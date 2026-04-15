// ─── Content Resolver ────────────────────────────────────────────────────────
//
// Provides translated overlays for lesson content (step titles, descriptions,
// explanations, hints, region/world titles).
//
// Strategy: English originals live in worlds.ts. This file holds ES and NL
// overrides as lookup tables, keyed by entity ID. resolveStep / resolveRegion /
// resolveWorld merge the override (if any) onto the original object, leaving
// all untranslated fields (code, command, os…) untouched.

import type { LessonStep, Region, World } from './schema'
import type { Language } from '../context/AppContext'

// ── Types ────────────────────────────────────────────────────────────────────

type StepOverride = Partial<Pick<LessonStep, 'title' | 'description' | 'explanation' | 'hint'>>
type RegionOverride = Pick<Region, 'title'>
type WorldOverride = Pick<World, 'title'>

// ── Step Translations ────────────────────────────────────────────────────────

const STEP_TRANSLATIONS: Record<Language, Record<string, StepOverride>> = {
  en: {},
  es: {
    // ── World 1: Boot Camp ────────────────────────────────────────────────
    'w1-s01-check-node': {
      title: 'Verificar versión de Node.js',
      description:
        'Los servidores MCP requieren Node.js 20 o posterior. Verifica tu versión instalada antes de continuar.',
      explanation:
        'Deberías ver `v20.x.x` o superior. Si ves una versión anterior — o "command not found" — descarga la versión LTS desde https://nodejs.org antes de continuar.',
      hint: 'En macOS también puedes usar `nvm` o `fnm` para instalar y cambiar versiones de Node sin tocar tu instalación del sistema.',
    },
    'w1-s02-check-npm': {
      title: 'Verificar versión de npm',
      description:
        'npm es el gestor de paquetes incluido con Node.js. Se recomienda la versión 10 o posterior para soporte de workspaces.',
      explanation:
        'npm 10+ viene con Node 20. Si necesitas actualizar: `npm install -g npm@latest`.',
      hint: 'Ejecuta `npm --version` después de actualizar para confirmar que la nueva versión está activa.',
    },
    'w1-s03-check-git': {
      title: 'Verificar que git está instalado',
      description:
        'Necesitarás git para versionar tu servidor y enviarlo a GitHub más adelante.',
      explanation:
        'Cualquier versión ≥ 2.30 es válida. Si falta git, instálalo desde https://git-scm.com.',
      hint: 'macOS incluye un stub que te pide instalar las Xcode Command Line Tools — ejecuta `xcode-select --install` para obtener git real.',
    },
    'w1-s04-install-vscode': {
      title: 'Abrir tu editor',
      description:
        'Abre VS Code (o tu editor preferido) e instala la extensión de **TypeScript** si aún no está presente. Las buenas herramientas te ahorrarán horas durante el desarrollo.',
      explanation:
        'La extensión oficial de Microsoft para TypeScript te da IntelliSense, verificación de tipos y "ir a definición" en todo tu código.',
      hint: 'Busca `ms-vscode.vscode-typescript-next` en la barra lateral de Extensiones para la última versión nightly.',
    },
    'w1-s05-hello-node': {
      title: 'Ejecutar tu primer script de Node',
      description:
        'Antes de escribir código MCP, confirma que Node.js puede ejecutar un script en tu máquina. Crea un archivo `hello.js` con `console.log("Boot camp complete!")` y ejecútalo.',
      explanation:
        'Si ves `Boot camp complete!` en la terminal, tu entorno está listo. Elimina `hello.js` — fue solo una verificación de entorno.',
      hint: 'En Windows usa el Símbolo del sistema o PowerShell — ambos funcionan perfectamente con Node.',
    },
    // ── World 2: Project Setup ────────────────────────────────────────────
    'w2-s01-mkdir': {
      title: 'Crear la carpeta del proyecto',
      description:
        'Elige un nombre para tu servidor MCP y crea su directorio raíz. Mantenlo en minúsculas y con guiones.',
      explanation:
        'Todos los archivos del proyecto — `package.json`, fuentes TypeScript y archivos de configuración — vivirán dentro de esta carpeta.',
      hint: 'Reemplaza `my-mcp-server` por cualquier nombre que quieras. Mantén la consistencia durante toda la quest.',
    },
    'w2-s02-npm-init': {
      title: 'Inicializar paquete npm',
      description:
        'Convierte la carpeta en un paquete npm. El flag `-y` acepta todos los valores por defecto para que puedas personalizarlos en el siguiente paso.',
      explanation:
        'Se crea un archivo `package.json` con valores sensatos predeterminados. Registra el nombre de tu proyecto, versión, scripts y dependencias.',
      hint: 'Abre `package.json` en tu editor para ver lo que se generó.',
    },
    'w2-s03-configure-esm': {
      title: 'Habilitar módulos ES',
      description:
        'Añade `"type": "module"` a `package.json` para que Node.js trate los archivos `.js` como módulos ES. El SDK de MCP lo requiere.',
      explanation:
        'Sin `"type": "module"`, Node usa CommonJS por defecto y las declaraciones `import` del SDK fallarán en tiempo de ejecución.',
      hint: 'Guarda `package.json` después de editarlo. Puedes verificar el cambio con `cat package.json`.',
    },
    'w2-s04-install-sdk': {
      title: 'Instalar el SDK de MCP',
      description:
        'El paquete oficial `@modelcontextprotocol/sdk` es la única dependencia de tiempo de ejecución que necesitas para construir un servidor MCP conforme.',
      explanation:
        'El SDK aparece ahora bajo `"dependencies"` en `package.json`. Proporciona `McpServer`, todas las clases de transporte y las definiciones de tipos del protocolo MCP.',
      hint: 'El paquete tiene el scope `@modelcontextprotocol` — incluye el scope completo al instalar.',
    },
    'w2-s05-install-zod': {
      title: 'Instalar Zod',
      description:
        'Zod se usa para definir y validar los esquemas de entrada de tus herramientas. Es la biblioteca de esquemas estándar en el ecosistema TypeScript de MCP.',
      explanation:
        'Los esquemas Zod se convierten a JSON Schema durante el handshake de capacidades MCP. Los clientes usan estos esquemas para saber qué argumentos acepta cada herramienta.',
      hint: 'Zod v3 es la versión principal actual — asegúrate de que `package.json` muestre `"zod": "^3.x.x"`.',
    },
    'w2-s06-install-tsx': {
      title: 'Instalar tsx y TypeScript',
      description:
        'Durante el desarrollo ejecutarás tu servidor directamente con `tsx` — sin paso de compilación.',
      explanation:
        '`tsx` envuelve Node.js con compilación TypeScript al vuelo. El flag `-D` pone ambos paquetes en `devDependencies` — no se necesitan en producción.',
      hint: 'Verifica con `npx tsx --version`. Deberías ver un número de versión, no un error.',
    },
    'w2-s07-tsconfig': {
      title: 'Crear tsconfig.json',
      description:
        'Añade un archivo de configuración de TypeScript en la raíz del proyecto que apunte a Node.js moderno y habilite la verificación de tipos estricta.',
      explanation:
        '`"module": "NodeNext"` es obligatorio cuando `package.json` tiene `"type": "module"`. Juntos hacen que TypeScript y Node.js coincidan en cómo resolver las importaciones.',
      hint: 'Si ves errores de `Cannot find module`, verifica que `moduleResolution` sea `NodeNext`.',
    },
    // ── World 3: Server Creation ──────────────────────────────────────────
    'w3-s01-create-file': {
      title: 'Crear server.ts',
      description:
        'Crea el punto de entrada principal de tu servidor MCP. Este archivo contendrá toda la lógica del servidor.',
      explanation:
        'En Windows puedes crear el archivo en VS Code haciendo clic en **Nuevo archivo** en el panel Explorador, o ejecutar `echo "" > server.ts` en PowerShell.',
      hint: 'Mantén `server.ts` en la raíz de tu proyecto, junto a `package.json`.',
    },
    'w3-s02-imports': {
      title: 'Añadir importaciones',
      description:
        'Abre `server.ts` y añade las dos importaciones necesarias para cualquier servidor MCP: `McpServer` y `StdioServerTransport`.',
      explanation:
        'Fíjate en la extensión `.js` en las rutas de importación — es obligatoria para la resolución ESM de Node.js aunque los archivos fuente sean `.ts`.',
      hint: 'TypeScript con `moduleResolution: NodeNext` espera extensiones `.js` explícitas en las rutas de importación.',
    },
    'w3-s03-create-instance': {
      title: 'Crear la instancia del servidor',
      description:
        'Instancia `McpServer` con un nombre y una versión. Estos se envían a los clientes durante el handshake de capacidades.',
      explanation:
        'Los campos `name` y `version` identifican tu servidor ante los clientes como Claude Desktop. Elige un nombre claro en kebab-case.',
      hint: 'La cadena de versión debe seguir el versionado semántico (MAJOR.MINOR.PATCH).',
    },
    'w3-s04-connect-transport': {
      title: 'Conectar el transporte STDIO',
      description:
        'Crea un `StdioServerTransport` y conéctalo al servidor. Este único `await` es todo lo que se necesita para comenzar a escuchar.',
      explanation:
        '`StdioServerTransport` conecta el servidor al `stdin` / `stdout` del proceso. La llamada `await server.connect(transport)` bloquea hasta que el cliente se desconecta.',
      hint: 'El archivo debe usar `await` de nivel superior, lo cual se permite en módulos ES. Por eso se requería `"type": "module"`.',
    },
    'w3-s05-run-server': {
      title: 'Iniciar el servidor con tsx',
      description:
        'Ejecuta tu servidor. Se iniciará y esperará silenciosamente a que un cliente se conecte a través de STDIO.',
      explanation:
        'No se espera ninguna salida — el servidor está escuchando en stdin/stdout los mensajes JSON-RPC. Presiona `Ctrl+C` para detenerlo. En el siguiente mundo conectarás un inspector.',
      hint: 'Si ves un error de TypeScript, verifica que tus importaciones usen extensiones `.js` y que `tsconfig.json` tenga `"module": "NodeNext"`.',
    },
    'w3-s06-add-start-script': {
      title: 'Añadir scripts de npm run',
      description:
        'Actualiza `package.json` para poder iniciar tu servidor con `npm run dev` en lugar de escribir el comando completo cada vez.',
      explanation:
        '`npm run dev` → desarrollo (tsx, sin compilación). `npm run build` → compila TypeScript a `dist/`. `npm start` → ejecuta la salida compilada en producción.',
      hint: 'Pruébalo: `npm run dev` debería iniciar el servidor igual que `npx tsx server.ts`.',
    },
    // ── World 4: Tool Creation ────────────────────────────────────────────
    'w4-s01-echo-tool': {
      title: 'Registrar una herramienta echo',
      description:
        'Añade tu primera herramienta al servidor. `server.tool()` recibe un nombre, una descripción, un esquema Zod y un manejador asíncrono que devuelve un array `content`.',
      explanation:
        'La cadena de descripción se envía al cliente durante el handshake de capacidades. Las buenas descripciones ayudan al LLM a decidir cuándo y cómo llamar a tu herramienta.',
      hint: 'Coloca este código **antes** de la línea `await server.connect(transport)`.',
    },
    'w4-s02-add-tool': {
      title: 'Registrar una herramienta de suma',
      description:
        'Registra una herramienta que sume dos números. Esto demuestra esquemas con múltiples parámetros de tipo numérico.',
      explanation:
        'Zod convierte y valida las entradas antes de que se ejecute tu manejador. Si el cliente envía una cadena donde se espera un número, MCP devuelve un error de validación automáticamente.',
      hint: 'Puedes encadenar validadores Zod: `z.number().min(0).max(100)` restringe la entrada a 0–100.',
    },
    'w4-s03-optional-params': {
      title: 'Añadir una herramienta con parámetros opcionales',
      description:
        'Registra una herramienta `greet` donde el parámetro de idioma es opcional y tiene inglés como valor predeterminado.',
      explanation:
        'Los parámetros opcionales con `.default()` se incluyen en el JSON Schema como no obligatorios. El LLM puede omitirlos y tu código recibe el valor predeterminado.',
      hint: 'Usa `z.enum()` cuando la entrada deba ser uno de un conjunto fijo de valores de cadena.',
    },
    'w4-s04-error-handling': {
      title: 'Manejar errores en herramientas',
      description:
        'Las herramientas deben capturar errores y devolverlos como respuestas de error MCP en lugar de dejar que las excepciones rompan el servidor.',
      explanation:
        'Lanzar `McpError` envía una respuesta de error JSON-RPC estructurada al cliente. El enum `ErrorCode` contiene códigos estándar: `InvalidParams`, `InternalError` y `MethodNotFound`.',
      hint: 'Nunca lances un `Error` simple desde un manejador de herramienta — usa `McpError` para errores estructurados y legibles.',
    },
    'w4-s05-async-tool': {
      title: 'Crear una herramienta asíncrona con I/O real',
      description:
        'Registra una herramienta `fetch-url` que realice una petición HTTP real y devuelva el código de estado — demostrando herramientas asíncronas con I/O real.',
      explanation:
        '`fetch` está integrado en Node.js 18+. `AbortSignal.timeout(5000)` asegura que un servidor lento no bloquee tu servidor MCP indefinidamente.',
      hint: 'Prueba esta herramienta con `https://example.com` — debería devolver HTTP 200.',
    },
    // ── World 5: Inspector ────────────────────────────────────────────────
    'w5-s01-install-inspector': {
      title: 'Instalar MCP Inspector',
      description:
        'El MCP Inspector oficial es una interfaz gráfica en el navegador para probar tu servidor de forma interactiva. Usa `npx` para ejecutarlo sin instalación global.',
      explanation:
        'El Inspector se conecta a tu servidor a través de STDIO, realiza el handshake de capacidades, lista todas las herramientas y recursos disponibles, y te permite llamarlos sin escribir código de cliente.',
      hint: 'Puedes omitir la instalación global y usar `npx @modelcontextprotocol/inspector` directamente si prefieres no instalar globalmente.',
    },
    'w5-s02-launch-inspector': {
      title: 'Lanzar el Inspector',
      description:
        'Inicia el Inspector y apúntalo a tu servidor. Abrirá una pestaña del navegador automáticamente.',
      explanation:
        'El Inspector lanza tu servidor como un proceso hijo y se conecta a través de STDIO. Abre una interfaz web en `http://localhost:5173`. Deberías ver el nombre y versión de tu servidor en el encabezado.',
      hint: 'Asegúrate de que tu servidor **no** esté ejecutándose en otra terminal — el Inspector lo inicia por ti.',
    },
    'w5-s03-explore-ui': {
      title: 'Explorar la interfaz del Inspector',
      description:
        'Familiarízate con las tres pestañas principales: **Tools**, **Resources** y **Prompts**. Cada una lista las capacidades que tu servidor ha registrado.',
      explanation:
        'La pestaña Tools muestra cada herramienta registrada con `server.tool()` junto con su JSON Schema. La pestaña Resources muestra los elementos registrados con `server.resource()`. La pestaña Prompts muestra plantillas de prompt.',
      hint: 'Si una pestaña está vacía, tu servidor no ha registrado capacidades de ese tipo — eso es esperado en esta etapa.',
    },
    'w5-s04-call-echo': {
      title: 'Llamar a la herramienta echo',
      description:
        'En la pestaña **Tools** del Inspector, haz clic en `echo`, escribe cualquier mensaje en el campo `message` y presiona **Run Tool**. Verifica que la respuesta aparezca en el panel de salida.',
      explanation:
        'El Inspector te muestra la solicitud JSON-RPC en bruto que envió y la respuesta que devolvió tu servidor — exactamente lo que Claude Desktop enviaría al invocar tu herramienta.',
      hint: 'Haz clic en **View raw** en el panel de respuesta para ver el envoltorio JSON-RPC completo.',
    },
    'w5-s05-inspect-schema': {
      title: 'Inspeccionar el esquema de una herramienta',
      description:
        'Haz clic en cualquier nombre de herramienta (sin ejecutarla) para expandir su panel de esquema. Revisa el JSON Schema generado a partir de tu definición Zod.',
      explanation:
        'Este JSON Schema se envía al LLM durante el handshake de capacidades. Los esquemas bien anotados (usando `.describe()`) mejoran significativamente la capacidad del LLM de usar tus herramientas correctamente.',
      hint: 'Si un campo no tiene anotación `.describe()` el LLM no recibe orientación. Siempre anota los campos obligatorios.',
    },
    'w5-s06-test-error': {
      title: 'Provocar una respuesta de error',
      description:
        'Llama a la herramienta `divide` con `denominator: 0`. Observa la respuesta de error estructurada que muestra el Inspector.',
      explanation:
        'Una respuesta de error MCP correcta es un objeto de error JSON-RPC con un `code` numérico y un `message` legible. Clientes como Claude Desktop muestran estos mensajes al usuario.',
      hint: 'Compara la respuesta de error con una respuesta exitosa — observa que la clave `"error"` reemplaza a `"result"` en el envoltorio JSON.',
    },
    // ── World 6: JSON-RPC ─────────────────────────────────────────────────
    'w6-s01-request-format': {
      title: 'Entender una solicitud JSON-RPC',
      description:
        'Cada mensaje enviado desde un cliente MCP a tu servidor es una solicitud JSON-RPC 2.0. Estudia el formato a continuación.',
      explanation:
        '`jsonrpc` siempre debe ser `"2.0"`. `id` es cualquier valor único usado para hacer coincidir la respuesta. `method` es el nombre del método MCP. `params` lleva los argumentos.',
      hint: 'Nunca escribes este JSON manualmente — el SDK y la capa de transporte lo hacen por ti. Pero conocer el formato ayuda a depurar registros en bruto.',
    },
    'w6-s02-response-format': {
      title: 'Entender una respuesta JSON-RPC',
      description:
        'Cuando tu manejador de herramienta devuelve un resultado, el SDK envuelve su salida en una respuesta de éxito JSON-RPC y la envía de vuelta al cliente.',
      explanation:
        'El `id` en la respuesta coincide con el `id` en la solicitud — así sabe el cliente a qué solicitud pertenece esta respuesta. El campo `result` contiene lo que tu manejador devolvió.',
      hint: 'El array `content` puede contener múltiples elementos de diferentes tipos: `text`, `image` o `resource`.',
    },
    'w6-s03-error-response': {
      title: 'Entender una respuesta de error JSON-RPC',
      description:
        'Cuando una herramienta lanza un `McpError`, el SDK lo serializa como una respuesta de error JSON-RPC. Estudia la forma.',
      explanation:
        'Códigos de error JSON-RPC estándar: `-32700` error de parseo, `-32600` solicitud inválida, `-32601` método no encontrado, `-32602` parámetros inválidos, `-32603` error interno. MCP añade códigos personalizados por debajo de `-32000`.',
      hint: '`McpError` mapea `ErrorCode.InvalidParams` → `-32602`, `ErrorCode.InternalError` → `-32603`.',
    },
    'w6-s04-notification': {
      title: 'Entender las notificaciones',
      description:
        'Una notificación es un mensaje JSON-RPC **sin** campo `id`. Es de tipo "disparar y olvidar" — el destinatario nunca envía una respuesta.',
      explanation:
        'MCP usa notificaciones para eventos como `notifications/tools/list_changed` (tu servidor registró o eliminó una herramienta). El cliente escucha y actualiza su caché de capacidades en consecuencia.',
      hint: 'Puedes emitir notificaciones usando `server.notification()`. Son útiles para transmitir actualizaciones de progreso sin bloquear la respuesta.',
    },
    'w6-s05-handshake': {
      title: 'Entender el handshake de capacidades',
      description:
        'Cuando un cliente se conecta por primera vez a tu servidor, ambas partes intercambian una solicitud/respuesta `initialize` para acordar la versión del protocolo y las capacidades.',
      explanation:
        'El handshake negocia la versión del protocolo y anuncia las capacidades de cada parte. El SDK de MCP lo maneja automáticamente — solo debes proporcionar el nombre y versión de tu servidor a `McpServer`.',
      hint: 'Puedes ver el JSON completo del handshake en la pestaña **Messages** del Inspector.',
    },
    // ── World 7: Testing ──────────────────────────────────────────────────
    'w7-s01-install-vitest': {
      title: 'Instalar Vitest',
      description:
        'Añade Vitest como dependencia de desarrollo. Funciona de forma nativa con TypeScript y módulos ES — sin configuración adicional.',
      explanation:
        'Vitest es compatible con la API de Jest (archivos `.test.ts`, `describe`, `it`, `expect`) por lo que cualquier conocimiento de Jest se transfiere directamente.',
      hint: 'Añade `"test": "vitest run"` a la sección `"scripts"` de `package.json` para habilitar `npm test`.',
    },
    'w7-s02-add-test-script': {
      title: 'Añadir script de pruebas a package.json',
      description:
        'Registra los scripts `test` y `test:watch` para que `npm test` ejecute tu suite y termine.',
      explanation:
        '`vitest run` ejecuta una vez y termina — perfecto para CI. `vitest` (sin `run`) inicia el modo de observación, re-ejecutando las pruebas cuando editas archivos.',
      hint: 'Usa `npm run test:watch` para desarrollo y `npm test` en CI.',
    },
    'w7-s03-extract-handlers': {
      title: 'Extraer manejadores para testabilidad',
      description:
        'Refactoriza la lógica de tus herramientas en funciones puras que puedan probarse independientemente del servidor. Crea un archivo `tools.ts`.',
      explanation:
        'Las funciones puras son fáciles de probar porque no tienen efectos secundarios. En `server.ts`, impórtalas y pásalas como el manejador de la herramienta: `async (args) => echoHandler(args)`.',
      hint: 'Mantén `server.ts` lo más delgado posible — solo importaciones, registros de herramientas y la llamada a `connect()`.',
    },
    'w7-s04-first-test': {
      title: 'Escribir tu primera prueba',
      description:
        'Crea `tools.test.ts` y escribe pruebas para la función `echoHandler`.',
      explanation:
        'Cada bloque `it()` es un caso de prueba. `expect().toBe()` comprueba igualdad estricta. Si el manejador devuelve el valor incorrecto, la prueba falla con un diff claro.',
      hint: 'Ejecuta `npm test` para ejecutar. Deberías ver dos pruebas pasando.',
    },
    'w7-s05-test-errors': {
      title: 'Probar casos de error',
      description:
        'Añade pruebas que verifiquen que tus herramientas lanzan `McpError` con el código correcto cuando se les da entrada inválida.',
      explanation:
        'Probar los caminos de error es tan importante como probar el camino feliz. Verificar el `ErrorCode` exacto asegura que los clientes reciban la señal estructurada correcta.',
      hint: 'Usa `.toThrow(McpError)` para afirmar que se lanzó una clase de error específica.',
    },
    'w7-s06-run-tests': {
      title: 'Ejecutar la suite de pruebas completa',
      description:
        'Ejecuta la suite de pruebas completa y confirma que todas las pruebas pasan.',
      explanation:
        'Todas las pruebas deberían pasar. Una suite verde es tu red de seguridad — cualquier cambio futuro que rompa el comportamiento de una herramienta surgirá inmediatamente como una prueba fallida.',
      hint: 'Si una prueba falla, lee el diff detenidamente: el lado izquierdo es "recibido", el lado derecho es "esperado".',
    },
    // ── World 8: Debugging ────────────────────────────────────────────────
    'w8-s01-try-catch': {
      title: 'Envolver manejadores I/O en try/catch',
      description:
        'Los errores de tiempo de ejecución inesperados dentro de un manejador de herramienta romperán el servidor a menos que se capturen. Envuelve todos los manejadores con mucho I/O en `try/catch`.',
      explanation:
        'Los errores del sistema de archivos de Node.js exponen una propiedad `code` (p. ej. `ENOENT`, `EACCES`). Mapéalos a valores de `ErrorCode` apropiados para que el cliente reciba un error significativo en lugar de un fallo genérico.',
      hint: 'Castea el error capturado a `NodeJS.ErrnoException` para acceder a la propiedad `.code` con seguridad de tipos.',
    },
    'w8-s02-input-validation': {
      title: 'Añadir validación defensiva de entrada',
      description:
        'Incluso con esquemas Zod, añade guardas en tiempo de ejecución para restricciones que Zod no puede expresar — como asegurar que una ruta se mantenga dentro de un directorio sandbox.',
      explanation:
        'La travesía de rutas (`../../etc/passwd`) es una vulnerabilidad clásica cuando las herramientas manejan rutas de archivo. Siempre resuelve y verifica que el resultado todavía comience con la raíz permitida.',
      hint: 'El `path.sep` final evita coincidir con un directorio hermano cuyo nombre empiece con el mismo prefijo.',
    },
    'w8-s03-stderr-logging': {
      title: 'Registrar en stderr, no en stdout',
      description:
        'Toda la salida de diagnóstico de tu servidor **debe** ir a `stderr`. Escribir en `stdout` corrompe el flujo JSON-RPC que el cliente está leyendo.',
      explanation:
        'El transporte STDIO usa stdout como el cable para los mensajes JSON-RPC. Cualquier texto mezclado rompe el enmarcado JSON y el cliente recibirá un error de parseo o descartará mensajes silenciosamente.',
      hint: 'Una convención simple: usa `console.error` para todo. El prefijo `[server-name]` hace que las líneas de log sean fáciles de buscar con grep.',
    },
    'w8-s04-debug-flag': {
      title: 'Añadir un flag --debug',
      description:
        'Controla el registro detallado detrás de un flag CLI `--debug` para que los despliegues en producción permanezcan silenciosos mientras las compilaciones de desarrollo sean detalladas.',
      explanation:
        'Ejecuta `npx tsx server.ts --debug` para habilitar la salida detallada durante el desarrollo.',
      hint: 'También puedes usar una variable de entorno: `const DEBUG = process.env.MCP_DEBUG === "1"`.',
    },
    'w8-s05-common-errors': {
      title: 'Reconocer errores comunes',
      description:
        'Revisa los errores más comunes del servidor MCP y cómo solucionar cada uno.',
      explanation:
        'La causa más común de "server disconnected" en cualquier cliente MCP es un `console.log` escrito accidentalmente en stdout. Siempre usa `console.error` para toda la salida de diagnóstico.',
      hint: 'Añade `console.error("[server] ready")` como la última línea de tu servidor. Si se imprime, el servidor se inició correctamente.',
    },
    'w8-s06-run-with-debug': {
      title: 'Ejecutar el servidor en modo debug',
      description:
        'Inicia tu servidor con el flag `--debug` y conecta el Inspector. Observa las líneas de log de depuración en tu terminal mientras interactúas con las herramientas en el navegador.',
      explanation:
        'El Inspector lanza el servidor y pasa todos los argumentos siguientes a él. Tus logs de depuración aparecen en la terminal; la salida del Inspector aparece en el navegador — separación limpia de diagnósticos y pruebas interactivas.',
      hint: 'Añade `"debug": "tsx server.ts --debug"` a los scripts de `package.json` para mayor comodidad.',
    },
  },
  nl: {
    // ── World 1: Boot Camp ────────────────────────────────────────────────
    'w1-s01-check-node': {
      title: 'Node.js-versie controleren',
      description:
        'MCP-servers vereisen Node.js 20 of later. Verifieer je geïnstalleerde versie voordat je verdergaat.',
      explanation:
        'Je zou `v20.x.x` of hoger moeten zien. Als je een oudere versie ziet — of "command not found" — download dan de LTS-release van https://nodejs.org voordat je verdergaat.',
      hint: 'Op macOS kun je ook `nvm` of `fnm` gebruiken om Node-versies te installeren en te wisselen zonder je systeeminstallatie te raken.',
    },
    'w1-s02-check-npm': {
      title: 'npm-versie controleren',
      description:
        'npm is de pakketbeheerder die wordt meegeleverd met Node.js. Versie 10 of later wordt aanbevolen voor workspace-ondersteuning.',
      explanation:
        'npm 10+ wordt geleverd met Node 20. Als je moet upgraden: `npm install -g npm@latest`.',
      hint: 'Voer `npm --version` uit na het upgraden om de nieuwe versie te bevestigen.',
    },
    'w1-s03-check-git': {
      title: 'Controleer of git is geïnstalleerd',
      description:
        'Je hebt git nodig om je server te versiebeheren en later naar GitHub te pushen.',
      explanation:
        'Elke versie ≥ 2.30 is prima. Als git ontbreekt, installeer het dan van https://git-scm.com.',
      hint: 'macOS wordt geleverd met een stub die je vraagt de Xcode Command Line Tools te installeren — voer `xcode-select --install` uit voor echte git.',
    },
    'w1-s04-install-vscode': {
      title: 'Je editor openen',
      description:
        'Open VS Code (of je favoriete editor) en installeer de **TypeScript**-taalextensie als die er nog niet is. Goede tooling bespaart je uren tijdens de ontwikkeling.',
      explanation:
        'De officiële Microsoft TypeScript-extensie geeft je IntelliSense, typecontrole en ga-naar-definitie in je hele codebase.',
      hint: 'Zoek naar `ms-vscode.vscode-typescript-next` in de Extensions-zijbalk voor de laatste nightly build.',
    },
    'w1-s05-hello-node': {
      title: 'Je eerste Node-script uitvoeren',
      description:
        'Bevestig voordat je MCP-code schrijft dat Node.js een script op je machine kan uitvoeren. Maak een bestand `hello.js` aan met `console.log("Boot camp complete!")` en voer het uit.',
      explanation:
        'Als je `Boot camp complete!` in de terminal ziet, is je omgeving klaar. Verwijder `hello.js` — het was slechts een controle.',
      hint: 'Gebruik op Windows de Opdrachtprompt of PowerShell — beide werken prima met Node.',
    },
    // ── World 2: Project Setup ────────────────────────────────────────────
    'w2-s01-mkdir': {
      title: 'Projectmap aanmaken',
      description:
        'Kies een naam voor je MCP-server en maak de hoofdmap aan. Houd het kleingeschreven en met koppeltekens.',
      explanation:
        'Alle projectbestanden — `package.json`, TypeScript-bronnen en configuratiebestanden — leven in deze map.',
      hint: 'Vervang `my-mcp-server` door elke naam die je wilt. Wees consistent gedurende de hele quest.',
    },
    'w2-s02-npm-init': {
      title: 'npm-pakket initialiseren',
      description:
        'Maak van de map een npm-pakket. De `-y`-vlag accepteert alle standaardwaarden zodat je ze in de volgende stap kunt aanpassen.',
      explanation:
        'Er wordt een `package.json`-bestand aangemaakt met verstandige standaardwaarden. Het bijhoudt de naam, versie, scripts en afhankelijkheden van je project.',
      hint: 'Open `package.json` in je editor om te zien wat er is gegenereerd.',
    },
    'w2-s03-configure-esm': {
      title: 'ES-modules inschakelen',
      description:
        'Voeg `"type": "module"` toe aan `package.json` zodat Node.js `.js`-bestanden behandelt als ES-modules. De MCP SDK vereist dit.',
      explanation:
        'Zonder `"type": "module"` gebruikt Node standaard CommonJS en zullen de `import`-statements van de SDK mislukken tijdens runtime.',
      hint: 'Sla `package.json` op na het bewerken. Je kunt de wijziging verifiëren met `cat package.json`.',
    },
    'w2-s04-install-sdk': {
      title: 'De MCP SDK installeren',
      description:
        'Het officiële `@modelcontextprotocol/sdk`-pakket is de enige runtime-afhankelijkheid die je nodig hebt om een conforme MCP-server te bouwen.',
      explanation:
        'De SDK staat nu onder `"dependencies"` in `package.json`. Het biedt `McpServer`, alle transportklassen en de typedefinities voor het MCP-protocol.',
      hint: 'Het pakket heeft de scope `@modelcontextprotocol` — voeg de volledige scope toe bij de installatie.',
    },
    'w2-s05-install-zod': {
      title: 'Zod installeren',
      description:
        'Zod wordt gebruikt om de invoerschema\'s voor je tools te definiëren en te valideren. Het is de standaard schemabibliotheek in het MCP TypeScript-ecosysteem.',
      explanation:
        'Zod-schema\'s worden geconverteerd naar JSON Schema tijdens de MCP-capabilities-handshake. Clients gebruiken deze schema\'s om te weten welke argumenten elke tool accepteert.',
      hint: 'Zod v3 is de huidige hoofdversie — zorg dat `package.json` `"zod": "^3.x.x"` toont.',
    },
    'w2-s06-install-tsx': {
      title: 'tsx en TypeScript installeren',
      description:
        'Tijdens de ontwikkeling voer je je server direct uit met `tsx` — geen compilatiestap nodig.',
      explanation:
        '`tsx` omhult Node.js met on-the-fly TypeScript-compilatie. De `-D`-vlag plaatst beide pakketten in `devDependencies` — ze zijn niet nodig in productie.',
      hint: 'Verifieer met `npx tsx --version`. Je zou een versienummer moeten zien, geen foutmelding.',
    },
    'w2-s07-tsconfig': {
      title: 'tsconfig.json aanmaken',
      description:
        'Voeg een TypeScript-configuratiebestand toe aan de projectroot dat gericht is op moderne Node.js en strikte typecontrole inschakelt.',
      explanation:
        '`"module": "NodeNext"` is vereist wanneer `package.json` `"type": "module"` heeft. Samen zorgen ze ervoor dat TypeScript en Node.js het eens zijn over het oplossen van imports.',
      hint: 'Als je `Cannot find module`-fouten ziet, controleer dan of `moduleResolution` `NodeNext` is.',
    },
    // ── World 3: Server Creation ──────────────────────────────────────────
    'w3-s01-create-file': {
      title: 'server.ts aanmaken',
      description:
        'Maak het hoofdinvoerpunt voor je MCP-server aan. Dit bestand bevat alle serverlogica.',
      explanation:
        'Op Windows kun je het bestand in VS Code maken door op **Nieuw bestand** te klikken in het Verkenner-paneel, of `echo "" > server.ts` uitvoeren in PowerShell.',
      hint: 'Houd `server.ts` in de root van je project, naast `package.json`.',
    },
    'w3-s02-imports': {
      title: 'Imports toevoegen',
      description:
        'Open `server.ts` en voeg de twee imports toe die nodig zijn voor elke MCP-server: `McpServer` en `StdioServerTransport`.',
      explanation:
        'Let op de `.js`-extensie in de importpaden — dit is vereist voor Node.js ESM-resolutie ook al zijn de bronbestanden `.ts`.',
      hint: 'TypeScript met `moduleResolution: NodeNext` verwacht expliciete `.js`-extensies in importpaden.',
    },
    'w3-s03-create-instance': {
      title: 'De serverinstantie aanmaken',
      description:
        'Maak een instantie van `McpServer` met een naam en versie. Deze worden naar clients verzonden tijdens de capabilities-handshake.',
      explanation:
        'De velden `name` en `version` identificeren je server bij clients zoals Claude Desktop. Kies een duidelijke kebab-case naam.',
      hint: 'De versietekenreeks moet semantische versiebeheer volgen (MAJOR.MINOR.PATCH).',
    },
    'w3-s04-connect-transport': {
      title: 'STDIO-transport verbinden',
      description:
        'Maak een `StdioServerTransport` aan en verbind het met de server. Deze ene `await` is alles wat nodig is om te beginnen met luisteren.',
      explanation:
        '`StdioServerTransport` verbindt de server met de `stdin`/`stdout` van het proces. De aanroep `await server.connect(transport)` blokkeert totdat de client verbreekt.',
      hint: 'Het bestand moet top-level `await` gebruiken, wat is toegestaan in ES-modules. Daarom was `"type": "module"` vereist.',
    },
    'w3-s05-run-server': {
      title: 'De server starten met tsx',
      description:
        'Start je server. Het zal starten en stilzwijgend wachten tot een client verbinding maakt via STDIO.',
      explanation:
        'Er wordt geen uitvoer verwacht — de server luistert op stdin/stdout naar JSON-RPC-berichten. Druk op `Ctrl+C` om te stoppen. In de volgende wereld verbind je een inspector ermee.',
      hint: 'Als je een TypeScript-fout ziet, controleer dan of je imports `.js`-extensies gebruiken en of `tsconfig.json` `"module": "NodeNext"` heeft.',
    },
    'w3-s06-add-start-script': {
      title: 'npm run-scripts toevoegen',
      description:
        'Werk `package.json` bij zodat je je server kunt starten met `npm run dev` in plaats van elke keer het volledige `tsx`-commando te typen.',
      explanation:
        '`npm run dev` → ontwikkeling (tsx, geen compilatiestap). `npm run build` → compileert TypeScript naar `dist/`. `npm start` → voert de gecompileerde uitvoer uit in productie.',
      hint: 'Test het: `npm run dev` zou de server moeten starten zoals `npx tsx server.ts` deed.',
    },
    // ── World 4: Tool Creation ────────────────────────────────────────────
    'w4-s01-echo-tool': {
      title: 'Een echo-tool registreren',
      description:
        'Voeg je eerste tool toe aan de server. `server.tool()` neemt een naam, een beschrijving, een Zod-schema en een asynchrone handler die een `content`-array retourneert.',
      explanation:
        'De beschrijvingsstring wordt naar de client verzonden tijdens de capabilities-handshake. Goede beschrijvingen helpen de LLM beslissen wanneer en hoe je tool aan te roepen.',
      hint: 'Plaats deze code **voor** de regel `await server.connect(transport)`.',
    },
    'w4-s02-add-tool': {
      title: 'Een optelgereedschap registreren',
      description:
        'Registreer een tool die twee getallen optelt. Dit demonstreert schema\'s met meerdere parameters van het type getal.',
      explanation:
        'Zod dwingt invoer af en valideert deze voordat je handler wordt uitgevoerd. Als de client een string stuurt waar een getal wordt verwacht, retourneert MCP automatisch een validatiefout.',
      hint: 'Je kunt Zod-validators ketenen: `z.number().min(0).max(100)` beperkt invoer tot 0–100.',
    },
    'w4-s03-optional-params': {
      title: 'Een tool met optionele parameters toevoegen',
      description:
        'Registreer een `greet`-tool waarbij de taalparameter optioneel is en standaard Engels is.',
      explanation:
        'Optionele parameters met `.default()` worden opgenomen in het JSON Schema als niet-verplicht. De LLM kan ze weglaten en je code ontvangt de standaardwaarde.',
      hint: 'Gebruik `z.enum()` wanneer de invoer één van een vaste set tekenreekswaarden moet zijn.',
    },
    'w4-s04-error-handling': {
      title: 'Fouten in tools afhandelen',
      description:
        'Tools moeten fouten opvangen en ze teruggeven als MCP-foutrespons in plaats van uitzonderingen de server te laten laten crashen.',
      explanation:
        'Het gooien van `McpError` stuurt een gestructureerde JSON-RPC-foutrespons naar de client. De `ErrorCode`-enum bevat standaardcodes: `InvalidParams`, `InternalError` en `MethodNotFound`.',
      hint: 'Gooi nooit een gewone `Error` vanuit een tool-handler — gebruik `McpError` voor leesbare, gestructureerde fouten.',
    },
    'w4-s05-async-tool': {
      title: 'Een asynchrone tool met echte I/O maken',
      description:
        'Registreer een `fetch-url`-tool die een echte HTTP-aanvraag doet en de statuscode retourneert — waarmee asynchrone tools met echte I/O worden gedemonstreerd.',
      explanation:
        '`fetch` is ingebouwd in Node.js 18+. `AbortSignal.timeout(5000)` zorgt ervoor dat een trage server je MCP-server niet voor onbepaalde tijd blokkeert.',
      hint: 'Test deze tool met `https://example.com` — het zou HTTP 200 moeten retourneren.',
    },
    // ── World 5: Inspector ────────────────────────────────────────────────
    'w5-s01-install-inspector': {
      title: 'MCP Inspector installeren',
      description:
        'De officiële MCP Inspector is een browsergebaseerde GUI voor het interactief testen van je server. Gebruik `npx` om het te starten zonder globale installatie.',
      explanation:
        'De Inspector verbindt met je server via STDIO, voert de capabilities-handshake uit, geeft alle beschikbare tools en resources weer en laat je ze aanroepen zonder clientcode te schrijven.',
      hint: 'Je kunt de globale installatie overslaan en `npx @modelcontextprotocol/inspector` direct gebruiken als je liever niet globaal installeert.',
    },
    'w5-s02-launch-inspector': {
      title: 'De Inspector starten',
      description:
        'Start de Inspector en wijs hem naar je server. Er wordt automatisch een browsertabblad geopend.',
      explanation:
        'De Inspector spawnt je server als een kindproces en verbindt via STDIO. Het opent een web-UI op `http://localhost:5173`. Je zou de naam en versie van je server in de koptekst moeten zien.',
      hint: 'Zorg dat je server **niet** al actief is in een andere terminal — de Inspector start hem voor je.',
    },
    'w5-s03-explore-ui': {
      title: 'De Inspector-interface verkennen',
      description:
        'Maak je vertrouwd met de drie hoofdtabbladen: **Tools**, **Resources** en **Prompts**. Elk toont de mogelijkheden die je server heeft geregistreerd.',
      explanation:
        'Het tabblad Tools toont elke tool die is geregistreerd met `server.tool()` samen met zijn JSON Schema. Het tabblad Resources toont items die zijn geregistreerd met `server.resource()`. Het tabblad Prompts toont promptsjablonen.',
      hint: 'Als een tabblad leeg is, heeft je server nog geen mogelijkheden van dat type geregistreerd — dat is verwacht in dit stadium.',
    },
    'w5-s04-call-echo': {
      title: 'De echo-tool aanroepen',
      description:
        'Klik in het tabblad **Tools** van de Inspector op `echo`, typ een bericht in het veld `message` en druk op **Run Tool**. Verifieer dat de respons verschijnt in het uitvoerpaneel.',
      explanation:
        'De Inspector toont je het ruwe JSON-RPC-verzoek dat het stuurde en de respons die je server teruggaf — precies wat Claude Desktop zou sturen bij het aanroepen van je tool.',
      hint: 'Klik op **View raw** in het responspaneel om de volledige JSON-RPC-envelop te zien.',
    },
    'w5-s05-inspect-schema': {
      title: 'Een toolschema inspecteren',
      description:
        'Klik op een toolnaam (zonder hem uit te voeren) om het schemapaneel uit te vouwen. Bekijk het JSON Schema dat is gegenereerd uit je Zod-definitie.',
      explanation:
        'Dit JSON Schema wordt naar de LLM gestuurd tijdens de capabilities-handshake. Goed geannoteerde schema\'s (met `.describe()`) verbeteren aanzienlijk het vermogen van de LLM om je tools correct te gebruiken.',
      hint: 'Als een veld geen `.describe()`-annotatie heeft, ontvangt de LLM geen begeleiding. Annoteer altijd verplichte velden.',
    },
    'w5-s06-test-error': {
      title: 'Een foutrespons uitlokken',
      description:
        'Roep de `divide`-tool aan met `denominator: 0`. Observeer de gestructureerde foutrespons die de Inspector weergeeft.',
      explanation:
        'Een correcte MCP-foutrespons is een JSON-RPC-foutobject met een numerieke `code` en een leesbaar `message`. Clients zoals Claude Desktop tonen deze berichten aan de gebruiker.',
      hint: 'Vergelijk de foutrespons met een succesvolle respons — merk op dat de sleutel `"error"` de sleutel `"result"` vervangt in de JSON-envelop.',
    },
    // ── World 6: JSON-RPC ─────────────────────────────────────────────────
    'w6-s01-request-format': {
      title: 'Een JSON-RPC-verzoek begrijpen',
      description:
        'Elk bericht dat een MCP-client naar je server stuurt, is een JSON-RPC 2.0-verzoek. Bestudeer het formaat hieronder.',
      explanation:
        '`jsonrpc` moet altijd `"2.0"` zijn. `id` is een unieke waarde die wordt gebruikt om de respons te koppelen. `method` is de naam van de MCP-methode. `params` bevat de argumenten.',
      hint: 'Je schrijft dit JSON nooit handmatig — de SDK en transportlaag doen het voor je. Maar het formaat kennen helpt bij het debuggen van ruwe logboeken.',
    },
    'w6-s02-response-format': {
      title: 'Een JSON-RPC-respons begrijpen',
      description:
        'Wanneer je tool-handler retourneert, omhult de SDK de uitvoer in een JSON-RPC-succesrespons en stuurt die terug naar de client.',
      explanation:
        'Het `id` in de respons komt overeen met het `id` in het verzoek — zo weet de client bij welk verzoek deze respons hoort. Het veld `result` bevat wat je handler retourneerde.',
      hint: 'De `content`-array kan meerdere items van verschillende typen bevatten: `text`, `image` of `resource`.',
    },
    'w6-s03-error-response': {
      title: 'Een JSON-RPC-foutrespons begrijpen',
      description:
        'Wanneer een tool een `McpError` gooit, serialiseert de SDK het als een JSON-RPC-foutrespons. Bestudeer de vorm.',
      explanation:
        'Standaard JSON-RPC-foutcodes: `-32700` parsefout, `-32600` ongeldig verzoek, `-32601` methode niet gevonden, `-32602` ongeldige params, `-32603` interne fout. MCP voegt aangepaste codes toe onder `-32000`.',
      hint: '`McpError` koppelt `ErrorCode.InvalidParams` → `-32602`, `ErrorCode.InternalError` → `-32603`.',
    },
    'w6-s04-notification': {
      title: 'Meldingen begrijpen',
      description:
        'Een melding is een JSON-RPC-bericht **zonder** `id`-veld. Het is vuur-en-vergeet — de ontvanger stuurt nooit een respons.',
      explanation:
        'MCP gebruikt meldingen voor gebeurtenissen zoals `notifications/tools/list_changed` (je server registreerde of verwijderde een tool). De client luistert en werkt zijn capabilities-cache dienovereenkomstig bij.',
      hint: 'Je kunt meldingen uitzenden met `server.notification()`. Ze zijn handig voor het streamen van voortgangsupdates zonder de respons te blokkeren.',
    },
    'w6-s05-handshake': {
      title: 'De capabilities-handshake begrijpen',
      description:
        'Wanneer een client voor het eerst verbinding maakt met je server, wisselen beide kanten een `initialize`-verzoek/respons uit om het protocolversie en capabilities overeen te komen.',
      explanation:
        'De handshake onderhandelt over de protocolversie en adverteert de capabilities van elke kant. De MCP SDK verwerkt dit automatisch — je hoeft alleen je servernaam en versie op te geven aan `McpServer`.',
      hint: 'Je kunt de volledige handshake-JSON zien in het tabblad **Messages** van de Inspector.',
    },
    // ── World 7: Testing ──────────────────────────────────────────────────
    'w7-s01-install-vitest': {
      title: 'Vitest installeren',
      description:
        'Voeg Vitest toe als dev-afhankelijkheid. Het werkt native met TypeScript en ES-modules — geen extra configuratie nodig.',
      explanation:
        'Vitest is compatibel met de Jest API (`.test.ts`-bestanden, `describe`, `it`, `expect`) zodat eventuele Jest-kennis direct overdraagbaar is.',
      hint: 'Voeg `"test": "vitest run"` toe aan de `"scripts"`-sectie van `package.json` om `npm test` in te schakelen.',
    },
    'w7-s02-add-test-script': {
      title: 'Testscript toevoegen aan package.json',
      description:
        'Registreer de scripts `test` en `test:watch` zodat `npm test` je suite uitvoert en afsluit.',
      explanation:
        '`vitest run` voert één keer uit en sluit af — perfect voor CI. `vitest` (zonder `run`) start de watch-modus, waarbij tests opnieuw worden uitgevoerd terwijl je bestanden bewerkt.',
      hint: 'Gebruik `npm run test:watch` voor ontwikkeling en `npm test` in CI.',
    },
    'w7-s03-extract-handlers': {
      title: 'Handlers extraheren voor testbaarheid',
      description:
        'Refactor je toollogica naar pure functies die onafhankelijk van de server kunnen worden getest. Maak een bestand `tools.ts` aan.',
      explanation:
        'Pure functies zijn eenvoudig te testen omdat ze geen neveneffecten hebben. In `server.ts`, importeer ze en geef ze door als de tool-handler: `async (args) => echoHandler(args)`.',
      hint: 'Houd `server.ts` zo dun mogelijk — alleen imports, toolregistraties en de `connect()`-aanroep.',
    },
    'w7-s04-first-test': {
      title: 'Je eerste test schrijven',
      description:
        'Maak `tools.test.ts` aan en schrijf tests voor de `echoHandler`-functie.',
      explanation:
        'Elk `it()`-blok is één testgeval. `expect().toBe()` controleert strikte gelijkheid. Als de handler de verkeerde waarde retourneert, mislukt de test met een duidelijk verschil.',
      hint: 'Voer `npm test` uit om te starten. Je zou twee geslaagde tests moeten zien.',
    },
    'w7-s05-test-errors': {
      title: 'Foutgevallen testen',
      description:
        'Voeg tests toe die verifiëren dat je tools `McpError` gooien met de juiste code bij ongeldige invoer.',
      explanation:
        'Het testen van foutpaden is net zo belangrijk als het testen van het gelukkige pad. Het verifiëren van de exacte `ErrorCode` zorgt ervoor dat clients het juiste gestructureerde signaal ontvangen.',
      hint: 'Gebruik `.toThrow(McpError)` om te bevestigen dat een specifieke foutklasse werd gegooien.',
    },
    'w7-s06-run-tests': {
      title: 'De volledige testsuite uitvoeren',
      description:
        'Voer de volledige testsuite uit en bevestig dat alle tests slagen.',
      explanation:
        'Alle tests zouden moeten slagen. Een groene testsuite is je veiligheidsnet — elke toekomstige wijziging die het gedrag van een tool verbreekt, zal onmiddellijk als een mislukte test verschijnen.',
      hint: 'Als een test mislukt, lees het verschil zorgvuldig: de linkerkant is "ontvangen", de rechterkant is "verwacht".',
    },
    // ── World 8: Debugging ────────────────────────────────────────────────
    'w8-s01-try-catch': {
      title: 'I/O-handlers omhullen met try/catch',
      description:
        'Onverwachte runtime-fouten in een tool-handler laten de server crashen tenzij ze worden opgevangen. Omhul alle I/O-zware handlers met `try/catch`.',
      explanation:
        'Node.js-bestandssysteemfouten stellen een `code`-eigenschap bloot (bijv. `ENOENT`, `EACCES`). Wijs deze toe aan de juiste `ErrorCode`-waarden zodat de client een zinvolle fout ontvangt in plaats van een generieke crash.',
      hint: 'Cast de opgevangen fout naar `NodeJS.ErrnoException` om de `.code`-eigenschap met typeveiligheid te benaderen.',
    },
    'w8-s02-input-validation': {
      title: 'Defensieve invoervalidatie toevoegen',
      description:
        'Voeg zelfs met Zod-schema\'s runtime-bewakers toe voor beperkingen die Zod niet kan uitdrukken — zoals ervoor zorgen dat een pad binnen een sandbox-directory blijft.',
      explanation:
        'Padtraversal (`../../etc/passwd`) is een klassieke kwetsbaarheid wanneer tools bestandspaden verwerken. Altijd oplossen en verifiëren dat het resultaat nog steeds begint met de toegestane root.',
      hint: 'Het afsluitende `path.sep` voorkomt matching van een broederdirectory waarvan de naam begint met hetzelfde voorvoegsel.',
    },
    'w8-s03-stderr-logging': {
      title: 'Loggen naar stderr, niet stdout',
      description:
        'Alle diagnostische uitvoer van je server **moet** naar `stderr` gaan. Schrijven naar `stdout` beschadigt de JSON-RPC-stroom die de client leest.',
      explanation:
        'STDIO-transport gebruikt stdout als de verbinding voor JSON-RPC-berichten. Elke tekst die erdoorheen gemengd wordt, verbreekt JSON-framing en de client ontvangt een parsefout of laat berichten stil vallen.',
      hint: 'Een eenvoudige conventie: gebruik `console.error` voor alles. Het `[server-name]`-voorvoegsel maakt logregels eenvoudig te doorzoeken met grep.',
    },
    'w8-s04-debug-flag': {
      title: 'Een --debug-vlag toevoegen',
      description:
        'Beheer uitgebreide logging achter een `--debug` CLI-vlag zodat productie-implementaties stil blijven terwijl ontwikkelbuilds uitgebreid zijn.',
      explanation:
        'Voer `npx tsx server.ts --debug` uit om uitgebreide uitvoer tijdens ontwikkeling in te schakelen.',
      hint: 'Je kunt ook een omgevingsvariabele gebruiken: `const DEBUG = process.env.MCP_DEBUG === "1"`.',
    },
    'w8-s05-common-errors': {
      title: 'Veelvoorkomende fouten herkennen',
      description:
        'Bekijk de meest voorkomende MCP-serverfouten en hoe je ze kunt oplossen.',
      explanation:
        'De meest voorkomende oorzaak van "server disconnected" in elke MCP-client is een `console.log` die per ongeluk naar stdout schrijft. Gebruik altijd `console.error` voor alle diagnostische uitvoer.',
      hint: 'Voeg `console.error("[server] ready")` toe als de allerlaatste regel van je server. Als het wordt afgedrukt, is de server schoon gestart.',
    },
    'w8-s06-run-with-debug': {
      title: 'De server uitvoeren in debugmodus',
      description:
        'Start je server met de `--debug`-vlag en verbind de Inspector. Observeer de debuglogregels in je terminal terwijl je met tools in de browser interacteert.',
      explanation:
        'De Inspector spawnt de server en geeft alle volgende argumenten door. Je debuglogs verschijnen in de terminal; Inspector-uitvoer verschijnt in de browser — schone scheiding van diagnostiek en interactief testen.',
      hint: 'Voeg `"debug": "tsx server.ts --debug"` toe aan `package.json`-scripts voor gemak.',
    },
  },
}

// ── Region Translations ──────────────────────────────────────────────────────

const REGION_TRANSLATIONS: Record<Language, Record<string, RegionOverride>> = {
  en: {},
  es: {
    'region-01-prerequisites': { title: '🔍 Verificación de requisitos' },
    'region-02-dev-environment': { title: '🛠️ Entorno de desarrollo' },
    'region-03-init': { title: '📋 Inicializar proyecto' },
    'region-04-dependencies': { title: '📦 Instalar dependencias' },
    'region-05-first-server': { title: '⚡ Tu primer servidor' },
    'region-06-run': { title: '🚀 Ejecutarlo' },
    'region-07-basic-tools': { title: '🔩 Herramientas básicas' },
    'region-08-advanced-tools': { title: '⚡ Herramientas avanzadas' },
    'region-09-inspector-setup': { title: '🛠️ Configurar el Inspector' },
    'region-10-inspect-tools': { title: '🧪 Inspeccionar y probar' },
    'region-11-protocol-basics': { title: '📋 Conceptos básicos del protocolo' },
    'region-12-notifications': { title: '🔔 Notificaciones y ciclo de vida' },
    'region-13-test-setup': { title: '⚙️ Configurar pruebas' },
    'region-14-write-tests': { title: '✅ Escribir pruebas' },
    'region-15-error-handling': { title: '🛡️ Manejo robusto de errores' },
    'region-16-logging': { title: '🔦 Registros y diagnósticos' },
  },
  nl: {
    'region-01-prerequisites': { title: '🔍 Vereistencontrole' },
    'region-02-dev-environment': { title: '🛠️ Ontwikkelomgeving' },
    'region-03-init': { title: '📋 Project initialiseren' },
    'region-04-dependencies': { title: '📦 Afhankelijkheden installeren' },
    'region-05-first-server': { title: '⚡ Je eerste server' },
    'region-06-run': { title: '🚀 Uitvoeren' },
    'region-07-basic-tools': { title: '🔩 Basistools' },
    'region-08-advanced-tools': { title: '⚡ Geavanceerde tools' },
    'region-09-inspector-setup': { title: '🛠️ Inspector instellen' },
    'region-10-inspect-tools': { title: '🧪 Inspecteren en testen' },
    'region-11-protocol-basics': { title: '📋 Protocolbasisprincipes' },
    'region-12-notifications': { title: '🔔 Meldingen en levenscyclus' },
    'region-13-test-setup': { title: '⚙️ Testconfiguratie' },
    'region-14-write-tests': { title: '✅ Tests schrijven' },
    'region-15-error-handling': { title: '🛡️ Robuuste foutafhandeling' },
    'region-16-logging': { title: '🔦 Loggen en diagnostiek' },
  },
}

// ── World Translations ───────────────────────────────────────────────────────

const WORLD_TRANSLATIONS: Record<Language, Record<string, WorldOverride>> = {
  en: {},
  es: {
    'world-01-boot-camp': { title: '🏕️ Campamento base' },
    'world-02-project-setup': { title: '📁 Configuración del proyecto' },
    'world-03-server-creation': { title: '🖥️ Creación del servidor' },
    'world-04-tool-creation': { title: '🔧 Creación de herramientas' },
    'world-05-inspector': { title: '🔍 Inspector' },
    'world-06-json-rpc': { title: '📨 JSON-RPC' },
    'world-07-testing': { title: '🧪 Pruebas' },
    'world-08-debugging': { title: '🐛 Depuración' },
  },
  nl: {
    'world-01-boot-camp': { title: '🏕️ Basiskamp' },
    'world-02-project-setup': { title: '📁 Projectconfiguratie' },
    'world-03-server-creation': { title: '🖥️ Serveraanmaak' },
    'world-04-tool-creation': { title: '🔧 Toolaanmaak' },
    'world-05-inspector': { title: '🔍 Inspector' },
    'world-06-json-rpc': { title: '📨 JSON-RPC' },
    'world-07-testing': { title: '🧪 Testen' },
    'world-08-debugging': { title: '🐛 Debuggen' },
  },
}

// ── Resolver functions ───────────────────────────────────────────────────────

/**
 * Returns a copy of `step` with translated fields merged in for the given
 * language. Fields without a translation keep their English originals.
 */
export function resolveStep(step: LessonStep, language: Language): LessonStep {
  if (language === 'en') return step
  const override = STEP_TRANSLATIONS[language]?.[step.id]
  return override ? { ...step, ...override } : step
}

/**
 * Returns a copy of `region` with a translated title (and its steps resolved).
 */
export function resolveRegion(region: Region, language: Language): Region {
  if (language === 'en') return region
  const override = REGION_TRANSLATIONS[language]?.[region.id]
  const resolvedSteps = region.steps.map(s => resolveStep(s, language))
  return override
    ? { ...region, ...override, steps: resolvedSteps }
    : { ...region, steps: resolvedSteps }
}

/**
 * Returns a copy of `world` with a translated title (and its regions resolved).
 */
export function resolveWorld(world: World, language: Language): World {
  if (language === 'en') return world
  const override = WORLD_TRANSLATIONS[language]?.[world.id]
  const resolvedRegions = world.regions.map(r => resolveRegion(r, language))
  return override
    ? { ...world, ...override, regions: resolvedRegions }
    : { ...world, regions: resolvedRegions }
}
