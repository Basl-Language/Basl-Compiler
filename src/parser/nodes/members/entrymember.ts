import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import ParameterClause from "../clauses/parameterclause";
import BlockStatement from "../statements/blockstatement";
import { MemberNode } from "../syntaxnode";


// This is an entry member
export default class EntryMember extends MemberNode {

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