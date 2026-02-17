import { describe, it, expect } from 'vitest';
import { getUrlParam, decodeBase64, getMermaidFromUrl } from './urlParser';

describe('getUrlParam', () => {
  it('should extract URL parameter correctly', () => {
    const result = getUrlParam('mermaid', '?mermaid=test123');
    expect(result).toBe('test123');
  });

  it('should return null for missing parameter', () => {
    const result = getUrlParam('mermaid', '?other=value');
    expect(result).toBeNull();
  });

  it('should handle empty search string', () => {
    const result = getUrlParam('mermaid', '');
    expect(result).toBeNull();
  });

  it('should handle multiple parameters', () => {
    const result = getUrlParam('mermaid', '?foo=bar&mermaid=test&baz=qux');
    expect(result).toBe('test');
  });

  it('should use window.location.search by default', () => {
    const result = getUrlParam('mermaid');
    expect(result).toBeNull();
  });
});

describe('decodeBase64', () => {
  it('should decode valid Base64 string', () => {
    const encoded = btoa('hello world');
    const result = decodeBase64(encoded);
    expect(result).toBe('hello world');
  });

  it('should return null for invalid Base64', () => {
    const result = decodeBase64('not!!!valid!!!base64');
    expect(result).toBeNull();
  });

  it('should handle empty strings', () => {
    const result = decodeBase64('');
    expect(result).toBeNull();
  });

  it('should decode multi-line content', () => {
    const multiline = 'flowchart TD\n    A[Start] --> B[End]';
    const encoded = btoa(multiline);
    const result = decodeBase64(encoded);
    expect(result).toBe(multiline);
  });

  it('should handle special characters', () => {
    const special = 'Test: {special} [chars] --> |label|';
    const encoded = btoa(special);
    const result = decodeBase64(encoded);
    expect(result).toBe(special);
  });
});

describe('getMermaidFromUrl', () => {
  it('should get and decode mermaid parameter', () => {
    const diagram = 'flowchart TD';
    const encoded = btoa(diagram);
    const result = getMermaidFromUrl(`?mermaid=${encoded}`);
    expect(result).toBe(diagram);
  });

  it('should return null when parameter missing', () => {
    const result = getMermaidFromUrl('?other=value');
    expect(result).toBeNull();
  });

  it('should return null when Base64 invalid', () => {
    const result = getMermaidFromUrl('?mermaid=invalid!!!base64');
    expect(result).toBeNull();
  });

  it('should use window.location.search by default', () => {
    const result = getMermaidFromUrl();
    expect(result).toBeNull();
  });
});
