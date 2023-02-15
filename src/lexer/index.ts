import { maxHeaderSize } from 'http';
import {Source} from '../common/Source';
import SrcObject from '../common/SrcObject';
import {Token} from './tokens';
import {TT} from './tokens';

export default class Lexer extends SrcObject {
    private _tokens: Token[] = [];

    private _index = 0;
    private _char = '';

    constructor(src: Source) {
        super(src);
    }

    // ===========================================================================
    // Helpers
    // ===========================================================================

    private next(): void {
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
    public isLetter(c: string): boolean {
        return /[A-Za-z]/i.test(c);
    }

    public isSpecial(x: string): boolean {
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

    public collectString(): Token {
        let fullStr = ''; // buffer to store our string into

        // Loop for as long as we dont hit a closing " or the end of file
        while (this._char != '\0' && this._char != '"') {
            fullStr += this._char;
            this.next();
        }

        // collect trailing "
        this.next();

        return new Token(TT.VALUE_STRING, fullStr);
    }

    public collectNumber(): Token {
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

        return new Token(TT.VALUE_NUMBER, fullNumStr);
    }

    public collectSymbol(): Token {

        // Identify which symbol this is
        switch (this._char) {

            // Symbols
            // -------
            case '@': return new Token(TT.SYM_AT, this._char);
            case '.': return new Token(TT.SYM_DOT, this._char);
            case '#': return new Token(TT.SYM_HASH, this._char);
            case ',': return new Token(TT.SYM_COMMA, this._char);
            
            case ':' :
                if (this.peek() == ':') {
                    this.next();
                    return new Token(TT.SYM_COLCOL, '::');
                } 

                return new Token(TT.SYM_COLON, this._char);

            case '$': return new Token(TT.SYM_DOLLAR, this._char);
            case '?': return new Token(TT.SYM_QUESTION, this._char);
            case ';': return new Token(TT.SYM_SEMICOLON, this._char);

            // Brackets
            // --------
            case '(': return new Token(TT.BRACKET_LPARENT, this._char);
            case '{': return new Token(TT.BRACKET_LCURLY, this._char);
            case '[': return new Token(TT.BRACKET_LSQUARED, this._char);

            case ')': return new Token(TT.BRACKET_RPARENT, this._char);
            case '}': return new Token(TT.BRACKET_RCURLY, this._char);
            case ']': return new Token(TT.BRACKET_RSQUARED, this._char);

            // Operators (Big and smol)
            // ------------------------
            case '*':
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_MULEQ, '*=');
                } 

                return new Token(TT.OP_MUL, this._char);

            case '%': 
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_MOD_EQ, '%=');
                } 

                return new Token(TT.OP_MOD, this._char);

            case '/': 
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_DIVEQ, '/=');
                } 
                
                return new Token(TT.OP_DIV, this._char);

            case '+': 
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_PLUSEQ, '+=');
                } 
                
                return new Token(TT.OP_PLUS, this._char);

            case '-':
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_MINUSEQ, '-=');
                } 

                return new Token(TT.OP_MINUS, this._char);

            case '<': 
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_LTEQ, '<=');
                } else if (this.peek() == '<' && this.peek(2) == '=') {
                    this.next();
                    this.next();
                    return new Token(TT.OP_BIT_LSHIFT_EQ, "<<=");
                } else if (this.peek() == '<') {
                    this.next();
                    return new Token(TT.OP_BIT_LSHIFT, "<<");
                }

                return new Token(TT.OP_LT, this._char);

            case '>': 
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_GTEQ, '>=');
                } else if (this.peek() == '>' && this.peek(2) == '=') {
                    this.next();
                    this.next();
                    return new Token(TT.OP_BIT_RSHIFT_EQ, ">>=");
                } else if (this.peek() == '>') {
                    this.next();
                    return new Token(TT.OP_BIT_RSHIFT, ">>");
                }

                return new Token(TT.OP_GT, this._char);

            case '=':
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_EQEQ, '==');
                } else if (this.peek() == '>') {
                    this.next();
                    return new Token(TT.OP_ARROW, '=>');
                }

                return new Token(TT.OP_EQ, this._char);

            case '!':
                if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_NOTEQ, '!=');
                }

                return new Token(TT.OP_NOT, this._char);

            case '&':
                if (this.peek() == '&') {
                    this.next();
                    return new Token(TT.OP_AND, '&&');
                } else if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_BIT_AND_EQ, '&=');
                }

                return new Token(TT.OP_BIT_AND, this._char);

            case '|':
                if (this.peek() == '|') {
                    this.next();
                    return new Token(TT.OP_OR, '||');
                } else if (this.peek() == '=') {
                    this.next();
                    return new Token(TT.OP_BIT_OR_EQ, '|=');
                }

                return new Token(TT.OP_BIT_OR, this._char);

            case '^':
                if (this.peek() == "=") {
                    this.next();
                    return new Token(TT.OP_BIT_XOR_EQ, '^=');
                }

                return new Token(TT.OP_BIT_XOR, this._char);

            case '~': return new Token(TT.OP_BIT_NOT, this._char);
        }

        // Aight, no clue
        return new Token(TT.UNKNOWN, '');
  }

    public collectIdentifier(): Token {
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
                return new Token(TT.KW_FUNC, fullIdent);

            case 'Event':
            case 'event':
                return new Token(TT.KW_EVENT, fullIdent);

            case 'Entry':
            case 'entry':
                return new Token(TT.KW_ENTRY, fullIdent);

            case 'Namespace':
            case 'namespace':
                return new Token(TT.KW_NS, fullIdent);

            case 'Struct':
            case 'struct':
                return new Token(TT.KW_STRUCT, fullIdent);

            case 'if':
                return new Token(TT.KW_IF, fullIdent);
            case 'else':
                return new Token(TT.KW_ELSE, fullIdent);
            case 'for':
                return new Token(TT.KW_FOR, fullIdent);
            case 'foreach':
                return new Token(TT.KW_FOREACH, fullIdent);
            case 'in':
                return new Token(TT.KW_IN, fullIdent);
            case 'while':
                return new Token(TT.KW_WHILE, fullIdent);
            case 'local': 
                return new Token(TT.KW_LOCAL, fullIdent);
        }

        // If its none of those -> its an identifier
        return new Token(TT.IDENTIFIER, fullIdent);
    }

    // cheeky token getter
    public get tokens() {
        return this._tokens;
    }
}
