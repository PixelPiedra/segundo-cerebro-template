<%*
// ============================================================
// T_Create_Detail_Wizard.md — Crea una nota de detalle con wizard
// Si la tarea padre no tiene ticket_id, se lo genera y lo
// escribe en su frontmatter. No crea archivo hasta confirmación.
// ============================================================

// 1. Obtener proyecto/ticket_id de la nota activa (tarea padre)
const archivoActivo = app.workspace.getActiveFile();
if (!archivoActivo) { new Notice("❌ No hay nota activa"); return; }
const metadata = app.metadataCache.getFileCache(archivoActivo);
const fm = metadata?.frontmatter || {};
const project = fm.project || "";
let ticketId = fm.ticket_id || "";

// 2. Pedir título del detalle
const tituloRaw = await tp.system.prompt("¿De qué trata esta nota?");
if (!tituloRaw) return;
const titulo = tituloRaw.replace(/[\\/:*?"<>|#^\[\]]/g, "")
    .replace(/\(/g, "{").replace(/\)/g, "}")
    .replace(/\s+/g, " ").trim();
if (!titulo) return;

// 3. Si la tarea padre no tiene ticket_id, generarle uno
if (!ticketId) {
    // Escanear todas las notas en 20_Projects que usen TSK-xxx
    const archivos = app.vault.getFiles();
    const prefix = `${project} - TSK-`;
    let maxNum = 0;
    for (const f of archivos) {
        if (f.path.startsWith("20_Projects/") && f.name.startsWith(prefix)) {
            const match = f.name.match(/TSK-(\d+)/);
            if (match) {
                const n = parseInt(match[1], 10);
                if (n > maxNum) maxNum = n;
            }
        }
    }
    ticketId = `TSK-${String(maxNum + 1).padStart(3, "0")}`;

    // Escribir ticket_id en el frontmatter de la tarea padre
    const contentPadre = await app.vault.read(archivoActivo);
    const frontMatch = contentPadre.match(/^---\n([\s\S]*?)\n---/);
    if (frontMatch) {
        const frontBody = frontMatch[1];
        const newFrontBody = frontBody + `\nticket_id: ${ticketId}`;
        const newContent = contentPadre.replace(frontMatch[0], `---\n${newFrontBody}\n---`);
        await app.vault.modify(archivoActivo, newContent);
    }
}

// 4. Construir filename (proyecto - TSK-xxx - título)
const folder = "20_Projects";
const filePath = `${folder}/${project} - ${ticketId} - ${titulo}.md`;

// 5. Si ya existe, avisar y salir
const existing = app.vault.getAbstractFileByPath(filePath);
if (existing) {
    new Notice(`⚠️ Ya existe un detalle con ese nombre: ${filePath}`);
    return;
}

// 6. Generar contenido
const fecha = tp.date.now("YYYY-MM-DD HH:mm");
const detail = titulo;
const originLink = archivoActivo.path;
const content = `---
created: ${fecha}
tags:
  - type/detail
detail: ${detail}
ticket_id: ${ticketId}
origin: "[[${originLink}]]"
---
# ${titulo}

## 📋 Descripción


---
## 🔗 Referencias
- 
---
\`button-create-zettel\` \`button-delete-note\`
`;

// 7. Escribir y abrir
const newFile = await app.vault.create(filePath, content);
await app.workspace.openLinkText(newFile.path, "");
new Notice(`✅ Detalle creado en ${ticketId}`);
%>