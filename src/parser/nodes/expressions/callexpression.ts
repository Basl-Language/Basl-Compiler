import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { ExpressionNode } from "../syntaxnode";

// This is a call expression
export default class CallExpression extends ExpressionNode {

	Identifier: Token;
	Arguments: ExpressionNode[];

	constructor(source: Source, id: Token, args: ExpressionNode[]) {
		super(source);

		this.Identifier = id;
		this.Arguments = args;
	}
}