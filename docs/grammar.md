# Process Algebra Grammar

> Status: provisional core implemented; the official course grammar is still required.

The initial parser implements only the constructs explicitly demonstrated by the current assignment. This is a replaceable baseline, not a claim that the full course grammar has been recovered.

## Provisional lexical rules

- Identifiers begin with an ASCII letter or underscore and continue with ASCII letters, digits, or underscores.
- `alt`, `par`, and `ref` are case-sensitive reserved keywords.
- `C` is a continuation when it appears as a primary expression.
- Each equation currently occupies one logical line.
- Spaces, tabs, and blank lines are ignored outside tokens.
- Comments and Unicode identifiers are not defined until the official grammar confirms them.

## Implemented grammar

```ebnf
program       = { newline }, equation, { newline, { newline }, equation }, { newline } ;
equation      = identifier, "=", expression ;
expression    = alternative ;
alternative   = parallel, { "alt", parallel } ;
parallel      = sequence, { "par", sequence } ;
sequence      = primary, { ".", primary } ;
primary       = identifier
              | "C"
              | "ref", identifier
              | "(", expression, ")" ;
```

The provisional precedence, from strongest to weakest, is:

1. Parentheses and primary expressions
2. Sequence (`.`)
3. Parallel (`par`)
4. Alternative (`alt`)

All three infix operators are provisionally left-associative and are represented as flat n-ary AST nodes.

## Required official decisions

Before extending the parser, the team must obtain and record:

- The complete grammar productions
- Confirmed precedence and associativity
- Interaction syntax and identifier character set
- Whether expressions may span multiple lines
- Comment and separator rules
- Guards, regions, calls, interrupts, fork/join, and pseudostate syntax
- SD-, SMD-, and AD-specific constructs
- Continuation and recursive-reference rules
- Valid examples and invalid counterexamples

Any uncertain rule must be raised as a group question rather than silently guessed.
