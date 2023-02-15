import DBGSourceInfo from '../common/DBGSourceInfo';
import {Source} from '../common/Source';
import SrcObject from '../common/SrcObject';
import {Token, TT} from '../lexer/tokens';
import ParameterClause from './nodes/clauses/parameterclause';
import TypeClause from './nodes/clauses/typeclause';
import AssignmentExpression from './nodes/expressions/assignmenexpression';
import BinaryExpression from './nodes/expressions/binaryexpression';
import CallExpression from './nodes/expressions/callexpression';
import LiteralExpression from './nodes/expressions/literalexpression';
import UnaryExpression from './nodes/expressions/unaryexpression';
import VariableExpression from './nodes/expressions/variableexpression';
import EntryMember from './nodes/members/entrymember';
import EventMember from './nodes/members/eventmember';
import FuncMember from './nodes/members/funcmember';
import MethodMember from './nodes/members/methodmember';
import StructMember from './nodes/members/structmember';
import Operators from './nodes/operators';
import BlockStatement from './nodes/statements/blockstatement';
import ExpressionStatement from './nodes/statements/expressionstatement';
import ForeachStatement from './nodes/statements/foreachstatement';
import ForStatement from './nodes/statements/forstatement';
import IfStatement from './nodes/statements/ifstatement';
import LocalStatement from './nodes/statements/localstatement';
import ReturnStatement from './nodes/statements/returnstatement';
import WhileStatement from './nodes/statements/whilestatement';
import {ExpressionNode, MemberNode, StatementNode} from './nodes/syntaxnode';

export default class extends /* Parser */ SrcObject {
    private _tokens: Token[];
    private _index: number = 0;

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
            throw new Error(
                `Wow sucks to be you! Expected ${TT[tokenType]} but got ${
                    TT[this.current().type]
                }!`
            );
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
        else if (
            this.current().type == TT.IDENTIFIER &&
            this.peek(1).type == TT.SYM_COLON
        ) {
            return this.parseMethodMember();
        }

        // welp looks like you lost
        throw new Error(
            `Wow sucks to be you! Expected MemberNode but got ${
                TT[this.current().type]
            }!`
        );
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

        return new EntryMember(
            this._source,
            entryKw,
            identifier,
            parameters,
            body
        );
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
        } else {
            returnType = undefined as unknown as TypeClause; // TODO: void type
        }

        // Func: someFunc(a i32, b i32) bool { ... }
        //                                   ^^^^^^^
        var body: BlockStatement = this.parseBlockStatement();

        return new FuncMember(
            this._source,
            funcKw,
            identifier,
            parameters,
            returnType,
            body
        );
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

        return new EventMember(
            this._source,
            eventKw,
            identifier,
            parameters,
            body
        );
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
        var returnType: TypeClause | null = null;
        if (this.current().type != TT.BRACKET_LCURLY) {
            returnType = this.parseTypeClause();
        }

        // Func: someFunc(a i32, b i32) bool { ... }
        //                                   ^^^^^^^
        var body: BlockStatement = this.parseBlockStatement();

        return new MethodMember(
            this._source,
            baseStruct,
            identifier,
            parameters,
            returnType,
            body
        );
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
            // These statements should not expect a semicolon
            case TT.BRACKET_LCURLY:
                return this.parseBlockStatement();

            case TT.KW_IF:
                return this.parseIfStatement();

            case TT.KW_WHILE:
                return this.parseWhileStatement();

            case TT.KW_FOR:
                return this.parseForStatement();

            case TT.KW_FOREACH:
                return this.parseForeachStatement();

            // These should expect a semicolon
            case TT.KW_LOCAL:
                statement = this.parseLocalStatement();
                break;

            case TT.OP_ARROW:
                statement = this.parseReturnStatement();
                break;

            default:
                statement = this.parseExpressionStatement();
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
        while (
            this.current().type != TT.BRACKET_RCURLY &&
            this.current().type != TT.EOF
        ) {
            statements.push(this.parseStatement());
        }

        // }
        this.consume(TT.BRACKET_RCURLY);

        return new BlockStatement(this._source, statements);
    }

    private parseIfStatement(): IfStatement {
        var ifKw: Token = this.consume(TT.KW_IF);
        var condition: ExpressionNode = this.parseExpression();
        var thenStmt: StatementNode = this.parseStatement();

        // optional else statement
        var elseStmt: StatementNode | null = null;
        if (this.current().type == TT.KW_ELSE) {
            this.consume(TT.KW_ELSE);
            elseStmt = this.parseStatement();
        }

        return new IfStatement(
            this._source,
            ifKw,
            condition,
            thenStmt,
            elseStmt
        );
    }

    private parseWhileStatement(): WhileStatement {
        var whileKw: Token = this.consume(TT.KW_WHILE);
        var condition: ExpressionNode = this.parseExpression();
        var loopStmt: StatementNode = this.parseStatement();

        return new WhileStatement(this._source, whileKw, condition, loopStmt);
    }

    private parseForStatement(): ForStatement {
        var forKw: Token = this.consume(TT.KW_FOR);

        var initializer: StatementNode = this.parseStatement();
        var condition: ExpressionNode = this.parseExpression();
        var step: StatementNode = this.parseStatement();

        var loopStmt: StatementNode = this.parseStatement();

        return new ForStatement(
            this._source,
            forKw,
            initializer,
            condition,
            step,
            loopStmt
        );
    }

    private parseForeachStatement(): ForeachStatement {
        var foreachKw: Token = this.consume(TT.KW_FOREACH);
        var iterator: Token = this.consume(TT.IDENTIFIER);

        this.consume(TT.KW_IN);

        var iterationSource: ExpressionNode = this.parseExpression();

        return new ForeachStatement(
            this._source,
            foreachKw,
            iterator,
            iterationSource
        );
    }

    private parseLocalStatement(): LocalStatement {
        var localKw: Token = this.consume(TT.KW_LOCAL);

        // is there a datatype given for this variable?
        // local [type:] myVar [= 100];
        var explicitType: TypeClause | null = null;
        if (
            this.peek(1).type != TT.OP_EQ &&
            this.peek(1).type != TT.SYM_SEMICOLON
        ) {
            explicitType = this.parseTypeClause();
            this.consume(TT.SYM_COLON);
        }

        // whats this variable called?
        var identifier: Token = this.consume(TT.IDENTIFIER);

        // do we have an initializer?
        var initializer: ExpressionNode | null = null;
        if (this.current().type == TT.OP_EQ) {
            this.consume(TT.OP_EQ);
            initializer = this.parseExpression();
        }

        return new LocalStatement(
            this._source,
            localKw,
            explicitType,
            identifier,
            initializer
        );
    }

    private parseReturnStatement(): ReturnStatement {
        this.consume(TT.OP_ARROW);

        // Parse the return value, if we've got one
        var returnValue: ExpressionNode|null = null;
        if (this.current().type != TT.SYM_SEMICOLON) {
            returnValue = this.parseExpression();
        }
        
        return new ReturnStatement(this._source, returnValue);
    }

    private parseExpressionStatement(): ExpressionStatement {
        var expression: ExpressionNode = this.parseExpression();
        return new ExpressionStatement(this._source, expression);
    }

    // -------------------------------------------------------------------------
    // Expressions
    // -------------------------------------------------------------------------
    private parseExpression(): ExpressionNode {
        // some crazy complex expressions would go here
        // stuff that you wouldnt want inside a binary expression

        return this.parseBinaryExpression();
    }

    private parseBinaryExpression(
        parentPrecendence: number = 0
    ): ExpressionNode {
        var left: ExpressionNode;

        // okay but like, is this actually a unary expression?
        var unaryPrecedence: number = Operators.getUnaryOperatorPrecedence(
            this.current().type
        );
        if (unaryPrecedence != 0 && unaryPrecedence > parentPrecendence) {
            // next token is our operator
            var operator: Token = this.consume(this.current().type);

            // then the expression
            var operand: ExpressionNode =
                this.parseBinaryExpression(unaryPrecedence);

            // done
            return new UnaryExpression(this._source, operator, operand);
        }

        // okay nah its a binary one

        left = this.parsePrimaryExpression();

        while (true) {
            var precedence: number = Operators.getBinaryOperatorPrecedence(
                this.current().type
            );

            // either not an operator or less important than our parent operator
            if (precedence == 0 || precedence < parentPrecendence) {
                break;
            }

            // parse both operator and the other side of the expression
            var operator: Token = this.consume(this.current().type);
            var right: ExpressionNode = this.parseBinaryExpression(precedence);

            // move all this to the left side and start again
            left = new BinaryExpression(this._source, left, operator, right);
        }

        return left;
    }

    private parsePrimaryExpression(): ExpressionNode {
        switch (this.current().type) {
            case TT.VALUE_NULL:
            case TT.VALUE_BOOL:
            case TT.VALUE_NUMBER:
            case TT.VALUE_FLOAT:
            case TT.VALUE_STRING:
                return this.parseLiteralExpression();

            case TT.IDENTIFIER:
                if (this.peek(1).type == TT.BRACKET_LPARENT) {
                    return this.parseCallExpression();
                } else if (this.peek(1).type == TT.OP_EQ) {
                    return this.parseAssignmentExpression(); 
                } else {
                    return this.parseVariableExpression();
                }

            default:
                throw new Error(
                    `Wow sucks to be you i guess. Expected an expression but got ${
                        TT[this.current().type]
                    }`
                );
        }
    }

    private parseLiteralExpression(): LiteralExpression {
        // just consume the next token we got
        var value: Token = this.consume(this.current().type);

        return new LiteralExpression(this._source, value);
    }

    private parseCallExpression(): CallExpression {
        // what are we calling?
        var identifier: Token = this.consume(TT.IDENTIFIER);

        this.consume(TT.BRACKET_LPARENT);

        // what are we calling with?
        var args: ExpressionNode[] = [];
        while (
            this.current().type != TT.EOF &&
            this.current().type != TT.BRACKET_RPARENT
        ) {
            args.push(this.parseExpression());

            // no comma? no bitches
            if (this.current().type != TT.SYM_COMMA) {
                break;
            }

            this.consume(TT.SYM_COMMA);
        }

        this.consume(TT.BRACKET_RPARENT);

        return new CallExpression(this._source, identifier, args);
    }

    private parseVariableExpression(): VariableExpression {
        // just a variable name
        var identifier: Token = this.consume(TT.IDENTIFIER);
        return new VariableExpression(this._source, identifier);
    }

    private parseAssignmentExpression(): AssignmentExpression {
        // the variable name
        var identifier: Token = this.consume(TT.IDENTIFIER);
        this.consume(TT.OP_EQ);

        // the value we're storing
        var value: ExpressionNode = this.parseExpression();

        return new AssignmentExpression(this._source, identifier, value);
    }

    private newNode<T extends any>(
        type: {new (...targs: any): T},
        dbg: DBGSourceInfo | undefined = undefined,
        ...args: any[]
    ) {
        let n = new type(...args) as any;

        if (typeof dbg === 'undefined') {
            dbg = DBGSourceInfo.fromToken(this._source, this.current());
        }

        n.dbgInfo(dbg);

        return n;
    }
}
