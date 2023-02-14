import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import ParameterClause from "../clauses/parameterclause";
import { NT } from "../nodetypes";
import BlockStatement from "../statements/blockstatement";
import { MemberNode } from "../syntaxnode";

export default class EntryMember extends MemberNode {

	// This is an entry member
	NodeType: NT = NT.MEMBER_ENTRY;

	// Parts of the entry member
	// Entry: <identifier>(<param>, <param>) { ... }
	EntryKeyword: Token;
	Identifier: Token;
	Parameters: ParameterClause[]
	Body: BlockStatement;

	constructor(source: Source, kw: Token, id: Token, params: ParameterClause[], body: BlockStatement) {
		super(source);

		this.EntryKeyword = kw;
		this.Identifier = id;
		this.Parameters = params;
		this.Body = body;
	}
}