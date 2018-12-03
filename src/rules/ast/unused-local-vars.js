// @flow

import type { EmitIssue } from 'engine'
import type { Node } from 'ast_types.js'

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type !== 'local var') return
    if(node.usages > 0) return
    emitIssue({
        msg: `unused local var: ${node.name}`,
        line: node.line,
        col: node.col,
    })
}
