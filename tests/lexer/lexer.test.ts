import { describe, expect, it } from "vitest";
import { lex } from "../../src/language/lexer";
import { TOKEN_TYPES } from "../../src/language/token-types";

describe("lexer", () => {
  it("recognizes the initial language tokens", () => {
    const result = lex("System = (i1 . ref A) alt i2 par C");

    expect(result.diagnostics).toEqual([]);
    expect(result.tokens.map(({ type, lexeme }) => [type, lexeme])).toEqual([
      [TOKEN_TYPES.identifier, "System"],
      [TOKEN_TYPES.equals, "="],
      [TOKEN_TYPES.leftParen, "("],
      [TOKEN_TYPES.identifier, "i1"],
      [TOKEN_TYPES.dot, "."],
      [TOKEN_TYPES.ref, "ref"],
      [TOKEN_TYPES.identifier, "A"],
      [TOKEN_TYPES.rightParen, ")"],
      [TOKEN_TYPES.alt, "alt"],
      [TOKEN_TYPES.identifier, "i2"],
      [TOKEN_TYPES.par, "par"],
      [TOKEN_TYPES.identifier, "C"],
      [TOKEN_TYPES.eof, ""],
    ]);
  });

  it("tracks one-based line and column positions across CRLF input", () => {
    const result = lex("A = i1\r\nB = ref A");
    const secondEquationName = result.tokens.find(
      (token) => token.lexeme === "B",
    );

    expect(secondEquationName?.span.start).toEqual({
      offset: 8,
      line: 2,
      column: 1,
    });
  });

  it("reports unexpected characters without hiding their location", () => {
    const result = lex("A = i1 @ C");

    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]).toMatchObject({
      code: "LEX_UNEXPECTED_CHARACTER",
      severity: "error",
      span: { start: { line: 1, column: 8 } },
    });
  });
});

