export enum TT {
  IDENTIFIER,

  // Keywords

  KW_FUNC, // Keyword: Func
  KW_EVENT, // Keyword: Event
  KW_ENTRY, // Keyword: Entry
  KW_NS, // Keyword: Namespace
  KW_STRUCT, // Keyword: Struct
  KW_IF, // Keyword: if
  KW_ELSE, // Keyword: else
  KW_WHILE, // Keyword: while
  KW_FOR, // Keyword: for
  KW_FOREACH, // Keyword: foreach
  KW_UHHHHHH, // Keyword: uhhhhhhhhhhhhhhhh

  // Values

  VALUE_NUMBER,
  VALUE_FLOAT,
  VALUE_NULL,
  VALUE_BOOL,
  VALUE_STRING,

  // Symbols
  SYM_AT, // Symbol: @
  SYM_DOT, // Symbol: .
  SYM_HASH, // Symbol: #
  SYM_COMMA, // Symbol: ,
  SYM_COLON, // Symbol: :
  SYM_COLCOL, // Symbol: ::
  SYM_DOLLAR, // Symbol: $
  SYM_QUESTION, // Symbol: ?
  SYM_SEMI_COLON, // Symbol: ;

  // Brackets
  BRACKET_LCURLY, // Symbol: {
  BRACKET_RCURLY, // Symbol: }
  BRACKET_LPARENT, // Symbol: (
  BRACKET_RPARENT, // Symbol: )
  BRACKET_RSQUARED, // Symbol: [
  BRACKET_LSQUARED, // Symbol: ]

  // Single characters
  OP_MUL, // Symbol: *
  OP_MOD, // Symbol: %
  OP_DIV, // Symbol: /
  OP_PLUS, // Symbol: +
  OP_MINUS, // Symbol: -

  // Double characters
  OP_MULEQ, // Symbol: *=
  OP_DIVEQ, // Symbol: /=
  OP_MOD_EQ, // Symbol: %=
  OP_PLUSEQ, // Symbol: +=
  OP_MINUSEQ, // Symbol: -=

  // Single character tokens
  OP_GT, // Symbol: >
  OP_LT, // Symbol: <

  // Double character tokens
  OP_ARROW, // Symbol: =>
  OP_EQEQ, // Symbol: ==
  OP_GTEQ, // Symbol: >=
  OP_LTEQ, // Symbol: <=
  OP_NOTEQ, // Symbol: !=

  // Single character tokens
  OP_EQ, // Symbol: =
  OP_NOT, // Symbol: !

  // Double character tokens
  OP_AND, // Symbol: &&
  OP_OR, // Symbol: ||

  // Bitwise operations
  OP_BIT_NOT, // Symbol: ~
  OP_BIT_OR, // Symbol: |
  OP_BIT_AND, // Symbol: &
  OP_BIT_XOR, // Symbol: ^

  OP_BIT_OR_EQ, // Symbol: |=
  OP_BIT_RSHIFT, // Symbol: >>
  OP_BIT_LSHIFT, // Symbol: <<
  OP_BIT_AND_EQ, // Symbol: &=
  OP_BIT_XOR_EQ, // Symbol: ^=
  OP_BIT_RSHIFT_EQ, // Symbol: >>=
  OP_BIT_LSHIFT_EQ, // Symbol: <<=

  __KWORD_START, // Start of the keyword list
  __KWORD_END, // End of the keyword list

  EOF, // End of file. This already exists in <stdio.h>
  UNKNOWN, // Other
}

export class Token {
  private _type: TT;
  private _value = '';

  constructor(t: TT, value = '<unknown>') {
    this._type = t;
    this._value = value;
  }

  public get type(): TT {
    return this._type;
  }

  public get value() {
    return this._value;
  }
}
