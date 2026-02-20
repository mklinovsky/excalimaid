# Excalimaid

Converts Mermaid diagrams into Excalidraw diagrams, serves them locally, and opens the result in your browser.

## Requirements

- Node.js >= 22.18
- pnpm

## Setup

```sh
pnpm install
pnpm build
pnpm link --global
```

## Usage

Pass a Mermaid string as an argument:

```sh
excalimaid "graph TD; A-->B; B-->C"
```

Or pipe via stdin:

```sh
cat diagram.mmd | excalimaid
```

## Tips

Add to your `~/.zshrc` or `~/.bashrc` to open whatever Mermaid diagram is in your clipboard:

```sh
alias mmd='pbpaste | excalimaid'
```

Then just copy a Mermaid diagram and run `mmd`.

## How it works

1. The script base64-encodes the Mermaid syntax and passes it as a `?mermaid=` query parameter
2. It serves the `dist/` directory via a minimal HTTP server
3. The React app decodes the parameter and converts it to Excalidraw elements using `@excalidraw/mermaid-to-excalidraw`
4. The result is rendered in a full-screen Excalidraw canvas
