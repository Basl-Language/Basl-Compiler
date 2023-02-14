import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import TypeClause from "../clauses/typeclause";
import { ExpressionNode, StatementNode } from "../syntaxnode"

// This do be a local statement
export default class LocalStatement extends StatementNode {

	// local [<type>:] myVar [= 100];
	LocalKeyword: Token;
	ExplicitType: TypeClause;
	Identifier: Token;
	Initializer: ExpressionNode;

	constructor(source: Source, localKw: Token, expType: TypeClause, id: Token, init: ExpressionNode) {
		super(source);

		this.LocalKeyword = localKw;
		this.ExplicitType = expType;
		this.Identifier = id;
		this.Initializer = init;
	}
}