function getUrlParam(paramName: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(paramName);
}

function decodeBase64(encoded: string): string | null {
  if (!encoded) {
    return null;
  }

  try {
    return atob(encoded);
  } catch {
    return null;
  }
}

export function getMermaidFromUrl(): string | null {
  const encoded = getUrlParam("mermaid");

  if (!encoded) {
    throw new Error("Error while encoding the url params.");
  }

  return decodeBase64(encoded);
}
