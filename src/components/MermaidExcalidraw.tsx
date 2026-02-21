import { useState, useEffect } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import "@excalidraw/excalidraw/index.css";
import { useMermaidDiagram } from "../hooks/useMermaidDiagram";

export function MermaidExcalidraw() {
  const { elements, error } = useMermaidDiagram();

  if (!elements) {
    return (
      <div style={{ height: "100vh", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        initialData={{
          elements,
          appState: {zenModeEnabled: true},
          scrollToContent: true,
        }}
      />
    </div>
  );
}
