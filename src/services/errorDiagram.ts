export type ErrorType = "missing" | "invalid-base64" | "parse-error";

export function getErrorDiagramSyntax(errorType?: ErrorType): string {
  if (errorType === "missing") {
    return `flowchart TD
    A["No diagram found"]
    A --> B["Add ?mermaid=base64<br/>to URL"]
    B --> C["Encode your<br/>Mermaid diagram"]`;
  }

  if (errorType === "invalid-base64") {
    return `flowchart TD
    A["Invalid Base64<br/>encoding"]
    A --> B["Check your<br/>URL parameter"]
    B --> C["Try encoding<br/>again"]`;
  }

  if (errorType === "parse-error") {
    return `flowchart TD
    A["Invalid Mermaid<br/>syntax"]
    A --> B["Check your<br/>diagram code"]
    B --> C["Fix syntax<br/>errors"]`;
  }

  return `flowchart TD
    A["Something went<br/>wrong"]
    A --> B["Check URL<br/>parameter"]
    B --> C["Try again"]`;
}
