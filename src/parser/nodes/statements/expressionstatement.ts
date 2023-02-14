import { Source } from "../../../common/Source";
import { NT } from "../nodetypes";
import { ExpressionNode, StatementNode } from "../syntaxnode";

export default class ExpressionStatement extends StatementNode {

	// E x p r e s s i o n s t a t e m e n t
	NodeType: NT = NT.STATEMENT_EXPRESSION;

	// Literally just an expression in a trench coat
	Expression: ExpressionNode;

	constructor(source: Source, expr: ExpressionNode) {
		super(source);
		
		this.Expression = expr;
	}
}