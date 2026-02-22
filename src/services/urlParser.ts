function getUrlParam(paramName: string): string | null {
  const params = window.location.search;
  if (!params) {
    throw new Error("Empty query params.");
  }

  const urlParams = new URLSearchParams(params);
  return urlParams.get(paramName);
}

export function getMermaidFromUrl(): string {
  const encoded = getUrlParam("mermaid");

  if (!encoded) {
    throw new Error('Missing or empty "mermaid" query param.');
  }

  return encoded;
}
