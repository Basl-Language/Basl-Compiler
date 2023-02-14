import {Source} from '../../../common/Source';
import {Token} from '../../../lexer/tokens';

import {ExpressionNode} from '../syntaxnode';

// Very cool binary expression
export default class BinaryExpression extends ExpressionNode {
    OperandA: ExpressionNode;
    Operator: Token;
    OperandB: ExpressionNode;

    constructor(
        source: Source,
        a: ExpressionNode,
        op: Token,
        b: ExpressionNode
    ) {
        super(source);

        this.OperandA = a;
        this.Operator = op;
        this.OperandB = b;
    }
}
