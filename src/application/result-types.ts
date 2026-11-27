import type {
  Diagnostic,
  DiagramType,
  ValidationStatus,
} from "../shared/types";

export interface AnalysisResult {
  status: ValidationStatus;
  diagnostics: Diagnostic[];
}

export interface ConversionResult {
  status: "success" | "success_with_warnings" | "unsupported";
  target: DiagramType;
  output: string | null;
  diagnostics: Diagnostic[];
  appliedRules: string[];
}
