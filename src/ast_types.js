// @flow

/* eslint-disable no-use-before-define */
export type Node = ClassNode |
    FunctionNode |
    BlockNode |
    TypeNode |
    BuiltInFunctionNode |
    IdentifierNode |
    LocalVarNode |
    ConstantNode |
    ArrayNode |
    DictionaryNode |
    SelfNode |
    OperatorNode |
    PatternNode |
    PatternBranchNode |
    MatchNode |
    ControlFlowNode |
    CastNode |
    AssertNode |
    BreakpointNode |
    NewLineNode;
/* eslint-enable no-use-before-define */

type NodeBase = {
    line: number,
    col: number,
};

type RPCMode = 'RPC_MODE_DISABLED' |
    'RPC_MODE_REMOTE' |
    'RPC_MODE_MASTER' |
    'RPC_MODE_PUPPET' |
    'RPC_MODE_REMOTESYNC' |
    'RPC_MODE_MASTERSYNC' |
    'RPC_MODE_PUPPETSYNC';

type Operator = 'OP_CALL' |
    'OP_PARENT_CALL' |
    'OP_YIELD' |
    'OP_IS' |
    'OP_IS_BUILTIN' |
    'OP_INDEX' |
    'OP_INDEX_NAMED' |
    'OP_NEG' |
    'OP_POS' |
    'OP_NOT' |
    'OP_BIT_INVERT' |
    'OP_IN' |
    'OP_EQUAL' |
    'OP_NOT_EQUAL' |
    'OP_LESS' |
    'OP_LESS_EQUAL' |
    'OP_GREATER' |
    'OP_GREATER_EQUAL' |
    'OP_AND' |
    'OP_OR' |
    'OP_ADD' |
    'OP_SUB' |
    'OP_MUL' |
    'OP_DIV' |
    'OP_MOD' |
    'OP_SHIFT_LEFT' |
    'OP_SHIFT_RIGHT' |
    'OP_INIT_ASSIGN' |
    'OP_ASSIGN' |
    'OP_ASSIGN_ADD' |
    'OP_ASSIGN_SUB' |
    'OP_ASSIGN_MUL' |
    'OP_ASSIGN_DIV' |
    'OP_ASSIGN_MOD' |
    'OP_ASSIGN_SHIFT_LEFT' |
    'OP_ASSIGN_SHIFT_RIGHT' |
    'OP_ASSIGN_BIT_AND' |
    'OP_ASSIGN_BIT_OR' |
    'OP_ASSIGN_BIT_XOR' |
    'OP_BIT_AND' |
    'OP_BIT_OR' |
    'OP_BIT_XOR' |
    'OP_TERNARY_IF' |
    'OP_TERNARY_ELSE';

type Function = 'MATH_SIN' |
    'MATH_COS' |
    'MATH_TAN' |
    'MATH_SINH' |
    'MATH_COSH' |
    'MATH_TANH' |
    'MATH_ASIN' |
    'MATH_ACOS' |
    'MATH_ATAN' |
    'MATH_ATAN2' |
    'MATH_SQRT' |
    'MATH_FMOD' |
    'MATH_FPOSMOD' |
    'MATH_FLOOR' |
    'MATH_CEIL' |
    'MATH_ROUND' |
    'MATH_ABS' |
    'MATH_SIGN' |
    'MATH_POW' |
    'MATH_LOG' |
    'MATH_EXP' |
    'MATH_ISNAN' |
    'MATH_ISINF' |
    'MATH_EASE' |
    'MATH_DECIMALS' |
    'MATH_STEPIFY' |
    'MATH_LERP' |
    'MATH_INVERSE_LERP' |
    'MATH_RANGE_LERP' |
    'MATH_DECTIME' |
    'MATH_RANDOMIZE' |
    'MATH_RAND' |
    'MATH_RANDF' |
    'MATH_RANDOM' |
    'MATH_SEED' |
    'MATH_RANDSEED' |
    'MATH_DEG2RAD' |
    'MATH_RAD2DEG' |
    'MATH_LINEAR2DB' |
    'MATH_DB2LINEAR' |
    'MATH_POLAR2CARTESIAN' |
    'MATH_CARTESIAN2POLAR' |
    'MATH_WRAP' |
    'MATH_WRAPF' |
    'LOGIC_MAX' |
    'LOGIC_MIN' |
    'LOGIC_CLAMP' |
    'LOGIC_NEAREST_PO2' |
    'OBJ_WEAKREF' |
    'FUNC_FUNCREF' |
    'TYPE_CONVERT' |
    'TYPE_OF' |
    'TYPE_EXISTS' |
    'TEXT_CHAR' |
    'TEXT_STR' |
    'TEXT_PRINT' |
    'TEXT_PRINT_TABBED' |
    'TEXT_PRINT_SPACED' |
    'TEXT_PRINTERR' |
    'TEXT_PRINTRAW' |
    'TEXT_PRINT_DEBUG' |
    'PUSH_ERROR' |
    'PUSH_WARNING' |
    'VAR_TO_STR' |
    'STR_TO_VAR' |
    'VAR_TO_BYTES' |
    'BYTES_TO_VAR' |
    'GEN_RANGE' |
    'RESOURCE_LOAD' |
    'INST2DICT' |
    'DICT2INST' |
    'VALIDATE_JSON' |
    'PARSE_JSON' |
    'TO_JSON' |
    'HASH' |
    'COLOR8' |
    'COLORN' |
    'PRINT_STACK' |
    'GET_STACK' |
    'INSTANCE_FROM_ID' |
    'LEN' |
    'IS_INSTANCE_VALID';

type VariantType = 'NIL' |
    'BOOL' |
    'INT' |
    'REAL' |
    'STRING' |
    'VECTOR2' |
    'RECT2' |
    'VECTOR3' |
    'TRANSFORM2D' |
    'PLANE' |
    'QUAT' |
    'AABB' |
    'BASIS' |
    'TRANSFORM' |
    'COLOR' |
    'NODE_PATH' |
    '_RID' |
    'OBJECT' |
    'DICTIONARY' |
    'ARRAY' |
    'POOL_BYTE_ARRAY' |
    'POOL_INT_ARRAY' |
    'POOL_REAL_ARRAY' |
    'POOL_STRING_ARRAY' |
    'POOL_VECTOR2_ARRAY' |
    'POOL_VECTOR3_ARRAY' |
    'POOL_COLOR_ARRAY';

type PIHintType = 'PROPERTY_HINT_NONE' |
    'PROPERTY_HINT_RANGE' |
    'PROPERTY_HINT_EXP_RANGE' |
    'PROPERTY_HINT_ENUM' |
    'PROPERTY_HINT_EXP_EASING' |
    'PROPERTY_HINT_LENGTH' |
    'PROPERTY_HINT_SPRITE_FRAME' |
    'PROPERTY_HINT_KEY_ACCEL' |
    'PROPERTY_HINT_FLAGS' |
    'PROPERTY_HINT_LAYERS_2D_RENDER' |
    'PROPERTY_HINT_LAYERS_2D_PHYSICS' |
    'PROPERTY_HINT_LAYERS_3D_RENDER' |
    'PROPERTY_HINT_LAYERS_3D_PHYSICS' |
    'PROPERTY_HINT_FILE' |
    'PROPERTY_HINT_DIR' |
    'PROPERTY_HINT_GLOBAL_FILE' |
    'PROPERTY_HINT_GLOBAL_DIR' |
    'PROPERTY_HINT_RESOURCE_TYPE' |
    'PROPERTY_HINT_MULTILINE_TEXT' |
    'PROPERTY_HINT_PLACEHOLDER_TEXT' |
    'PROPERTY_HINT_COLOR_NO_ALPHA' |
    'PROPERTY_HINT_IMAGE_COMPRESS_LOSSY' |
    'PROPERTY_HINT_IMAGE_COMPRESS_LOSSLESS' |
    'PROPERTY_HINT_OBJECT_ID' |
    'PROPERTY_HINT_TYPE_STRING' |
    'PROPERTY_HINT_NODE_PATH_TO_EDITED_NODE' |
    'PROPERTY_HINT_METHOD_OF_VARIANT_TYPE' |
    'PROPERTY_HINT_METHOD_OF_BASE_TYPE' |
    'PROPERTY_HINT_METHOD_OF_INSTANCE' |
    'PROPERTY_HINT_METHOD_OF_SCRIPT' |
    'PROPERTY_HINT_PROPERTY_OF_VARIANT_TYPE' |
    'PROPERTY_HINT_PROPERTY_OF_BASE_TYPE' |
    'PROPERTY_HINT_PROPERTY_OF_INSTANCE' |
    'PROPERTY_HINT_PROPERTY_OF_SCRIPT' |
    'PROPERTY_HINT_OBJECT_TOO_BIG' |
    'PROPERTY_HINT_NODE_PATH_VALID_TYPES';

type PropertyInfo = {
    type: VariantType,
    name: string,
    class_name: string,
    property_hint: PIHintType,
    hint_string: string,
    usage: number,
};

export type ClassMember = {
    _export: PropertyInfo,
    default_value: Node,
    identifier: string,
    data_type: DataType, // eslint-disable-line no-use-before-define
    getter: string,
    setter: string,
    line: number,
    expression: Node,
    initial_assignment: OperatorNode, // eslint-disable-line no-use-before-define
    rpc_mode: RPCMode,
    onready: boolean,
    usages: number,
};

export type ClassConstant = {
    data_type: DataType, // eslint-disable-line no-use-before-define
    expression: Node, // eslint-disable-line no-use-before-define
    is_enum: boolean,
    line: number,
};

export type ClassSignal = {
    name: string,
    arguments: Array<string>,
    emissions: number,
    line: number,
};

export type DataType = {
    has_type: boolean,
    is_constant: boolean,
    is_meta_type: boolean,
    infer_type: boolean,
    may_yield: boolean,
    builtin_type: VariantType,
    native_type: boolean,
};

export type ClassNode = NodeBase & {
    type: 'class',
    name: string,
    subclasses: Array<ClassNode>,
    variables: Array<ClassMember>,
    tool: boolean,
    extends_used: boolean,
    extends_file: string,
    extends_class: string,
    base_type: DataType,
    constant_expressions: Array<{
        key: string,
        value: ClassConstant,
    }>,
    functions: Array<FunctionNode>, // eslint-disable-line no-use-before-define
    static_functions: Array<FunctionNode>, // eslint-disable-line no-use-before-define
    _signals: Array<ClassSignal>,
    end_line: number,
    initializer: BlockNode, // eslint-disable-line no-use-before-define
    ready: BlockNode, // eslint-disable-line no-use-before-define
};

type FunctionNode = NodeBase & {
    type: 'function',
    name: string,
    _static: boolean,
    rpc_mode: RPCMode,
    has_yield: boolean,
    has_unreachable_code: boolean,
    return_type: DataType,
    arguments: Array<{
        name: string,
        type: DataType,
        default_value?: Node,
    }>,
    body: BlockNode, // eslint-disable-line no-use-before-define
};

export type BlockNode = NodeBase & {
    type: 'block',
    statements: Array<Node>,
    variables: {
        [string]: LocalVarNode, // eslint-disable-line no-use-before-define
    },
    has_return: boolean,
    if_condition?: Node,
    end_line: number,
};

type TypeNode = NodeBase & {
    type: 'type',
    vtype: VariantType,
};

type BuiltInFunctionNode = NodeBase & {
    type: 'built-in function',
    function: Function,
};

type IdentifierNode = NodeBase & {
    type: 'identifier',
    name: string,
    declared_block: BlockNode,
    datatype: DataType,
};

type LocalVarNode = NodeBase & {
    type: 'local var',
    name: string,
    assign?: Node,
    assign_op?: OperatorNode, // eslint-disable-line no-use-before-define
    assignments: number,
    usages: number,
    datatype: DataType,
};

/* eslint-disable no-use-before-define */
type Variant = VariantNil |
    VariantBool |
    VariantInt |
    VariantReal |
    VariantString |
    VariantVector2 |
    VariantRect2 |
    VariantVector3 |
    VariantTransform2D |
    VariantPlane |
    VariantQuat |
    VariantAABB |
    VariantBasis |
    VariantTransform |
    VariantColor |
    VariantNodePath |
    VariantRID |
    VariantObject |
    VariantDictionary |
    VariantArray |
    VariantPoolByteArray |
    VariantPoolIntArray |
    VariantPoolRealArray |
    VariantPoolStringArray |
    VariantPoolVector2Array |
    VariantPoolVector3Array |
    VariantPoolColorArray;
/* eslint-enable no-use-before-define */

type VariantNil = {
    type: 'NIL',
    value: 'NIL,'
};

type VariantBool = {
    type: 'BOOL',
    value: boolean,
};

type VariantInt = {
    type: 'INT',
    value: number,
};

type VariantReal = {
    type: 'REAL',
    value: number,
};

type VariantString = {
    type: 'STRING',
    value: string,
};

type Vector2 = {
    x: number,
    y: number,
};

type VariantVector2 = {
    type: 'VECTOR2',
    value: Vector2,
};

type VariantRect2 = {
    type: 'RECT2',
    value: {
        origin: Vector2,
        size: Vector2,
    }
};

type Vector3 = {
    x: number,
    y: number,
    z: number,
};

type VariantVector3 = {
    type: 'VECTOR3',
    value: Vector3,
};

type VariantTransform2D = {
    type: 'TRANSFORM2D',
    value: {
        elements: [ Vector2, Vector2, Vector2 ],
    },
};

type VariantPlane = {
    type: 'PLANE',
    value: {
        normal: Vector3,
        d: number,
    },
};

type VariantQuat = {
    type: 'QUAT',
    value: {
        x: number,
        y: number,
        z: number,
        w: number,
    },
};

type VariantAABB = {
    type: 'AABB',
    value: {
        position: Vector2,
        size: Vector2,
    },
};

type Basis = {
    tangent: Vector3,
    bitangent: Vector3,
    normal: Vector3,
};

type VariantBasis = {
    type: 'BASIS',
    value: Basis,
};

type VariantTransform = {
    type: 'TRANSFORM',
    value: {
        basis: Basis,
        origin: Vector3,
    },
};

type Color = {
    r: number,
    g: number,
    b: number,
    a: number,
};

type VariantColor = {
    type: 'COLOR',
    value: Color,
};

type VariantNodePath = {
    type: 'NODE_PATH',
    value: {
        names: Array<string>,
        subnames: Array<string>,
    },
};

type VariantRID = {
    type: 'RID',
    value: {
        id: number,
    },
};

type VariantObject = {
    type: 'OBJECT',
    value: {
        class_name: string,
    },
};

type VariantDictionary = {
    type: 'DICTIONARY',
    value: Array<{
        key: Variant,
        value: Variant,
    }>,
};

type VariantArray = {
    type: 'ARRAY',
    value: Array<Variant>,
};

type PoolVector<T> = Array<T>;

type VariantPoolByteArray = {
    type: 'POOL_BYTE_ARRAY',
    value: PoolVector<number>,
};

type VariantPoolIntArray = {
    type: 'POOL_BYTE_ARRAY',
    value: PoolVector<number>,
};

type VariantPoolRealArray = {
    type: 'POOL_BYTE_ARRAY',
    value: PoolVector<number>,
};

type VariantPoolStringArray = {
    type: 'POOL_BYTE_ARRAY',
    value: PoolVector<string>,
};

type VariantPoolVector2Array = {
    type: 'POOL_BYTE_ARRAY',
    value: PoolVector<Vector2>,
};

type VariantPoolVector3Array = {
    type: 'POOL_BYTE_ARRAY',
    value: PoolVector<Vector3>,
};

type VariantPoolColorArray = {
    type: 'POOL_BYTE_ARRAY',
    value: PoolVector<Color>,
};

type ConstantNode = NodeBase & {
    type: 'constant',
    value: Variant;
    datatype: DataType,
};

type ArrayNode = NodeBase & {
    type: 'array',
    elements: Array<Node>,
    datatype: DataType,
};

type DictionaryNode = NodeBase & {
    type: 'dictionary',
    elements: Array<{
        key: Node,
        value: Node,
    }>,
    datatype: DataType,
};

type SelfNode = NodeBase & {
    type: 'self',
};

type OperatorNode = NodeBase & {
    type: 'operator',
    operator: Operator,
    arguments: Array<Node>,
    datatype: DataType,
};

type PatternType = 'PT_CONSTANT' |
    'PT_BIND' |
    'PT_DICTIONARY' |
    'PT_ARRAY' |
    'PT_IGNORE_REST' |
    'PT_WILDCARD';

type PatternNode = NodeBase & {
    type: 'pattern',
    pt_type: PatternType,
    constant?: Node,
    dictionary: Array<{
        key: ConstantNode,
        value: PatternNode
    }>,
    array: Array<PatternNode>,
};

type PatternBranchNode = NodeBase & {
    type: 'pattern branch',
    patterns: Array<PatternNode>,
    body: BlockNode,
};

type MatchNode = NodeBase & {
    type: 'match',
    val_to_match: Node,
    branches: Array<PatternBranchNode>,
};

type CFType = 'CF_IF' |
    'CF_FOR' |
    'CF_WHILE' |
    'CF_SWITCH' |
    'CF_BREAK' |
    'CF_CONTINUE' |
    'CF_RETURN' |
    'CF_MATCH';

type ControlFlowNode = NodeBase & {
    type: 'control flow',
    cf_type: CFType,
    arguments: Array<Node>,
    body?: BlockNode,
    body_else?: BlockNode,
    match?: MatchNode,
    _else?: ControlFlowNode,
};

type CastNode = NodeBase & {
    type: 'cast',
    source_node: Node,
    cast_type: DataType,
    return_type: DataType,
};

type AssertNode = NodeBase & {
    type: 'assert',
    condition: Node,
};

type BreakpointNode = NodeBase & {
    type: 'breakpoint',
};

type NewLineNode = NodeBase & {
    type: 'newline',
};
