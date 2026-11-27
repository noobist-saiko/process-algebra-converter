import { describe, expect, it } from "vitest";
import { DIAGRAM_TYPES } from "../src/shared/types";

describe("shared diagram types", () => {
  it("defines the three required conversion targets", () => {
    expect(DIAGRAM_TYPES).toEqual(["SD", "SMD", "AD"]);
  });
});
