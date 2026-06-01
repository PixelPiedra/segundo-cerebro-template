// planificar_tareas_helper.js — helpers cargados via dv.view()
// Registra funciones en window._ptHelpers para el bloque principal

window._ptHelpers = {
    prioOrder: { "Alta": 0, "Media": 1, "Baja": 2, "High": 0, "Medium": 1, "Low": 2 },

    getTags(p) {
        if (!p.tags) return [];
        if (Array.isArray(p.tags)) return p.tags;
        if (p.tags.values) return p.tags.values;
        return [];
    },

    saveSecuencia: async (path, tareaId, valor, inputEl) => {
        const file = app.vault.getAbstractFileByPath(path);
        if (!file) return;
        let content = await app.vault.read(file);
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const partes = lines[i].split("|");
            if (partes.length < 7) continue;
            if (partes[1].trim() !== String(tareaId)) continue;
            partes[5] = ` ${valor} `;
            lines[i] = partes.join("|");
            break;
        }
        await app.vault.modify(file, lines.join("\n"));
        const flash = inputEl.parentElement.querySelector('.saved-flash');
        if (flash) { flash.style.opacity = '1'; setTimeout(() => flash.style.opacity = '0', 1000); }
    },

    saveFecha: async (path, tareaId, valor, inputEl) => {
        const file = app.vault.getAbstractFileByPath(path);
        if (!file) return;
        let content = await app.vault.read(file);
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            const partes = lines[i].split("|");
            if (partes.length < 7) continue;
            if (partes[1].trim() !== String(tareaId)) continue;
            partes[4] = ` [fecha:: ${valor}] `;
            lines[i] = partes.join("|");
            break;
        }
        await app.vault.modify(file, lines.join("\n"));
        const flash = inputEl.parentElement.querySelector('.saved-flash');
        if (flash) { flash.style.opacity = '1'; setTimeout(() => flash.style.opacity = '0', 1000); }
    },

    cargarSubtareas: async (notaPath) => {
        const H = window._ptHelpers;
        const today = dv.date("today").toFormat("yyyy-MM-dd");
        const subs = dv.pages('"20_Projects"')
            .where(d => {
                const tags = H.getTags(d);
                return tags.includes("type/task/sub") && d.origin?.path === notaPath;
            });
        const resultado = [];
        for (const sub of subs) {
            const subContent = await dv.io.load(sub.file.path);
            const subLimpio = subContent.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
            const subMatch = subLimpio.match(/### Plan de Desarrollo[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
            const subTareas = [];
            if (subMatch) {
                let subLines = subMatch[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
                if (subLines.length > 0) subLines.shift();
                for (const line of subLines) {
                    const partes = line.split("|");
                    if (partes.length < 7) continue;
                    const id = partes[1].trim();
                    const nombre = partes[2].trim();
                    const est = partes[3].trim();
                    const fechaCol = partes[4].trim();
                    const secuencia = partes[5].trim();
                    if (!id || isNaN(parseInt(id))) continue;
                    const fechaMatch = fechaCol.match(/\[\s*fecha::\s*([\d-]+)\s*\]/);
                    if (fechaMatch && fechaMatch[1] < today) continue;
                    subTareas.push({ id, nombre, est, fecha: fechaMatch?.[1] || "", secuencia });
                }
            }
            const subSubtareas = await H.cargarSubtareas(sub.file.path);
            resultado.push({ sub, subTareas, subSubtareas });
        }
        return resultado;
    },

    renderSubtareas: (subtareas, idPadre, nivel) => {
        const H = window._ptHelpers;
        let html = "";
        const paddingBase = 20 + (nivel * 16);
        for (const { sub, subTareas, subSubtareas } of subtareas) {
            const idSub = `${idPadre}s`;
            const subNombre = sub.detail || sub.file.name;
            html += `<tr class="subtarea-row"><td style="color:var(--text-muted);font-size:11px;padding-left:${paddingBase}px">${idSub}</td><td colspan="4" style="padding-left:${paddingBase}px">↳ <a data-href="${sub.file.path}" href="${sub.file.path}" class="internal-link">${subNombre}</a></td></tr>`;
            for (const subTarea of subTareas) {
                const idSubTarea = `${idSub}.${subTarea.id}`;
                html += `<tr class="tarea-row"><td style="color:var(--text-muted);font-size:12px;padding-left:${paddingBase + 16}px">${idSubTarea}</td><td style="padding-left:${paddingBase + 16}px">${subTarea.nombre}</td><td><div class="edit-cell"><input class="date-input" type="date" value="${subTarea.fecha}" onchange="window._ptHelpers.saveFecha('${sub.file.path}', '${subTarea.id}', this.value, this)"><span class="saved-flash">✓</span></div></td><td style="color:var(--text-muted);font-size:12px">${subTarea.est}</td><td><div class="edit-cell"><input class="seq-input" type="number" value="${subTarea.secuencia || subTarea.id}" min="1" onchange="window._ptHelpers.saveSecuencia('${sub.file.path}', '${subTarea.id}', this.value, this)"><span class="saved-flash">✓</span></div></td></tr>`;
                const subSubs = subSubtareas.filter(s => String(s.sub.parent_task_id) === String(subTarea.id));
                if (subSubs.length) html += H.renderSubtareas(subSubs, idSubTarea, nivel + 1);
            }
        }
        return html;
    },

    // Nueva: carga todos los tickets + tareas del proyecto
    cargarTicketsProyecto: async (projectPath) => {
        const H = window._ptHelpers;
        const today = dv.date("today").toFormat("yyyy-MM-dd");

        const tickets = dv.pages('"20_Projects"')
            .where(p => {
                const tags = H.getTags(p);
                return !tags.includes("type/task/sub") &&
                       !tags.includes("type/detail") &&
                       p.status !== "Cerrado" &&
                       p.status !== "Resuelto" &&
                       p.status !== "Archivado" &&
                       p.origin?.path === projectPath;
            });

        const ticketData = [];
        for (const ticket of tickets) {
            const content = await dv.io.load(ticket.file.path);
            const contentLimpio = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
            const match = contentLimpio.match(/### Plan de Desarrollo[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
            if (!match) continue;
            let lines = match[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
            if (lines.length > 0) lines.shift();
            const tareasHoy = [];
            for (const line of lines) {
                const partes = line.split("|");
                if (partes.length < 7) continue;
                const id     = partes[1].trim();
                const nombre = partes[2].trim();
                const est    = partes[3].trim();
                const fechaCol = partes[4].trim();
                const secuencia = partes[5].trim();
                if (!id || isNaN(parseInt(id))) continue;
                const fechaMatch = fechaCol.match(/\[\s*fecha::\s*([\d-]+)\s*\]/);
                if (fechaMatch && fechaMatch[1] < today) continue;
                tareasHoy.push({ id, nombre, est, fecha: fechaMatch?.[1] || "", secuencia });
            }
            if (!tareasHoy.length) continue;
            const subtareasConTareas = await H.cargarSubtareas(ticket.file.path);
            ticketData.push({ ticket, tareasHoy, subtareas: subtareasConTareas });
        }

        ticketData.sort((a, b) => (H.prioOrder[a.ticket.priority] ?? 99) - (H.prioOrder[b.ticket.priority] ?? 99));
        return ticketData;
    },

    // Acumula horas de subtareas recursivamente en el mapa tareas
    // Busca toda la cadena: tarea → subtarea → sub-subtarea → ...
    acumularHorasSubtareas: async (parentPath, tareas, inheritedParentId = null) => {
        const H = window._ptHelpers;
        const subs = dv.pages('"20_Projects"')
            .where(p => H.getTags(p).includes("type/task/sub") && p.origin?.path === parentPath);
        for (const sub of subs) {
            const parentId = sub.parent_task_id?.toString().trim();
            // inheritedParentId (nivel 2+) antepone a parentId para evitar
            // que una sub-subtarea con parent_task_id coincidente se acumule
            // en una tarea top-level diferente a la de su padre
            const targetId = inheritedParentId || (parentId && tareas[parentId] ? parentId : null);
            if (targetId && tareas[targetId]) {
                const subContent = await dv.io.load(sub.file.path);
                const subLimpio = subContent.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
                const subBitMatch = subLimpio.match(/## 3\. Bitácora de Ejecución[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
                if (subBitMatch) {
                    let lines = subBitMatch[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
                    if (lines.length > 0) lines.shift();
                    for (const line of lines) {
                        const partes = line.split("|");
                        if (partes.length < 6) continue;
                        const durStr = partes[4].trim();
                        const mins = H.toMins(durStr.replace(/\[duracion::\s*/, "").replace("]", ""));
                        tareas[targetId].mins += mins;
                    }
                }
            }
            await H.acumularHorasSubtareas(sub.file.path, tareas, targetId);
        }
    },

    // Nueva: renderiza la tabla HTML completa
    renderTablaPlanificar: (ticketData) => {
        const H = window._ptHelpers;
        let html = `<style>
    .daily-table { width:100%; border-collapse:collapse; font-size:13px; }
    .daily-table th { text-align:left; padding:4px 8px; border-bottom:1px solid var(--background-modifier-border); color:var(--text-muted); font-weight:500; }
    .daily-table td { padding:4px 8px; border-bottom:1px solid var(--background-modifier-border); color:var(--text-normal); vertical-align:middle; }
    .daily-table tr.ticket-row td { font-weight:500; background:var(--background-secondary); }
    .edit-cell { display:flex; align-items:center; gap:4px; }
    .seq-input { width:44px; background:transparent; border:1px solid var(--background-modifier-border); border-radius:4px; padding:2px 4px; color:var(--text-normal); font-size:11px; text-align:center; }
    .seq-input:focus { outline:none; border-color:var(--interactive-accent); }
    .date-input { width:110px; background:transparent; border:1px solid var(--background-modifier-border); border-radius:4px; padding:2px 4px; color:var(--text-normal); font-size:11px; }
    .date-input:focus { outline:none; border-color:var(--interactive-accent); }
    .badge-high   { color:var(--color-red);    font-size:11px; }
    .badge-medium { color:var(--color-yellow); font-size:11px; }
    .badge-low    { color:var(--color-green);  font-size:11px; }
    .saved-flash  { color:var(--color-green); font-size:10px; opacity:0; transition:opacity 0.3s; }
</style><table class="daily-table"><thead><tr><th style="width:80px">ID</th><th>Nombre</th><th style="width:120px">Fecha</th><th style="width:55px">Est.</th><th style="width:80px">Secuencia</th></tr></thead><tbody>`;

        let ticketSeq = 0;
        for (const { ticket, tareasHoy, subtareas } of ticketData) {
            ticketSeq++;
            const idFicticio = ticketSeq * 100;
            const prio = ticket.priority || "Media";
            const badgeClass = `badge-${prio.toLowerCase()}`;
            const nombre = ticket.file.name.split(" - ").pop();

            html += `<tr class="ticket-row"><td style="color:var(--text-muted);font-size:12px">${idFicticio}</td><td><a data-href="${ticket.file.path}" href="${ticket.file.path}" class="internal-link">${nombre}</a></td><td></td><td></td><td class="${badgeClass}">${prio}</td></tr>`;

            for (const tarea of tareasHoy) {
                const idCompleto = `${idFicticio}.${tarea.id}`;
                const subs = subtareas.filter(s => String(s.sub.parent_task_id) === String(tarea.id));
                if (subs.length) {
                    html += `<tr class="tarea-row"><td style="color:var(--text-muted);font-size:12px;padding-left:20px">${idCompleto}</td><td style="padding-left:20px">${tarea.nombre} <span style="color:var(--text-muted);font-size:11px;opacity:0.6">(desglosado)</span></td><td colspan="2" style="color:var(--text-muted);font-size:11px;opacity:0.6">↳ subtareas</td><td class="badge-${prio.toLowerCase()}">${prio}</td></tr>`;
                } else {
                    html += `<tr class="tarea-row"><td style="color:var(--text-muted);font-size:12px;padding-left:20px">${idCompleto}</td><td style="padding-left:20px">${tarea.nombre}</td><td><div class="edit-cell"><input class="date-input" type="date" value="${tarea.fecha}" onchange="window._ptHelpers.saveFecha('${ticket.file.path}', '${tarea.id}', this.value, this)"><span class="saved-flash">✓</span></div></td><td style="color:var(--text-muted);font-size:12px">${tarea.est}</td><td><div class="edit-cell"><input class="seq-input" type="number" value="${tarea.secuencia || tarea.id}" min="1" onchange="window._ptHelpers.saveSecuencia('${ticket.file.path}', '${tarea.id}', this.value, this)"><span class="saved-flash">✓</span></div></td></tr>`;
                }
                if (subs.length) html += H.renderSubtareas(subs, idCompleto, 1);
            }
        }

        html += `</tbody></table>`;
        return html.replace(/\n\s*/g, "");
    },

    // ====== Gantt del Día ======

    toMins(s) {
        const [h, m] = (s||"").replace("hs","").trim().split(":").map(Number);
        return (h||0)*60+(m||0);
    },

    toStr(m) {
        return `${Math.floor(m/60).toString().padStart(2,"0")}:${(m%60).toString().padStart(2,"0")}`;
    },

    // ====== Utilidades de fecha y tabla (MOC_Serfe report) ======

    parseDate(input) {
        if (!input) return moment();
        if (input.ts) return moment(input.toJSDate());
        return moment(input);
    },

    normalizarOrigin(origin) {
        if (!origin) return "";
        const str = origin.path || origin.toString();
        return str.replace(/\[\[|\]\]|\.md/g, '').split('/').pop();
    },

    _cacheContenidos: new Map(),

    async leerContenido(path) {
        if (!this._cacheContenidos.has(path)) {
            try {
                this._cacheContenidos.set(path, await dv.io.load(path));
            } catch (e) {
                this._cacheContenidos.set(path, null);
            }
        }
        return this._cacheContenidos.get(path);
    },

    extraerInlineField(texto, campo) {
        const regex = new RegExp(`\\[${campo}::\\s*([^\\]]+)\\]`, 'i');
        const match = texto.match(regex);
        return match?.[1]?.trim() || null;
    },

    extraerDatosTabla(contenido, campoTiempo = 'duracion') {
        if (!contenido) return [];
        const H = this;
        const lineas = contenido.split('\n');
        const datos = [];
        let enTabla = false, headerEncontrado = false;
        for (const linea of lineas) {
            if (!headerEncontrado && linea.includes('| Fecha') &&
                (linea.includes('| Duración') || linea.includes('| Tiempo'))) {
                enTabla = true; headerEncontrado = true; continue;
            }
            if (enTabla && linea.includes(':---')) continue;
            if (enTabla && linea.trim().startsWith('|') && !linea.includes('BUTTON')) {
                const fechaValue = H.extraerInlineField(linea, 'fecha');
                const tiempoValue = H.extraerInlineField(linea, campoTiempo) ||
                                   H.extraerInlineField(linea, 'horas');
                if (fechaValue && tiempoValue) {
                    const columnas = linea.split('|');
                    datos.push({
                        fecha: fechaValue,
                        duracion: tiempoValue,
                        descripcion: columnas[columnas.length - 2]?.trim() || "Sin descripción"
                    });
                }
            }
            if (enTabla && (!linea.trim() || linea.includes('BUTTON') || linea.startsWith('#'))) break;
        }
        return datos;
    },

    crearTablaMD(items, prefix) {
        if (items.length === 0) return `${prefix} _Sin actividad registrada_`;
        let md = `${prefix} | Actividad | Tiempo | Tarea |\n${prefix} | :--- | :---: | :---: |`;
        for (const item of items) {
            md += `\n${prefix} | <code style="user-select:all; display:block; color:var(--text-accent);">${item.nombre}</code> | ${item.tiempo} | ${item.link} |`;
        }
        return md;
    },

    renderGanttDia: async (logPath) => {
        const H = window._ptHelpers;
        const logFile = app.vault.getAbstractFileByPath(logPath);
        const cache = app.metadataCache.getFileCache(logFile);
        const today = cache?.frontmatter?.created?.toString().split(" ")[0]
            || dv.date("today").toFormat("yyyy-MM-dd");
        const filterOrigin = cache?.frontmatter?.origin ? H.normalizarOrigin(cache.frontmatter.origin) : null;

        const logContent = await dv.io.load(logPath);

        // 1. Leer bitácora del log
        const logLimpio = logContent.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
        const bitacoraMatch = logLimpio.match(/## ⏱ Bitácora del Día[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
        const interrupciones = [];
        const rutina = [];
        if (bitacoraMatch) {
            let lines = bitacoraMatch[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
            if (lines.length > 0) lines.shift();
            for (const line of lines) {
                const partes = line.split("|");
                if (partes.length < 7) continue;
                const inicio = partes[2].trim();
                const fin    = partes[3].trim();
                const tipo   = partes[5].trim().toLowerCase();
                const desc   = partes[6].trim();
                if (!inicio.match(/^\d{2}:\d{2}$/) || !fin.match(/^\d{2}:\d{2}$/)) continue;
                const e = { inicio, fin, tipo, desc, inicioM: H.toMins(inicio), finM: H.toMins(fin) };
                if (tipo === "rutina") rutina.push(e); else interrupciones.push(e);
            }
        }
        const entradasOrd = [...interrupciones, ...rutina].sort((a, b) => a.inicioM - b.inicioM);

        // 2. Calcular huecos libres
        const horaInicio = entradasOrd.length ? entradasOrd[0].inicioM : 9 * 60;
        const horaFin = 20 * 60;
        const huecos = [];
        let cursor = horaInicio;
        for (const e of entradasOrd) {
            if (e.inicioM > cursor) huecos.push({ ini: cursor, fin: e.inicioM });
            cursor = Math.max(cursor, e.finM);
        }
        if (cursor < horaFin) huecos.push({ ini: cursor, fin: horaFin });

        // 3. Colectar notas relacionadas al origin (pre-index O(n), lookup O(1))
        const porOrigin = {};
        dv.pages('"20_Projects"').forEach(p => {
            const o = H.normalizarOrigin(p.origin);
            (porOrigin[o] ??= []).push(p);
        });

        const notas = [];
        const visitadas = new Set();
        const recolectar = (nombre) => {
            if (visitadas.has(nombre)) return;
            visitadas.add(nombre);
            for (const p of porOrigin[nombre] || []) {
                const tags = H.getTags(p);
                if (p.status !== "Cerrado" && p.status !== "Resuelto" && !tags.includes("type/detail")) {
                    if (!notas.some(n => n.file.path === p.file.path)) notas.push(p);
                    // Recurre siempre: busca sub-tareas y sub-sub-tareas
                    // que tengan origin === p.file.name
                    recolectar(p.file.name);
                }
            }
        };
        if (filterOrigin) {
            recolectar(filterOrigin);
        } else {
            // Sin origin en el log: mostrar todas las tareas no cerradas
            dv.pages('"20_Projects"')
                .where(p => !H.getTags(p).includes("type/detail") && p.status !== "Cerrado" && p.status !== "Resuelto")
                .forEach(p => { if (!notas.some(n => n.file.path === p.file.path)) notas.push(p); });
        }

        // Leer Plan de Desarrollo de todas las notas recolectadas
        const planificadas = [];
        for (const p of notas) {
            const content = await dv.io.load(p.file.path);
            const limpio = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
            const match = limpio.match(/### Plan de Desarrollo[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
            if (!match) continue;
            let lines = match[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
            if (lines.length > 0) lines.shift();
            const pNombre = H.getTags(p).includes("type/task/sub")
                ? (p.detail || p.file.name.split(" - ").pop())
                : p.file.name.split(" - ").pop();
            for (const line of lines) {
                const partes = line.split("|");
                if (partes.length < 7) continue;
                const id = partes[1].trim(), nombre = partes[2].trim(), est = partes[3].trim();
                const fechaCol = partes[4].trim(), check = partes[6]?.trim();
                if (!id || isNaN(parseInt(id))) continue;
                const fechaMatch = fechaCol.match(/\[\s*fecha::\s*([\d-]+)\s*\]/);
                if (!fechaMatch || fechaMatch[1] !== today) continue;
                planificadas.push({
                    nombre: `${pNombre} · ${nombre}`,
                    durM: H.toMins(est) || 30,
                    completada: check === "[x]",
                    secuencia: parseInt(partes[5]?.trim()) || 999
                });
            }
        }
        planificadas.sort((a, b) => a.secuencia - b.secuencia);

        // 4. Distribuir planificadas en huecos
        const bloquesPlan = [];
        let huecoIdx = 0;
        let posEnHueco = huecos.length ? huecos[0].ini : horaInicio;
        for (const tarea of planificadas) {
            let restante = tarea.durM, parteIdx = 1;
            while (restante > 0 && huecoIdx < huecos.length) {
                const hueco = huecos[huecoIdx];
                if (posEnHueco >= hueco.fin) {
                    huecoIdx++;
                    if (huecoIdx < huecos.length) posEnHueco = huecos[huecoIdx].ini;
                    continue;
                }
                const disponible = hueco.fin - posEnHueco;
                const usar = Math.min(restante, disponible);
                const nom = planificadas.length > 1 || tarea.durM > disponible
                    ? `${tarea.nombre} (${parteIdx})`.replace(/:/g," ").substring(0,40)
                    : tarea.nombre.replace(/:/g," ").substring(0,40);
                bloquesPlan.push({ nombre: nom, ini: posEnHueco, fin: posEnHueco + usar, completada: tarea.completada });
                posEnHueco += usar; restante -= usar; parteIdx++;
                if (posEnHueco >= hueco.fin) {
                    huecoIdx++;
                    if (huecoIdx < huecos.length) posEnHueco = huecos[huecoIdx].ini;
                }
            }
        }

        // 5. Leer bitácoras reales de las mismas notas
        const bloquesReales = [];
        for (const nota of notas) {
            const content = await dv.io.load(nota.file.path);
            const limpio = content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
            const bitMatch = limpio.match(/## 3\. Bitácora de Ejecución[\s\S]*?((?:\|[^\n]+\|\n?)+)/);
            if (!bitMatch) continue;
            let lines = bitMatch[1].split("\n").map(l => l.trim()).filter(l => l.includes("|") && !l.includes("---"));
            if (lines.length > 0) lines.shift();
            for (const line of lines) {
                const partes = line.split("|");
                if (partes.length < 7) continue;
                const fechaCol = partes[1].trim(), inicio = partes[2].trim(), fin = partes[3].trim(), desc = partes[6].trim();
                const fechaMatch = fechaCol.match(/\[\s*fecha::\s*([\d-]+)\s*\]/);
                if (!fechaMatch || fechaMatch[1] !== today) continue;
                if (!inicio.match(/^\d{2}:\d{2}$/) || !fin.match(/^\d{2}:\d{2}$/)) continue;
                bloquesReales.push({ nombre: `${nota.file.name.split(" - ").pop()} · ${desc}`.replace(/:/g," ").substring(0,40), inicio, fin, inicioM: H.toMins(inicio), finM: H.toMins(fin) });
            }
        }
        bloquesReales.sort((a, b) => a.inicioM - b.inicioM);

        if (!bloquesPlan.length && !bloquesReales.length && !interrupciones.length && !rutina.length) {
            dv.span("_Sin datos para mostrar en el Gantt._");
            return;
        }

        // 6. Construir mermaid
        let code = "gantt\n  dateFormat HH:mm\n  axisFormat %H:%M\n";
        if (bloquesPlan.length) {
            code += "  section Planificado\n";
            for (const b of bloquesPlan) code += `    ${b.nombre} : ${b.completada ? "done, " : ""}${H.toStr(b.ini)}, ${H.toStr(b.fin)}\n`;
        }
        if (bloquesReales.length) {
            code += "  section Real\n";
            for (const b of bloquesReales) code += `    ${b.nombre} : crit, ${b.inicio}, ${b.fin}\n`;
        }
        if (rutina.length) {
            code += "  section Rutina\n";
            for (const r of rutina) code += `    ${r.desc.replace(/:/g," ").substring(0,40)} : ${r.inicio}, ${r.fin}\n`;
        }
        if (interrupciones.length) {
            code += "  section Interrupciones\n";
            for (const i of interrupciones) code += `    ${`${i.tipo} - ${i.desc}`.replace(/:/g," ").substring(0,40)} : ${i.inicio}, ${i.fin}\n`;
        }

        // 7. Resumen de tiempos
        dv.paragraph("```mermaid\n" + code + "\n```");
        dv.paragraph(
            `⏱ **Planificado:** ${H.toStr(bloquesPlan.reduce((a, b) => a + (b.fin - b.ini), 0))} hs` +
            `　　✅ **Real:** ${H.toStr(bloquesReales.reduce((a, b) => a + (b.finM - b.inicioM), 0))} hs` +
            (rutina.length ? `　　🔄 **Rutina:** ${H.toStr(rutina.reduce((a, r) => a + (r.finM - r.inicioM), 0))} hs` : "") +
            (interrupciones.length ? `　　⚡ **Interrupciones:** ${H.toStr(interrupciones.reduce((a, i) => a + (i.finM - i.inicioM), 0))} hs` : "")
        );
    }
};
