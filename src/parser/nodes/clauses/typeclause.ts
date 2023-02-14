import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { Node } from "../syntaxnode";

/// @brief Node for a datatype mention
export default class TypeClause extends Node {
	
	// This is a parameter clause
	NodeType: NT = NT.CLAUSE_TYPE;

	// Types are made out of either a pointer or array flag + a sub-typeclause
	// or an identifier for a type name
	Identifier: Token;

	// if its an array or pointer take note of that and store what its made of
	IsArray: boolean;
	IsPointer: boolean;
	SubType: TypeClause;

	constructor(source: Source, id: Token, arr: boolean, ptr: boolean, subtype: TypeClause) {
		super(source);

		this.Identifier = id;
		this.IsArray = arr;
		this.IsPointer = ptr;
		this.SubType = subtype;
	}
}