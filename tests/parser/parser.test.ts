import { describe, expect, it } from "vitest";
import { parseProgram } from "../../src/language/parser";

describe("parser", () => {
  it("parses a valid equation into a structured AST", () => {
    const result = parseProgram("System = i1 . ref A");

    expect(result.diagnostics).toEqual([]);
    expect(result.ast?.equations[0]).toMatchObject({
      kind: "Equation",
      name: "System",
      expression: {
        kind: "Sequence",
        elements: [
          { kind: "Interaction", name: "i1" },
          { kind: "Reference", target: "A" },
        ],
      },
    });
  });

  it("parses multiple equations and leaves reference resolution to validation", () => {
    const result = parseProgram(
      "System = i1 . ref A\nA = (i2 . C) alt (i3 . C)",
    );

    expect(result.diagnostics).toEqual([]);
    expect(result.ast?.equations.map((equation) => equation.name)).toEqual([
      "System",
      "A",
    ]);
  });

  it("applies sequence before parallel and parallel before alternative", () => {
    const result = parseProgram("A = i1 alt i2 par i3 . C");

    expect(result.diagnostics).toEqual([]);
    expect(result.ast?.equations[0].expression).toMatchObject({
      kind: "Alternative",
      branches: [
        { kind: "Interaction", name: "i1" },
        {
          kind: "Parallel",
          branches: [
            { kind: "Interaction", name: "i2" },
            {
              kind: "Sequence",
              elements: [
                { kind: "Interaction", name: "i3" },
                { kind: "Continuation" },
              ],
            },
          ],
        },
      ],
    });
  });

  it("reports a missing operand after an operator", () => {
    const result = parseProgram("A = i1 alt");

    expect(result.ast).toBeNull();
    expect(result.diagnostics[0]).toMatchObject({
      code: "PARSE_MISSING_OPERAND",
      equationName: "A",
      span: { start: { line: 1, column: 11 } },
    });
    expect(result.diagnostics[0].message).toContain("after 'alt'");
  });

  it("reports an unclosed parenthesized expression", () => {
    const result = parseProgram("A = (i1 . C");

    expect(result.ast).toBeNull();
    expect(result.diagnostics[0]).toMatchObject({
      code: "PARSE_EXPECTED_RIGHT_PAREN",
      equationName: "A",
    });
  });

  it("reports the equation and location when an expression is missing", () => {
    const result = parseProgram("A =\nB = i2");

    expect(result.ast).toBeNull();
    expect(result.diagnostics[0]).toMatchObject({
      code: "PARSE_EXPECTED_EXPRESSION",
      equationName: "A",
      span: { start: { line: 1, column: 4 } },
    });
  });
});

