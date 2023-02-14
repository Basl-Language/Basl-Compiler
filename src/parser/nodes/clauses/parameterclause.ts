import { Source } from "../../../common/Source";
import { Token } from "../../../lexer/tokens";
import { NT } from "../nodetypes";
import { Node } from "../syntaxnode";
import TypeClause from "./typeclause";

/// @brief Node for a single parameter declaration
export default class ParameterClause extends Node {
	
	// This is a parameter clause
	NodeType: NT = NT.CLAUSE_PARAMETER;

	// Parameters are made out of just a name and a type
	Identifier: Token;
	Type: TypeClause;

	constructor(source: Source, id: Token, type: TypeClause) {
		super(source);

		this.Identifier = id;
		this.Type = type;
	}
}