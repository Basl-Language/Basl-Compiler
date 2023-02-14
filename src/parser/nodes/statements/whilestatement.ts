import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { ExpressionNode, StatementNode } from "../syntaxnode";

// This is a while statement!
export default class WhileStatement extends StatementNode {

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