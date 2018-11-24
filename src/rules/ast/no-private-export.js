// @flow

import type { EmitIssue } from 'engine'
import type { Node, ClassMember } from 'ast_types'

function isExport(member: ClassMember): boolean {
    return member._export.type !== 'NIL'
}

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type === 'class') {
        for(const v of node.variables) {
            if(isExport(v) && v.identifier.startsWith('_')) {
                emitIssue({
                    line: v.line,
                    col: 1,
                    msg: `no private var export allowed`,
                })
            }
        }
    }
}
