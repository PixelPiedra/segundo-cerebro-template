---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
status: Activo
priority: Alta
tags:
  - type/project
due_date:
project: <%* tR += tp.file.title.replace("MOC_", "").toLowerCase() %>
<% tp.file.include("[[script_detectar_origen]]") %>
---
# <% tp.file.title.replace("MOC_","") %>
> [!ABSTRACT]- Panel de Control
> **Estado**: `INPUT[inlineSelect(option(Activo), option(Pausado), option(Futuro), option(Completado), option(Archivado)):status]`
> **Prioridad**: `INPUT[inlineSelect(option(Alta), option(Media), option(Baja)):priority]`
> **Deadline**: `INPUT[date:due_date]`

> [!QUOTE] 🎯 Objetivo
> _¿Qué querés lograr con este proyecto?_

## Planificar tareas
```dataviewjs
await dv.view("80_Templates/Scripts/planificar_tareas_helper", {});
const H = window._ptHelpers;
const projectPath = dv.current().file.path;

const ticketData = await H.cargarTicketsProyecto(projectPath);
if (!ticketData.length) { dv.span("_No hay tareas planificadas para hoy._"); return; }

const container = dv.el("div", "");
container.innerHTML = H.renderTablaPlanificar(ticketData);
```
---
```dataviewjs
const project = dv.current().project; // Lee el atributo 'area' del YAML de esta nota

dv.paragraph("```todoist\n" +
`name: "Mis tareas del proyecto ${project}"\n` +
`filter: "##Obsidian & @${project}"\n` +
"```");
```
`BUTTON[add-task-todoist]`
## ☕ Registro de Tiempos del Día
`button-routine-log`
```dataview
LIST
FROM "00_Inbox" AND #type/log
WHERE origin = this.file.link
SORT created DESC
LIMIT 5
```
---
## 🏗️ Tareas y Tickets
`button-new-task`
### 🆕 Nuevo
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/task')
    .where(p => p.origin && p.origin.path === dv.current().file.path && p.status === "Nuevo")
    .sort(p => [p.status, p.priority, p.created], "asc");

dv.table(
    ["Nombre", "Prioridad"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.priority || "-"
    ])
);
```
### 📋 Asignado
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/task')
    .where(p => p.origin && p.origin.path === dv.current().file.path && p.status === "Asignado")
    .sort(p => [p.status, p.priority, p.created], "asc");

dv.table(
    ["Nombre", "Prioridad"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.priority || "-"
    ])
);
```
### 🔍 Revisión
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/task')
    .where(p => p.origin && p.origin.path === dv.current().file.path && p.status === "Revisión")
    .sort(p => [p.status, p.priority, p.created], "asc");

dv.table(
    ["Nombre", "Prioridad"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.priority || "-"
    ])
);
```
### ⏳ Esperando
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/task')
    .where(p => p.origin && p.origin.path === dv.current().file.path && p.status === "Esperando")
    .sort(p => [p.waiting_since, p.priority], "asc");

dv.table(
    ["Nombre", "Esperando a", "Desde"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.waiting_for || "-",
        p.waiting_since ? p.waiting_since : (p.created ? p.created.substring(0,10) : "-")
    ])
);
```
### 🧪 Pruebas
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/task')
    .where(p => p.origin && p.origin.path === dv.current().file.path && p.status === "Pruebas")
    .sort(p => [p.status, p.priority, p.created], "asc");

dv.table(
    ["Nombre", "Prioridad"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.priority || "-"
    ])
);
```
### ✅ Resuelto
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/task')
    .where(p => p.origin && p.origin.path === dv.current().file.path && p.status === "Resuelto")
    .sort(p => [p.status, p.priority, p.created], "asc");

dv.table(
    ["Nombre", "Prioridad"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.priority || "-"
    ])
);
```
### 🔒 Cerrado
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/task')
    .where(p => p.origin && p.origin.path === dv.current().file.path && p.status === "Cerrado")
    .sort(p => [p.status, p.priority, p.created], "asc");

dv.table(
    ["Nombre", "Prioridad"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.priority || "-"
    ])
);
```
---
##  🏔️ Contextos
`button-new-context`
```dataview
LIST WITHOUT ID
	link(file.link, upper(context))
FROM "20_Projects" AND #type/context
WHERE origin = this.file.link
```
---
## 📝 Notas
`button-new-inbox-note`
```dataview
LIST
FROM "00_Inbox"
WHERE origin = this.file.link
```

`button-delete-note`<%*
try {
  const token = (await app.vault.adapter.read(".obsidian/todoist-token")).trim();
  const raw = tp.file.title.replace("MOC_", "").toLowerCase();
  const labelName = raw.charAt(0).toUpperCase() + raw.slice(1);

  await requestUrl({
    url: "https://api.todoist.com/api/v1/sync",
    method: "POST",
    headers: { "Authorization": `Bearer ${token}` },
    contentType: "application/x-www-form-urlencoded",
    body: `commands=${encodeURIComponent(JSON.stringify([{
      type: "label_add",
      temp_id: crypto.randomUUID(),
      uuid: crypto.randomUUID(),
      args: { name: labelName }
    }]))}`
  });

  new Notice(`✓ Etiqueta "${labelName}" creada en Todoist`);

} catch(e) {
  new Notice("Error: " + e.message.substring(0, 100));
  console.error(e);
}
%>