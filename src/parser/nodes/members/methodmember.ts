import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import ParameterClause from "../clauses/parameterclause";
import TypeClause from "../clauses/typeclause";
import { NT } from "../nodetypes";
import BlockStatement from "../statements/blockstatement";
import { MemberNode } from "../syntaxnode";

export default class MethodMember extends MemberNode {

	// Meth member
	NodeType: NT = NT.MEMBER_METHOD;
	
	// Basically a function but with an extra ID token
	// <base>: <identifier>(<param>, <param>) <rettype> { ... }
	Base: Token;
	Identifier: Token;
	Parameters: ParameterClause[];
	ReturnType: TypeClause;
	Body: BlockStatement;

	constructor(source: Source, base: Token, id: Token, params: ParameterClause[], retType: TypeClause, body: BlockStatement) {
		super(source);

		this.Base = base;
		this.Identifier = id;
		this.Parameters = params;
		this.ReturnType = retType;
		this.Body = body;
	}
}