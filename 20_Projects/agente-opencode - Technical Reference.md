---
created: 2026-05-25 18:30
tags:
  - type/context
project: agente-opencode
context: Technical Reference
origin: "[[MOC_agente-opencode]]"
---
# Technical Reference
---
## Descripción

Referencia técnica integral del proyecto **agente-opencode**: la configuración, arquitectura y componentes del asistente de codigo AI OpenCode (v1.15.10) sobre Bun runtime / Node.js, instalado en `/home/agentuser/agente_ia`.

### OpenCode Platform

- **Version:** OpenCode v1.15.10
- **Runtime:** Bun / Node.js
- **Proposito:** Plataforma orquestadora de agentes de IA para asistencia en codigo
- **Base path:** `/home/agentuser/agente_ia`

### Plugins Activos

Tres plugins registrados en `.opencode/opencode.json`:

1. **Graphify** (`.opencode/plugins/graphify.js`): Plugin de grafo de conocimiento para visualizacion de codebase, deteccion de comunidades, y consultas BFS/DFS.
2. **Superpowers** (`/home/agentuser/.config/opencode/superpowers`): Metodologia de workflow que incluye brainstorming, writing-plans, TDD, subagent-driven-development, systematic-debugging, verification-before-completion, y otros 7 skills de proceso.
3. **Oh-My-OpenAgent** (`.opencode/skills/oh-my-openagent/dist/index.js`): Plugin principal v4.4.0 (npm: oh-my-opencode) con 11 agentes, 54 lifecycle hooks, 20-39 tools y sistema MCP de 3 niveles.

### Oh-My-OpenAgent v4.4.0

**Agentes:**
- **Sisyphus** — Orquestador principal, coordina la ejecucion de tareas multi-paso
- **Hephaestus** — Trabajador profundo para implementaciones complejas
- **Prometheus** — Planificador, genera planes de implementacion
- **Oracle** — Arquitecto / consultor tecnico, revisa codigo y diseno
- **Librarian** — Investigador, busca informacion en la web y documentacion
- **Explore** — Busqueda en codebase local
- **Atlas** — Orquestador de workflows multi-agente
- **Metis** — Consultor de planes, evalua viabilidad
- **Momus** — Revisor de planes, critica y sugiere mejoras
- **Multimodal-Looker** — Analisis multimedia (imagenes, PDFs, diagramas)
- **Sisyphus-Junior** — Ejecutor de tareas enfocado

**Categorias de agentes:** visual-engineering, artistry, ultrabrain, deep, quick, unspecified-low, unspecified-high, writing — cada una optimizada para dominios especificos.

### Architecture & Configuration

- **Config principal:** `.opencode/opencode.json` con 3 plugins registrados
- **Modelo unico:** Todos los agentes configurados con `opencode/big-pickle` (OpenCode free tier, GLM 4.6)
- **Skills system:** 5 built-in + 37 skills instalados por el usuario, cargados via la herramienta `skill()`
- **Agency-Agents:** 186 agentes especializados disponibles via @mention (frontend-developer, backend-architect, security-engineer, database-administrator, devops-engineer, entre otros)

### LSP (Language Server Protocol)

- **Servidor principal:** typescript-language-server v5.3.0, instalado globalmente via `bun add -g`
- **Config:** `.opencode/lsp.json` mapea `.ts`, `.tsx`, `.js`, `.jsx`
- **7 herramientas:** status, diagnostics, goto_definition, find_references, symbols, prepare_rename, rename
- **Otros servidores:** Rust analyzer tambien instalado
- **Estado:** 2 LSP servers instalados activamente (typescript + rust), 38 configurados por defecto

### MCPs (Model Context Protocol)

Sistema de 3 niveles:

1. **Built-in MCPs:** websearch (Exa, sin API key), context7 (documentacion oficial), grep_app (busqueda en GitHub)
2. **Claude Code .mcp.json:** Nivel proyecto + nivel usuario, con expansion de variables `${VAR}`
3. **Skill-embedded MCPs:** Por sesion, con autenticacion OAuth 2.0 + PKCE + DCR

### Hooks System

54 lifecycle hooks en 5 tiers (Team Mode OFF):

- **Session (24 hooks):** Configuracion y ciclo de vida de sesiones
- **ToolGuard (16 hooks):** Validacion pre/post ejecucion de herramientas
- **Transform (5 hooks):** Inyeccion de contexto y validacion de mensajes
- **Continuation (7 hooks):** Persistencia entre sesiones y compactacion
- **Skill (2 hooks):** Gestion de carga y descarga de skills

Con Team Mode activado serian 61 hooks totales (actualmente OFF).

### Skills Instalados

**Built-in (5):** playwright, frontend-ui-ux, git-master, review-work, ai-slop-remover

**Instalados (5):** security-audit, scrapling, second-brain, persistent-learning, graphify

**Superpowers (14):** brainstorming, writing-plans, subagent-driven-development, test-driven-development, systematic-debugging, verification-before-completion, dispatching-parallel-agents, requesting-code-review, receiving-code-review, finishing-a-development-branch, using-git-worktrees, writing-skills, executing-plans, using-superpowers

### CLI & Commands

- **CLI:** `bunx oh-my-opencode doctor`, `bunx oh-my-opencode install`, `bunx oh-my-opencode run`
- **Comandos incorporados:** `/start-work`, `/init-deep`, `/refactor`, `/playwright`, `/git-master`, `/ralph-loop`, `/ulw-loop`, `/hyperplan`, `/handoff`, `/stop-continuation`, `/audit-install`, `/remove-ai-slops`, `/cancel-ralph`

### Infrastructure Details

- **Ollama:** Instalado en `$HOME/.local/bin/ollama` (v0.24.0) pero inactivo por RAM limitada (3.3GiB total, ~219MiB disponible)
- **AirLLM:** v2.11.0 instalado como alternativa local con CPU-only torch (2.12.0+cpu). Soporta Llama2, Mistral, QWen, ChatGLM, Baichuan, InternLM via layer-by-layer loading
- **Second Brain:** Vault Obsidian en `segundo cerebro/` con metodologia PARA + Zettelkasten + MOC, 4 carpetas principales, plugins Dataview/Templater/Buttons/MetaBind

---
## Detalles
`button-add-detail`
```dataview
LIST WITHOUT ID
	link(file.link, detail)
FROM "20_Projects" AND #type/detail 
WHERE origin = this.file.link
```
---
##  🏔️ Contextos
`button-new-context`
```dataview
LIST WITHOUT ID
	link(file.link, context)
FROM "20_Projects" AND #type/context
WHERE origin = this.file.link
```
---
# Notas
`button-new-inbox-note`
```dataview
LIST
FROM "00_Inbox"
WHERE origin = this.file.link
```

`button-delete-note`
