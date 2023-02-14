import {privateEncrypt} from 'crypto';
import {createSourceObject} from '../common/Source';
import Lexer from '../lexer';
import {openFile} from '../utils';
import { TT } from '../lexer/tokens';

export default (path: string) => {
    const content = openFile(path);

    const source = createSourceObject(path, content);
    const lexer = new Lexer(source);

    lexer.tokenize();

    var tokenInfo: any[] = []
    lexer.tokens.forEach(token => {
        tokenInfo.push({'Token': TT[token.type], 'Value': token.value});
    });
    console.table(tokenInfo);
};
