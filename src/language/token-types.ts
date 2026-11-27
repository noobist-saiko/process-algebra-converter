import type { Diagnostic, SourceSpan } from "../shared/types";

export const TOKEN_TYPES = {
  identifier: "identifier",
  equals: "equals",
  dot: "dot",
  leftParen: "leftParen",
  rightParen: "rightParen",
  alt: "alt",
  par: "par",
  ref: "ref",
  newline: "newline",
  eof: "eof",
} as const;

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export interface Token {
  type: TokenType;
  lexeme: string;
  span: SourceSpan;
}

export interface LexResult {
  tokens: Token[];
  diagnostics: Diagnostic[];
}

