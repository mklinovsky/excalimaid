/**
 * Get URL search param value
 */
export function getUrlParam(paramName: string, searchString?: string): string | null {
  const search = searchString ?? (typeof window !== 'undefined' ? window.location.search : '');
  const params = new URLSearchParams(search);
  return params.get(paramName);
}

/**
 * Decode Base64 to UTF-8 string
 * Returns null if decoding fails
 */
export function decodeBase64(encoded: string): string | null {
  if (!encoded) {
    return null;
  }

  try {
    return atob(encoded);
  } catch {
    return null;
  }
}

/**
 * Get and decode Mermaid diagram from URL
 * Combines getUrlParam and decodeBase64
 */
export function getMermaidFromUrl(searchString?: string): string | null {
  const encoded = getUrlParam('mermaid', searchString);
  
  if (!encoded) {
    return null;
  }

  return decodeBase64(encoded);
}
