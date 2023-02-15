import { maxHeaderSize } from 'http';
import {Source} from '../common/Source';
import SrcObject from '../common/SrcObject';
import {Token} from './tokens';
import {TT} from './tokens';

export default class Lexer extends SrcObject {
    private _tokens: Token[] = [];

    private _index = 0;
    private _char = '';

    private _line = 0;
    private _col  = 0;

    constructor(src: Source) {
        super(src);
    }

    // ===========================================================================
    // Helpers
    // ===========================================================================

    private next(): void {

        if (this._char === '\n') { this._line++; this._col = 0; }
        else { this._col++; }
        // Is this still valid?
        if (this._index >= this._source.content.length) {
            // null character will function as EOF
            this._char = '\0';
            return;
        }

        // Otherwise we're fine
        this._char = this._source.content[this._index++];
    }

    private peek(offset: number = 0): string {
        // Is this still valid?
        if (this._index + offset >= this._source.content.length) {
            // null character will function as EOF
            return '\0';
        }

        // Otherwise we're fine
        return this._source.content[this._index + offset];
    }

    // ---------------------------------------------------------------------------
    // Character classification helpers
    // ---------------------------------------------------------------------------
    private isLetter(c: string): boolean {
        return /[A-Za-z]/i.test(c);
    }

    private isSpecial(x: string): boolean {
        var format = /[`!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?~]/;
        return format.test(x);
    }

    // ===========================================================================
    // Lexing
    // ===========================================================================

    public tokenize() {
        while (this._char != '\0') {

            // Is this a whitespace character? -> Skip
            if (/\s/.test(this._char)) {
                this.next();
                continue;
            }

            // Is this the start of a string?
            if (this._char == "\"") {
                this._tokens.push(this.collectString());
            }

            // Is this an operator or symbol?
            else if (this.isSpecial(this._char)) {
                this._tokens.push(this.collectSymbol());
                this.next();
            }

            // Is this a keyword?
            else if (this.isLetter(this._char)) {
                this._tokens.push(this.collectIdentifier());
            }

            // Is this a numeric?
            else if (!isNaN(parseInt(this._char))) {
                this._tokens.push(this.collectNumber());
            }

            // Alright no clue what this is -> Skip
            else this.next();
        }
    }

    private collectString(): Token {
        let fullStr = ''; // buffer to store our string into

        // Loop for as long as we dont hit a closing " or the end of file
        while (this._char != '\0' && this._char != '"') {
            if (this._char === "\\") {
                let c = this.peek();
                switch (c) {
                    case '\0': throw new TypeError(
                        'A floating-point number can only have one decimal point.'
                    );

                    case '\\': fullStr += '\\'; this.next(); break;
                    case '\'': fullStr += '\''; this.next(); break;
                    case 't': fullStr += '\t';  this.next(); break;
                    case 'n': fullStr += '"';   this.next(); break;
                    case '"': fullStr += '\n';  this.next(); break;
                    case 't': fullStr += '\t';  this.next(); break;
                    case 'r': fullStr += '\r';  this.next(); break;
                    case '\n': fullStr += '\n';  this.next(); break;

                }
            }
            this.next();
        }

        // collect trailing "
        this.next();

        return this.newToken(TT.VALUE_STRING, fullStr, fullStr.length);
    }

    private collectNumber(): Token {
        let fullNumStr = ''; // Number buffer
        let isFloat = false; // Float flag

        // As long as we keep finding numbers or a decimal point
        while (!isNaN(parseInt(this._char)) || this._char == '.') {

            // 1.0.0 is an invalid number
            if (this._char == '.' && isFloat == true) {
                throw new TypeError(
                    'A floating-point number can only have one decimal point.'
                );
            }

            // Mark this as a floating point number
            if (this._char == '.') isFloat = true;

            fullNumStr += this._char;
            this.next();
        }

        return this.newToken(TT.VALUE_NUMBER, fullNumStr, fullNumStr.length);
    }

    private newToken(ty: TT, value: string = this._char, width: number = -1) {
        let pos: [number, number] = [this._line, this._col - (width === -1 ? 0 : (width+1))];
        return new Token(ty, pos, value, width);
    }

    private collectSymbol(): Token {

        // Identify which symbol this is
        switch (this._char) {

            // Symbols
            // -------
            case '@': return this.newToken(TT.SYM_AT);
            case '.': return this.newToken(TT.SYM_DOT);
            case '#': return this.newToken(TT.SYM_HASH);
            case ',': return this.newToken(TT.SYM_COMMA);
            
            case ':' :
                if (this.peek() == ':') {
                    this.next();
                    return this.newToken(TT.SYM_COLCOL, '::');
                } 

                return this.newToken(TT.SYM_COLON);

            case '$': return this.newToken(TT.SYM_DOLLAR);
            case '?': return this.newToken(TT.SYM_QUESTION);
            case ';': return this.newToken(TT.SYM_SEMICOLON);

            // Brackets
            // --------
            case '(': return this.newToken(TT.BRACKET_LPARENT);
            case '{': return this.newToken(TT.BRACKET_LCURLY);
            case '[': return this.newToken(TT.BRACKET_LSQUARED);

            case ')': return this.newToken(TT.BRACKET_RPARENT);
            case '}': return this.newToken(TT.BRACKET_RCURLY);
            case ']': return this.newToken(TT.BRACKET_RSQUARED);

            // Operators (Big and smol)
            // ------------------------
            case '*':
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_MULEQ, '*=');
                } 

                return this.newToken(TT.OP_MUL);

            case '%': 
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_MOD_EQ, '%=');
                } 

                return this.newToken(TT.OP_MOD);

            case '/': 
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_DIVEQ, '/=');
                } 
                
                return this.newToken(TT.OP_DIV);

            case '+': 
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_PLUSEQ, '+=');
                } 
                
                return this.newToken(TT.OP_PLUS);

            case '-':
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_MINUSEQ, '-=');
                } 

                return this.newToken(TT.OP_MINUS);

            case '<': 
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_LTEQ, '<=');
                } else if (this.peek() == '<' && this.peek(2) == '=') {
                    this.next();
                    this.next();
                    return this.newToken(TT.OP_BIT_LSHIFT_EQ, "<<=");
                } else if (this.peek() == '<') {
                    this.next();
                    return this.newToken(TT.OP_BIT_LSHIFT, "<<");
                }

                return this.newToken(TT.OP_LT);

            case '>': 
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_GTEQ, '>=');
                } else if (this.peek() == '>' && this.peek(2) == '=') {
                    this.next();
                    this.next();
                    return this.newToken(TT.OP_BIT_RSHIFT_EQ, ">>=");
                } else if (this.peek() == '>') {
                    this.next();
                    return this.newToken(TT.OP_BIT_RSHIFT, ">>");
                }

                return this.newToken(TT.OP_GT);

            case '=':
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_EQEQ, '==');
                } else if (this.peek() == '>') {
                    this.next();
                    return this.newToken(TT.OP_ARROW, '=>');
                }

                return this.newToken(TT.OP_EQ);

            case '!':
                if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_NOTEQ, '!=');
                }

                return this.newToken(TT.OP_NOT);

            case '&':
                if (this.peek() == '&') {
                    this.next();
                    return this.newToken(TT.OP_AND, '&&');
                } else if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_BIT_AND_EQ, '&=');
                }

                return this.newToken(TT.OP_BIT_AND);

            case '|':
                if (this.peek() == '|') {
                    this.next();
                    return this.newToken(TT.OP_OR, '||');
                } else if (this.peek() == '=') {
                    this.next();
                    return this.newToken(TT.OP_BIT_OR_EQ, '|=');
                }

                return this.newToken(TT.OP_BIT_OR);

            case '^':
                if (this.peek() == "=") {
                    this.next();
                    return this.newToken(TT.OP_BIT_XOR_EQ, '^=');
                }

                return this.newToken(TT.OP_BIT_XOR);

            case '~': return this.newToken(TT.OP_BIT_NOT);
        }

        // Aight, no clue
        // TODO: throw error? Undefined character
        return this.newToken(TT.UNKNOWN, '');
  }

    private collectIdentifier(): Token {
        let fullIdent = ''; // Identifier / Keyword buffer

        // Loop for as long as we find letters, numbers or _ (EOF safe)
        while (this.isLetter(this._char) || !isNaN(parseInt(this._char)) || this._char == '_') {
            fullIdent += this._char;
            this.next();
        }

        // Classify this keyword
        switch (fullIdent) {
            case 'Func':
            case 'func':
                return this.newToken(TT.KW_FUNC, fullIdent, fullIdent.length);

            case 'Event':
            case 'event':
                return this.newToken(TT.KW_EVENT, fullIdent, fullIdent.length);

            case 'Entry':
            case 'entry':
                return this.newToken(TT.KW_ENTRY, fullIdent, fullIdent.length);

            case 'Namespace':
            case 'namespace':
                return this.newToken(TT.KW_NS, fullIdent, fullIdent.length);

            case 'Struct':
            case 'struct':
                return this.newToken(TT.KW_STRUCT, fullIdent, fullIdent.length);

            case 'if':
                return this.newToken(TT.KW_IF, fullIdent, fullIdent.length);
            case 'else':
                return this.newToken(TT.KW_ELSE, fullIdent, fullIdent.length);
            case 'for':
                return this.newToken(TT.KW_FOR, fullIdent, fullIdent.length);
            case 'foreach':
                return this.newToken(TT.KW_FOREACH, fullIdent, fullIdent.length);
            case 'in':
                return this.newToken(TT.KW_IN, fullIdent, fullIdent.length);
            case 'while':
                return this.newToken(TT.KW_WHILE, fullIdent, fullIdent.length);
            case 'local':
                return this.newToken(TT.KW_LOCAL, fullIdent, fullIdent.length);
        }

        // If its none of those -> its an identifier
        return this.newToken(TT.IDENTIFIER, fullIdent, fullIdent.length);
    }

    // cheeky token getter
    public get tokens() {
        return this._tokens;
    }
}
