import { Source } from "../../../common/Source";
import { ExpressionNode, StatementNode } from "../syntaxnode";

// E x p r e s s i o n s t a t e m e n t
export default class ExpressionStatement extends StatementNode {
	// Literally just an expression in a trench coat
	Expression: ExpressionNode;

	constructor(source: Source, expr: ExpressionNode) {
		super(source);
		
		this.Expression = expr;
	}
}