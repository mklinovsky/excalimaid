import { describe, it, expect } from 'vitest';
import { getErrorDiagramSyntax } from './errorDiagram';

describe('getErrorDiagramSyntax', () => {
  it('should return valid Mermaid flowchart syntax', () => {
    const result = getErrorDiagramSyntax();
    expect(result).toContain('flowchart');
  });

  it('should handle missing parameter error', () => {
    const result = getErrorDiagramSyntax('missing');
    expect(result).toContain('flowchart');
    expect(result).toContain('mermaid');
  });

  it('should handle invalid base64 error', () => {
    const result = getErrorDiagramSyntax('invalid-base64');
    expect(result).toContain('flowchart');
    expect(result).toContain('Base64');
  });

  it('should handle parse error', () => {
    const result = getErrorDiagramSyntax('parse-error');
    expect(result).toContain('flowchart');
    expect(result).toContain('syntax');
  });

  it('should return different messages for different errors', () => {
    const missing = getErrorDiagramSyntax('missing');
    const invalid = getErrorDiagramSyntax('invalid-base64');
    const parse = getErrorDiagramSyntax('parse-error');
    
    expect(missing).not.toBe(invalid);
    expect(invalid).not.toBe(parse);
    expect(missing).not.toBe(parse);
  });

  it('should use default error when type not specified', () => {
    const result = getErrorDiagramSyntax();
    expect(result).toBeTruthy();
    expect(result).toContain('flowchart');
  });

  it('returned syntax should start with "flowchart"', () => {
    const result = getErrorDiagramSyntax();
    expect(result.trim().startsWith('flowchart')).toBe(true);
  });
});
