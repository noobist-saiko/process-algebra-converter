# Process Algebra Parser and Converter

A browser-based group project for parsing, validating, and converting process algebra equations among Sequence Diagram (SD), State Machine Diagram (SMD), and Activity Diagram (AD) forms.

Repository: <https://github.com/noobist-saiko/process-algebra-converter>

## Current status

The project foundation is ready. It includes the React/TypeScript application shell, shared contracts, documentation, and a smoke test. The lexer, parser, semantic validator, generator, and converters are intentionally left for the assigned team members.

## Requirements

- Git
- Node.js 20 or newer
- npm 10 or newer
- Python 3.10 or newer and groupctl for the collaboration workflow

## Setup

```bash
git clone https://github.com/noobist-saiko/process-algebra-converter.git
cd process-algebra-converter
npm install
npm test
npm run build
npm run dev
```

## Project documents

- [`assignment.md`](assignment.md): authoritative project requirements.
- [`PROJECT_PLAN.md`](PROJECT_PLAN.md): milestone plan.
- [`TEAM_WORK_ASSIGNMENT.md`](TEAM_WORK_ASSIGNMENT.md): three-person responsibilities.
- [`docs/architecture.md`](docs/architecture.md): processing pipeline and module boundaries.
- [`docs/grammar.md`](docs/grammar.md): official grammar placeholder and checklist.
- [`docs/conversion-rules.md`](docs/conversion-rules.md): conversion-rule template.
- [`docs/limitations.md`](docs/limitations.md): known limitations.

## Collaboration setup

Install groupctl according to its official instructions, then install the agent-facing collaboration files:

```bash
groupctl agent-setup --target . --dry-run
groupctl agent-setup --target .
```

The first member initializes the group after choosing the real group ID, person ID, display name, and topic. The repository includes cross-platform validation commands in `groupctl-checks.json`:

```bash
groupctl init --group YOUR_GROUP_ID --person YOUR_PERSON_ID --name "YOUR_NAME" --topic YOUR_TOPIC --assignment assignment.md --checks-file groupctl-checks.json --publish
```

Other members then join using their assigned identities.

Start each work session with:

```bash
groupctl context --format markdown
groupctl inbox
groupctl status --format text
```

Follow this evidence flow for each small feature:

```text
SYNC -> implementation and local tests -> PUB -> independent REV -> INT -> TEST
```

## Validation commands

The initial project checks are:

```bash
npm run typecheck
npm test
npm run build
```

Do not claim parser or converter correctness until the official grammar, semantic conversion rules, and corresponding tests are present.
