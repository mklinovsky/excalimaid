import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
};

export async function serveStatic(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  distDir: string,
): Promise<void> {
  const reqPath = req.url?.split("?")[0] ?? "/";
  const filePath = path.join(distDir, reqPath === "/" ? "index.html" : reqPath);
  const resolvedPath = path.resolve(filePath);
  const distDirResolved = path.resolve(distDir);

  if (!resolvedPath.startsWith(distDirResolved + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  let data: Buffer;
  try {
    data = await fs.readFile(resolvedPath);
  } catch {
    const fallback = await fs.readFile(path.join(distDir, "index.html"));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fallback);
    return;
  }

  const ext = path.extname(resolvedPath);
  res.writeHead(200, {
    "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
  });
  res.end(data);
}
