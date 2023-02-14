import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { ExpressionNode, StatementNode } from "../syntaxnode";

export default class ForeachStatement extends StatementNode {

	// This is a foreach statement :o
	NodeType: NT = NT.STATEMENT_FOREACH;

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