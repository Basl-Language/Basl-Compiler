import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode } from "../syntaxnode";

export default class UnaryExpression extends ExpressionNode {

	// Unary expression moment
	NodeType: NT = NT.EXPRESSION_UNARY;

	// !expression, -expression, +expression
	Operator: Token;
	Operand: ExpressionNode;

	constructor(source: Source, operator: Token, operand: ExpressionNode) {
		super(source);

		this.Operator = operator;
		this.Operand = operand
	}
}