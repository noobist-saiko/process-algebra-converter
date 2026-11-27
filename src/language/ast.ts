import type { SourceSpan } from "../shared/types";

interface AstNodeBase {
  kind: string;
  span: SourceSpan;
}

export interface ProgramNode extends AstNodeBase {
  kind: "Program";
  equations: EquationNode[];
}

export interface EquationNode extends AstNodeBase {
  kind: "Equation";
  name: string;
  nameSpan: SourceSpan;
  expression: ExpressionNode;
}

export interface InteractionNode extends AstNodeBase {
  kind: "Interaction";
  name: string;
}

export interface ContinuationNode extends AstNodeBase {
  kind: "Continuation";
}

export interface ReferenceNode extends AstNodeBase {
  kind: "Reference";
  target: string;
  targetSpan: SourceSpan;
}

export interface SequenceNode extends AstNodeBase {
  kind: "Sequence";
  elements: ExpressionNode[];
}

export interface AlternativeNode extends AstNodeBase {
  kind: "Alternative";
  branches: ExpressionNode[];
}

export interface ParallelNode extends AstNodeBase {
  kind: "Parallel";
  branches: ExpressionNode[];
}

export interface ParenthesizedNode extends AstNodeBase {
  kind: "Parenthesized";
  expression: ExpressionNode;
}

export type ExpressionNode =
  | InteractionNode
  | ContinuationNode
  | ReferenceNode
  | SequenceNode
  | AlternativeNode
  | ParallelNode
  | ParenthesizedNode;

