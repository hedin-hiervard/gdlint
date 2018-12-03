// @flow
import glob from 'glob-promise'
import path from 'path'
import log from 'log.js'
import rcConfigLoader from 'rc-config-loader'

import type { Node } from 'ast_types.js'

type RuleIssueType = 'error' | 'warn' | 'disabled';

type Config = {
    rules: {
        [ string ]: RuleIssueType,
    }
};

type LineIssue = {
    line: number,
    col: number,
    msg: string,
};

type LineIssueWithRule = LineIssue & {
    rule: string,
    type: RuleIssueType,
};

export type SingleLintingResult = Array<LineIssueWithRule>;

export type MultipleLintingResults = {
    [ string ]: SingleLintingResult,
};

export type EmitIssue = LineIssue => void;

type ASTRule = {
    apply: (Node, EmitIssue) => void,
    name: string,
};

type SourceRule = {
    apply: (string, EmitIssue) => void,
    name: string,
};

export default class Engine {
    inited: boolean;
    astRules: Array<ASTRule>;
    sourceRules: Array<SourceRule>;
    config: Config;

    constructor() {
        this.astRules = []
        this.sourceRules = []

        const astFiles = glob.sync(path.join(__dirname, 'rules', 'ast', '*.js'))
        for(const file of astFiles) {
            const ruleName = path.parse(file).name
            // $FlowFixMe
            const rule = require(file)
            rule.name = ruleName
            rule.issueType = 'error'
            this.astRules.push(rule)
        }

        const rulesFiles = glob.sync(path.join(__dirname, 'rules', 'source', '*.js'))
        for(const file of rulesFiles) {
            const ruleName = path.parse(file).name

            // $FlowFixMe
            const rule = require(file)
            rule.name = ruleName
            rule.issueType = 'error'
            this.astRules.push(rule)
        }
        this.inited = true
    }

    iterateAST(node: ?Node, cb: Node => void) {
        if(node == null) return
        cb(node)
        let subnodes: Array<Node> = []
        switch(node.type) {
        case 'class':
            subnodes = [
                ...node.subclasses,
                ...node.functions,
                ...node.static_functions,
                node.initializer,
                node.ready,
            ]
            for(const variable of node.variables) {
                subnodes.push(variable.default_value)
                subnodes.push(variable.expression)
                subnodes.push(variable.initial_assignment)
            }
            for(const c of node.constant_expressions) {
                subnodes.push(c.value.expression)
            }
            break
        case 'function':
            subnodes = [ node.body ]
            break
        case 'block':
            subnodes = [
                ...node.statements,
            ]
            for(const vName in node.variables) {
                subnodes.push(node.variables[vName])
            }
            break
        case 'operator':
            subnodes = [ ...node.arguments ]
            break
        case 'control flow':
            subnodes = [ ...node.arguments ]
            if(node.body) subnodes.push(node.body)
            if(node.body_else) subnodes.push(node.body_else)
            if(node.match) subnodes.push(node.match)
            if(node._else) subnodes.push(node._else)
            break
        case 'pattern':
            subnodes = [
                ...node.dictionary.map(elem => elem.key),
                ...node.dictionary.map(elem => elem.value),
                ...node.array,
            ]
            if(node.constant) subnodes.push(node.constant)

            break
        case 'pattern branch':
            subnodes = [
                node.body,
                ...node.patterns,
            ]
            break
        case 'match':
            subnodes = [
                node.val_to_match,
                ...node.branches,
            ]
            break
        case 'local var':
            subnodes = []
            if(node.assign) subnodes.push(node.assign)
            if(node.assign_op) subnodes.push(node.assign_op)
            break
        case 'cast':
            subnodes = [ node.source_node ]
            break
        case 'assert':
            subnodes = [ node.condition ]
            break
        case 'identifier':
        case 'type':
        case 'constant':
        case 'array':
        case 'dictionary':
        case 'self':
        case 'breakpoint':
        case 'built-in function':
        case 'newline':
            break
        }

        subnodes.forEach(subnode => this.iterateAST(subnode, cb))
    }

    defaultConfig(): Config {
        const result = { rules: {} }
        for(const rule of [
            ...this.astRules,
            ...this.sourceRules,
        ]) {
            result.rules[rule.name] = 'error'
        }
        return result
    }

    loadConfig(cwd: string) {
        try {
            const result = rcConfigLoader('gdlint', {
                cwd,
            })
            if(!result) {
                log.info(`no gdlint config found, using default`)
                this.config = this.defaultConfig()
            }
            const { config, filePath } = result
            log.info(`using config at: ${filePath}`)
            this.config = config
        } catch(err) {
            log.error(`failed to load config: ${err.toString()}`)
            log.info(`will use default config`)
            this.config = this.defaultConfig()
        }

        for(const ruleName in this.config.rules) {
            if(!this.astRules.find(rule => rule.name === ruleName) &&
                !this.sourceRules.find(rule => rule.name === ruleName)) {
                throw new Error(`no such rule: ${ruleName}`)
            }
            const possible = ['error', 'warn', 'disabled']
            if(!possible.includes(this.config.rules[ruleName])) {
                throw new Error(`rule ${ruleName}: invalid option ${this.config.rules[ruleName]}. Possible values: ${possible.join(', ')}`)
            }
        }
        this.config.rules = this.config.rules || {}
        for(const rule of [
            ...this.astRules,
            ...this.sourceRules,
        ]) {
            if(!this.config.rules[rule.name]) {
                this.config.rules[rule.name] = 'error'
            }
        }
    }

    issueType(ruleName: string): RuleIssueType {
        for(const rn in this.config.rules) {
            if(ruleName === rn) {
                return this.config.rules[rn]
            }
        }
        throw new Error(`invalid rule: ${ruleName}`)
    }

    async lint(source: string, ast: any): Promise<SingleLintingResult> {
        const issues: Array<LineIssueWithRule> = []
        for(const astRule of this.astRules) {
            this.iterateAST(ast,
                node => astRule.apply(node, error => {
                    const type = this.issueType(astRule.name)
                    if(type !== 'disabled') {
                        issues.push({
                            ...error,
                            rule: astRule.name,
                            type,
                        })
                    }
                })
            )
        }
        return issues
    }
}
