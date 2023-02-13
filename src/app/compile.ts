
import { createSourceObject } from "../common/Source";
import Lexer from "../lexer";

export default (path: string) => {
    let source = createSourceObject(path);
    let lexer = new Lexer(source);
}
