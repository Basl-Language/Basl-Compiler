
import { Source } from "../common/Source";
import SrcObject from "../common/SrcObject";
import { Token } from "./tokens";


export default class /* Lexer */ extends SrcObject {
    private _tokens: Token[] = [];
    constructor(src: Source) {
        super(src);


    }

    public tokenize() {

    }

    public get tokens() {
        return this._tokens;
    }
}
