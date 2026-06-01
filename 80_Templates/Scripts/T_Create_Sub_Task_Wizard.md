<%*
// ============================================================
// T_Create_Sub_Task_Wizard.md — Crea una sub-tarea con wizard
// Se ejecuta desde Meta Bind. NO crea archivo hasta confirmación.
// ============================================================

// 1. Leer Plan de Desarrollo de la nota activa
const view = app.workspace.activeLeaf?.view;
if (!view || view.getViewType() !== "markdown") {
    new Notice("❌ No hay nota activa");
    return;
}
const editor = view.editor;
const lineCount = editor.lineCount();

let planHeaderLine = -1;
const tareasPlan = [];

for (let i = 0; i < lineCount; i++) {
    const lineText = editor.getLine(i);
    if (lineText.includes("| ID") && lineText.includes("| Tarea")) {
        planHeaderLine = i;
        continue;
    }
    if (planHeaderLine !== -1 && lineText.trim().startsWith("|")) {
        if (lineText.includes("---")) continue;
        const partes = lineText.split("|");
        if (partes.length < 3) continue;
        const id = partes[1].trim();
        const nombre = partes[2].trim();
        if (id && !isNaN(parseInt(id))) {
            tareasPlan.push({ id, nombre });
        }
    } else if (planHeaderLine !== -1 && !lineText.trim().startsWith("|")) {
        break;
    }
}

if (!tareasPlan.length) {
    new Notice("❌ No hay tareas en el Plan de Desarrollo");
    return;
}

// 2. Elegir tarea padre
const opciones = tareasPlan.map(t => `${t.id} — ${t.nombre}`);
const seleccion = await tp.system.suggester(opciones, opciones);
if (!seleccion) {
    // User cancelled → salir sin crear nada
    return;
}
const parentTaskId = seleccion.split(" — ")[0];

// 3. Poner "-" en fecha y secuencia de la tarea padre
for (let i = 0; i < lineCount; i++) {
    const lineText = editor.getLine(i);
    if (lineText.trim().startsWith("|")) {
        const partes = lineText.split("|");
        if (partes.length >= 7) {
            const id = partes[1].trim();
            if (id === parentTaskId) {
                const oldLen = lineText.length;
                partes[4] = " - ";
                partes[5] = " - ";
                editor.replaceRange(partes.join("|"), { line: i, ch: 0 }, { line: i, ch: oldLen });
                break;
            }
        }
    }
}

// 4. Pedir título de la sub-tarea
const tituloRaw = await tp.system.prompt("Título de la Sub-Tarea");
if (!tituloRaw) return;
const titulo = tituloRaw.replace(/[\\/:*?"<>|#^\[\]]/g, "")
    .replace(/\(/g, "{").replace(/\)/g, "}")
    .replace(/\s+/g, " ").trim();
if (!titulo) return;

// 5. Obtener proyecto de la nota activa
const archivoActivo = app.workspace.getActiveFile();
const metadata = app.metadataCache.getFileCache(archivoActivo);
const project = metadata?.frontmatter?.project || "Sin Proyecto";

// 6. Crear el archivo
const folder = "20_Projects";
const filename = `${project} - ${titulo}`;
const filePath = `${folder}/${filename}.md`;

const existing = app.vault.getAbstractFileByPath(filePath);
if (existing) {
    new Notice(`⚠️ Ya existe: ${filename}`);
    return;
}

// 7. Generar contenido
const fecha = tp.date.now("YYYY-MM-DD HH:mm");
const detail = titulo;
const originLink = archivoActivo.path;
const content = `---
created: ${fecha}
project: ${project}
tags:
  - type/task/sub
origin: "[[${originLink}]]"
parent_task_id: ${parentTaskId}
detail: ${detail}

---
# 🛠️ Sub-Tarea: \`${titulo}\`
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
\`BUTTON[btn-add-task-module]\`
#### Sub Tareas
\`BUTTON[btn-create-sub-task]\`
\`\`\`dataview
LIST WITHOUT ID
	link(file.link, upper(detail))
FROM "20_Projects" AND #type/task/sub  
WHERE origin = this.file.link
\`\`\`
---
## 2. Desarrollo de la solución
\`BUTTON[btn-add-detail]\`
\`\`\`dataview
LIST WITHOUT ID
	link(file.link, upper(detail))
FROM "20_Projects" AND #type/detail  
WHERE origin = this.file.link
\`\`\`
## 3. Bitácora de Ejecución
| Fecha                | Inicio | Fin   | Duración           | ID Tarea | Tarea Realizada |
| :------------------- | :----- | :---- | :----------------- | :------- | --------------- |
\`BUTTON[btn-add-time]\` \`BUTTON[btn-recalcular-tiempos]\`

### 📊 Resumen de Horas
\`\`\`dataviewjs
const getTags = (p) => {
    if (!p.tags) return [];
    if (Array.isArray(p.tags)) return p.tags;
    if (p.tags.values) return p.tags.values;
    return [];
};
const toMins = (s) => {
    if (!s) return 0;
    const parts = s.toString().replace("hs","").trim().split(":");
    return parts.length < 2 ? 0 : (parseInt(parts[0]) * 60) + parseInt(parts[1]);
};
const toStr = (m) => \`\${Math.floor(m/60).toString().padStart(2,"0")}:\${(m%60).toString().padStart(2,"0")}\`;

const curr = dv.current();
const filePath = curr.file.path;

const content = await dv.io.load(filePath);
const limpio = content.replace(/\\\`\`\`[\\s\\S]*?\\\`\`\`/g, "").replace(/\\\`[^\\\`]*\\\`/g, "");

const planMatch = limpio.match(/### Plan de Desarrollo[\\s\\S]*?((?:\\|[^\\n]+\\|\\n?)+)/);
const tareas = {};

if (planMatch) {
    let lines = planMatch[1].split("\\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
    if (lines.length > 0) lines.shift();
    for (const line of lines) {
        const partes = line.split("|");
        if (partes.length < 3) continue;
        const id     = partes[1].trim();
        const nombre = partes[2].trim();
        if (!id || isNaN(parseInt(id))) continue;
        tareas[id] = { nombre, mins: 0 };
    }
}

const bitMatch = limpio.match(/## 3\\. Bitácora de Ejecución[\\s\\S]*?((?:\\|[^\\n]+\\|\\n?)+)/);
if (bitMatch) {
    let lines = bitMatch[1].split("\\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
    if (lines.length > 0) lines.shift();
    for (const line of lines) {
        const partes = line.split("|");
        if (partes.length < 6) continue;
        const durStr  = partes[4].trim();
        const idTarea = partes[5].trim();
        if (!idTarea || isNaN(parseInt(idTarea))) continue;
        const mins = toMins(durStr.replace(/\\[duracion::\\s*/, "").replace("]", ""));
        if (tareas[idTarea]) tareas[idTarea].mins += mins;
    }
}

const subtareas = dv.pages('"20_Projects"')
    .where(p => {
        return getTags(p).includes("type/task/sub") && 
               p.origin?.path === filePath;
    });

for (const sub of subtareas) {
    const subContent = await dv.io.load(sub.file.path);
    const subLimpio = subContent.replace(/\\\`\`\`[\\s\\S]*?\\\`\`\`/g, "").replace(/\\\`[^\\\`]*\\\`/g, "");
    const parentId = sub.parent_task_id?.toString().trim();
    if (!parentId || !tareas[parentId]) continue;

    const subBitMatch = subLimpio.match(/## 3\\. Bitácora de Ejecución[\\s\\S]*?((?:\\|[^\\n]+\\|\\n?)+)/);
    if (!subBitMatch) continue;

    let lines = subBitMatch[1].split("\\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
    if (lines.length > 0) lines.shift();

    for (const line of lines) {
        const partes = line.split("|");
        if (partes.length < 6) continue;
        const durStr = partes[4].trim();
        const mins = toMins(durStr.replace(/\\[duracion::\\s*/, "").replace("]", ""));
        tareas[parentId].mins += mins;
    }
}

const filas = Object.entries(tareas).filter(([_, t]) => t.mins > 0);

if (!filas.length) {
    dv.span("_Sin horas cargadas._");
    return;
}

const totalMins = filas.reduce((acc, [_, t]) => acc + t.mins, 0);

dv.table(
    ["ID", "Tarea / Módulo", "Tiempo"],
    [
        ...filas.map(([id, t]) => [id, t.nombre, \`**\${toStr(t.mins)}** hs\`]),
        ["", "**TOTAL**", \`**\${toStr(totalMins)}** hs\`]
    ]
);
\`\`\`

---
# Notas
\`button-new-inbox-note\`
\`\`\`dataview
LIST
FROM "00_Inbox"
WHERE origin = this.file.link
\`\`\`

\`button-delete-note\`
`;

// 8. Escribir archivo
const newFile = await app.vault.create(filePath, content);

// 9. Abrir la nota creada
await app.workspace.openLinkText(newFile.path, "");

new Notice(`✅ Sub-tarea creada: ${titulo}`);
%>