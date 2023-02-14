import {SourceMap} from 'module';
import {isString, isSymbol} from 'util';
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

  public next(): void {
    this._char = this._source.content[this._index++];
  }
  public peek(): string {
    return this._source.content[this._index + 1];
  }

  public collectSymbol(): Token {
    switch (this._char) {
      case '@':
        return new Token(TT.SYM_AT, this._char);
      case '.':
        return new Token(TT.SYM_DOT, this._char);
      case '#':
        return new Token(TT.SYM_HASH, this._char);
      case ',':
        return new Token(TT.SYM_COMMA, this._char);
      case ':':
        if (this.peek() != ':') {
          return new Token(TT.SYM_COLON, this._char);
        } else {
          this.next();
          return new Token(TT.SYM_COLCOL, '::');
        }

      case '$':
        return new Token(TT.SYM_DOLLAR, this._char);
      case '?':
        return new Token(TT.SYM_QUESTION, this._char);
      case ';':
        return new Token(TT.SYM_SEMICOLON, this._char);
    }

    return new Token(TT.UNKNOWN, '');
  }

  public collectNumber(): Token {
    let fullNumStr = '';

    let isFloat = false;

    while (!isNaN(parseInt(this._char)) || this._char == '.') {
      if (this._char == '.' && isFloat == true) {
        throw new TypeError(
          'A floating-point number can only have one decimal point.'
        );
      }
      if (this._char == '.') isFloat = true;

      fullNumStr += this._char;
      this.next();
    }

    return new Token(TT.VALUE_NUMBER, fullNumStr);
  }

  public collectString(): Token {
    let fullStr = '';

    while (this._char != '"') {
      fullStr += this._char;
      this.next();
    }

    return new Token(TT.VALUE_STRING, fullStr);
  }

  // something.
  public isLetter(c: string): boolean {
    return c.toLowerCase() != c.toUpperCase();
  }

  public collectIdentifier(): Token {
    let fullIdent = '';

    while (this.isLetter(this._char)) {
      fullIdent += this._char;
      this.next();
    }

    switch (fullIdent) {
      case 'Func':
        return new Token(TT.KW_FUNC, fullIdent);
      case 'Event':
        return new Token(TT.KW_EVENT, fullIdent);
      case 'Entry':
        return new Token(TT.KW_ENTRY, fullIdent);
      case 'Namespace':
        return new Token(TT.KW_NS, fullIdent);
      case 'Struct':
        return new Token(TT.KW_STRUCT, fullIdent);
      case 'if':
        return new Token(TT.KW_FUNC, fullIdent);
      case 'else':
        return new Token(TT.KW_EVENT, fullIdent);
      case 'for':
        return new Token(TT.KW_ENTRY, fullIdent);
      case 'foreach':
        return new Token(TT.KW_NS, fullIdent);
      case 'while':
        return new Token(TT.KW_STRUCT, fullIdent);
    }

    return new Token(TT.IDENTIFIER, fullIdent);
  }

  public isSpecial(x: string): boolean{
    var format = /[ `!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?~]/;
    return format.test(x);
  }

  public tokenize() {
    while(this._index < this._source.content.length)
    {
        if(/\s/.test(this._char))
            continue; // skip whitespace
        if(this._char == '"')
            this._tokens.push(this.collectString());
        if(this.isSpecial(this._char))
            this._tokens.push(this.collectSymbol());
        if(this.isLetter(this._char))
            this._tokens.push(this.collectIdentifier());
        if(!isNaN(parseInt(this._char)))
            this._tokens.push(this.collectNumber());
        this.next();
    }
  }

  
  public get tokens() {
    return this._tokens;
  }
}
