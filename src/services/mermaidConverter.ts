import { parseMermaidToExcalidraw } from "@excalidraw/mermaid-to-excalidraw";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import type { ExcalidrawElements } from "../types/mermaid.types";

export interface ConvertOptions {
  fontSize?: string;
}

const DEFAULT_FONT_SIZE = "25px";

export async function convertMermaidToExcalidraw(
  mermaidDiagram: string,
  options?: ConvertOptions,
) {
  const fontSize = options?.fontSize ?? DEFAULT_FONT_SIZE;

  try {
    const { elements } = await parseMermaidToExcalidraw(mermaidDiagram, {
      themeVariables: {
        fontSize,
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
