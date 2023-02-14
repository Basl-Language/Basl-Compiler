import {Source} from '../../../common/Source';
import {Token} from '../../../lexer/tokens';

import {ExpressionNode} from '../syntaxnode';

// This is a variable expression
export default class VariableExpression extends ExpressionNode {
    Identifier: Token;

    constructor(source: Source, id: Token) {
        super(source);

        this.Identifier = id;
    }
}
