import {maxHeaderSize} from 'http';
import {Source} from '../../../common/Source';
import {Token} from '../../../lexer/tokens';
import {ExpressionNode} from '../syntaxnode';

export default class AssignmentExpression extends ExpressionNode {
    // <identifier> = <value>
    Identifier: Token;
    Value: ExpressionNode;

    constructor(source: Source, id: Token, val: ExpressionNode) {
        super(source);

        this.Identifier = id;
        this.Value = val;
    }
}
