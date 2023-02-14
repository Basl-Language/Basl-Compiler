import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode } from "../syntaxnode";

export default class VariableExpression extends ExpressionNode {

	// This is a variable expression
	NodeType: NT = NT.EXPRESSION_VARIABLE;

	Identifier: Token;

	constructor(source: Source, id: Token) {
		super(source);

		this.Identifier = id;
	}
}