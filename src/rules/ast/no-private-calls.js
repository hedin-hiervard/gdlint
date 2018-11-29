// @flow

import log from 'log.js'

import type { EmitIssue } from 'engine'
import type { Node } from 'ast_types'

const _snakeCase = /^_[a-z][a-z0-9_]*$/

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type === 'operator') {
        if(node.arguments.length < 2) return
        const [ caller, method ] = node.arguments
        if(caller.type === 'self') return
        if(method.type !== 'identifier') return
        if(!method.name.match(_snakeCase)) return

        if(node.operator === 'OP_CALL') {
            emitIssue({
                line: method.line,
                col: method.col,
                msg: `calling other objects' private methods is prohibited`,
            })
        } else if(node.operator === 'OP_INDEX_NAMED') {
            emitIssue({
                line: method.line,
                col: method.col,
                msg: `accessing other objects' private vars is prohibited`,
            })
        }
    }
}
