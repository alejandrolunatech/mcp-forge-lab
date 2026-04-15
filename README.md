# ⚒️ MCP Forge Lab — Node Server Quest

**A gamified, interactive learning lab for building MCP (Model Context Protocol) servers from scratch.**

> 🎮 **[Play now → alejandrolunatech.github.io/mcp-forge-lab](https://alejandrolunatech.github.io/mcp-forge-lab/)**

---

## What is this?

MCP Forge Lab is a browser-based learning game that teaches you how to build **MCP (Model Context Protocol) Node servers** step by step — no local setup required.

You play as a **Toolsmith** progressing through a series of worlds, each covering a key concept in MCP server development. You follow real commands and code, earn XP, level up, and ultimately face a **Boss Fight** where you build a full server from memory.

---

## 🗺️ Learning Worlds

The lab is divided into 8 worlds, each with multiple regions and steps:

| # | World | What you learn |
|---|-------|----------------|
| 1 | **Boot Camp** | Terminal basics, Node.js setup |
| 2 | **Project Setup** | `npm init`, folder structure |
| 3 | **Server Creation** | Writing your first MCP server |
| 4 | **Tool Creation** | Defining tools with name, schema & handler |
| 5 | **Inspector** | Using the MCP Inspector to test tools |
| 6 | **JSON-RPC** | How MCP communication works under the hood |
| 7 | **Testing** | Writing and running tests for your server |
| 8 | **Debugging** | Finding and fixing common MCP errors |

---

## 🎮 Gameplay Features

- **Step-by-step lessons** — each step includes an explanation, real terminal commands, and copyable code snippets
- **XP & levelling system** — earn XP for completing steps and regions, unlock the next world
- **Mini-games** — interactive challenges between lessons:
  - 🔧 *Fix the Broken Command* — pick the correct command from options
  - 🏗️ *Build the Tool* — assemble a tool from its parts (name, schema, handler)
  - 🐛 *Debug Challenge* — spot the bug in a code snippet
- **Boss Fight** — a final timed simulation where you build a complete MCP server from scratch with no hints
- **Glossary panel** — searchable, multi-language definitions for terms like MCP Server, Tool, STDIO, JSON-RPC, Schema, Transport, and Client
- **Multi-language support** — switch between 🇬🇧 English, 🇪🇸 Spanish, and 🇳🇱 Dutch at any time
- **OS mode** — toggle between macOS and Windows to see the right commands for your system

---

## 🚀 Running locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Tech Stack

- **React 19** + **TypeScript**
- **Vite** — fast dev server and build tool
- **Tailwind CSS** — utility-first styling (dark mode by default)
- **React Router** (HashRouter) — client-side routing compatible with GitHub Pages
- No backend — fully static, runs entirely in the browser

---

## 📦 Deployment

The app is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions.

**Live URL:** [https://alejandrolunatech.github.io/mcp-forge-lab/](https://alejandrolunatech.github.io/mcp-forge-lab/)
