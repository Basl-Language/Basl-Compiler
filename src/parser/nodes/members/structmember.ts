import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import ParameterClause from "../clauses/parameterclause";
import { NT } from "../nodetypes";
import { MemberNode } from "../syntaxnode";

export default class StructMember extends MemberNode {

	// mmm struct
	NodeType: NT = NT.MEMBER_STRUCT;
	
	// if you think about it
	// Struct: myStruct {
	//		someField1 i32,	
	//		someField2 bool,	
	// }
	// 
	// these struct fields are literally the same format as parameters
	// so ill be recycling those here
	Identifier: Token;
	Fields: ParameterClause[]

	constructor(source: Source, id: Token, fields: ParameterClause[]) {
		super(source);

		this.Identifier = id;
		this.Fields = fields;
	}
}