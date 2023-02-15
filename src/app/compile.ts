import {privateEncrypt} from 'crypto';
import {createSourceObject} from '../common/Source';
import Lexer from '../lexer';
import Parser from '../parser';
import {openFile} from '../utils';
import { TT } from '../lexer/tokens';
import parser from '../parser';

export default (path: string) => {
    const content = openFile(path);

    const source = createSourceObject(path, content);
    const lexer = new Lexer(source);

    lexer.tokenize();

    var tokenInfo: any[] = []
    lexer.tokens.forEach(token => {
        tokenInfo.push({'Token': TT[token.type], 'Value': token.value, Width: token.width, Position: token.pos});
    });
    console.table(tokenInfo);

    // :B:arsing
    const parser = new Parser(source, lexer.tokens);
    var members  = parser.parse();

    console.log(members);
};
