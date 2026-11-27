# Architecture

## Processing pipeline

```text
Text input
  -> Lexer
  -> Parser
  -> Syntax AST
  -> Validator and reference table
  -> Common Semantic IR
  -> Target conversion rules
  -> Expression generator
  -> Target re-parse and validation
  -> Browser output
```

## Module ownership

- `src/language/`: tokens, lexer, parser, syntax AST, and syntax diagnostics.
- `src/semantic/`: reference resolution, completeness checks, recursion analysis, and Common Semantic IR.
- `src/converters/`: target capability matrix and structural SD/SMD/AD conversion rules.
- `src/generator/`: precedence-aware process algebra output.
- `src/application/`: orchestration APIs used by the UI.
- `src/ui/`: browser components, file import, results, and user interactions.
- `src/shared/`: stable types shared across module boundaries.

## Interface rule

Changes to the AST, Semantic IR, diagnostics, or shared types are interface changes. Announce and review them before integration because they can affect every team member.

## Correctness rules

1. Undefined references are completeness warnings, not syntax errors.
2. Incomplete systems may still be converted.
3. References should remain references unless a documented rule requires expansion.
4. Unsupported constructs must produce explicit limitations.
5. Generated output must be parsed again using the target profile.
6. A textual Git merge is not proof of semantic compatibility.
