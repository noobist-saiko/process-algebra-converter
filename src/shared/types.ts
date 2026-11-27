export const DIAGRAM_TYPES = ["SD", "SMD", "AD"] as const;

export type DiagramType = (typeof DIAGRAM_TYPES)[number];

export type ValidationStatus =
  | "not_checked"
  | "valid_complete"
  | "valid_incomplete"
  | "syntax_error";

export interface SourcePosition {
  line: number;
  column: number;
  offset: number;
}

export interface SourceSpan {
  start: SourcePosition;
  end: SourcePosition;
}

export type DiagnosticSeverity = "error" | "warning" | "information";

export interface Diagnostic {
  code: string;
  severity: DiagnosticSeverity;
  message: string;
  equationName?: string;
  span?: SourceSpan;
}
