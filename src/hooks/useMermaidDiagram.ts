import { useState, useEffect } from "react";
import { getMermaidFromUrl } from "../services/urlParser";
import { convertMermaidToExcalidraw } from "../services/mermaidConverter";
import type {
  ExcalidrawElements,
  UseMermaidDiagramResult,
} from "../types/mermaid.types";

export function useMermaidDiagram(): UseMermaidDiagramResult {
  const [elements, setElements] = useState<ExcalidrawElements | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDiagram() {
      try {
        const mermaidSyntax = getMermaidFromUrl();
        const result = await convertMermaidToExcalidraw(mermaidSyntax ?? "");

        if (result.error) {
          console.error(result.error);
        }

        if (isMounted) {
          setElements(result.excalidrawElements);
          setError(result.error ?? null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      }
    }

    loadDiagram();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    elements,
    error,
  };
}
