import Function from "../values/Function";

export default class {
    private _functions: Function[] = [];

    constructor() {}

    public get functions() {
        return this._functions;
    }

    public set addFunction(fn: Function) {
        this._functions.push(fn);
    }
}
