---
<%*// 2. PROCESAMIENTO DE TICKET
const rawInput = tp.file.title;
const idMatch = rawInput.match(/(\d+)/);
const ticketId = idMatch ? idMatch[1] : "S/N";

// 3. GENERAR YAML
tR += `ticket_id: "${ticketId}"`;
%>
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
status: Nuevo
priority: Media
project: <% rawInput.split(" - ")[0] %>
related_tasks: []
tags: 
  - type/task
due_date: 
est_E: 0
est_EE: 0
est_P: 0
<% tp.file.include("[[script_detectar_origen]]") %>
---
# 🛠️ Ticket: `<% rawInput.split(" - ").pop() %>`
> [!ABSTRACT] 🧭 Panel de Control
> **Ticket:** [<% ticketId %>](https://tracker.serfe.com/view.php?id=<% ticketId %>)
> **Prioridad**: `INPUT[inlineSelect(option(Alta), option(Media), option(Baja)):priority]`
> **Estado Actual**: `INPUT[inlineSelect(option(Nuevo), option(Asignado), option(Revisión), option(Pruebas), option(Resuelto), option(Cerrado), option(Archivado)):status]`
## 🔗 Tareas Relacionadas
`BUTTON[btn-link-task]`
```dataview
 LIST WITHOUT ID 
     "**[" + priority + "]** " + file.link + " (" + status + ")"
 FROM ""
 WHERE contains(this.related_tasks, file.link) OR contains(related_tasks, this.file.link)
```

## Tiempo
```dataviewjs
await dv.view("80_Templates/Scripts/planificar_tareas_helper", {});
const H = window._ptHelpers;

const content = await dv.io.load(dv.current().file.path);
const contentLimpio = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
const curr = dv.current();

const tableRegex = /### Plan de Desarrollo[\s\S]*?(\|.*\|[\s\S]*?)(?=##|$)/;
const match = contentLimpio.match(tableRegex);
const toDecimal = (mins) => Math.round(mins / 60 * 100) / 100;

let totalMins = 0;
if (match) {
    let lines = match[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
    if (lines.length > 0) lines.shift();
    for (let line of lines) {
        let cols = line.split("|").map(c => c.trim()).filter(c => c !== "");
        if (cols.length >= 3) totalMins += H.toMins(cols[2]);
    }
}

const riesgo  = curr.riesgo ?? 30;
const EE_mins = totalMins;
const E_mins  = Math.round(EE_mins * (1 + riesgo / 100));
const EE_dec  = toDecimal(EE_mins);
const E_dec   = toDecimal(E_mins);

if (curr.est_EE !== EE_dec || curr.est_E !== E_dec) {
    const file = app.vault.getAbstractFileByPath(curr.file.path);
    let fc = await app.vault.read(file);
    fc = fc.replace(/^est_EE:.*$/m, `est_EE: ${EE_dec}`);
    fc = fc.replace(/^est_E:.*$/m,  `est_E: ${E_dec}`);
    await app.vault.modify(file, fc);
}

dv.span(`**E: ${H.toStr(E_mins)} hs** (EE: ${H.toStr(EE_mins)} hs · riesgo: ${riesgo}%)`);
```

---
## 1. Estimación & Análisis
> [!WARNING]- Checklist de Tiempos
> 1. Análisis de requerimiento
> 2. Estimar la tarea
> 3. Reuniones (si aplica)
> 4. Desarrollo Neto
> 5. Testing
> 6. Deploy
> 7. Riesgo (20%)

> [!warning]- ⚡ Checklist Antes de Estimar
> - [ ] Leí completamente el ticket en el tracker
> - [ ] Identifiqué qué módulos/archivos se modifican
> - [ ] Verifiqué si hay documentación disponible
> - [ ] Revisé si existen tests relacionados
> - [ ] Identifiqué dependencias con otros equipos
> - [ ] Consideré casos edge y escenarios de error
> - [ ] Desglosé la tarea en subtareas específicas
### Plan de Desarrollo
| ID  | Tarea / Módulo | Estimación | Fecha | Secuencia | ✅   |     |     |
| :-- | :------------- | :--------- | ----- | --------- | --- | --- | --- |
`BUTTON[btn-add-task-module]`
#### Sub Tareas
`BUTTON[btn-create-sub-task]`
```dataview
LIST WITHOUT ID
	link(file.link, upper(detail))
FROM "20_Projects" AND #type/task/sub  
WHERE origin = this.file.link
```

### 📝 Nota para el Tracker
```dataviewjs
await dv.view("80_Templates/Scripts/planificar_tareas_helper", {});
const H = window._ptHelpers;
const toTimeStr = (m) => H.toStr(m) + " hs";

const content = await dv.io.load(dv.current().file.path);
const contentLimpio = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
const tableRegex = /### Plan de Desarrollo[\s\S]*?(\|.*\|[\s\S]*?)(?=##|$)/;
const match = contentLimpio.match(tableRegex);

let datosTabla = [];
let totalMins = 0;
let maxLongitudNombre = 15;

if (match) {
    let lines = match[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
    if (lines.length > 0) lines.shift();
    for (let line of lines) {
        let cols = line.split("|").map(c => c.trim()).filter(c => c !== "");
        if (cols.length >= 2) {
            const item = cols[1];
            const tiempoStr = cols[2];
            if (item.length > maxLongitudNombre) maxLongitudNombre = item.length;
            totalMins += H.toMins(tiempoStr);
            datosTabla.push({ item, tiempo: tiempoStr.replace("hs", "").trim() + " hs" });
        }
    }
}

const anchoColumna = maxLongitudNombre + 2;
let filasHTML = "";
for (let fila of datosTabla) filasHTML += `${fila.item.padEnd(anchoColumna)} | ${fila.tiempo}\n`;

const riesgo = dv.current().riesgo ?? 30;
const totalConRiesgo = Math.round(totalMins * (1 + riesgo / 100));

dv.paragraph("```html\n" +
"<b>Desglose de tareas</b>\n" +
"<pre>\n" +
"ITEM".padEnd(anchoColumna) + " | TIEMPO\n" +
"-".repeat(anchoColumna) + " | -----------\n" +
filasHTML +
"-".repeat(anchoColumna) + " | -----------\n" +
"<b>TOTAL ESTIMADO</b>".padEnd(anchoColumna + 7) + " | <b>" + toTimeStr(totalMins) + "</b>\n" +
"<b>TOTAL + RIESGO (" + riesgo + "%)</b>".padEnd(anchoColumna - 14) + " | <b>" + toTimeStr(totalConRiesgo) + "</b>\n" +
"</pre>\n" +
"```");
```
---
## 2. Desarrollo de la solución
`BUTTON[btn-add-detail]`
```dataview
LIST WITHOUT ID
	link(file.link, upper(detail))
FROM "20_Projects" AND #type/detail  
WHERE origin = this.file.link
```
## 3. Bitácora de Ejecución
| Fecha | Inicio | Fin | Duración | ID Tarea | Tarea Realizada |
| :---- | :----- | :-- | :------- | :------- | --------------- |
`BUTTON[btn-add-time]` `BUTTON[btn-recalcular-tiempos]`

### 📊 Resumen de Horas
```dataviewjs
await dv.view("80_Templates/Scripts/planificar_tareas_helper", {});
const H = window._ptHelpers;

const curr = dv.current();
const filePath = curr.file.path;

const content = await dv.io.load(filePath);
const limpio = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");

const planMatch = limpio.match(/### Plan de Desarrollo[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
const tareas = {};
if (planMatch) {
    let lines = planMatch[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
    if (lines.length > 0) lines.shift();
    for (const line of lines) {
        const partes = line.split("|");
        if (partes.length < 3) continue;
        const id = partes[1].trim();
        const nombre = partes[2].trim();
        if (!id || isNaN(parseInt(id))) continue;
        tareas[id] = { nombre, mins: 0 };
    }
}

const bitMatch = limpio.match(/## 3\. Bitácora de Ejecución[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
if (bitMatch) {
    let lines = bitMatch[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
    if (lines.length > 0) lines.shift();
    for (const line of lines) {
        const partes = line.split("|");
        if (partes.length < 6) continue;
        const durStr = partes[4].trim();
        const idTarea = partes[5].trim();
        if (!idTarea || isNaN(parseInt(idTarea))) continue;
        const mins = H.toMins(durStr.replace(/\[duracion::\s*/, "").replace("]", ""));
        if (tareas[idTarea]) tareas[idTarea].mins += mins;
    }
}

// Subtareas recursivas (incluye sub-subtareas, etc.)
await H.acumularHorasSubtareas(filePath, tareas);

const filas = Object.entries(tareas).filter(([_, t]) => t.mins > 0);
if (!filas.length) { dv.span("_Sin horas cargadas._"); return; }

const totalMins = filas.reduce((acc, [_, t]) => acc + t.mins, 0);
dv.table(
    ["ID", "Tarea / Módulo", "Tiempo"],
    [
        ...filas.map(([id, t]) => [id, t.nombre, `**${H.toStr(t.mins)}** hs`]),
        ["", "**TOTAL**", `**${H.toStr(totalMins)}** hs`]
    ]
);
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