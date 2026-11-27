import type { SourcePosition, SourceSpan } from "../shared/types";
import { syntaxDiagnostic } from "./syntax-diagnostics";
import {
  TOKEN_TYPES,
  type LexResult,
  type Token,
  type TokenType,
} from "./token-types";

const KEYWORDS: Readonly<Record<string, TokenType>> = {
  alt: TOKEN_TYPES.alt,
  par: TOKEN_TYPES.par,
  ref: TOKEN_TYPES.ref,
};

function isIdentifierStart(character: string): boolean {
  return /[A-Za-z_]/.test(character);
}

function isIdentifierPart(character: string): boolean {
  return /[A-Za-z0-9_]/.test(character);
}

export function lex(source: string): LexResult {
  const tokens: Token[] = [];
  const diagnostics: LexResult["diagnostics"] = [];
  let offset = 0;
  let line = 1;
  let column = 1;

  const position = (): SourcePosition => ({ offset, line, column });
  const spanFrom = (start: SourcePosition): SourceSpan => ({
    start,
    end: position(),
  });
  const pushToken = (
    type: TokenType,
    lexeme: string,
    start: SourcePosition,
  ) => {
    tokens.push({ type, lexeme, span: spanFrom(start) });
  };

  while (offset < source.length) {
    const character = source[offset];

    if (character === " " || character === "\t" || character === "\f") {
      offset += 1;
      column += 1;
      continue;
    }

    if (character === "\r" || character === "\n") {
      const start = position();
      const isCrLf = character === "\r" && source[offset + 1] === "\n";
      const lexeme = isCrLf ? "\r\n" : character;
      offset += isCrLf ? 2 : 1;
      line += 1;
      column = 1;
      pushToken(TOKEN_TYPES.newline, lexeme, start);
      continue;
    }

    if (isIdentifierStart(character)) {
      const start = position();
      const startOffset = offset;
      while (offset < source.length && isIdentifierPart(source[offset])) {
        offset += 1;
        column += 1;
      }
      const lexeme = source.slice(startOffset, offset);
      pushToken(KEYWORDS[lexeme] ?? TOKEN_TYPES.identifier, lexeme, start);
      continue;
    }

    const punctuation: Partial<Record<string, TokenType>> = {
      "=": TOKEN_TYPES.equals,
      ".": TOKEN_TYPES.dot,
      "(": TOKEN_TYPES.leftParen,
      ")": TOKEN_TYPES.rightParen,
    };
    const punctuationType = punctuation[character];
    if (punctuationType) {
      const start = position();
      offset += 1;
      column += 1;
      pushToken(punctuationType, character, start);
      continue;
    }

    const start = position();
    offset += 1;
    column += 1;
    diagnostics.push(
      syntaxDiagnostic(
        "LEX_UNEXPECTED_CHARACTER",
        `Unexpected character ${JSON.stringify(character)}.`,
        spanFrom(start),
      ),
    );
  }

  const eofPosition = position();
  tokens.push({
    type: TOKEN_TYPES.eof,
    lexeme: "",
    span: { start: eofPosition, end: eofPosition },
  });

  return { tokens, diagnostics };
}

