import {Source} from '../../../common/Source';
import {Token} from '../../../lexer/tokens';
import TypeClause from '../clauses/typeclause';
import {ExpressionNode, StatementNode} from '../syntaxnode';

// This do be a local statement
export default class LocalStatement extends StatementNode {
    // local [<type>:] myVar [= 100];
    LocalKeyword: Token;
    ExplicitType: TypeClause | null;
    Identifier: Token;
    Initializer: ExpressionNode | null;

    constructor(
        source: Source,
        localKw: Token,
        expType: TypeClause | null,
        id: Token,
        init: ExpressionNode | null
    ) {
        super(source);

        this.LocalKeyword = localKw;
        this.ExplicitType = expType;
        this.Identifier = id;
        this.Initializer = init;
    }
}
