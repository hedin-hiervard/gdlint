// @flow

import type { EmitIssue } from 'Engine'
import type { Node } from 'ast_types'

const pascalCase = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/
const pascalCaseOrEmpty = /^([A-Z][a-z]+(?:[A-Z][a-z]+)*)|$/
const constantCase = /^([A-Z]*_?[A-Z]*)*$/
const snakeCase = /^([a-z]*_?[a-z]*)*$/
const _snakeCase = /^_?([a-z]*_?[a-z]*)*$/

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type === 'class') {
        if(!node.name.match(pascalCaseOrEmpty)) {
            emitIssue({
                col: node.col,
                line: node.line,
                msg: 'class names must match PascalCase',
            })
        }
        for(const { key: name, value: subnode } of node.constant_expressions) {
            if(!name.match(constantCase) && !name.match(pascalCase)) {
                emitIssue({
                    col: subnode.expression.col,
                    line: subnode.expression.line,
                    msg: 'constant names must match CONSTANT_CASE or PascalCase',
                })
            }
        }
        for(const variable of node.variables) {
            if(!variable.identifier.match(_snakeCase)) {
                emitIssue({
                    col: variable.expression.col,
                    line: variable.expression.line,
                    msg: 'variable names must match _?snake_case',
                })
            }
        }
        for(const signal of node._signals) {
            if(!signal.name.match(snakeCase)) {
                emitIssue({
                    col: 1,
                    line: signal.line,
                    msg: 'signal names must match snake_case',
                })
            }
        }
    } else if(node.type === 'function') {
        if(!node.name.match(_snakeCase)) {
            emitIssue({
                col: node.col,
                line: node.line,
                msg: 'function names must match _?snake_case',
            })
        }
    }
}
