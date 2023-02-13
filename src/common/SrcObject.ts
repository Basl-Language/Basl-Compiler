import { Source } from "./Source";

export default class {
    protected _source: Source;
    constructor(src: Source) {
        this._source = src;
    }

    /// @brief Set a new source object instance
    public set source(src: Source) {
        this._source = src;
    }

    /// @return source object added to the parent class
    public get source(): Source {
        return this._source;
    }
}
