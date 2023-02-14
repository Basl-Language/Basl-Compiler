import { privateEncrypt } from 'crypto';
import {createSourceObject} from '../common/Source';
import Lexer from '../lexer';
import {openFile} from '../utils';

export default (path: string) => {
  const content = openFile(path);

  const source = createSourceObject(path, content);
  const lexer = new Lexer(source);

  lexer.tokenize();

  lexer.tokens.forEach(token => {
    console.log(token.type+": "+token.value);
  });
};
