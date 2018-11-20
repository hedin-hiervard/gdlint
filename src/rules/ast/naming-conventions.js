// @flow

import log from 'log.js'

import type { EmitIssue } from 'engine'
import type { Node } from 'ast_types'

const pascalCase = /^[A-Z][a-z]+(?:[A-Z][a-z]+)*$/
const pascalCaseOrEmpty = /^([A-Z][a-z]+(?:[A-Z][a-z]+)*)|$/
const constantCase = /^([A-Z]*_?[A-Z]*)*$/
const snakeCase = /^([a-z]*_?[a-z]*)*$/
const _snakeCase = /^_?([a-z]*_?[a-z]*)*$/

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type === 'class') {
        const classNode = node

        if(!node.name.match(pascalCaseOrEmpty)) {
            emitIssue({
                col: node.col,
                line: node.line,
                msg: 'class names must match PascalCase',
            })
        }

        for(const { key: name, value: { expression: subnode } } of classNode.constant_expressions) {
            if(subnode.type !== 'constant') {
                log.warn(`class constant type is not ConstantNode at ${subnode.line}:${subnode.col}`)
                continue
            }

            if(subnode.value.type === 'OBJECT' &&
                subnode.value.value.class_name === 'PackedScene'
            ) {
                if(!name.match(pascalCase)) {
                    emitIssue({
                        col: subnode.col,
                        line: subnode.line,
                        msg: 'preloaded packed scenes names must match PascalCase',
                    })
                }
            } else if(subnode.value.type === 'OBJECT' &&
                subnode.value.value.class_name === 'GDScript'
            ) {
                if(!name.match(pascalCase)) {
                    emitIssue({
                        col: subnode.col,
                        line: subnode.line,
                        msg: 'preloaded script names must match PascalCase',
                    })
                }
            } else if(subnode.value.type === 'DICTIONARY') {
                if(!name.match(pascalCase)) {
                    emitIssue({
                        col: subnode.col,
                        line: subnode.line,
                        msg: 'const dictionaries (incl. enums) names must match PascalCase',
                    })
                }
            } else {
                if(!name.match(constantCase)) {
                    emitIssue({
                        col: subnode.col,
                        line: subnode.line,
                        msg: 'constant names must match CONSTANT_CASE',
                    })
                }
            }
        }
        for(const variable of classNode.variables) {
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
