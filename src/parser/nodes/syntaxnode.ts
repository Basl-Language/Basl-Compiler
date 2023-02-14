
import { Source } from "../../common/Source";
import SrcObject from "../../common/SrcObject";
import { NT } from "./nodetypes";

// =============================================================================
// Node base class, doesnt do shit, but is the base of everything else

/// @brief Base syntax tree node class, all nodes inherit from this.
export abstract class Node extends SrcObject {
    constructor(src: Source) {
        super(src);
    }

	abstract readonly NodeType: NT
}

// =============================================================================
// Members! This is the stuff thats allowed in the global scope

/// @brief Base node for all members (functions, events, structs, etc...)
export abstract class MemberNode extends Node {
	constructor(src: Source) {
        super(src);
    }
}

// =============================================================================
// Statement base class. These are contained withing members.

/// @brief Base node for all statements (if/else, for, while, etc...)
export abstract class StatementNode extends Node {
	constructor(src: Source) {
        super(src);
    }
}

// =============================================================================
// Expression base class. These are contained withing statements.

/// @brief Base node for all expressions (binary, unary, literals, etc...)
export abstract class ExpressionNode extends Node {
	constructor(src: Source) {
        super(src);
    }
}