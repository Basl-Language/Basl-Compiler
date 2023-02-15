import {TT} from '../../lexer/tokens';

export default class {
    public static getUnaryOperatorPrecedence(t: TT) {
        // TODO: someone fill this in please
        switch (t) {
            case TT.OP_PLUS:
            case TT.OP_MINUS:
            case TT.OP_NOT:
                return 3; // always one higher than the highest binary operator

            default:
                return 0;
        }
    }

    public static getBinaryOperatorPrecedence(t: TT) {
        // TODO: someone fill this in please
        switch (t) {
            case TT.OP_EQEQ:
            case TT.OP_MUL:
            case TT.OP_DIV:
                return 2;

            case TT.OP_PLUS:
            case TT.OP_MINUS:
                return 1;

            default:
                return 0;
        }
    }
}
