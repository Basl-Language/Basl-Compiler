
import { SourceMap } from "module";
import { Source } from "../common/Source";
import SrcObject from "../common/SrcObject";
import { Token } from "./tokens";
import { TT } from "./tokens";

export default class Lexer extends SrcObject {
    private _tokens: Token[] = [];

    private _index: number = 0;
    private _char: string = "";

    constructor(src: Source) {
        super(src);


    }

    public Next(): void
    {
        this._char = this._source.content[this._index++];
    }
    public Peek(): string
    {
        return this._source.content[this._index+1];
    }

    public CollectSymbol(): Token
    {
        switch(this._char)
        {
            case '@':
                return new Token(TT.SYM_AT, this._char);
            case '.':
                return new Token(TT.SYM_DOT, this._char);
            case '#':
                return new Token(TT.SYM_HASH, this._char);
            case ',':
                return new Token(TT.SYM_COMMA, this._char);
            case ':':
                if(this.Peek() != ':')
                {
                    return new Token(TT.SYM_COLON, this._char);
                }
                else
                {
                    this.Next();
                    return new Token(TT.SYM_COLCOL, "::");
                }
                
            case '$':
                return new Token(TT.SYM_DOLLAR, this._char);
            case '?':
                return new Token(TT.SYM_QUESTION, this._char);
            case ';':
                return new Token(TT.SYM_SEMI_COLON, this._char);
        }

        return new Token(TT.UNKNOWN, "");
    }

    public tokenize() {

    }

    public get tokens() {
        return this._tokens;
    }
}
