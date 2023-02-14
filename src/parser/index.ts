
import { Source } from "../common/Source";
import SrcObject from "../common/SrcObject";
import { Token, TT } from "../lexer/tokens";
import ParameterClause from "./nodes/clauses/parameterclause";
import TypeClause from "./nodes/clauses/typeclause";
import EntryMember from "./nodes/members/entrymember";
import EventMember from "./nodes/members/eventmember";
import FuncMember from "./nodes/members/funcmember";
import MethodMember from "./nodes/members/methodmember";
import StructMember from "./nodes/members/structmember";
import BlockStatement from "./nodes/statements/blockstatement";
import { MemberNode, StatementNode } from "./nodes/syntaxnode";


export default class /* Parser */ extends SrcObject {

	private _tokens: Token[]
	private _index: number = 0

    constructor(src: Source, tokens: Token[]) {
        super(src);

		this._tokens = tokens;
    }

	// =========================================================================
	// Helpers
	// =========================================================================

	private current(): Token {
		return this.peek(0);
	} 

	private peek(offset: number): Token {
		
		// make sure this index is still valid
		if (this._index + offset >= this._tokens.length) {
			return new Token(TT.EOF);
		}

		// we good fam
		return this._tokens[this._index + offset];
	}

	private consume(tokenType: TT): Token {
		// is this the token we're looking for?
		if (this.current().type != tokenType) {
			throw new Error(`Wow sucks to be you! Expected ${tokenType} but got ${this.current().type}!`);
		}

		// if it is -> return it
		this._index++;
		return this.peek(-1);
	}

	// =========================================================================
	// Actual parsing
	// =========================================================================

	/// @brief Turns a list of tokens into a list of members in the global scope
	public parse(): MemberNode[] {
		var members: MemberNode[] = [];

		while (this.current().type != TT.EOF) {
			members.push(this.parseMember());
		}

		return members;
	}

	// -------------------------------------------------------------------------
	// Members
	// -------------------------------------------------------------------------
	private parseMember(): MemberNode {
		// Entry: member
		if (this.current().type == TT.KW_ENTRY) {
			return this.parseEntryMember();
		}

		// Func: member
		else if (this.current().type == TT.KW_FUNC) {
			return this.parseFuncMember();
		}

		// Event: member
		else if (this.current().type == TT.KW_EVENT) {
			return this.parseEventMember();
		}

		// Struct: member
		else if (this.current().type == TT.KW_STRUCT) {
			return this.parseStructMember();
		}

		// Maybe a method member if we find an identifier followed by a colon
		else if (this.current().type == TT.IDENTIFIER &&
				 this.peek(1).type == TT.SYM_COLON) {
			return this.parseMethodMember();
		}

		// welp looks like you lost
		throw new Error(`Wow sucks to be you! Expected MemberNode but got ${this.current().type}!`);
	}

	private parseEntryMember(): EntryMember {
		// Parse the context
		var entryKw: Token = this.consume(TT.KW_ENTRY);
		this.consume(TT.SYM_COLON);

		// Parse entry point name
		var identifier: Token = this.consume(TT.IDENTIFIER);

		// Parse parameters
		// Entry: main(args [string]) { ... }
		//            ^^^^^^^^^^^^^^
		this.consume(TT.BRACKET_LPARENT); // (
		var parameters: ParameterClause[] = this.parseParameterList();
		this.consume(TT.BRACKET_RPARENT); // )

		// the main entry point does not have a return value
		// if stuff went wrong, an error will have been thrown
		// (or something like that, havent thought about that yet)

		// Entry: main(args [string]) { ... }
		//                            ^^^^^^^
		var body: BlockStatement = this.parseBlockStatement();

		return new EntryMember(this._source, entryKw, identifier, parameters, body);
	}

	private parseFuncMember(): FuncMember {
		// Parse the context
		var funcKw: Token = this.consume(TT.KW_FUNC);
		this.consume(TT.SYM_COLON);

		// Parse function name
		var identifier: Token = this.consume(TT.IDENTIFIER);

		// Parse parameters
		// Func: someFunc(a i32, b i32) bool { ... }
		//               ^^^^^^^^^^^^^
		this.consume(TT.BRACKET_LPARENT); // (
		var parameters: ParameterClause[] = this.parseParameterList();
		this.consume(TT.BRACKET_RPARENT); // )

		// If there is one, parse a return type
		// Func: someFunc(a i32, b i32) bool { ... }
		//                              ^^^^
		var returnType: TypeClause;
		if (this.current().type != TT.BRACKET_LCURLY) {
			returnType = this.parseTypeClause();
		}

		// Func: someFunc(a i32, b i32) bool { ... }
		//                                   ^^^^^^^
		var body: BlockStatement = this.parseBlockStatement();

		return new FuncMember(this._source, funcKw, identifier, parameters, returnType, body);
	}

	private parseEventMember(): EventMember {
		// Parse the context
		var eventKw: Token = this.consume(TT.KW_EVENT);
		this.consume(TT.SYM_COLON);

		// Parse event name
		var identifier: Token = this.consume(TT.IDENTIFIER);

		// Parse parameters
		// Event: someCallback(someData <Data>) { ... }
		//                    ^^^^^^^^^^^^^^^^
		this.consume(TT.BRACKET_LPARENT); // (
		var parameters: ParameterClause[] = this.parseParameterList();
		this.consume(TT.BRACKET_RPARENT); // )

		// events currently dont return stuff, they are supposed to take data
		// in and operate on it directly

		// Event: someCallback(someData <Data>) { ... }
		//                                      ^^^^^^^
		var body: BlockStatement = this.parseBlockStatement();

		return new EventMember(this._source, eventKw, identifier, parameters, body);
	}

	private parseStructMember(): StructMember {
		// Parse the context
		var structKw: Token = this.consume(TT.KW_STRUCT);
		this.consume(TT.SYM_COLON);

		// Parse the struct name
		var identifier: Token = this.consume(TT.IDENTIFIER);

		this.consume(TT.BRACKET_LCURLY); // {
		var fields: ParameterClause[] = this.parseParameterList();
		this.consume(TT.BRACKET_RCURLY); // }

		return new StructMember(this._source, structKw, identifier, fields);
	}

	private parseMethodMember(): MethodMember {
		// Parse the context
		var baseStruct: Token = this.consume(TT.IDENTIFIER);
		this.consume(TT.SYM_COLON);

		// Parse function name
		var identifier: Token = this.consume(TT.IDENTIFIER);

		// Parse parameters
		// someStruct: someFunc(a i32, b i32) bool { ... }
		//                     ^^^^^^^^^^^^^
		this.consume(TT.BRACKET_LPARENT); // (
		var parameters: ParameterClause[] = this.parseParameterList();
		this.consume(TT.BRACKET_RPARENT); // )

		// If there is one, parse a return type
		// someStruct: someFunc(a i32, b i32) bool { ... }
		//                                    ^^^^
		var returnType: TypeClause;
		if (this.current().type != TT.BRACKET_LCURLY) {
			returnType = this.parseTypeClause();
		}

		// Func: someFunc(a i32, b i32) bool { ... }
		//                                   ^^^^^^^
		var body: BlockStatement = this.parseBlockStatement();

		return new MethodMember(this._source, baseStruct, identifier, parameters, returnType);
	}

	// -------------------------------------------------------------------------
	// Clauses
	// -------------------------------------------------------------------------
	private parseParameterClause(): ParameterClause {
		// Parameter name
		var identifier: Token = this.consume(TT.IDENTIFIER);

		// Parameter type
		var type: TypeClause = this.parseTypeClause();

		return new ParameterClause(this._source, identifier, type);
	}

	private parseParameterList(): ParameterClause[] {
		// list of all our parameters
		var parameters: ParameterClause[] = [];

		// loop for as long as we find enough commas to keep us happy 
		while (this.current().type != TT.EOF) {

			// <identifier> <type>
			parameters.push(this.parseParameterClause());
			
			// no more comma? no more params.
			if (this.current().type != TT.SYM_COMMA) {
				break;
			}

			// c o n s u m e  the comma
			this.consume(TT.SYM_COMMA);
		}

		// we don
		return parameters;
	}

	private parseTypeClause(): TypeClause {
		// Array types!
		// [subType]
		if (this.current().type == TT.BRACKET_LSQUARED) {
			this.consume(TT.BRACKET_LSQUARED);
			var subType: TypeClause = this.parseTypeClause();
			this.consume(TT.BRACKET_RSQUARED);

			return new TypeClause(this._source, null, true, false, subType);
		}

		// Pointer types!
		// <subType>
		if (this.current().type == TT.OP_LT) {
			this.consume(TT.OP_LT);
			var subType: TypeClause = this.parseTypeClause();
			this.consume(TT.OP_GT);

			return new TypeClause(this._source, null, false, true, subType);
		}

		// Boring types!
		var identifier: Token = this.consume(TT.IDENTIFIER);
		return new TypeClause(this._source, identifier, false, false, null);
	}

	// -------------------------------------------------------------------------
	// Statements
	// -------------------------------------------------------------------------
	private parseStatement(): StatementNode {
		var statement: StatementNode;

		switch (this.current().type) {
			case TT.BRACKET_LCURLY:
				statement = this.parseBlockStatement();
				break;
		}

		// yes (semicolon at the end of each statement)
		this.consume(TT.SYM_SEMICOLON);
		return statement;
	}

	private parseBlockStatement(): BlockStatement {
		// {
		this.consume(TT.BRACKET_LCURLY);

		var statements: StatementNode[] = [];

		// collect statements until we hit a closing brace or end of file
		while(this.current().type != TT.BRACKET_RCURLY &&
		      this.current().type != TT.EOF) {

			statements.push(this.parseStatement());
		}

		// }
		this.consume(TT.BRACKET_RCURLY);

		return new BlockStatement(this._source, statements);
	}
}
