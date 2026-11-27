import type { Diagnostic, SourceSpan } from "../shared/types";
import type {
  AlternativeNode,
  EquationNode,
  ExpressionNode,
  ParallelNode,
  ParenthesizedNode,
  ProgramNode,
  ReferenceNode,
  SequenceNode,
} from "./ast";
import { lex } from "./lexer";
import { syntaxDiagnostic } from "./syntax-diagnostics";
import {
  TOKEN_TYPES,
  type Token,
  type TokenType,
} from "./token-types";

export interface ParseResult {
  ast: ProgramNode | null;
  diagnostics: Diagnostic[];
}

function mergeSpans(first: SourceSpan, last: SourceSpan): SourceSpan {
  return { start: first.start, end: last.end };
}

class Parser {
  private index = 0;
  private readonly diagnostics: Diagnostic[];
  private currentEquationName: string | undefined;

  constructor(
    private readonly tokens: Token[],
    lexicalDiagnostics: Diagnostic[],
  ) {
    this.diagnostics = [...lexicalDiagnostics];
  }

  parse(): ParseResult {
    const equations: EquationNode[] = [];
    this.skipNewlines();

    while (!this.check(TOKEN_TYPES.eof)) {
      const equation = this.parseEquation();
      if (equation) {
        equations.push(equation);
      }

      if (!this.check(TOKEN_TYPES.newline) && !this.check(TOKEN_TYPES.eof)) {
        this.report(
          "PARSE_UNEXPECTED_TOKEN_AFTER_EXPRESSION",
          `Unexpected token ${JSON.stringify(this.peek().lexeme)} after the equation expression. Expected a new line or end of input.`,
          this.peek(),
        );
        this.synchronizeToNextLine();
      }
      this.skipNewlines();
      this.currentEquationName = undefined;
    }

    const eofSpan = this.peek().span;
    const program: ProgramNode = {
      kind: "Program",
      equations,
      span:
        equations.length > 0
          ? mergeSpans(equations[0].span, equations[equations.length - 1].span)
          : eofSpan,
    };

    return {
      ast: this.diagnostics.length === 0 ? program : null,
      diagnostics: this.diagnostics,
    };
  }

  private parseEquation(): EquationNode | null {
    if (!this.check(TOKEN_TYPES.identifier)) {
      this.report(
        "PARSE_EXPECTED_EQUATION_NAME",
        `Expected an equation name, but found ${this.describe(this.peek())}.`,
        this.peek(),
      );
      this.synchronizeToNextLine();
      return null;
    }

    const nameToken = this.advance();
    this.currentEquationName = nameToken.lexeme;

    if (!this.match(TOKEN_TYPES.equals)) {
      this.report(
        "PARSE_EXPECTED_EQUALS",
        `Equation ${JSON.stringify(nameToken.lexeme)} is missing '=' after its name.`,
        this.peek(),
      );
      this.synchronizeToNextLine();
      return null;
    }

    if (!this.canStartPrimary(this.peek().type)) {
      this.report(
        "PARSE_EXPECTED_EXPRESSION",
        `Equation ${JSON.stringify(nameToken.lexeme)} requires a process expression after '='.`,
        this.peek(),
      );
      this.synchronizeToNextLine();
      return null;
    }

    const expression = this.parseAlternative();
    if (!expression) {
      this.synchronizeToNextLine();
      return null;
    }

    return {
      kind: "Equation",
      name: nameToken.lexeme,
      nameSpan: nameToken.span,
      expression,
      span: mergeSpans(nameToken.span, expression.span),
    };
  }

  private parseAlternative(): ExpressionNode | null {
    const first = this.parseParallel();
    if (!first) return null;

    const branches: ExpressionNode[] = [first];
    while (this.match(TOKEN_TYPES.alt)) {
      const operator = this.previous();
      const right = this.parseOperandAfter(operator);
      if (!right) break;
      branches.push(right);
    }

    if (branches.length === 1) return first;
    const node: AlternativeNode = {
      kind: "Alternative",
      branches,
      span: mergeSpans(first.span, branches[branches.length - 1].span),
    };
    return node;
  }

  private parseParallel(): ExpressionNode | null {
    const first = this.parseSequence();
    if (!first) return null;

    const branches: ExpressionNode[] = [first];
    while (this.match(TOKEN_TYPES.par)) {
      const operator = this.previous();
      if (!this.canStartPrimary(this.peek().type)) {
        this.reportMissingOperand(operator);
        break;
      }
      const right = this.parseSequence();
      if (!right) break;
      branches.push(right);
    }

    if (branches.length === 1) return first;
    const node: ParallelNode = {
      kind: "Parallel",
      branches,
      span: mergeSpans(first.span, branches[branches.length - 1].span),
    };
    return node;
  }

  private parseSequence(): ExpressionNode | null {
    const first = this.parsePrimary();
    if (!first) return null;

    const elements: ExpressionNode[] = [first];
    while (this.match(TOKEN_TYPES.dot)) {
      const operator = this.previous();
      if (!this.canStartPrimary(this.peek().type)) {
        this.reportMissingOperand(operator);
        break;
      }
      const right = this.parsePrimary();
      if (!right) break;
      elements.push(right);
    }

    if (elements.length === 1) return first;
    const node: SequenceNode = {
      kind: "Sequence",
      elements,
      span: mergeSpans(first.span, elements[elements.length - 1].span),
    };
    return node;
  }

  private parseOperandAfter(operator: Token): ExpressionNode | null {
    if (!this.canStartPrimary(this.peek().type)) {
      this.reportMissingOperand(operator);
      return null;
    }
    return this.parseParallel();
  }

  private parsePrimary(): ExpressionNode | null {
    if (this.match(TOKEN_TYPES.identifier)) {
      const token = this.previous();
      if (token.lexeme === "C") {
        return { kind: "Continuation", span: token.span };
      }
      return { kind: "Interaction", name: token.lexeme, span: token.span };
    }

    if (this.match(TOKEN_TYPES.ref)) {
      const refToken = this.previous();
      if (!this.match(TOKEN_TYPES.identifier)) {
        this.report(
          "PARSE_EXPECTED_REFERENCE_TARGET",
          "Expected an equation name after 'ref'.",
          this.peek(),
        );
        return null;
      }
      const targetToken = this.previous();
      const node: ReferenceNode = {
        kind: "Reference",
        target: targetToken.lexeme,
        targetSpan: targetToken.span,
        span: mergeSpans(refToken.span, targetToken.span),
      };
      return node;
    }

    if (this.match(TOKEN_TYPES.leftParen)) {
      const leftParen = this.previous();
      if (!this.canStartPrimary(this.peek().type)) {
        this.report(
          "PARSE_EXPECTED_EXPRESSION",
          "Expected a process expression after '('.",
          this.peek(),
        );
        return null;
      }

      const expression = this.parseAlternative();
      if (!expression) return null;

      let endSpan = expression.span;
      if (this.match(TOKEN_TYPES.rightParen)) {
        endSpan = this.previous().span;
      } else {
        this.report(
          "PARSE_EXPECTED_RIGHT_PAREN",
          "Expected ')' to close the parenthesized expression.",
          this.peek(),
        );
      }

      const node: ParenthesizedNode = {
        kind: "Parenthesized",
        expression,
        span: mergeSpans(leftParen.span, endSpan),
      };
      return node;
    }

    this.report(
      "PARSE_EXPECTED_EXPRESSION",
      `Expected an interaction, reference, continuation, or parenthesized expression, but found ${this.describe(this.peek())}.`,
      this.peek(),
    );
    return null;
  }

  private reportMissingOperand(operator: Token): void {
    this.report(
      "PARSE_MISSING_OPERAND",
      `An operand is missing after '${operator.lexeme}'. Expected an interaction, reference, continuation, or parenthesized expression.`,
      this.peek(),
    );
  }

  private report(code: string, message: string, token: Token): void {
    this.diagnostics.push(
      syntaxDiagnostic(code, message, token.span, this.currentEquationName),
    );
  }

  private describe(token: Token): string {
    if (token.type === TOKEN_TYPES.eof) return "end of input";
    if (token.type === TOKEN_TYPES.newline) return "a new line";
    return JSON.stringify(token.lexeme);
  }

  private canStartPrimary(type: TokenType): boolean {
    return (
      type === TOKEN_TYPES.identifier ||
      type === TOKEN_TYPES.ref ||
      type === TOKEN_TYPES.leftParen
    );
  }

  private synchronizeToNextLine(): void {
    while (!this.check(TOKEN_TYPES.newline) && !this.check(TOKEN_TYPES.eof)) {
      this.advance();
    }
  }

  private skipNewlines(): void {
    while (this.match(TOKEN_TYPES.newline)) {
      // Empty lines separate equations and carry no syntax meaning.
    }
  }

  private match(type: TokenType): boolean {
    if (!this.check(type)) return false;
    this.advance();
    return true;
  }

  private check(type: TokenType): boolean {
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.check(TOKEN_TYPES.eof)) this.index += 1;
    return this.previous();
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private previous(): Token {
    return this.tokens[Math.max(0, this.index - 1)];
  }
}

export function parseProgram(source: string): ParseResult {
  const lexicalResult = lex(source);
  return new Parser(lexicalResult.tokens, lexicalResult.diagnostics).parse();
}

