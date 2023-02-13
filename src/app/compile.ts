
import { createSourceObject } from "../common/Source";
import Lexer from "../lexer";
import { openFile } from "../utils";

export default (path: string) => {

    let content = openFile(path);

    let source = createSourceObject(path, content);
    let lexer = new Lexer(source);
}
