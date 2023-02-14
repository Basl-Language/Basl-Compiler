import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import ParameterClause from "../clauses/parameterclause";
import TypeClause from "../clauses/typeclause";

import BlockStatement from "../statements/blockstatement";
import { MemberNode } from "../syntaxnode";

// This do be a Func member
export default class FuncMember extends MemberNode {

	// Functions have a name, parameters, return type and body
	FuncKeyword: Token;
	Identifier: Token;
	Parameters: ParameterClause[];
	ReturnType: TypeClause;
	Body: BlockStatement;

	constructor(source: Source, funcKw: Token, id: Token, params: ParameterClause[], retType: TypeClause, body: BlockStatement) {
		super(source);

		this.FuncKeyword = funcKw;
		this.Identifier = id;
		this.Parameters = params;
		this.ReturnType = retType;
		this.Body = body;
	}
}