// @flow

import type { EmitIssue } from 'engine'
import type { Node } from 'ast_types'

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type !== 'block') return

    if(node.statements.length <= 1) return
    if(
        node.statements[0].type === 'newline' &&
        node.statements[1].type === 'newline'
    ) {
        emitIssue({
            line: node.statements[0].line,
            col: node.statements[0].col,
            msg: 'block must not start with newline',
        })
    }
    if(
        node.statements[node.statements.length - 1].type === 'newline' &&
        node.statements[node.statements.length - 2].type === 'newline'
    ) {
        emitIssue({
            line: node.statements[node.statements.length - 1].line,
            col: node.statements[node.statements.length - 1].col,
            msg: 'block must not end with newline',
        })
    }
}
