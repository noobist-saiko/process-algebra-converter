"""Install locked Node.js dependencies for groupctl's isolated worktree."""

from __future__ import annotations

import shutil
import subprocess


def main() -> int:
    executable = shutil.which("pnpm") or shutil.which("pnpm.cmd")
    if executable is None:
        print(
            "pnpm was not found on PATH. Install pnpm 11.25.0 before running validation.",
            flush=True,
        )
        return 127

    completed = subprocess.run(
        [executable, "install", "--frozen-lockfile"],
        check=False,
    )
    return completed.returncode


if __name__ == "__main__":
    raise SystemExit(main())
