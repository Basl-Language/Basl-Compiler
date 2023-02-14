import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode } from "../syntaxnode";

export default class CallExpression extends ExpressionNode {

	// This is a call expression
	NodeType: NT = NT.EXPRESSION_CALL;

	Identifier: Token;
	Arguments: ExpressionNode[];

	constructor(source: Source, id: Token, args: ExpressionNode[]) {
		super(source);

		this.Identifier = id;
		this.Arguments = args;
	}
}