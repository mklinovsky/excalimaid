#!/usr/bin/env node

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const PORT = 4173;
const DIST_DIR = path.resolve(fileURLToPath(import.meta.url), "../../dist");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".woff2": "font/woff2",
};

async function getMermaid(): Promise<string> {
  if (process.argv[2]) {
    return process.argv[2];
  }

  if (!process.stdin.isTTY) {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      process.stdin.on("data", (chunk) => chunks.push(chunk));
      process.stdin.on("end", () =>
        resolve(Buffer.concat(chunks).toString().trim()),
      );
      process.stdin.on("error", reject);
    });
  }

  console.error("Missing mermaid string argument");
  process.exit(1);
}

const mermaid = await getMermaid();
const encoded = encodeURIComponent(Buffer.from(mermaid).toString("base64"));
const url = `http://localhost:${PORT}/?mermaid=${encoded}`;

const server = http.createServer((req, res) => {
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
});

server.listen(PORT, () => {
  console.log(url);

  const opener =
    process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";

  exec(`${opener} "${url}"`);
});
