import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode, StatementNode } from "../syntaxnode";

export default class WhileStatement extends StatementNode {

	// This is a while statement!
	NodeType: NT = NT.STATEMENT_WHILE;

	// while { ... }
	WhileKeyword: Token;
	Condition: ExpressionNode;
	LoopStatement: StatementNode;

	constructor(source: Source, whileKw: Token, cond: ExpressionNode, loopStmt: StatementNode) {
		super(source);

		this.WhileKeyword = whileKw;
		this.Condition = cond;
		this.LoopStatement = loopStmt;
	}
}