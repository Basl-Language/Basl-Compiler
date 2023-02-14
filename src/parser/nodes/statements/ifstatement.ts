import {Source} from '../../../common/Source';
import {Token} from '../../../lexer/tokens';

import {ExpressionNode, StatementNode} from '../syntaxnode';

// This is an if statement!
export default class IfStatement extends StatementNode {
    // if { ... } [else { ... }]
    IfKeyword: Token;
    Condition: ExpressionNode;
    ThenStatement: StatementNode;
    ElseStatement: StatementNode | null;

    constructor(
        source: Source,
        ifKw: Token,
        cond: ExpressionNode,
        thenStmt: StatementNode,
        elseStmt: StatementNode | null
    ) {
        super(source);

        this.IfKeyword = ifKw;
        this.Condition = cond;
        this.ThenStatement = thenStmt;
        this.ElseStatement = elseStmt;
    }
}
