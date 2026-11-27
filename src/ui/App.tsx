import { useState } from "react";
import { DIAGRAM_TYPES, type DiagramType } from "../shared/types";

const EXAMPLE_INPUT = `System = i1 . ref A
A = (i2 . C) alt (i3 . C)`;

export default function App() {
  const [sourceType, setSourceType] = useState<DiagramType>("SD");
  const [input, setInput] = useState(EXAMPLE_INPUT);
  const [message, setMessage] = useState(
    "Parser, validator, and converters are not connected yet.",
  );

  const showPendingMessage = (action: string) => {
    setMessage(`${action} is waiting for its assigned implementation.`);
  };

  return (
    <main className="page-shell">
      <header className="hero">
        <p className="eyebrow">Process Algebra Tooling</p>
        <h1>Parser and Converter</h1>
        <p>
          Validate process algebra equations and convert them between sequence,
          state-machine, and activity-diagram forms.
        </p>
      </header>

      <section className="workspace" aria-label="Process algebra workspace">
        <div className="toolbar">
          <label>
            Source form
            <select
              value={sourceType}
              onChange={(event) =>
                setSourceType(event.target.value as DiagramType)
              }
            >
              {DIAGRAM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <button type="button" onClick={() => showPendingMessage("File import")}>
            Import text file
          </button>
          <button type="button" onClick={() => showPendingMessage("Syntax check")}>
            Check syntax
          </button>
        </div>

        <label className="editor-label" htmlFor="equation-input">
          Input equations
        </label>
        <textarea
          id="equation-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          spellCheck={false}
        />

        <div className="status" role="status">
          <strong>Status:</strong> {message}
        </div>

        <div className="conversion-actions" aria-label="Conversion targets">
          {DIAGRAM_TYPES.map((target) => (
            <button
              key={target}
              type="button"
              onClick={() => showPendingMessage(`Conversion to ${target}`)}
            >
              Convert to {target}
            </button>
          ))}
        </div>

        <label className="editor-label" htmlFor="conversion-output">
          Converted equations
        </label>
        <textarea
          id="conversion-output"
          value=""
          readOnly
          placeholder="Validated conversion output will appear here."
        />
      </section>
    </main>
  );
}
