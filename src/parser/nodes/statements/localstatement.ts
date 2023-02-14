import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import TypeClause from "../clauses/typeclause";
import { NT } from "../nodetypes";
import { ExpressionNode, StatementNode } from "../syntaxnode"

export default class LocalStatement extends StatementNode {
	
	// This do be a local statement
	NodeType: NT = NT.STATEMENT_LOCAL;

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