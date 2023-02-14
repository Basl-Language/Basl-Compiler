import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode, StatementNode } from "../syntaxnode";

export default class IfStatement extends StatementNode {

	// This is an if statement!
	NodeType: NT = NT.STATEMENT_IF;

	// if { ... } [else { ... }]
	IfKeyword: Token;
	Condition: ExpressionNode;
	ThenStatement: StatementNode;
	ElseStatement: StatementNode;

	constructor(source: Source, ifKw: Token, cond: ExpressionNode, thenStmt: StatementNode, elseStmt: StatementNode) {
		super(source);

		this.IfKeyword = ifKw;
		this.Condition = cond;
		this.ThenStatement = thenStmt;
		this.ElseStatement = elseStmt;
	}
}