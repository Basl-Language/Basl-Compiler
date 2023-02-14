import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";

import { ExpressionNode, StatementNode } from "../syntaxnode";

// This is a foreach statement :o
export default class ForeachStatement extends StatementNode {

	// foreach itm in array {...}
	ForeachKeyword: Token;
	Iterator: Token;
	IterationSource: ExpressionNode;

	constructor(source: Source, foreachKw: Token, iter: Token, iterSrc: ExpressionNode) {
		super(source);

		this.ForeachKeyword = foreachKw;
		this.Iterator = iter;
		this.IterationSource = iterSrc;
	}
}