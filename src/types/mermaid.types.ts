import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export type ExcalidrawElements = OrderedExcalidrawElement[];

export interface UseMermaidDiagramResult {
  elements: ExcalidrawElements | null;
  error: string | null;
}
