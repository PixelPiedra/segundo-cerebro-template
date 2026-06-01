---
created: 2026-01-25 18:59
tags:
  - type/project
status: Active
priority: High
due_date: ""
project: holasim
origin: "[[MOC_Serfe]]"
---
# HolaSim
> [!ABSTRACT]- Panel de Control
> **Estado**: `INPUT[inlineSelect(option(Active), option(OnHold), option(Completed), option(Archived)):status]`
> **Prioridad**: `INPUT[inlineSelect(option(High), option(Medium), option(Low)):priority]`
> **Deadline**: `INPUT[date:due_date]`
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
`button-new-task-serfe`
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

`button-delete-note`
