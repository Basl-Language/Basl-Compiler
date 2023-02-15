import {Token} from '../lexer/tokens';
import {Source} from './Source';
import SrcObject from './SrcObject';

export default class DBGInfo extends SrcObject {
    public readonly width: number = 0;
    public readonly line: number = 0;
    public readonly pos: [number, number] = [0, 0];

    public readonly line_before: string = '';
    public readonly line_str: string = '';
    public readonly line_after: string = '';

    constructor(
        src: Source,
        pos: [number, number] = [0, 0],
        line = -1,
        width = 1
    ) {
        super(src);

        this.pos = pos;
        this.line = line ?? pos[1];
        this.width = width;

        // TODO: get lines from the source and the position
    }

    static fromToken(src: Source, tok: Token): DBGInfo {
        return new DBGInfo(src, tok.pos, tok.pos[1], tok.width);
    }
}
