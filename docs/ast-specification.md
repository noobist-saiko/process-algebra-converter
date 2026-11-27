# Syntax AST Specification

The syntax AST records what the user wrote. It is intentionally separate from the Common Semantic IR owned by Member B.

## Root nodes

- `Program`: ordered list of equations.
- `Equation`: equation name, name span, expression, and complete source span.

## Expression nodes

- `Interaction`: a non-keyword identifier used as an action or interaction.
- `Continuation`: the reserved identifier `C` when used in an expression.
- `Reference`: `ref` followed by an equation name.
- `Sequence`: two or more expressions joined with `.`.
- `Parallel`: two or more expressions joined with `par`.
- `Alternative`: two or more expressions joined with `alt`.
- `Parenthesized`: an expression explicitly surrounded by parentheses.

Every node contains a `SourceSpan`. Positions are one-based for line and column, zero-based for absolute offset, and the end position is exclusive.

## Ownership boundary

The parser does not resolve references or decide whether a system is complete. For example, `System = ref Missing` is syntactically valid and produces a `Reference` node. Member B's validator determines that the system is incomplete.

## Interface changes

Adding or changing AST nodes is an interface change. Announce it to Members B and C before publishing because their IR and conversion code may depend on this contract.

