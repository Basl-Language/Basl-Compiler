import {
  action,
  command,
  commandOption,
  description,
  option,
  optionalArg,
  program,
  requiredArg,
  usage,
  variadicArg,
  version,
  Command,
} from 'commander-ts';
import {version as compilerVersion} from '../../package.json';
import compile from './compile';

@program()
@version(compilerVersion)
@description('A basic program')
@usage('--help')
export class Program {
  @option('--env <env>')
  env: string | null = null;

  constructor() {}

  run(@requiredArg('path') path: string) {
    compile(path);
  }
}
