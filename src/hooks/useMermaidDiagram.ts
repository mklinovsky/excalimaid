import { useState, useEffect } from "react";
import { convertMermaidToExcalidraw } from "../services/mermaidConverter";
import type {
  ExcalidrawElements,
  UseMermaidDiagramResult,
} from "../services/mermaid.types";

export function useMermaidDiagram(): UseMermaidDiagramResult {
  const [elements, setElements] = useState<ExcalidrawElements | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDiagram() {
      try {
        const result = await convertMermaidToExcalidraw();

        if (isMounted) {
          setElements(result.excalidrawElements);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadDiagram();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    elements,
  };
}
