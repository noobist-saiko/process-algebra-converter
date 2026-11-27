import type { Diagnostic, SourceSpan } from "../shared/types";

export function syntaxDiagnostic(
  code: string,
  message: string,
  span: SourceSpan,
  equationName?: string,
): Diagnostic {
  return {
    code,
    severity: "error",
    message,
    span,
    ...(equationName ? { equationName } : {}),
  };
}

