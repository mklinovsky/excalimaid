function getUrlParam(paramName: string): string | null {
  const params = window.location.search;
  if (!params) {
    throw new Error("Empty query params.");
  }

  if (!paramName) {
    throw new Error('Missing "mermaid" query param.');
  }

  const urlParams = new URLSearchParams(params);
  return urlParams.get(paramName);
}

export function getMermaidFromUrl(): string {
  const encoded = getUrlParam("mermaid");

  if (!encoded) {
    throw new Error('Error getting the "mermaid" query param.');
  }

  return atob(encoded) ?? "";
}
