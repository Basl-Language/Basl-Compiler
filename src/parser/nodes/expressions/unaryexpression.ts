import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";

import { ExpressionNode } from "../syntaxnode";

// Unary expression moment
export default class UnaryExpression extends ExpressionNode {
	// !expression, -expression, +expression
	Operator: Token;
	Operand: ExpressionNode;

	constructor(source: Source, operator: Token, operand: ExpressionNode) {
		super(source);

		this.Operator = operator;
		this.Operand = operand
	}
}