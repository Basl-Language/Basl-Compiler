import {Source} from '../../../common/Source';
import {Token} from '../../../lexer/tokens';
import ParameterClause from '../clauses/parameterclause';
import TypeClause from '../clauses/typeclause';

import BlockStatement from '../statements/blockstatement';
import {MemberNode} from '../syntaxnode';

// This do be a Func member
export default class EventMember extends MemberNode {
    // Events are functions lite, no return type because yes
    EventKeyword: Token;
    Identifier: Token;
    Parameters: ParameterClause[];
    Body: BlockStatement;

    constructor(
        source: Source,
        eventKw: Token,
        id: Token,
        params: ParameterClause[],
        body: BlockStatement
    ) {
        super(source);

        this.EventKeyword = eventKw;
        this.Identifier = id;
        this.Parameters = params;
        this.Body = body;
    }
}
