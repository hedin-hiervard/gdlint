// @flow

import type { EmitIssue } from 'engine'
import type { Node, BlockNode } from 'ast_types.js'

function firstNonemptyLine(node: BlockNode) {
    if(node.type !== 'block') return node.line
    for(const s of node.statements) {
        if(s.type !== 'newline') return s.line
    }
    return NaN
}

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type !== 'control flow') return
    const body = node.body
    if(!body) return
    const nodeLine = firstNonemptyLine(body)
    if(!isNaN(nodeLine) && node.line === nodeLine) {
        emitIssue({
            line: node.line,
            col: node.col,
            msg: 'one statement per line',
        })
    }
}
