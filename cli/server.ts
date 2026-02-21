import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const PORT = 17532;
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const DIST_DIR = path.resolve(fileURLToPath(import.meta.url), "../../web");
const TIMEOUT_CHECK_INTERVAL_MS = 30 * 1000;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
};

function serveStatic(req: http.IncomingMessage, res: http.ServerResponse) {
  const reqPath = req.url?.split("?")[0] ?? "/";
  const filePath = path.join(
    DIST_DIR,
    reqPath === "/" ? "index.html" : reqPath,
  );

  fs.readFile(filePath, (err, data) => {
    if (err) {
      fs.readFile(
        path.join(DIST_DIR, "index.html"),
        (fallbackErr, fallbackData) => {
          if (fallbackErr) {
            res.writeHead(500);
            res.end("Internal Server Error");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(fallbackData);
        },
      );
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream",
    });
    res.end(data);
  });
}

export function startSimpleServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = http.createServer(serveStatic);
    server.on("error", reject);
    server.listen(PORT, resolve);
  });
}

let managedServer: http.Server | null = null;
let lastRequestTime = Date.now();
let timeoutCheckInterval: ReturnType<typeof setInterval> | null = null;

export async function isServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: "localhost",
        port: PORT,
        path: "/excalimaid-healthy",
        method: "GET",
        timeout: 1000,
      },
      (res) => resolve(res.statusCode === 200),
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

function startTimeoutCheck() {
  if (timeoutCheckInterval) return;
  timeoutCheckInterval = setInterval(() => {
    if (Date.now() - lastRequestTime > IDLE_TIMEOUT_MS && managedServer) {
      clearInterval(timeoutCheckInterval!);
      timeoutCheckInterval = null;
      managedServer.close();
      managedServer = null;
    }
  }, TIMEOUT_CHECK_INTERVAL_MS);
}

export function startManagedServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    managedServer = http.createServer((req, res) => {
      lastRequestTime = Date.now();

      if (req.url?.split("?")[0] === "/excalimaid-healthy") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("ok");
        return;
      }
      serveStatic(req, res);
    });
    managedServer.on("error", reject);
    managedServer.listen(PORT, () => {
      startTimeoutCheck();
      resolve();
    });
  });
}

export async function ensureManagedServer(): Promise<void> {
  if (!(await isServerRunning())) {
    await startManagedServer();
  }
}

export function generateUrl(mermaid: string): string {
  const encoded = encodeURIComponent(Buffer.from(mermaid).toString("base64"));
  return `http://localhost:${PORT}/?mermaid=${encoded}`;
}

export function openBrowser(url: string): void {
  const opener =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
  exec(`${opener} "${url}"`);
}
