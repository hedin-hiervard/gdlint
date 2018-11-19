// @flow

import type { EmitIssue } from 'engine'
import type { Node } from 'ast_types.js'

export function apply(node: Node, emitIssue: EmitIssue) {
    if(
        node.type === 'built-in function' &&
        node.function === 'TEXT_PRINT'
    ) {
        emitIssue({
            line: node.line,
            col: node.col,
            msg: 'usage of print() is discouraged, use a custom logger instead',
        })
    }
}
