// ─── Glossary Content ────────────────────────────────────────────────────────
//
// Definitions for core MCP concepts, available in EN, ES, and NL.
// Each term has a short (one-sentence) summary shown when collapsed and a
// long explanation shown when expanded, plus an optional code/command example.

import type { Language } from '../context/AppContext'

// ── Types ────────────────────────────────────────────────────────────────────

export interface GlossaryDefinition {
  /** One-sentence summary, shown in the collapsed row. */
  short: string
  /** Full explanation, shown when the term is expanded. */
  long: string
  /** Optional illustrative code snippet or command. */
  example?: string
}

export interface GlossaryTerm {
  id: string
  /** Canonical English term name — used for search matching regardless of language. */
  term: string
  /** Emoji tag for quick visual scanning. */
  icon: string
  definitions: Record<Language, GlossaryDefinition>
}

// ── Term data ────────────────────────────────────────────────────────────────

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'mcp-server',
    term: 'MCP Server',
    icon: '🖥️',
    definitions: {
      en: {
        short: 'A local process that exposes tools, resources, and prompts to AI clients.',
        long: 'An MCP server sits between an AI host (e.g. Claude Desktop) and your business logic. It registers capabilities — tools, resources, and prompts — and communicates over a transport layer using JSON-RPC 2.0. Your server can be written in TypeScript, Python, or any language that implements the protocol.',
        example: 'npx tsx server.ts',
      },
      es: {
        short: 'Un proceso local que expone herramientas, recursos e indicaciones a clientes de IA.',
        long: 'Un servidor MCP actúa como intermediario entre un host de IA (p. ej. Claude Desktop) y tu lógica de negocio. Registra capacidades — herramientas, recursos e indicaciones — y se comunica a través de una capa de transporte usando JSON-RPC 2.0. Puedes escribirlo en TypeScript, Python o cualquier lenguaje que implemente el protocolo.',
        example: 'npx tsx server.ts',
      },
      nl: {
        short: 'Een lokaal proces dat tools, resources en prompts blootstelt aan AI-clients.',
        long: 'Een MCP-server zit tussen een AI-host (bijv. Claude Desktop) en jouw bedrijfslogica. Het registreert mogelijkheden — tools, resources en prompts — en communiceert via een transportlaag met JSON-RPC 2.0. Je server kan worden geschreven in TypeScript, Python of elke taal die het protocol implementeert.',
        example: 'npx tsx server.ts',
      },
    },
  },
  {
    id: 'tool',
    term: 'Tool',
    icon: '🔧',
    definitions: {
      en: {
        short: 'A function registered on the server that an AI client can invoke with validated arguments.',
        long: 'Tools are the primary way an LLM interacts with external systems through MCP. Each tool has a name, a Zod schema defining its inputs, and an async handler that returns a `content` array. The AI decides when to call a tool based on the conversation and the tool\'s description.',
        example: "server.tool('echo', { message: z.string() }, async ({ message }) => ({\n  content: [{ type: 'text', text: `Echo: ${message}` }],\n}))",
      },
      es: {
        short: 'Una función registrada en el servidor que un cliente de IA puede invocar con argumentos validados.',
        long: 'Las herramientas son la principal forma en que un LLM interactúa con sistemas externos a través de MCP. Cada herramienta tiene un nombre, un esquema Zod que define sus entradas y un manejador asíncrono que devuelve un array `content`. La IA decide cuándo llamar a una herramienta basándose en la conversación y la descripción de la misma.',
        example: "server.tool('echo', { message: z.string() }, async ({ message }) => ({\n  content: [{ type: 'text', text: `Echo: ${message}` }],\n}))",
      },
      nl: {
        short: 'Een functie geregistreerd op de server die een AI-client kan aanroepen met gevalideerde argumenten.',
        long: 'Tools zijn de primaire manier waarop een LLM met externe systemen interageert via MCP. Elke tool heeft een naam, een Zod-schema dat de invoer definieert, en een async handler die een `content`-array retourneert. De AI beslist wanneer een tool wordt aangeroepen op basis van het gesprek en de beschrijving van de tool.',
        example: "server.tool('echo', { message: z.string() }, async ({ message }) => ({\n  content: [{ type: 'text', text: `Echo: ${message}` }],\n}))",
      },
    },
  },
  {
    id: 'stdio',
    term: 'STDIO',
    icon: '📡',
    definitions: {
      en: {
        short: 'Standard input/output streams — the default transport channel for local MCP servers.',
        long: 'When your server starts, `StdioServerTransport` attaches to the process\'s stdin and stdout. The client (host) spawns your server process and communicates by writing JSON-RPC messages to stdin and reading responses from stdout. No network sockets, ports, or authentication are required for local use.',
        example: 'const transport = new StdioServerTransport()\nawait server.connect(transport)',
      },
      es: {
        short: 'Flujos de entrada/salida estándar — el canal de transporte predeterminado para servidores MCP locales.',
        long: 'Cuando tu servidor se inicia, `StdioServerTransport` se adjunta a los flujos stdin y stdout del proceso. El cliente (host) lanza tu proceso de servidor y se comunica escribiendo mensajes JSON-RPC en stdin y leyendo respuestas desde stdout. No se necesitan sockets de red, puertos ni autenticación para uso local.',
        example: 'const transport = new StdioServerTransport()\nawait server.connect(transport)',
      },
      nl: {
        short: 'Standaard invoer-/uitvoerstromen — het standaard transportkanaal voor lokale MCP-servers.',
        long: 'Wanneer je server start, koppelt `StdioServerTransport` zich aan de stdin en stdout van het proces. De client (host) start jouw serverproces en communiceert door JSON-RPC-berichten naar stdin te schrijven en antwoorden van stdout te lezen. Geen netwerksockets, poorten of authenticatie vereist voor lokaal gebruik.',
        example: 'const transport = new StdioServerTransport()\nawait server.connect(transport)',
      },
    },
  },
  {
    id: 'json-rpc',
    term: 'JSON-RPC',
    icon: '📨',
    definitions: {
      en: {
        short: 'A lightweight remote procedure call protocol over JSON — the wire format MCP uses.',
        long: 'MCP uses JSON-RPC 2.0 for all messages. Every request carries `jsonrpc: "2.0"`, a `method` name, optional `params`, and an `id` for pairing with the response. Notifications (no `id`) are fire-and-forget. The protocol is transport-agnostic, which is why MCP can run over STDIO, SSE, or WebSocket.',
      },
      es: {
        short: 'Un protocolo ligero de llamada a procedimiento remoto sobre JSON — el formato de cable que usa MCP.',
        long: 'MCP usa JSON-RPC 2.0 para todos los mensajes. Cada solicitud contiene `jsonrpc: "2.0"`, un nombre de `method`, `params` opcionales y un `id` para emparejarse con la respuesta. Las notificaciones (sin `id`) son de tipo "dispara y olvida". El protocolo es agnóstico al transporte, por eso MCP puede funcionar sobre STDIO, SSE o WebSocket.',
      },
      nl: {
        short: 'Een lichtgewicht remote procedure call-protocol over JSON — het draadformaat dat MCP gebruikt.',
        long: 'MCP gebruikt JSON-RPC 2.0 voor alle berichten. Elk verzoek bevat `jsonrpc: "2.0"`, een `method`-naam, optionele `params` en een `id` voor koppeling met het antwoord. Meldingen (zonder `id`) zijn fire-and-forget. Het protocol is transport-agnostisch, waardoor MCP kan draaien via STDIO, SSE of WebSocket.',
      },
    },
  },
  {
    id: 'schema',
    term: 'Schema',
    icon: '📐',
    definitions: {
      en: {
        short: 'A Zod type definition that describes and validates the input parameters of a tool.',
        long: 'Schemas are written with the Zod library and compiled to JSON Schema for transmission during the MCP capabilities handshake. The client inspects them to know exactly what arguments each tool accepts and can validate user or LLM input before sending the call. Type-safe schemas prevent runtime errors and improve LLM tool-calling accuracy.',
        example: 'import { z } from \'zod\'\n\nconst schema = { message: z.string().min(1), count: z.number().int().optional() }',
      },
      es: {
        short: 'Una definición de tipo Zod que describe y valida los parámetros de entrada de una herramienta.',
        long: 'Los esquemas se escriben con la biblioteca Zod y se compilan a JSON Schema para su transmisión durante el protocolo de negociación de capacidades de MCP. El cliente los inspecciona para saber exactamente qué argumentos acepta cada herramienta y puede validar la entrada del usuario o del LLM antes de enviar la llamada. Los esquemas con tipado seguro evitan errores en tiempo de ejecución y mejoran la precisión de las llamadas a herramientas del LLM.',
        example: 'import { z } from \'zod\'\n\nconst schema = { message: z.string().min(1), count: z.number().int().optional() }',
      },
      nl: {
        short: 'Een Zod-typedefinitie die de invoerparameters van een tool beschrijft en valideert.',
        long: 'Schema\'s worden geschreven met de Zod-bibliotheek en gecompileerd naar JSON Schema voor verzending tijdens de MCP-capabilities-handshake. De client inspecteert ze om precies te weten welke argumenten elke tool accepteert en kan gebruikers- of LLM-invoer valideren voordat de aanroep wordt verzonden. Type-veilige schema\'s voorkomen runtime-fouten en verbeteren de nauwkeurigheid van LLM-tool-aanroepen.',
        example: 'import { z } from \'zod\'\n\nconst schema = { message: z.string().min(1), count: z.number().int().optional() }',
      },
    },
  },
  {
    id: 'transport',
    term: 'Transport',
    icon: '🚌',
    definitions: {
      en: {
        short: 'The communication channel that carries JSON-RPC messages between an MCP client and server.',
        long: 'MCP is transport-agnostic by design. `StdioServerTransport` is used for local processes spawned by the host. `SSEServerTransport` (Server-Sent Events) enables HTTP-based remote servers accessible over the network. The transport layer handles framing and serialisation — your tool and resource handlers stay identical regardless of which transport you choose.',
      },
      es: {
        short: 'El canal de comunicación que transporta mensajes JSON-RPC entre un cliente y servidor MCP.',
        long: 'MCP es agnóstico al transporte por diseño. `StdioServerTransport` se usa para procesos locales iniciados por el host. `SSEServerTransport` (Eventos Enviados por el Servidor) permite servidores remotos basados en HTTP accesibles por la red. La capa de transporte gestiona el encuadre y la serialización — tus manejadores de herramientas y recursos permanecen idénticos independientemente del transporte que elijas.',
      },
      nl: {
        short: 'Het communicatiekanaal dat JSON-RPC-berichten draagt tussen een MCP-client en -server.',
        long: 'MCP is door ontwerp transport-agnostisch. `StdioServerTransport` wordt gebruikt voor lokale processen die door de host worden gestart. `SSEServerTransport` (Server-Sent Events) maakt HTTP-gebaseerde externe servers mogelijk die via het netwerk toegankelijk zijn. De transportlaag verwerkt framing en serialisatie — je tool- en resource-handlers blijven identiek ongeacht welk transport je kiest.',
      },
    },
  },
  {
    id: 'client',
    term: 'Client',
    icon: '🤖',
    definitions: {
      en: {
        short: 'The AI host application that connects to an MCP server and invokes its capabilities.',
        long: 'Clients (also called hosts) are applications like Claude Desktop, Cursor, or custom AI agents. They perform the MCP capabilities handshake on startup, discover the server\'s available tools and resources, then invoke them on behalf of the LLM during a conversation. Clients are also responsible for the lifecycle of spawning, monitoring, and tearing down server processes.',
      },
      es: {
        short: 'La aplicación host de IA que se conecta a un servidor MCP e invoca sus capacidades.',
        long: 'Los clientes (también llamados hosts) son aplicaciones como Claude Desktop, Cursor o agentes de IA personalizados. Realizan el protocolo de negociación de capacidades de MCP al inicio, descubren las herramientas y recursos disponibles del servidor y los invocan en nombre del LLM durante una conversación. Los clientes también son responsables del ciclo de vida de inicio, monitoreo y terminación de los procesos del servidor.',
      },
      nl: {
        short: 'De AI-hostapplicatie die verbinding maakt met een MCP-server en de mogelijkheden aanroept.',
        long: 'Clients (ook wel hosts genoemd) zijn applicaties zoals Claude Desktop, Cursor of aangepaste AI-agenten. Ze voeren de MCP-capabilities-handshake uit bij het opstarten, ontdekken de beschikbare tools en resources van de server, en roepen ze aan namens de LLM tijdens een gesprek. Clients zijn ook verantwoordelijk voor de levenscyclus van het starten, bewaken en afsluiten van serverprocessen.',
      },
    },
  },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Return the definition for a term in the given language, falling back to EN. */
export function getDefinition(
  term: GlossaryTerm,
  language: Language,
): GlossaryDefinition {
  return term.definitions[language] ?? term.definitions.en
}

/** Filter terms by a search query (matches term name + short definition, case-insensitive). */
export function searchGlossary(
  terms: GlossaryTerm[],
  query: string,
  language: Language,
): GlossaryTerm[] {
  const q = query.trim().toLowerCase()
  if (!q) return terms
  return terms.filter(t => {
    const def = getDefinition(t, language)
    return (
      t.term.toLowerCase().includes(q) ||
      def.short.toLowerCase().includes(q) ||
      def.long.toLowerCase().includes(q)
    )
  })
}
