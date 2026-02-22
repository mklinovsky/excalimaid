import { describe, it, expect } from "vitest";
import { generateUrl } from "./server.js";

describe("generateUrl", () => {
  it("returns a localhost URL on the correct port", () => {
    const url = generateUrl("graph TD; A-->B");
    expect(url).toMatch(/^http:\/\/localhost:17532\/\?mermaid=/);
  });

  it("encodes mermaid as url-encoded query param", () => {
    const mermaid = "graph TD\nA-->B";
    const url = generateUrl(mermaid);
    const decoded = new URL(url).searchParams.get("mermaid");
    expect(decoded).toBe(mermaid);
  });

  it("handles multiline diagrams", () => {
    const mermaid = "sequenceDiagram\n  A->>B: Hello\n  B-->>A: Hi";
    const url = generateUrl(mermaid);
    const decoded = new URL(url).searchParams.get("mermaid");
    expect(decoded).toBe(mermaid);
  });

  it("handles special characters", () => {
    const mermaid = 'graph TD; A["hello & <world>"]-->B';
    const url = generateUrl(mermaid);
    const decoded = new URL(url).searchParams.get("mermaid");
    expect(decoded).toBe(mermaid);
  });

  it("handles emojis", () => {
    const mermaid = "graph TD; A[\"🎉 Hello\"]-->B[\"🌍 World\"]";
    const url = generateUrl(mermaid);
    const decoded = new URL(url).searchParams.get("mermaid");
    expect(decoded).toBe(mermaid);
  });
});
