// @flow

import type { EmitIssue } from 'Engine'
import type { Node } from 'ast_types.js'

function firstNonemptyLine(node: Node) {
    if(node.type !== 'block') return node.line
    for(const s of node.statements) {
        if(s.type !== 'newline') return s.line
    }
    return node.line
}

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type !== 'control flow') return

    if(node.body && node.line === firstNonemptyLine(node.body)) {
        emitIssue({
            line: node.line,
            col: node.col,
            msg: 'one statement per line',
        })
    }
}
