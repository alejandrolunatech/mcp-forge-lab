// ─── Challenge Data ───────────────────────────────────────────────────────────
//
// Mini-game challenges keyed by step ID.
// Each challenge is consumed by MiniGame.tsx, which is rendered inside
// LessonPlayer.tsx whenever the current step has a challenge registered here.
//
// Three challenge kinds:
//   fix-command  — pick the correct shell command from several options
//   build-tool   — drag-and-drop pieces into named slots to assemble a tool
//   debug        — click the buggy line in a code block

// ── Types ─────────────────────────────────────────────────────────────────────

export type ChallengeKind = 'fix-command' | 'build-tool' | 'debug'

/** Mini-game 1: choose the correct shell command. */
export interface FixCommandChallenge {
  kind: 'fix-command'
  /** Question shown above the options. */
  prompt: string
  /** All selectable command strings. */
  options: string[]
  /** 0-based index of the correct option. */
  correctIndex: number
  /** Explanation shown after the user submits. */
  explanation: string
}

/** A named drop-zone in the tool assembly template. */
export interface BuildSlot {
  id: string
  /** Short label displayed beside the slot (e.g. "name", "schema"). */
  label: string
}

/** A draggable piece in the piece tray. */
export interface BuildPiece {
  id: string
  /** Code-snippet label shown on the chip. */
  label: string
  /** ID of the slot this piece belongs in; empty string for distractors. */
  correctSlot: string
}

/** Mini-game 2: drag-and-drop pieces into the correct slots. */
export interface BuildToolChallenge {
  kind: 'build-tool'
  prompt: string
  slots: BuildSlot[]
  pieces: BuildPiece[]
}

/** Mini-game 3: click the buggy line in a code block. */
export interface DebugChallenge {
  kind: 'debug'
  prompt: string
  /** Code split into individual lines (empty string = blank line). */
  lines: string[]
  /** 1-based index of the line containing the bug. */
  bugLine: number
  /** Explanation shown after the user submits. */
  explanation: string
}

export type Challenge = FixCommandChallenge | BuildToolChallenge | DebugChallenge

// ── Challenge Registry ────────────────────────────────────────────────────────

const CHALLENGES: Record<string, Challenge> = {

  // ── Fix Command ─────────────────────────────────────────────────────────────

  'w2-s04-install-sdk': {
    kind: 'fix-command',
    prompt: 'Which command correctly installs the MCP SDK?',
    options: [
      'npm install mcp-sdk',
      'npm install @modelcontextprotocol/sdk',
      'npx install mcp',
      'npm add modelcontextprotocol',
    ],
    correctIndex: 1,
    explanation:
      'The package is scoped: @modelcontextprotocol/sdk — always include the full scope when installing.',
  },

  'w3-s05-run-server': {
    kind: 'fix-command',
    prompt: 'Which command starts your TypeScript MCP server during development?',
    options: [
      'node server.ts',
      'tsc && node dist/server.js',
      'npx tsx server.ts',
      'npm run build',
    ],
    correctIndex: 2,
    explanation:
      '`npx tsx server.ts` runs TypeScript directly — no compile step needed during development.',
  },

  'w7-s01-install-vitest': {
    kind: 'fix-command',
    prompt: 'Which command installs Vitest as a development dependency?',
    options: [
      'npm install vitest',
      'npm install -D vitest',
      'npm install -D jest',
      'npm add --save vitest',
    ],
    correctIndex: 1,
    explanation:
      'The -D flag (--save-dev) places vitest in devDependencies — test frameworks are not needed in production bundles.',
  },

  // ── Build Tool ──────────────────────────────────────────────────────────────

  'w4-s01-echo-tool': {
    kind: 'build-tool',
    prompt:
      'Drag the correct pieces into each slot to register the echo tool with server.tool().',
    slots: [
      { id: 'name',    label: 'name' },
      { id: 'schema',  label: 'schema' },
      { id: 'handler', label: 'handler' },
    ],
    pieces: [
      { id: 'p-name-echo',    label: "'echo'",                              correctSlot: 'name'    },
      { id: 'p-name-ping',    label: "'ping'",                              correctSlot: ''        },
      { id: 'p-schema-msg',   label: '{ message: z.string() }',            correctSlot: 'schema'  },
      { id: 'p-schema-url',   label: '{ url: z.string().url() }',          correctSlot: ''        },
      { id: 'p-handler-echo', label: 'async ({message}) => ({content:[{type:"text",text:"Echo:"+message}]})', correctSlot: 'handler' },
      { id: 'p-handler-ping', label: 'async ({url}) => ({content:[{type:"text",text:url}]})',                 correctSlot: ''        },
    ],
  },

  'w4-s02-add-tool': {
    kind: 'build-tool',
    prompt:
      'Assemble the "add" tool — drag the correct name, schema and handler into their slots.',
    slots: [
      { id: 'name',    label: 'name' },
      { id: 'schema',  label: 'schema' },
      { id: 'handler', label: 'handler' },
    ],
    pieces: [
      { id: 'p-name-add',       label: "'add'",                                     correctSlot: 'name'    },
      { id: 'p-name-multiply',  label: "'multiply'",                                correctSlot: ''        },
      { id: 'p-schema-ab',      label: '{ a: z.number(), b: z.number() }',         correctSlot: 'schema'  },
      { id: 'p-schema-xy',      label: '{ x: z.string(), y: z.string() }',         correctSlot: ''        },
      { id: 'p-handler-add',    label: 'async ({a,b}) => ({content:[{type:"text",text:String(a+b)}]})',      correctSlot: 'handler' },
      { id: 'p-handler-greet',  label: 'async ({name}) => ({content:[{type:"text",text:"Hi "+name}]})',      correctSlot: ''        },
    ],
  },

  // ── Debug Challenge ─────────────────────────────────────────────────────────

  'w3-s02-imports': {
    kind: 'debug',
    prompt:
      'One import is missing something required by Node.js ESM. Click the buggy line.',
    lines: [
      "import { McpServer } from '@modelcontextprotocol/sdk/server/mcp'",
      "import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'",
      '',
      "const server = new McpServer({ name: 'my-server', version: '1.0.0' })",
      'const transport = new StdioServerTransport()',
    ],
    bugLine: 1,
    explanation:
      'Node.js ESM requires explicit .js extensions in import paths, even for TypeScript source files. The first import is missing the .js extension.',
  },

  'w8-s03-stderr-logging': {
    kind: 'debug',
    prompt:
      'One line will corrupt the JSON-RPC transport stream. Click the problematic line.',
    lines: [
      "console.log('[server] starting up…')",
      '',
      "const server = new McpServer({ name: 'my-server', version: '1.0.0' })",
      'const transport = new StdioServerTransport()',
      'await server.connect(transport)',
    ],
    bugLine: 1,
    explanation:
      'console.log writes to stdout — the same channel used for JSON-RPC messages. This corrupts the framing. All diagnostic output must use console.error instead.',
  },

  'w4-s04-error-handling': {
    kind: 'debug',
    prompt:
      'The divide tool throws the wrong type of error. Find the buggy line.',
    lines: [
      'async ({ numerator, denominator }) => {',
      '  if (denominator === 0) {',
      "    throw new Error('Cannot divide by zero')",
      '  }',
      "  return { content: [{ type: 'text', text: String(numerator / denominator) }] }",
      '}',
    ],
    bugLine: 3,
    explanation:
      'Plain Error objects are not MCP-aware. Use McpError(ErrorCode.InvalidParams, "…") so the client receives a structured JSON-RPC error response.',
  },

}

// ── Public API ────────────────────────────────────────────────────────────────

export function getChallenge(stepId: string): Challenge | undefined {
  return CHALLENGES[stepId]
}

/** Step IDs that have a mini-game challenge registered. */
export const ALL_CHALLENGE_STEP_IDS: string[] = Object.keys(CHALLENGES)
