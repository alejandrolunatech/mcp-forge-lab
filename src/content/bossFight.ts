// ─── Boss Fight Data ──────────────────────────────────────────────────────────
//
// 7 sequential tasks the player must complete during Boss Fight mode.
// Tasks mirror the real workflow for building and running an MCP server.

export type BossTaskType = 'command' | 'choice'

export interface BossTask {
  id: string
  /** 1-based phase number (1–7). */
  phase: number
  /** Short title shown in the HUD phase dot tooltip and task header. */
  title: string
  /** Full instruction shown in the task card. */
  prompt: string
  type: BossTaskType
  /** Accepted command strings (normalised before comparison). command tasks only. */
  answers?: string[]
  /** Selectable option strings. choice tasks only. */
  options?: string[]
  /** 0-based index of the correct option. choice tasks only. */
  correctIndex?: number
  /** Costs −50 score when revealed. */
  hint: string
  /** Shown after the task is passed. */
  explanation: string
}

export const BOSS_TASKS: BossTask[] = [
  {
    id: 'boss-01-init',
    phase: 1,
    title: '⚙️ Setup Project',
    prompt:
      'Initialise a new npm package in the current directory with default settings — no prompts.',
    type: 'command',
    answers: ['npm init -y', 'npm init --yes'],
    hint: 'npm init has a flag that accepts all defaults without asking questions.',
    explanation:
      'npm init -y generates package.json with sensible defaults instantly.',
  },
  {
    id: 'boss-02-sdk',
    phase: 2,
    title: '📦 Install SDK',
    prompt:
      'Install the official MCP TypeScript SDK as a runtime dependency.',
    type: 'command',
    answers: [
      'npm install @modelcontextprotocol/sdk',
      'npm i @modelcontextprotocol/sdk',
    ],
    hint: 'The package is scoped under @modelcontextprotocol — include the full scope.',
    explanation:
      'The SDK provides McpServer, all transport classes, and MCP type definitions.',
  },
  {
    id: 'boss-03-server',
    phase: 3,
    title: '🖥️ Create Server',
    prompt:
      'Create an empty TypeScript entry-point file named server.ts.',
    type: 'command',
    answers: ['touch server.ts'],
    hint: 'Use the Unix command that creates an empty file without opening an editor.',
    explanation:
      'touch creates the file. On Windows use New-Item or create it directly in VS Code.',
  },
  {
    id: 'boss-04-tool',
    phase: 4,
    title: '🔧 Add Tool',
    prompt:
      'Choose the code that correctly registers an echo tool on an MCP server.',
    type: 'choice',
    options: [
      "server.register('echo', async ({ message }) => message)",
      "server.addTool({ name: 'echo', fn: async ({ message }) => message })",
      "server.tool('echo', 'Echo the message', { message: z.string() }, async ({ message }) => ({ content: [{ type: 'text', text: message }] }))",
      "server.use('echo', z.object({ message: z.string() }), (req) => req.message)",
    ],
    correctIndex: 2,
    hint: 'The correct API is server.tool() — takes name, description, Zod schema, and async handler returning { content: [...] }.',
    explanation:
      'server.tool() is the standard MCP SDK API. The handler must return { content: [...] } with typed content items.',
  },
  {
    id: 'boss-05-run',
    phase: 5,
    title: '🚀 Run Server',
    prompt:
      'Start the server in development mode — no compile step required.',
    type: 'command',
    answers: ['npx tsx server.ts', 'npm run dev'],
    hint: 'Use npx tsx to run TypeScript directly without calling tsc first.',
    explanation:
      'tsx executes TypeScript natively in Node.js. The server listens on STDIO for JSON-RPC messages.',
  },
  {
    id: 'boss-06-call',
    phase: 6,
    title: '🔍 Call Tool',
    prompt:
      'Launch the MCP Inspector and point it at your server so you can call tools interactively.',
    type: 'command',
    answers: [
      'npx @modelcontextprotocol/inspector npx tsx server.ts',
    ],
    hint: 'Pass the full server launch command as an argument to the Inspector.',
    explanation:
      'The Inspector spawns your server as a subprocess and opens a web UI at localhost:5173 for calling tools.',
  },
  {
    id: 'boss-07-test',
    phase: 7,
    title: '🧪 Run Tests',
    prompt:
      'Execute the full test suite using the npm test shorthand.',
    type: 'command',
    answers: ['npm test', 'npm run test', 'npx vitest run'],
    hint: 'Use the npm lifecycle script shorthand — no need to type "run".',
    explanation:
      'npm test runs the "test" script in package.json, which calls vitest run in CI mode.',
  },
]

export const BOSS_TASK_COUNT = BOSS_TASKS.length
