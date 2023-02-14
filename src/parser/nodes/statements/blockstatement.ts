import { Source } from "../../../common/Source";
import { NT } from "../nodetypes";
import { StatementNode } from "../syntaxnode";

export default class BlockStatement extends StatementNode {
	
	// This is, indeed, a block statement
	NodeType: NT = NT.STATEMENT_BLOCK;
	
	// Block statement is just a list of statements
	Statements: StatementNode[]

	constructor(source: Source, stmts: StatementNode[]) {
		super(source);

		this.Statements = stmts;
	}
}