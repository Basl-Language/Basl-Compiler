import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode, StatementNode } from "../syntaxnode";

export default class ForStatement extends StatementNode {

	// This is a for statement
	NodeType: NT = NT.STATEMENT_FOR;

	// for local i = 0; i < 100; i++ { ... }
	ForKeyword: Token;
	Initializer: StatementNode;
	Condition: ExpressionNode;
	Step: StatementNode;
	LoopStatement: StatementNode;

	constructor(source: Source, forKw: Token, init: StatementNode, cond: ExpressionNode, step: StatementNode, loopStmt: StatementNode) {
		super(source);

		this.ForKeyword = forKw;
		this.Initializer = init;
		this.Condition = cond;
		this.Step = step;
		this.LoopStatement = loopStmt;
	}
}