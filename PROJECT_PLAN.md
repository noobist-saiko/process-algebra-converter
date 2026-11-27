# Project Plan

## Milestone 0: Contract freeze

- Obtain and document the official grammar.
- Approve the Syntax AST, Common Semantic IR, and diagnostic contract.
- Approve the SD/SMD/AD capability matrix.

## Milestone 1: Basic language pipeline

- Parse multiple equations.
- Support sequencing, alternatives, parallel behavior, references, and continuations.
- Produce useful location-aware syntax diagnostics.

## Milestone 2: Validation and generation

- Build the reference table.
- Distinguish complete, incomplete, and invalid input.
- Generate precedence-correct equations.
- Re-parse generated output.

## Milestone 3: Basic conversions and UI

- Convert common constructs among SD, SMD, and AD profiles.
- Connect the editor, syntax check, conversion actions, diagnostics, and output.

## Milestone 4: Specialized conversions

- AD interruptible regions and fork/join.
- SMD composite states, pseudostates, and orthogonal regions.
- SD weak sequencing and combined fragments.
- Trace classifications such as `neg` and `assert`.

## Milestone 5: Final verification

- Complete unit and integration tests.
- Document limitations.
- Review, integrate, test, and obtain human final confirmation.
