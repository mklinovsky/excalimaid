import { useState, useEffect } from "react";
import { getMermaidFromUrl } from "../services/urlParser";
import { convertMermaidToExcalidraw } from "../services/mermaidConverter";
import { getErrorDiagramSyntax } from "../services/errorDiagram";
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
      console.log("loading diagram");
      try {
        const mermaidSyntax = getMermaidFromUrl();
        console.log(mermaidSyntax, mermaidSyntax);
        let syntaxToConvert: string;
        let errorType: "missing" | "parse-error" | undefined;

        if (!mermaidSyntax) {
          syntaxToConvert = getErrorDiagramSyntax("missing");
          errorType = "missing";
        } else {
          syntaxToConvert = mermaidSyntax;
        }

        const result = await convertMermaidToExcalidraw(syntaxToConvert);
        console.log(result);

        if (result.error && !errorType) {
          const errorSyntax = getErrorDiagramSyntax("parse-error");
          const errorResult = await convertMermaidToExcalidraw(errorSyntax);

          if (isMounted) {
            setElements(errorResult.excalidrawElements);
            setError(result.error);
          }
        } else {
          if (isMounted) {
            setElements(result.excalidrawElements);
            setError(errorType ? null : null);
          }
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
