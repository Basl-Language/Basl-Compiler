import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import ParameterClause from "../clauses/parameterclause";
import TypeClause from "../clauses/typeclause";
import { NT } from "../nodetypes";
import BlockStatement from "../statements/blockstatement";
import { MemberNode } from "../syntaxnode";

export default class FuncMember extends MemberNode {

	// This do be a Func member
	NodeType: NT = NT.MEMBER_FUNC;
	
	// Functions have a name, parameters, return type and body
	Identifier: Token;
	Parameters: ParameterClause[];
	ReturnType: TypeClause;
	Body: BlockStatement;
X
	constructor(source: Source, id: Token, params: ParameterClause[], retType: TypeClause, body: BlockStatement) {
		super(source);

		this.Identifier = id;
		this.Parameters = params;
		this.ReturnType = retType;
		this.Body = body;
	}
}