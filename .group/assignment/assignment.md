# Student Group Assignment: Process Algebra Parser and Converter

## Objective

Build a browser-based application that reads, validates, and converts process algebra equations between Sequence Diagram (SD), State Machine Diagram (SMD), and Activity Diagram (AD) forms.

The application produces process algebra equations and diagnostics. It does not draw UML diagrams.

## Required capabilities

1. Accept direct text editing and text-file import.
2. Parse multiple equations into an Abstract Syntax Tree.
3. Build a reference table connecting `ref A` to equation `A`.
4. Distinguish three outcomes:
   - Valid and complete
   - Valid but incomplete
   - Syntax error
5. Permit conversion of incomplete systems while preserving unresolved information.
6. Report useful syntax errors with the equation, line, column, problem, and expected input.
7. Convert behavior among SD-, SMD-, and AD-compatible forms using structural transformations rather than string replacement.
8. Preserve references, continuations, concurrency, guards, and trace classifications where applicable.
9. Clearly report unsupported or incomplete conversions.
10. Re-parse generated output to verify that it is syntactically valid for the target form.

## Required tests

- Valid single equation
- Multiple referenced equations
- Missing parenthesis or operand
- Undefined reference
- Unresolved top-level continuation
- Nested `alt`, `par`, and regions
- AD-specific construct converted to SMD
- SMD-specific construct converted to AD
- Generated conversion output parsed again

## Design constraint

Use one parser and one common semantic representation, followed by target-specific transformation and output procedures. Do not build three unrelated converters.
