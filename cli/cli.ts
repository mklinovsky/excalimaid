#!/usr/bin/env node

import { startSimpleServer, generateUrl, openBrowser } from "./server.js";
import { runMcpServer } from "./mcp.js";

const HELP = `excalimaid - Open mermaid diagrams in Excalidraw

Usage:
  excalimaid [mermaid]     Open diagram (reads from stdin if no argument)
  excalimaid mcp           Start MCP server
  excalimaid --help, -h    Show this help
`;

async function getInputFromStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () =>
      resolve(Buffer.concat(chunks).toString().trim()),
    );
    process.stdin.on("error", reject);
  });
}

async function openDiagram(mermaidArg?: string) {
  let mermaid = mermaidArg;

  if (!mermaid && !process.stdin.isTTY) {
    mermaid = await getInputFromStdin();
  }

  if (!mermaid) {
    console.error("Missing mermaid diagram");
    console.log(HELP);
    process.exit(1);
  }

  await startSimpleServer();
  const url = generateUrl(mermaid);
  openBrowser(url);
  console.log(url);
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === "--help" || args[0] === "-h") {
    console.log(HELP);
    process.exit(0);
  }

  if (args[0] === "mcp") {
    await runMcpServer();
    return;
  }

  await openDiagram(args[0]);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
