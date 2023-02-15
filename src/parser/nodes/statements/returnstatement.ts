import { Source } from "../../../common/Source";
import { ExpressionNode, StatementNode } from "../syntaxnode";

export default class ReturnStatement extends StatementNode {

	// The value we're returning, can be nothing
	ReturnValue: ExpressionNode|null;

	constructor(source: Source, retVal: ExpressionNode|null) {
		super(source);

		this.ReturnValue = retVal;
	}
}