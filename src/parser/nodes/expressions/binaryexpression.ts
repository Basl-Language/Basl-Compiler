import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode } from "../syntaxnode";

export default class BinaryExpression extends ExpressionNode {

	// Very cool binary expression
	NodeType: NT = NT.EXPRESSION_BINARY;

	OperandA: ExpressionNode;
	Operator: Token;
	OperandB: ExpressionNode;

	constructor(source: Source, a: ExpressionNode, op: Token, b: ExpressionNode) {
		super(source);

		this.OperandA = a;
		this.Operator = op;
		this.OperandB = b;
	}
}