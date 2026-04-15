// ─── World Content ────────────────────────────────────────────────────────────
//
// All 8 learning worlds for MCP Forge: Node Server Quest.
// Loaded into the lessonEngine at app startup via ALL_WORLDS.

import type { World } from './schema'

// ─────────────────────────────────────────────────────────────────────────────
// World 1 · Boot Camp
// ─────────────────────────────────────────────────────────────────────────────
export const bootCamp: World = {
  id: 'world-01-boot-camp',
  title: '🏕️ Boot Camp',
  regions: [
    {
      id: 'region-01-prerequisites',
      title: '🔍 Prerequisites Check',
      steps: [
        {
          id: 'w1-s01-check-node',
          title: 'Check Node.js version',
          description:
            'MCP servers require Node.js 20 or later. Verify your installed version before going any further.',
          command: 'node --version',
          explanation:
            'You should see `v20.x.x` or higher. If you see an older version — or "command not found" — download the LTS release from https://nodejs.org before continuing.',
          hint: 'On macOS you can also use `nvm` or `fnm` to install and switch Node versions without touching your system install.',
          os: 'both',
        },
        {
          id: 'w1-s02-check-npm',
          title: 'Check npm version',
          description:
            'npm is the package manager bundled with Node.js. Version 10 or later is recommended for workspace support.',
          command: 'npm --version',
          explanation:
            'npm 10+ ships with Node 20. If you need to upgrade: `npm install -g npm@latest`.',
          hint: 'Run `npm --version` after upgrading to confirm the new version is active.',
          os: 'both',
        },
        {
          id: 'w1-s03-check-git',
          title: 'Verify git is installed',
          description:
            'You will need git to version-control your server and push it to GitHub later.',
          command: 'git --version',
          explanation:
            'Any version ≥ 2.30 is fine. If git is missing, install it from https://git-scm.com.',
          hint: 'macOS ships with a stub that prompts you to install the Xcode Command Line Tools — run `xcode-select --install` to get real git.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-02-dev-environment',
      title: '🛠️ Dev Environment',
      steps: [
        {
          id: 'w1-s04-install-vscode',
          title: 'Open your editor',
          description:
            'Open VS Code (or your preferred editor) and install the **TypeScript** language extension if it is not already present. Good tooling will save you hours during development.',
          explanation:
            'The official Microsoft TypeScript extension gives you IntelliSense, type-checking, and go-to-definition across your entire codebase.',
          hint: 'Search for `ms-vscode.vscode-typescript-next` in the Extensions sidebar for the latest nightly build.',
          os: 'both',
        },
        {
          id: 'w1-s05-hello-node',
          title: 'Run your first Node script',
          description:
            'Before writing any MCP code, confirm that Node.js can run a script on your machine. Create a file called `hello.js` containing `console.log("Boot camp complete!")`, then execute it.',
          command: 'node hello.js',
          explanation:
            'If you see `Boot camp complete!` in the terminal your environment is ready. Delete `hello.js` — it was just a sanity check.',
          hint: 'On Windows use the Command Prompt or PowerShell — both work fine with Node.',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// World 2 · Project Setup
// ─────────────────────────────────────────────────────────────────────────────
export const projectSetup: World = {
  id: 'world-02-project-setup',
  title: '📁 Project Setup',
  regions: [
    {
      id: 'region-03-init',
      title: '📋 Initialise Project',
      steps: [
        {
          id: 'w2-s01-mkdir',
          title: 'Create your project folder',
          description:
            'Choose a name for your MCP server and create its home directory. Keep it lowercase and hyphenated.',
          command: 'mkdir my-mcp-server && cd my-mcp-server',
          explanation:
            'All project files — `package.json`, TypeScript sources, and config files — will live inside this folder.',
          hint: 'Replace `my-mcp-server` with any name you like. Stick with it throughout the quest.',
          os: 'both',
        },
        {
          id: 'w2-s02-npm-init',
          title: 'Initialise npm package',
          description:
            'Turn the folder into an npm package. The `-y` flag accepts all defaults so you can customise them in the next step.',
          command: 'npm init -y',
          explanation:
            'A `package.json` file is created with sensible defaults. It tracks your project name, version, scripts, and dependencies.',
          hint: 'Open `package.json` in your editor to see what was generated.',
          os: 'both',
        },
        {
          id: 'w2-s03-configure-esm',
          title: 'Enable ES modules',
          description:
            'Add `"type": "module"` to `package.json` so Node.js treats `.js` files as ES modules. The MCP SDK requires this.',
          code: `// package.json — add the "type" field
{
  "name": "my-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}`,
          explanation:
            'Without `"type": "module"`, Node defaults to CommonJS and the SDK\'s `import` statements will fail at runtime.',
          hint: 'Save `package.json` after editing. You can verify the change with `cat package.json`.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-04-dependencies',
      title: '📦 Install Dependencies',
      steps: [
        {
          id: 'w2-s04-install-sdk',
          title: 'Install the MCP SDK',
          description:
            'The official `@modelcontextprotocol/sdk` package is the only runtime dependency you need to build a conformant MCP server.',
          command: 'npm install @modelcontextprotocol/sdk',
          explanation:
            'The SDK is now listed under `"dependencies"` in `package.json`. It provides `McpServer`, all transport classes, and the type definitions for the MCP protocol.',
          hint: 'The package is scoped under `@modelcontextprotocol` — include the full scope when installing.',
          os: 'both',
        },
        {
          id: 'w2-s05-install-zod',
          title: 'Install Zod',
          description:
            'Zod is used to define and validate the input schemas for your tools. It is the standard schema library in the MCP TypeScript ecosystem.',
          command: 'npm install zod',
          explanation:
            'Zod schemas are converted to JSON Schema during the MCP capabilities handshake. Clients use these schemas to know what arguments each tool accepts.',
          hint: 'Zod v3 is the current major version — make sure `package.json` shows `"zod": "^3.x.x"`.',
          os: 'both',
        },
        {
          id: 'w2-s06-install-tsx',
          title: 'Install tsx and TypeScript',
          description:
            'During development you will run your server directly with `tsx` — no compile step needed.',
          command: 'npm install -D tsx typescript',
          explanation:
            '`tsx` wraps Node.js with on-the-fly TypeScript compilation. The `-D` flag puts both packages in `devDependencies` — they are not needed in production.',
          hint: 'Verify with `npx tsx --version`. You should see a version number, not an error.',
          os: 'both',
        },
        {
          id: 'w2-s07-tsconfig',
          title: 'Create tsconfig.json',
          description:
            'Add a TypeScript config file at the project root that targets modern Node.js and enables strict type checking.',
          code: `// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}`,
          explanation:
            '`"module": "NodeNext"` is required when `package.json` has `"type": "module"`. Together they make TypeScript and Node.js agree on how to resolve imports.',
          hint: 'If you see `Cannot find module` errors, double-check that `moduleResolution` is `NodeNext`.',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// World 3 · Server Creation
// ─────────────────────────────────────────────────────────────────────────────
export const serverCreation: World = {
  id: 'world-03-server-creation',
  title: '🖥️ Server Creation',
  regions: [
    {
      id: 'region-05-first-server',
      title: '⚡ Your First Server',
      steps: [
        {
          id: 'w3-s01-create-file',
          title: 'Create server.ts',
          description:
            'Create the main entry point for your MCP server. This file will hold all your server logic.',
          command: 'touch server.ts',
          explanation:
            'On Windows you can create the file in VS Code by clicking **New File** in the Explorer panel, or run `echo "" > server.ts` in PowerShell.',
          hint: 'Keep `server.ts` at the root of your project, next to `package.json`.',
          os: 'mac',
        },
        {
          id: 'w3-s02-imports',
          title: 'Add imports',
          description:
            'Open `server.ts` and add the two imports needed for any MCP server: `McpServer` and `StdioServerTransport`.',
          code: `import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'`,
          explanation:
            'Notice the `.js` extension on the import paths — this is required for Node.js ESM resolution even though the source files are `.ts`.',
          hint: 'TypeScript with `moduleResolution: NodeNext` expects explicit `.js` extensions in import paths.',
          os: 'both',
        },
        {
          id: 'w3-s03-create-instance',
          title: 'Create the server instance',
          description:
            'Instantiate `McpServer` with a name and version. These are sent to clients during the capabilities handshake.',
          code: `const server = new McpServer({
  name: 'my-mcp-server',
  version: '1.0.0',
})`,
          explanation:
            'The `name` and `version` fields identify your server to clients like Claude Desktop. Choose a clear, kebab-case name.',
          hint: 'The version string should follow semantic versioning (MAJOR.MINOR.PATCH).',
          os: 'both',
        },
        {
          id: 'w3-s04-connect-transport',
          title: 'Connect STDIO transport',
          description:
            'Create a `StdioServerTransport` and connect it to the server. This one `await` is all it takes to start listening.',
          code: `const transport = new StdioServerTransport()
await server.connect(transport)`,
          explanation:
            '`StdioServerTransport` wires the server to the process\'s `stdin` / `stdout`. The `await server.connect(transport)` call blocks until the client disconnects.',
          hint: 'The file must use top-level `await`, which is allowed in ES modules. That\'s why `"type": "module"` was required.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-06-run',
      title: '🚀 Run It',
      steps: [
        {
          id: 'w3-s05-run-server',
          title: 'Start the server with tsx',
          description:
            'Run your server. It will start and wait silently for a client to connect over STDIO.',
          command: 'npx tsx server.ts',
          explanation:
            'No output is expected — the server is listening on stdin/stdout for JSON-RPC messages. Press `Ctrl+C` to stop it. In the next world you will connect an inspector to it.',
          hint: 'If you see a TypeScript error, check that your imports use `.js` extensions and that `tsconfig.json` has `"module": "NodeNext"`.',
          os: 'both',
        },
        {
          id: 'w3-s06-add-start-script',
          title: 'Add npm run scripts',
          description:
            'Update `package.json` so you can start your server with `npm run dev` instead of typing the full `tsx` command each time.',
          code: `// In package.json → "scripts"
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}`,
          explanation:
            '`npm run dev` → development (tsx, no compile step). `npm run build` → compiles TypeScript to `dist/`. `npm start` → runs the compiled output in production.',
          hint: 'Test it: `npm run dev` should start the server the same way `npx tsx server.ts` did.',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// World 4 · Tool Creation
// ─────────────────────────────────────────────────────────────────────────────
export const toolCreation: World = {
  id: 'world-04-tool-creation',
  title: '🔧 Tool Creation',
  regions: [
    {
      id: 'region-07-basic-tools',
      title: '🔩 Basic Tools',
      steps: [
        {
          id: 'w4-s01-echo-tool',
          title: 'Register an echo tool',
          description:
            'Add your first tool to the server. `server.tool()` takes a name, a description, a Zod schema, and an async handler that returns a `content` array.',
          code: `import { z } from 'zod'

server.tool(
  'echo',
  'Echoes the message back to the caller',
  { message: z.string().describe('The text to echo') },
  async ({ message }) => ({
    content: [{ type: 'text', text: \`Echo: \${message}\` }],
  }),
)`,
          explanation:
            'The description string is sent to the client during the capabilities handshake. Good descriptions help the LLM decide when and how to call your tool.',
          hint: 'Place this code **before** the `await server.connect(transport)` line.',
          os: 'both',
        },
        {
          id: 'w4-s02-add-tool',
          title: 'Register an add tool',
          description:
            'Register a tool that adds two numbers. This demonstrates multi-parameter schemas with number types.',
          code: `server.tool(
  'add',
  'Adds two numbers and returns the result',
  {
    a: z.number().describe('First number'),
    b: z.number().describe('Second number'),
  },
  async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }],
  }),
)`,
          explanation:
            'Zod coerces and validates inputs before your handler runs. If the client sends a string where a number is expected, MCP returns a validation error automatically.',
          hint: 'You can chain Zod validators: `z.number().min(0).max(100)` restricts input to 0–100.',
          os: 'both',
        },
        {
          id: 'w4-s03-optional-params',
          title: 'Add a tool with optional parameters',
          description:
            'Register a `greet` tool where the language parameter is optional and defaults to English.',
          code: `server.tool(
  'greet',
  'Returns a greeting in the requested language',
  {
    name: z.string().describe('Name to greet'),
    lang: z.enum(['en', 'es', 'fr']).optional().default('en'),
  },
  async ({ name, lang }) => {
    const greetings = { en: 'Hello', es: 'Hola', fr: 'Bonjour' }
    return {
      content: [{ type: 'text', text: \`\${greetings[lang]}, \${name}!\` }],
    }
  },
)`,
          explanation:
            'Optional parameters with `.default()` are included in the JSON Schema as not-required. The LLM can omit them and your code receives the default value.',
          hint: 'Use `z.enum()` when the input must be one of a fixed set of string values.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-08-advanced-tools',
      title: '⚡ Advanced Tools',
      steps: [
        {
          id: 'w4-s04-error-handling',
          title: 'Handle errors in tools',
          description:
            'Tools should catch errors and return them as MCP error responses rather than letting exceptions crash the server.',
          code: `import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js'

server.tool(
  'divide',
  'Divides two numbers',
  {
    numerator: z.number(),
    denominator: z.number(),
  },
  async ({ numerator, denominator }) => {
    if (denominator === 0) {
      throw new McpError(ErrorCode.InvalidParams, 'Cannot divide by zero')
    }
    return {
      content: [{ type: 'text', text: String(numerator / denominator) }],
    }
  },
)`,
          explanation:
            'Throwing `McpError` sends a structured JSON-RPC error response to the client. The `ErrorCode` enum contains standard codes: `InvalidParams`, `InternalError`, and `MethodNotFound`.',
          hint: 'Never throw a plain `Error` from a tool handler — use `McpError` for user-readable, structured errors.',
          os: 'both',
        },
        {
          id: 'w4-s05-async-tool',
          title: 'Create an async tool with real I/O',
          description:
            'Register a `fetch-url` tool that makes a real HTTP request and returns the status code — demonstrating async tools that do real I/O.',
          code: `server.tool(
  'fetch-url',
  'Fetches a URL and returns its HTTP status code',
  { url: z.string().url().describe('The URL to fetch') },
  async ({ url }) => {
    try {
      const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
      return {
        content: [{
          type: 'text',
          text: \`\${url} → HTTP \${res.status} \${res.statusText}\`,
        }],
      }
    } catch (err) {
      throw new McpError(
        ErrorCode.InternalError,
        \`Fetch failed: \${err instanceof Error ? err.message : String(err)}\`,
      )
    }
  },
)`,
          explanation:
            '`fetch` is built into Node.js 18+. `AbortSignal.timeout(5000)` ensures a slow server does not hang your MCP server indefinitely.',
          hint: 'Test this tool with `https://example.com` — it should return HTTP 200.',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// World 5 · Inspector
// ─────────────────────────────────────────────────────────────────────────────
export const inspector: World = {
  id: 'world-05-inspector',
  title: '🔍 Inspector',
  regions: [
    {
      id: 'region-09-inspector-setup',
      title: '🛠️ Inspector Setup',
      steps: [
        {
          id: 'w5-s01-install-inspector',
          title: 'Install MCP Inspector',
          description:
            'The official MCP Inspector is a browser-based GUI for testing your server interactively. Use `npx` to run it without a global install.',
          command: 'npm install -g @modelcontextprotocol/inspector',
          explanation:
            'The Inspector connects to your server over STDIO, performs the capabilities handshake, lists all available tools and resources, and lets you call them without writing any client code.',
          hint: 'You can skip the global install and use `npx @modelcontextprotocol/inspector` directly if you prefer not to install globally.',
          os: 'both',
        },
        {
          id: 'w5-s02-launch-inspector',
          title: 'Launch the Inspector',
          description:
            'Start the Inspector and point it at your server. It will launch a browser tab automatically.',
          command: 'npx @modelcontextprotocol/inspector npx tsx server.ts',
          explanation:
            'The Inspector spawns your server as a child process and connects over STDIO. It opens a web UI at `http://localhost:5173`. You should see your server\'s name and version in the header.',
          hint: 'Make sure your server is **not** already running in another terminal — the Inspector starts it for you.',
          os: 'both',
        },
        {
          id: 'w5-s03-explore-ui',
          title: 'Explore the Inspector UI',
          description:
            'Familiarise yourself with the three main tabs: **Tools**, **Resources**, and **Prompts**. Each lists the capabilities your server has registered.',
          explanation:
            'The Tools tab shows every tool registered with `server.tool()` along with its JSON Schema. The Resources tab shows items registered with `server.resource()`. The Prompts tab shows prompt templates.',
          hint: 'If a tab is empty your server has not registered any capabilities of that type yet — that\'s expected at this stage.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-10-inspect-tools',
      title: '🧪 Inspect & Test',
      steps: [
        {
          id: 'w5-s04-call-echo',
          title: 'Call the echo tool',
          description:
            'In the Inspector\'s **Tools** tab, click `echo`, type any message in the `message` field, and press **Run Tool**. Verify the response appears in the output panel.',
          explanation:
            'The Inspector shows you the raw JSON-RPC request it sent and the response your server returned — exactly what Claude Desktop would send when invoking your tool.',
          hint: 'Click **View raw** in the response panel to see the full JSON-RPC envelope.',
          os: 'both',
        },
        {
          id: 'w5-s05-inspect-schema',
          title: 'Inspect a tool schema',
          description:
            'Click on any tool name (without running it) to expand its schema panel. Review the JSON Schema generated from your Zod definition.',
          explanation:
            'This JSON Schema is sent to the LLM during the capabilities handshake. Well-annotated schemas (using `.describe()`) significantly improve the LLM\'s ability to use your tools correctly.',
          hint: 'If a field has no `.describe()` annotation the LLM receives no guidance. Always annotate required fields.',
          os: 'both',
        },
        {
          id: 'w5-s06-test-error',
          title: 'Trigger an error response',
          description:
            'Call the `divide` tool with `denominator: 0`. Observe the structured error response the Inspector displays.',
          explanation:
            'A proper MCP error response is a JSON-RPC error object with a numeric `code` and a human-readable `message`. Clients like Claude Desktop surface these messages to the user.',
          hint: 'Compare the error response to a successful response — notice the `"error"` key replaces `"result"` in the JSON envelope.',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// World 6 · JSON-RPC
// ─────────────────────────────────────────────────────────────────────────────
export const jsonRpc: World = {
  id: 'world-06-json-rpc',
  title: '📨 JSON-RPC',
  regions: [
    {
      id: 'region-11-protocol-basics',
      title: '📋 Protocol Basics',
      steps: [
        {
          id: 'w6-s01-request-format',
          title: 'Understand a JSON-RPC request',
          description:
            'Every message sent from an MCP client to your server is a JSON-RPC 2.0 request. Study the format below.',
          code: `// A JSON-RPC 2.0 request — sent by the client
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "echo",
    "arguments": { "message": "hello" }
  }
}`,
          explanation:
            '`jsonrpc` must always be `"2.0"`. `id` is any unique value used to match the response. `method` is the MCP method name. `params` carries the arguments.',
          hint: 'You never write this JSON manually — the SDK and transport layer do it for you. But knowing the format helps you debug raw logs.',
          os: 'both',
        },
        {
          id: 'w6-s02-response-format',
          title: 'Understand a JSON-RPC response',
          description:
            'When your tool handler returns, the SDK wraps its output in a JSON-RPC success response and sends it back to the client.',
          code: `// A JSON-RPC 2.0 success response — sent by your server
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      { "type": "text", "text": "Echo: hello" }
    ]
  }
}`,
          explanation:
            'The `id` in the response matches the `id` in the request — that\'s how the client knows which request this response belongs to. The `result` field contains whatever your handler returned.',
          hint: 'The `content` array can hold multiple items of different types: `text`, `image`, or `resource`.',
          os: 'both',
        },
        {
          id: 'w6-s03-error-response',
          title: 'Understand a JSON-RPC error response',
          description:
            'When a tool throws an `McpError`, the SDK serialises it as a JSON-RPC error response. Study the shape.',
          code: `// A JSON-RPC 2.0 error response — sent when a tool throws McpError
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Cannot divide by zero"
  }
}`,
          explanation:
            'Standard JSON-RPC error codes: `-32700` parse error, `-32600` invalid request, `-32601` method not found, `-32602` invalid params, `-32603` internal error. MCP adds custom codes below `-32000`.',
          hint: '`McpError` maps `ErrorCode.InvalidParams` → `-32602`, `ErrorCode.InternalError` → `-32603`.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-12-notifications',
      title: '🔔 Notifications & Lifecycle',
      steps: [
        {
          id: 'w6-s04-notification',
          title: 'Understand notifications',
          description:
            'A notification is a JSON-RPC message with **no** `id` field. It is fire-and-forget — the recipient never sends a response.',
          code: `// A JSON-RPC 2.0 notification (no "id")
{
  "jsonrpc": "2.0",
  "method": "notifications/tools/list_changed"
}`,
          explanation:
            'MCP uses notifications for events like `notifications/tools/list_changed` (your server registered or removed a tool). The client listens and updates its capability cache accordingly.',
          hint: 'You can emit notifications using `server.notification()`. They are useful for streaming progress updates without blocking the response.',
          os: 'both',
        },
        {
          id: 'w6-s05-handshake',
          title: 'Understand the capabilities handshake',
          description:
            'When a client first connects to your server, both sides exchange an `initialize` request/response to agree on protocol version and capabilities.',
          code: `// Client → Server: initialize
{
  "jsonrpc": "2.0", "id": 0,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "roots": { "listChanged": true } },
    "clientInfo": { "name": "claude-desktop", "version": "1.0" }
  }
}

// Server → Client: initialize response
{
  "jsonrpc": "2.0", "id": 0,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {}, "resources": {} },
    "serverInfo": { "name": "my-mcp-server", "version": "1.0.0" }
  }
}`,
          explanation:
            'The handshake negotiates the protocol version and advertises each side\'s capabilities. The MCP SDK handles this automatically — you just provide your server name and version to `McpServer`.',
          hint: 'You can see the full handshake JSON in the Inspector\'s **Messages** tab.',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// World 7 · Testing
// ─────────────────────────────────────────────────────────────────────────────
export const testing: World = {
  id: 'world-07-testing',
  title: '🧪 Testing',
  regions: [
    {
      id: 'region-13-test-setup',
      title: '⚙️ Test Setup',
      steps: [
        {
          id: 'w7-s01-install-vitest',
          title: 'Install Vitest',
          description:
            'Add Vitest as a dev dependency. It works natively with TypeScript and ES modules — no extra config needed.',
          command: 'npm install -D vitest',
          explanation:
            'Vitest is compatible with the Jest API (`.test.ts` files, `describe`, `it`, `expect`) so any Jest knowledge transfers directly.',
          hint: 'Add `"test": "vitest run"` to the `"scripts"` section of `package.json` to enable `npm test`.',
          os: 'both',
        },
        {
          id: 'w7-s02-add-test-script',
          title: 'Add test script to package.json',
          description:
            'Register the `test` and `test:watch` scripts so `npm test` runs your suite and exits.',
          code: `// In package.json → "scripts"
{
  "scripts": {
    "dev": "tsx server.ts",
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}`,
          explanation:
            '`vitest run` runs once and exits — perfect for CI. `vitest` (no `run`) starts watch mode, re-running tests as you edit files.',
          hint: 'Use `npm run test:watch` for development and `npm test` in CI.',
          os: 'both',
        },
        {
          id: 'w7-s03-extract-handlers',
          title: 'Extract tool handlers for testability',
          description:
            'Refactor your tool logic into pure functions that can be tested independently of the server. Create a `tools.ts` file.',
          code: `// tools.ts — pure, testable handler functions
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js'

export function echoHandler({ message }: { message: string }) {
  return { content: [{ type: 'text' as const, text: \`Echo: \${message}\` }] }
}

export function addHandler({ a, b }: { a: number; b: number }) {
  return { content: [{ type: 'text' as const, text: String(a + b) }] }
}

export function divideHandler({ numerator, denominator }: { numerator: number; denominator: number }) {
  if (denominator === 0) throw new McpError(ErrorCode.InvalidParams, 'Cannot divide by zero')
  return { content: [{ type: 'text' as const, text: String(numerator / denominator) }] }
}`,
          explanation:
            'Pure functions are easy to test because they have no side effects. In `server.ts`, import these and pass them as the tool handler: `async (args) => echoHandler(args)`.',
          hint: 'Keep `server.ts` as thin as possible — just imports, tool registrations, and the `connect()` call.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-14-write-tests',
      title: '✅ Write Tests',
      steps: [
        {
          id: 'w7-s04-first-test',
          title: 'Write your first test',
          description:
            'Create `tools.test.ts` and write tests for the `echoHandler` function.',
          code: `// tools.test.ts
import { describe, it, expect } from 'vitest'
import { echoHandler } from './tools.js'

describe('echoHandler', () => {
  it('returns the message prefixed with Echo:', () => {
    const result = echoHandler({ message: 'hello' })
    expect(result.content[0].text).toBe('Echo: hello')
  })

  it('handles empty string', () => {
    const result = echoHandler({ message: '' })
    expect(result.content[0].text).toBe('Echo: ')
  })
})`,
          explanation:
            'Each `it()` block is one test case. `expect().toBe()` checks strict equality. If the handler returns the wrong value the test fails with a clear diff.',
          hint: 'Run `npm test` to execute. You should see two passing tests.',
          os: 'both',
        },
        {
          id: 'w7-s05-test-errors',
          title: 'Test error cases',
          description:
            'Add tests that verify your tools throw `McpError` with the correct code when given invalid input.',
          code: `import { describe, it, expect } from 'vitest'
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js'
import { divideHandler } from './tools.js'

describe('divideHandler', () => {
  it('divides correctly', () => {
    const result = divideHandler({ numerator: 10, denominator: 2 })
    expect(result.content[0].text).toBe('5')
  })

  it('throws McpError when denominator is 0', () => {
    expect(() => divideHandler({ numerator: 10, denominator: 0 }))
      .toThrow(McpError)
  })

  it('throws InvalidParams error code', () => {
    try {
      divideHandler({ numerator: 1, denominator: 0 })
    } catch (err) {
      expect(err).toBeInstanceOf(McpError)
      expect((err as McpError).code).toBe(ErrorCode.InvalidParams)
    }
  })
})`,
          explanation:
            'Testing error paths is just as important as testing the happy path. Verifying the exact `ErrorCode` ensures clients receive the right structured signal.',
          hint: 'Use `.toThrow(McpError)` to assert a specific error class was thrown.',
          os: 'both',
        },
        {
          id: 'w7-s06-run-tests',
          title: 'Run the full test suite',
          description:
            'Execute the complete test suite and confirm all tests pass.',
          command: 'npm test',
          explanation:
            'All tests should pass. A green test suite is your safety net — any future change that breaks a tool\'s behaviour will immediately surface as a failing test.',
          hint: 'If a test fails, read the diff carefully: the left side is "received", the right side is "expected".',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// World 8 · Debugging
// ─────────────────────────────────────────────────────────────────────────────
export const debugging: World = {
  id: 'world-08-debugging',
  title: '🐛 Debugging',
  regions: [
    {
      id: 'region-15-error-handling',
      title: '🛡️ Robust Error Handling',
      steps: [
        {
          id: 'w8-s01-try-catch',
          title: 'Wrap I/O handlers in try/catch',
          description:
            'Unexpected runtime errors inside a tool handler will crash the server unless caught. Wrap all I/O-heavy handlers in `try/catch`.',
          code: `server.tool(
  'read-file',
  'Reads a text file and returns its contents',
  { path: z.string().describe('Absolute path to the file') },
  async ({ path }) => {
    try {
      const { readFile } = await import('node:fs/promises')
      const content = await readFile(path, 'utf8')
      return { content: [{ type: 'text', text: content }] }
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new McpError(ErrorCode.InvalidParams, \`File not found: \${path}\`)
      }
      throw new McpError(ErrorCode.InternalError, \`Could not read file: \${String(err)}\`)
    }
  },
)`,
          explanation:
            'Node.js filesystem errors expose a `code` property (e.g. `ENOENT`, `EACCES`). Map these to appropriate `ErrorCode` values so the client receives a meaningful error rather than a generic crash.',
          hint: 'Cast the caught error to `NodeJS.ErrnoException` to access the `.code` property with type safety.',
          os: 'both',
        },
        {
          id: 'w8-s02-input-validation',
          title: 'Add defensive input validation',
          description:
            'Even with Zod schemas, add runtime guards for constraints Zod cannot express — like ensuring a path stays within a sandboxed directory.',
          code: `import path from 'node:path'

const SANDBOX = path.resolve('./sandbox')

server.tool(
  'safe-read',
  'Reads a file within the sandbox directory only',
  { filename: z.string() },
  async ({ filename }) => {
    const resolved = path.resolve(SANDBOX, filename)
    // Prevent path traversal attacks
    if (!resolved.startsWith(SANDBOX + path.sep)) {
      throw new McpError(ErrorCode.InvalidParams, 'Path escapes sandbox directory')
    }
    const { readFile } = await import('node:fs/promises')
    const content = await readFile(resolved, 'utf8')
    return { content: [{ type: 'text', text: content }] }
  },
)`,
          explanation:
            'Path traversal (`../../etc/passwd`) is a classic vulnerability when tools handle file paths. Always resolve and verify the result still begins with the allowed root.',
          hint: 'The trailing `path.sep` prevents matching a sibling directory whose name starts with the same prefix.',
          os: 'both',
        },
      ],
    },
    {
      id: 'region-16-logging',
      title: '🔦 Logging & Diagnostics',
      steps: [
        {
          id: 'w8-s03-stderr-logging',
          title: 'Log to stderr, not stdout',
          description:
            'All diagnostic output from your server **must** go to `stderr`. Writing to `stdout` corrupts the JSON-RPC stream the client is reading.',
          code: `// ✅ Correct — write diagnostics to stderr
console.error('[my-mcp-server] starting up…')
console.error('[my-mcp-server] tool "echo" registered')

// ❌ Wrong — this corrupts the JSON-RPC transport on stdout
console.log('Server started')`,
          explanation:
            'STDIO transport uses stdout as the wire for JSON-RPC messages. Any text mixed in breaks JSON framing and the client will receive a parse error or silently drop messages.',
          hint: 'A simple convention: use `console.error` for everything. The `[server-name]` prefix makes log lines easy to grep.',
          os: 'both',
        },
        {
          id: 'w8-s04-debug-flag',
          title: 'Add a --debug flag',
          description:
            'Gate verbose logging behind a `--debug` CLI flag so production deployments stay quiet while development builds are chatty.',
          code: `// server.ts — add near the top
const DEBUG = process.argv.includes('--debug')

function log(...args: unknown[]): void {
  if (DEBUG) console.error('[debug]', ...args)
}

// Usage inside a tool handler:
server.tool('echo', '', { message: z.string() }, async ({ message }) => {
  log('echo called with:', message)
  return { content: [{ type: 'text', text: \`Echo: \${message}\` }] }
})`,
          explanation:
            'Run `npx tsx server.ts --debug` to enable verbose output during development.',
          hint: 'You can also use an env var: `const DEBUG = process.env.MCP_DEBUG === "1"`.',
          os: 'both',
        },
        {
          id: 'w8-s05-common-errors',
          title: 'Recognise common errors',
          description:
            'Review the most common MCP server errors and how to fix each one.',
          code: `// ❌ SyntaxError: Cannot use import statement in a module
// Fix: Ensure "type": "module" is in package.json

// ❌ Error: Cannot find module '...sdk/server/mcp.js'
// Fix: Import paths must end with .js even for .ts source files

// ❌ TypeError: Cannot read properties of undefined (reading 'connect')
// Fix: Call connect() only after instantiating McpServer

// ❌ Client shows "Server disconnected" immediately
// Fix: A console.log() wrote to stdout — use console.error() everywhere

// ❌ Tool not appearing in Inspector
// Fix: Register all tools BEFORE calling server.connect(transport)`,
          explanation:
            'The most common cause of "server disconnected" in any MCP client is a `console.log` accidentally written to stdout. Always use `console.error` for all diagnostic output.',
          hint: 'Add `console.error("[server] ready")` as the very last line of your server. If it prints, the server started cleanly.',
          os: 'both',
        },
        {
          id: 'w8-s06-run-with-debug',
          title: 'Run the server in debug mode',
          description:
            'Start your server with the `--debug` flag and connect the Inspector. Observe the debug log lines in your terminal while you interact with tools in the browser.',
          command: 'npx @modelcontextprotocol/inspector npx tsx server.ts --debug',
          explanation:
            'The Inspector spawns the server and passes all subsequent arguments to it. Your debug logs appear in the terminal; Inspector output appears in the browser — clean separation of diagnostics and interactive testing.',
          hint: 'Add `"debug": "tsx server.ts --debug"` to `package.json` scripts for convenience.',
          os: 'both',
        },
      ],
    },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

/** Backward-compat alias — resolves to the first world. */
export const mcpFundamentals = bootCamp

/** All worlds in display and play order. */
export const ALL_WORLDS: World[] = [
  bootCamp,
  projectSetup,
  serverCreation,
  toolCreation,
  inspector,
  jsonRpc,
  testing,
  debugging,
]

// Legacy placeholder — kept so any code importing the old ID compiles.
export const _DEPRECATED_world_01_id = 'world-01-mcp-fundamentals'

export default ALL_WORLDS

