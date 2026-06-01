# 🏁 Onboarding: Si nunca usaste Obsidian

Esta guía asume que agarrás el vault sin haber abierto Obsidian nunca. Cubre lo mínimo indispensable para arrancar.

---

## 1. ¿Qué es Obsidian?

Es un programa para tomar notas. Tus notas son archivos **.md** (Markdown) comunes y corrientes — no viven en una base de datos ni en la nube de nadie. Podés abrirlas con el Block de Notas, VS Code, o lo que quieras.

Un **vault** es simplemente una carpeta con archivos .md. Este vault ES esa carpeta.

## 2. Instalación

1. Andá a [obsidian.md](https://obsidian.md) y descargalo
2. Instalalo como cualquier programa
3. Abrí Obsidian
4. Te va a preguntar: "Open folder as vault" → seleccioná esta carpeta
5. Si aparece "Trust author", hacé clic en "Trust" (confianza habilitada, si no, no andan los plugins)

## 3. La interfaz en 10 segundos

```
┌─────────────────────────────────────────────────────┐
│  Panel izq.     │  Editor (centro)   │ Panel der.   │
│  ┌───────────┐  │                    │ ┌──────────┐ │
│  │ Archivos  │  │  Acá escribís      │ │ Backlinks│ │
│  │ Búsqueda  │  │                    │ │ Tags     │ │
│  │           │  │                    │ │ Grafo    │ │
│  └───────────┘  │                    │ └──────────┘ │
└─────────────────────────────────────────────────────┘
```

- **Panel izquierdo**: explorador de archivos (📁), búsqueda (🔍), y más
- **Centro**: acá se lee y escribe
- **Panel derecho**: backlinks (qué notas linkean a esta), tags, grafo
- **Esconder paneles**: `Ctrl+Shift+←/→` (Windows) o `Cmd+Shift+←/→` (Mac)

## 4. Lo único de Markdown que necesitás saber

```
# Título grande
## Título mediano
### Título chico

**negrita**     *cursiva*
- [ ] checklist sin hacer
- [x] checklist hecho
- Lista común
1. Lista numerada

[[Link a otra nota]]     ← ESTE es el más importante
```

Los links `[[así]]` son el corazón del sistema. Crean conexiones entre notas. Si la nota no existe, Obsidian te la crea al hacer clic.

## 5. Cómo se usa este vault: con botones

Este vault está diseñado para usarse con **botones**, no escribiendo comandos ni creando archivos a mano.

Vas a ver dos tipos de botones:

| Pinta | Ejemplo | Plugin |
|---|---|---|
| Fondo de color, texto, a veces un ícono | `BUTTON[btn-add-time]` | Meta Bind |
| Texto plano tipo "button-xxx" | `button-new-inbox-note` | Buttons |

**Siempre que quieras hacer algo** (crear una nota, agregar tiempo, marcar una tarea), buscá primero si hay un botón en la página. Están en los paneles de control, los MOCs, y las secciones de cada nota.

Si no hay botón, `Ctrl+P` abre la **paleta de comandos** donde podés buscar acciones de Obsidian y plugins.

## 6. Activar los plugins (OBLIGATORIO)

Este vault no funciona sin los plugins comunitarios. Hacé esto apenas abras el vault:

1. **Settings** (engranaje abajo a la izquierda, o `Ctrl+,`)
2. **Community plugins** → **Turn on** (te avisa que pueden ser inseguros — aceptá)
3. **Browse** y buscá cada uno de estos. Instalá y activá:
   - **Dataview** — consultas dinámicas, dashboards, tablas automáticas
   - **Templater** — motor de plantillas (las notas se crean con esto)
   - **Buttons** — botones para crear notas
   - **Meta Bind** — inputs interactivos, selectores, fechas
4. Volvé a Settings → **Templater** → **Template folder location**: poné `80_Templates`
5. Reiniciá Obsidian (cerrar y abrir de nuevo)

> **Si ves `dataviewjs` blocks que no se renderizan** → Dataview no está activo.
> **Si ves `BUTTON[btn-...]` sin botón** → falta Meta Bind o Buttons.
> **Si creás una nota y sale en blanco** → falta Templater o no está configurada la carpeta de templates.

## 7. Reglas de oro de ESTE vault

| Regla | Por qué |
|---|---|
| **No crees notas manualmente** | Usá los botones de las plantillas. Si creás una nota a mano, le faltan campos, tags, y conexiones. |
| **El Dashboard es tu casa** | Arrancá siempre desde `Dashboard.md`. Ahí están todos los accesos. |
| **Los tags definen el tipo, no el tema** | `#type/task` ≠ `#programación`. Los tags son para que Dataview sepa qué mostrar. |
| **No borres carpetas** | La estructura del vault es fija. Las notas se filtran por tags y origen, no por carpeta. |
| **Si no sabés qué hacer** | Abrí el Dashboard, mirá "Inbox" o "Esperando Respuesta", y seguí desde ahí. |

## 8. Atajos útiles

| Atajo | Acción |
|---|---|
| `Ctrl+P` | Paleta de comandos (cuando no hay botón) |
| `Ctrl+O` | Búsqueda rápida de archivos |
| `Ctrl+Shift+D` | Nota del día |
| `Ctrl+N` | Nueva nota (pero mejor usar botones) |
| `Ctrl+E` | Alternar vista editor/preview |
| `Ctrl+,` | Settings |
| `Ctrl+Shift+←/→` | Mostrar/esconder paneles |

## 9. Flujo de trabajo diario resumido

```
1. Abrí el Dashboard
2. "📅 Nota del Día" — anotá lo que hiciste/harás
3. Procesá el Inbox (lo que capturaste durante el día)
4. Trabajá en tareas desde el MOC del proyecto
5. Al final del día, registrá tiempo en la bitácora de cada tarea
6. Al final de la semana, "📋 Review Semanal"
```

## 10. Solución de problemas comunes

| Problema | Causa más probable |
|---|---|
| Aparece `dataviewjs` sin renderizar | Dataview desactivado |
| Botón `BUTTON[btn-...]` no anda | Meta Bind desactivado |
| Botón `button-...` no anda | Buttons desactivado |
| La nota nueva no tiene la plantilla | Templater no configurado (folder: `80_Templates`) |
| No veo la nota que creé | Revisá que estés en la vista "Files" (panel izquierdo) |
| "No puedo editar" | Obsidian se abrió en modo lectura. `Ctrl+E` o clic en el lápiz arriba a la derecha |

---

> **Una hora aprendiendo Obsidian ahorra diez horas de confusión después.**
