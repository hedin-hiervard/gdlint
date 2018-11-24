// @flow

import log from 'log.js'

import type { EmitIssue } from 'engine'
import type { Node, ClassNode, ClassConstant, ClassMember } from 'ast_types'

const minLine = (acc, linedObject: { line: number }) => (isNaN(acc) || linedObject.line < acc) ? linedObject.line : acc
const maxLine = (acc, linedObject: { line: number }) => (isNaN(acc) || linedObject.line > acc) ? linedObject.line : acc

function isImport(constant: ClassConstant): boolean {
    const expr = constant.expression
    if(expr.type !== 'constant') {
        log.warn(`class constant type is not ConstantNode at ${expr.line}:${expr.col}`)
        return false
    }

    return expr.value.type === 'OBJECT' &&
        (expr.value.value.class_name === 'PackedScene' ||
         expr.value.value.class_name === 'GDScript')
}

function isExport(member: ClassMember): boolean {
    return member._export.type !== 'NIL'
}

function isOnready(member: ClassMember): boolean {
    return member.onready
}

const entities = {
    signals: (cn: ClassNode, reducer: *) => cn._signals
        .reduce(reducer, NaN),
    imports: (cn: ClassNode, reducer: *) => cn.constant_expressions
        .filter(({ value: cn }) => isImport(cn))
        .map(({ value: constant }) => constant.expression)
        .reduce(reducer, NaN),
    constants: (cn: ClassNode, reducer: *) => cn.constant_expressions
        .filter(({ value: cn }) => !isImport(cn) && !cn.is_enum)
        .map(({ value: constant }) => constant.expression)
        .reduce(reducer, NaN),
    enums: (cn: ClassNode, reducer: *) => cn.constant_expressions
        .filter(({ value: cn }) => cn.is_enum)
        .map(({ value: constant }) => constant.expression)
        .reduce(reducer, NaN),
    'exported vars': (cn: ClassNode, reducer: *) => cn.variables
        .filter(v => isExport(v))
        .reduce(reducer, NaN),
    'onready vars': (cn: ClassNode, reducer: *) => cn.variables
        .filter(v => isOnready(v))
        .filter(v => !v.identifier.startsWith('_'))
        .reduce(reducer, NaN),
    'onready private vars': (cn: ClassNode, reducer: *) => cn.variables
        .filter(v => isOnready(v))
        .filter(v => v.identifier.startsWith('_'))
        .reduce(reducer, NaN),
    'vars': (cn: ClassNode, reducer: *) => cn.variables
        .filter(v => !isExport(v))
        .filter(v => !isOnready(v))
        .filter(v => !v.identifier.startsWith('_'))
        .reduce(reducer, NaN),
    'private vars': (cn: ClassNode, reducer: *) => cn.variables
        .filter(v => !isExport(v))
        .filter(v => !isOnready(v))
        .filter(v => v.identifier.startsWith('_'))
        .reduce(reducer, NaN),
    subclasses: (cn: ClassNode, reducer: *) => cn.subclasses
        .reduce(reducer, NaN),
    'static private funcs': (cn: ClassNode, reducer: *) => cn.static_functions
        .filter(v => v.name.startsWith('_') && v._static)
        .reduce(reducer, NaN),
    'static funcs': (cn: ClassNode, reducer: *) => cn.static_functions
        .filter(v => !v.name.startsWith('_') && v._static)
        .reduce(reducer, NaN),
    'private funcs': (cn: ClassNode, reducer: *) => cn.functions
        .filter(v => v.name.startsWith('_') && !v._static)
        .reduce(reducer, NaN),
    'funcs': (cn: ClassNode, reducer: *) => cn.functions
        .filter(v => !v.name.startsWith('_') && !v._static)
        .reduce(reducer, NaN),
}

export function apply(node: Node, emitIssue: EmitIssue) {
    if(node.type === 'class') {
        const classNode = node
        const firstLines = {}
        const lastLines = {}
        for(const entName in entities) {
            firstLines[entName] = entities[entName](classNode, minLine)
            lastLines[entName] = entities[entName](classNode, maxLine)
        }
        for(let idx = 0; idx < Object.keys(entities).length - 1; idx++) {
            const entName = Object.keys(entities)[idx]
            const nextEntName = Object.keys(entities)[idx + 1]
            if(!isNaN(firstLines[nextEntName]) &&
                !isNaN(lastLines[entName]) &&
                lastLines[entName] > firstLines[nextEntName]
            ) {
                emitIssue({
                    line: firstLines[nextEntName],
                    col: 1,
                    msg: `${entName} should go before ${nextEntName}`,
                })
            }
        }
    }
}
