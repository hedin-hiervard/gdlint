// @flow

import log from 'log.js'

import type { EmitIssue } from 'engine'
import type { Node, ClassNode, ClassConstant } from 'ast_types'

const minLineReducer = (acc, linedObject: { line: number }) => (isNaN(acc) || linedObject.line < acc) ? linedObject.line : acc

function isImport(constant: ClassConstant) {
    const expr = constant.expression
    if(expr.type !== 'constant') {
        log.warn(`class constant type is not ConstantNode at ${expr.line}:${expr.col}`)
        return false
    }

    return expr.value.type === 'OBJECT' &&
        (expr.value.value.class_name === 'PackedScene' ||
         expr.value.value.class_name === 'GDScript')
}

const entities = {
    signals: (cn: ClassNode) => cn._signals
        .reduce(minLineReducer, NaN),
    imports: (cn: ClassNode) => cn.constant_expressions
        .filter(({ value: cn }) => isImport(cn))
        .map(({ value: constant }) => constant.expression)
        .reduce(minLineReducer, NaN),
    constants: (cn: ClassNode) => cn.constant_expressions
        .filter(({ value: cn }) => !isImport(cn))
        .map(({ value: constant }) => constant.expression)
        .reduce(minLineReducer, NaN),
    'vars': (cn: ClassNode) => cn.variables
        .filter(v => !v.identifier.startsWith('_'))
        .reduce(minLineReducer, NaN),
    'private vars': (cn: ClassNode) => cn.variables
        .filter(v => v.identifier.startsWith('_'))
        .reduce(minLineReducer, NaN),
    subclasses: (cn: ClassNode) => cn.subclasses
        .reduce(minLineReducer, NaN),
    'static private funcs': (cn: ClassNode) => cn.static_functions
        .filter(v => v.name.startsWith('_') && v._static)
        .reduce(minLineReducer, NaN),
    'static funcs': (cn: ClassNode) => cn.static_functions
        .filter(v => !v.name.startsWith('_') && v._static)
        .reduce(minLineReducer, NaN),
    'private funcs': (cn: ClassNode) => cn.functions
        .filter(v => v.name.startsWith('_') && !v._static)
        .reduce(minLineReducer, NaN),
    'funcs': (cn: ClassNode) => cn.functions
        .filter(v => !v.name.startsWith('_') && !v._static)
        .reduce(minLineReducer, NaN),
}

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type === 'class') {
        const classNode = node
        const firstLines = {}
        for(const entName in entities) {
            firstLines[entName] = entities[entName](classNode)
        }
        for(let idx = 0; idx < Object.keys(entities).length - 1; idx++) {
            const entName = Object.keys(entities)[idx]
            const nextEntName = Object.keys(entities)[idx + 1]
            if(!isNaN(firstLines[nextEntName]) &&
                !isNaN(firstLines[entName]) &&
                firstLines[entName] > firstLines[nextEntName]
            ) {
                emitIssue({
                    line: firstLines[entName],
                    col: 1,
                    msg: `${entName} should go before ${nextEntName}`,
                })
            }
        }
    }
}
