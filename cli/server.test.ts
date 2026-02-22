import { describe, it, expect } from "vitest";
import { generateUrl } from "./server.js";

describe("generateUrl", () => {
  it("returns a localhost URL on the correct port", () => {
    const url = generateUrl("graph TD; A-->B");
    expect(url).toMatch(/^http:\/\/localhost:17532\/\?mermaid=/);
  });

  it("encodes mermaid as base64 in the query param", () => {
    const mermaid = "graph TD\nA-->B";
    const url = generateUrl(mermaid);
    const encoded = new URL(url).searchParams.get("mermaid");
    expect(encoded).not.toBeNull();
    const decoded = Buffer.from(decodeURIComponent(encoded ?? ""), "base64").toString();
    expect(decoded).toBe(mermaid);
  });

  it("handles multiline diagrams", () => {
    const mermaid = "sequenceDiagram\n  A->>B: Hello\n  B-->>A: Hi";
    const url = generateUrl(mermaid);
    const encoded = new URL(url).searchParams.get("mermaid");
    expect(encoded).not.toBeNull();
    const decoded = Buffer.from(decodeURIComponent(encoded ?? ""), "base64").toString();
    expect(decoded).toBe(mermaid);
  });

  it("handles special characters", () => {
    const mermaid = 'graph TD; A["hello & <world>"]-->B';
    const url = generateUrl(mermaid);
    const encoded = new URL(url).searchParams.get("mermaid");
    expect(encoded).not.toBeNull();
    const decoded = Buffer.from(decodeURIComponent(encoded ?? ""), "base64").toString();
    expect(decoded).toBe(mermaid);
  });
});
