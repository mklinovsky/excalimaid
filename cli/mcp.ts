import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ensureManagedServer, generateUrl, openBrowser } from "./server.js";

export async function runMcpServer() {
  const server = new McpServer({
    name: "excalimaid",
    version: "1.0.0",
  });

  server.registerTool(
    "open-diagram",
    {
      description: "Open a Mermaid diagram in Excalidraw editor. Supports Flowchart, Sequence, and Class diagrams.",
      inputSchema: {
        mermaid: z.string().describe("Mermaid diagram code"),
      },
    },
    async ({ mermaid }) => {
      await ensureManagedServer();
      const url = generateUrl(mermaid);
      openBrowser(url);
      return {
        content: [
          {
            type: "text" as const,
            text: url,
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
