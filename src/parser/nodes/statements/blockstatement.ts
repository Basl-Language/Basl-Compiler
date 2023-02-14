import {Source} from '../../../common/Source';
import {StatementNode} from '../syntaxnode';

// This is, indeed, a block statement
export default class BlockStatement extends StatementNode {
    // Block statement is just a list of statements
    Statements: StatementNode[];

    constructor(source: Source, stmts: StatementNode[]) {
        super(source);

        this.Statements = stmts;
    }
}
