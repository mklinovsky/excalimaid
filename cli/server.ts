import http from "node:http";
import path from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import { serveStatic } from "./static-server.js";

const PORT = 17532;
const IDLE_TIMEOUT_MS = 5 * 60 * 1000;
const TIMEOUT_CHECK_INTERVAL_MS = 30 * 1000;
const DIST_DIR = path.resolve(fileURLToPath(import.meta.url), "../../web");

export function startSimpleServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      serveStatic(req, res, DIST_DIR).catch(() => {
        if (!res.headersSent) {
          res.writeHead(500);
          res.end("Internal Server Error");
        }
      });
    });
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
  if (timeoutCheckInterval) {
    return;
  }

  timeoutCheckInterval = setInterval(() => {
    if (Date.now() - lastRequestTime > IDLE_TIMEOUT_MS && managedServer) {
      const interval = timeoutCheckInterval;
      timeoutCheckInterval = null;
      clearInterval(interval ?? undefined);
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
      serveStatic(req, res, DIST_DIR).catch(() => {
        if (!res.headersSent) {
          res.writeHead(500);
          res.end("Internal Server Error");
        }
      });
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
  const encoded = encodeURIComponent(mermaid);
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
