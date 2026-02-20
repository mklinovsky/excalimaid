import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import type { ExcalidrawElements } from "./mermaid.types";

const DEFAULT_FONT_SIZE = "16px";

export async function convertMermaidToExcalidraw(mermaidDiagram: string) {
  try {
    const { elements } = await parseMermaidToExcalidraw(mermaidDiagram, {
      themeVariables: {
        fontSize: DEFAULT_FONT_SIZE,
      },
    });

    const excalidrawElements = convertToExcalidrawElements(elements);

    return {
      excalidrawElements,
    };
  } catch (error) {
    return {
      excalidrawElements: [] as ExcalidrawElements,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
