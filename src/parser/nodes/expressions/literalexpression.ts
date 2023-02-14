import {Source} from '../../../common/Source';
import {Token} from '../../../lexer/tokens';

import {ExpressionNode} from '../syntaxnode';

export default class LiteralExpression extends ExpressionNode {
    // thats all there is
    Literal: Token;

    constructor(source: Source, literal: Token) {
        super(source);

        this.Literal = literal;
    }
}
