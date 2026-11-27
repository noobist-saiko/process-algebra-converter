# Three-Person Team Work Assignment

## Member A: Language Core

**Write scope:** `src/language/**`, `tests/lexer/**`, `tests/parser/**`, grammar and AST documentation.

1. Document the official grammar.
2. Define tokens and source locations.
3. Define the Syntax AST.
4. Implement the lexer and parser.
5. Add useful location-aware syntax diagnostics.
6. Add lexer and parser tests.
7. Publish the change for Member C to review.

## Member B: Semantics and Generator

**Write scope:** `src/semantic/**`, `src/generator/**`, `src/diagnostics/**`, validator and generator tests.

1. Confirm Member A's AST interface.
2. Define the Common Semantic IR.
3. Implement reference resolution and completeness checks.
4. Handle recursive references safely.
5. Implement AST-to-IR conversion.
6. Implement precedence-aware equation generation.
7. Re-parse generated output and add tests.
8. Publish the change for Member A to review.

## Member C: Conversion, UI, and Integration

**Write scope:** `src/converters/**`, `src/application/**`, `src/ui/**`, converter and integration tests.

1. Confirm Member B's Semantic IR interface.
2. Create the SD/SMD/AD capability matrix and rule registry.
3. Implement basic target conversions.
4. Build and connect the browser workflow.
5. Re-parse every generated target output.
6. Report unsupported conversions explicitly.
7. Add converter and integration tests.
8. Publish the change for Member B to review.

## Shared workflow

```text
SYNC -> implement -> test -> PUB -> REV -> INT -> TEST
```

- A reviews B.
- B reviews C.
- C reviews A.
- Do not self-review.
- Announce changes to shared AST, IR, diagnostic, or shared-type contracts.
