import DBGSourceInfo from './DBGSourceInfo';
import {Source} from './Source';
import SrcObject from './SrcObject';

/**
 * @brief Class to hold dbg source info for it's children
 */
export default class extends SrcObject {
    protected dbg!: DBGSourceInfo;
    constructor(src: Source, dbg: DBGSourceInfo | undefined = undefined) {
        super(src);
        this.dbg = dbg as DBGSourceInfo;
    }

    public get dbgInfo() {
        return this.dbg;
    }

    public set dbgInfo(dbg: DBGSourceInfo) {
        this.dbg = dbg;
    }
}
