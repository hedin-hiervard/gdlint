// @flow
import glob from 'glob-promise'
import path from 'path'

import type { Node } from 'ast_types.js'

type RuleIssueType = 'error' | 'warn';

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
    issueType: RuleIssueType,
};

type SourceRule = {
    apply: (string, EmitIssue) => void,
    name: string,
    issueType: RuleIssueType,
};

export default class Engine {
    inited: boolean;
    astRules: Array<ASTRule>;
    sourceRules: Array<SourceRule>;

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
            subnodes = [ ...node.statements ]
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

    async lint(source: string, ast: any): Promise<SingleLintingResult> {
        const issues: Array<LineIssueWithRule> = []
        for(const astRule of this.astRules) {
            this.iterateAST(ast,
                node => astRule.apply(node, error => {
                    issues.push({
                        ...error,
                        rule: astRule.name,
                        type: astRule.issueType,
                    })
                })
            )
        }
        return issues
    }
}
