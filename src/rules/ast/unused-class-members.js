// @flow

import type { EmitIssue } from 'engine'
import type { Node } from 'ast_types.js'

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type !== 'class') return
    for(const member of node.variables) {
        if(!member.identifier.startsWith('_')) {
            return
        }
        if(member.usages === 0) {
            emitIssue({
                msg: `unused class member: ${member.identifier}`,
                line: member.line,
                col: 1,
            })
        }
    }
}
