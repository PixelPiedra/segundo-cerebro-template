# ⚙️ Configuración de Botones

Este vault usa **dos plugins de botones** con roles separados:

| Plugin | Sintaxis | Rol |
|--------|----------|-----|
| **Meta Bind** | `` `BUTTON[btn-xxx]` `` | Acciones que ejecutan scripts (agregar tiempo, toggle, crear sub-tarea, etc.) |
| **Buttons** | `` `button-xxx` `` | Creación de notas (Nueva Área, Tarea, Zettel, etc.) y comandos (Daily Note, Review) |

**Regla**: si el ID empieza con `btn-` lo maneja Meta Bind; si empieza con `button-` lo maneja Buttons.

---

```button
name ➕ Nueva Área
type note(25_Areas/MOC_<% (window._origenNota = app.workspace.getActiveFile()?.basename, tp.system.prompt("¿Qué área es esta?")) %>) template
action T_MOC_Area
templater true
```
^button-new-area

```button
name 📝 Nota Rápida
type note(00_Inbox/<% (window._origenNota = app.workspace.getActiveFile()?.basename, tp.date.now("YYYY-MM-DD_HH-mm_") ) %><% tp.system.prompt("¿De qué trata esta nota?") %>) template
action T_Create_Inbox_Note
templater true
```
^button-new-inbox-note

```button
name ➕ Nueva Proyecto
type note(20_Projects/MOC_<% (window._origenNota = app.workspace.getActiveFile()?.basename, tp.system.prompt("¿Qué proyecto es este?") ) %>) template
action T_MOC_Project
templater true
```
^button-new-project

```button
name ➕ Nueva Contexto
type note(20_Projects/<%* window._origenNota = app.workspace.getActiveFile()?.basename; const project = tp.frontmatter.project; const name = await tp.system.prompt("¿Qué contexto es este?"); %><% name ? (project + " - " + name) : ":" %>) template
action T_Create_Context
templater true
```
^button-new-context

```button
name 🧠 Crear Nota Zettel
type note(10_Library/<% (window._origenNota = app.workspace.getActiveFile()?.basename, tp.system.prompt("Atomic Idea Title") ) %>) template
action T_Create_Zettel
templater true
```
^button-create-zettel

```button
name 📝 Crear Publicación (Express)
type note(10_Library/<% (window._origenNota = app.workspace.getActiveFile()?.basename, "Express - " + tp.system.prompt("Título de la publicación") ) %>) template
action T_Create_Express
templater true
```
^button-create-express

```button
name 🗑️ Eliminar la nota actual
type command
action Delete current file
class obsidian-button
color red
```
^button-delete-note

```button
name 💡 Crear MOC
type note(10_Library/MOC_<%* window._origenNota = app.workspace.getActiveFile()?.basename; const ZF="10_Library"; const flat=(v)=>[].concat(v||[]); const files=app.metadataCache.getCachedFiles().filter(f=>f.startsWith(ZF)); const mocs=new Set(); const topics=new Set(); files.forEach(f=>{const m=app.metadataCache.getCache(f)?.frontmatter; if(m){const ts=flat(m.tag).concat(flat(m.tags)); const tps=flat(m.topic); if(ts.some(t=>t&&t.includes("type/topic"))) tps.forEach(t=>mocs.add(t)); tps.forEach(t=>topics.add(t));}}); const list=Array.from(topics).filter(t=>!mocs.has(t)).sort(); let res=app.workspace.activeEditor?.editor.getSelection()||(await tp.system.suggester(t=>t,list)); if(res) tR+=res; %>) template
action T_MOC_Topic
templater true
```
^button-create-moc-topic

```button
name 🧠 Crear Capacitación
type note(20_Projects/<% (window._origenNota = app.workspace.getActiveFile()?.basename, tp.frontmatter.area ? tp.frontmatter.area + " - " : "" ) %>Training - <% tp.system.prompt("Nombre de la Capacitación (Ej: Curso Docker)") %>) template
action T_Create_Training
templater true
```
^button-create-training

```button
name 🛠️ Crear Tarea
type note(20_Projects/<% (window._origenNota = app.workspace.getActiveFile()?.basename, tp.frontmatter.project ) %> - <% (await tp.system.prompt("Título de la Tarea")).replace(/[\\/:*?"<>|#^\[\]]/g, "").replace(/\(/g, "{").replace(/\)/g, "}").replace(/\s+/g, " ").trim() %> ) template
action T_Create_Task
templater true
```
^button-new-task

```button
name 🛠️ Crear Tarea
type note(20_Projects/<% (window._origenNota = app.workspace.getActiveFile()?.basename, tp.frontmatter.project ) %> - <% (await tp.system.prompt("Título de la Tarea")).replace(/[\\/:*?"<>|#^\[\]]/g, "").replace(/\(/g, "{").replace(/\)/g, "}").replace(/\s+/g, " ").trim() %> ) template
action T_Create_Task_Serfe
templater true
```
^button-new-task-serfe

```button
name ⏳ Nuevo Registro
type note(00_Inbox/<% (window._origenNota=app.workspace.getActiveFile()?.basename, tp.date.now("YYYY-MM-DD")+(window._origenNota?"_"+window._origenNota.replace(/^MOC_/,""):"") ) %>_Routine) template
action T_Create_Routine_Log
templater true
```
^button-routine-log

```button
name ➕ Traducir Clipboard
type append template
action 80_Templates/Scripts/T_Traductor_a_Tracker
templater true
```
^button-traducir-tracker

```button
name 📅 Nota del Día
type command
action Periodic Notes: Open daily note
color blue
```
^button-daily-note

```button
name 📋 Review Semanal
type command
action Periodic Notes: Open weekly note
color green
```
^button-weekly-review