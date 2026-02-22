import http from "node:http";
import { describe, it, expect, vi, beforeEach, type MockInstance } from "vitest";
import { serveStatic } from "./static-server.js";

vi.mock("node:fs/promises", () => ({
  default: {
    readFile: vi.fn(),
  },
}));

import fs from "node:fs/promises";

const DIST_DIR = "/app/web";
const readFileMock = vi.mocked(fs.readFile) as unknown as MockInstance<(path: string) => Promise<Buffer>>;

function makeReq(url: string): http.IncomingMessage {
  return { url } as http.IncomingMessage;
}

function makeRes() {
  const headers: Record<string, string> = {};
  const res = {
    headersSent: false,
    statusCode: 0,
    body: null as Buffer | string | null,
    writeHead: vi.fn((code: number, hdrs?: Record<string, string>) => {
      res.statusCode = code;
      if (hdrs) Object.assign(headers, hdrs);
      res.headersSent = true;
    }),
    end: vi.fn((data?: Buffer | string) => {
      res.body = data ?? null;
    }),
    headers,
  };
  return res as unknown as http.ServerResponse & typeof res;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("serveStatic", () => {
  it("serves index.html for /", async () => {
    const data = Buffer.from("<html/>");
    readFileMock.mockResolvedValueOnce(data);

    const res = makeRes();
    await serveStatic(makeReq("/"), res, DIST_DIR);

    expect(fs.readFile).toHaveBeenCalledWith("/app/web/index.html");
    expect(res.statusCode).toBe(200);
    expect(res.headers["Content-Type"]).toBe("text/html");
    expect(res.body).toBe(data);
  });

  it("serves a .js file with correct Content-Type", async () => {
    const data = Buffer.from("console.log('hi')");
    readFileMock.mockResolvedValueOnce(data);

    const res = makeRes();
    await serveStatic(makeReq("/app.js"), res, DIST_DIR);

    expect(fs.readFile).toHaveBeenCalledWith("/app/web/app.js");
    expect(res.statusCode).toBe(200);
    expect(res.headers["Content-Type"]).toBe("application/javascript");
  });

  it("serves a .css file with correct Content-Type", async () => {
    const data = Buffer.from("body {}");
    readFileMock.mockResolvedValueOnce(data);

    const res = makeRes();
    await serveStatic(makeReq("/style.css"), res, DIST_DIR);

    expect(res.headers["Content-Type"]).toBe("text/css");
  });

  it("falls back to index.html for unknown routes", async () => {
    const fallback = Buffer.from("<html>fallback</html>");
    readFileMock
      .mockRejectedValueOnce(new Error("ENOENT"))
      .mockResolvedValueOnce(fallback);

    const res = makeRes();
    await serveStatic(makeReq("/some/unknown/route"), res, DIST_DIR);

    expect(fs.readFile).toHaveBeenNthCalledWith(2, "/app/web/index.html");
    expect(res.statusCode).toBe(200);
    expect(res.headers["Content-Type"]).toBe("text/html");
    expect(res.body).toBe(fallback);
  });

  it("returns 403 for path traversal", async () => {
    const res = makeRes();
    await serveStatic(makeReq("/../../etc/passwd"), res, DIST_DIR);

    expect(fs.readFile).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
  });

  it("returns 403 for traversal to sibling directory", async () => {
    const res = makeRes();
    await serveStatic(makeReq("/../web-extra/secret.js"), res, DIST_DIR);

    expect(fs.readFile).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
  });

  it("serves a .woff2 file with correct Content-Type", async () => {
    const data = Buffer.from("font-data");
    readFileMock.mockResolvedValueOnce(data);

    const res = makeRes();
    await serveStatic(makeReq("/font.woff2"), res, DIST_DIR);

    expect(res.headers["Content-Type"]).toBe("font/woff2");
  });

  it("falls back to application/octet-stream for unknown extensions", async () => {
    const data = Buffer.from("binary");
    readFileMock.mockResolvedValueOnce(data);

    const res = makeRes();
    await serveStatic(makeReq("/file.xyz"), res, DIST_DIR);

    expect(res.headers["Content-Type"]).toBe("application/octet-stream");
  });

  it("strips query string before resolving path", async () => {
    const data = Buffer.from("console.log('hi')");
    readFileMock.mockResolvedValueOnce(data);

    const res = makeRes();
    await serveStatic(makeReq("/app.js?v=123"), res, DIST_DIR);

    expect(fs.readFile).toHaveBeenCalledWith("/app/web/app.js");
    expect(res.statusCode).toBe(200);
  });
});
