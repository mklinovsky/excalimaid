import { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { convertMermaidToExcalidraw } from "../services/mermaidConverter";

export function MermaidExcalidraw() {
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    convertMermaidToExcalidraw().then(({ excalidrawElements }) => {
      api.updateScene({ elements: excalidrawElements });
      api.scrollToContent(excalidrawElements);
    });
  }, [api]);


  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw excalidrawAPI={(api) => setApi(api)} />
    </div>
  );
}
