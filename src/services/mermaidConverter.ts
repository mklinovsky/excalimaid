import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import type { ExcalidrawElements } from "./mermaid.types";
import { getMermaidFromUrl } from "./urlParser";

const DEFAULT_FONT_SIZE = 16;

function createErrorElements(message: string): ExcalidrawElements {
  return convertToExcalidrawElements([
    {
      type: "text",
      x: 0,
      y: 0,
      text: `Error: ${message}`,
      strokeColor: "#e03131",
    },
  ]);
}

export async function convertMermaidToExcalidraw() {
  try {
    const mermaidSyntax = getMermaidFromUrl();
    const { elements } = await parseMermaidToExcalidraw(mermaidSyntax, {
      themeVariables: {
        fontSize: `${DEFAULT_FONT_SIZE}px`,
      },
    });

    const excalidrawElements = convertToExcalidrawElements(elements);

    return {
      excalidrawElements,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(message);

    return {
      excalidrawElements: createErrorElements(message),
    };
  }
}
