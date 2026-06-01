---
created: 2026-01-25 18:58
tags:
  - type/area
area: serfe
ultimo_total_reportado: 57:59
ultimo_serfe_reportado: 57:59
reporte_fin: 2026-02-28
reporte_inicio: 2025-12-18
reporte_fin_registro: 2026-06-01
reporte_inicio_registro: 2026-04-11
origin: "[[MOC_Trabajo]]"
---
# Serfe
```dataviewjs
const area = dv.current().area; // Lee el atributo 'area' del YAML de esta nota

dv.paragraph("```todoist\n" +
`name: "Mis tareas del área ${area}"\n` +
`filter: "##Obsidian & /${area} & @${area}"\n` +
"```");
```
`BUTTON[add-task-todoist]`

---
## Horas para cargar
> [!ABSTRACT] Panel de Control
> **Rango de Fechas:** `INPUT[date:reporte_inicio_registro]` al `INPUT[date:reporte_fin_registro]`

```dataviewjs
await dv.view("80_Templates/Scripts/planificar_tareas_helper", {});
const H = window._ptHelpers;
const fInicio = H.parseDate(dv.current().reporte_inicio_registro);
const fFin = H.parseDate(dv.current().reporte_fin_registro);
const currentName = dv.current().file.name;

// Pre-indexar páginas por origin (1 solo pase, lookup O(1))
const porOrigin = {};
dv.pages('"20_Projects" or "00_Inbox"').forEach(p => {
    const o = H.normalizarOrigin(p.origin);
    (porOrigin[o] ??= []).push(p);
});

// Recolectar páginas que pueden tener datos de tiempo
// Recursa siempre para capturar la cadena completa: project → task → sub → sub-sub
const pages = [];
const visitadas = new Set();
const recolectar = (nombre) => {
    if (visitadas.has(nombre)) return;
    visitadas.add(nombre);
    for (const p of porOrigin[nombre] || []) {
        const tags = p.tags?.toString().toLowerCase() || "";
        if (tags.includes("type/task") || tags.includes("type/task/sub") || tags.includes("type/training") || tags.includes("type/log")) pages.push(p);
        recolectar(p.file.name);
    }
};

// Projects y trainings que cuelgan directo del área
const hijos = porOrigin[currentName] || [];
for (const p of hijos) {
    if (p.tags?.includes("type/project")) recolectar(p.file.name);
    else if ((p.tags?.toString().toLowerCase()||"").includes("type/training")) pages.push(p);
}

// Cargar y parsear en paralelo
const resultados = await Promise.all(pages.map(async (page) => {
    const tags = page.file.tags?.toString().toLowerCase() || "";
    let tipo = "otro", campoTiempo = "duracion";
    if (tags.includes("type/task")) tipo = "tarea";
    else if (tags.includes("type/training")) { tipo = "capacitacion"; campoTiempo = "horas"; }
    else if (tags.includes("type/log")) tipo = "rutina";
    const contenido = await H.leerContenido(page.file.path);
    return { page, datos: contenido ? H.extraerDatosTabla(contenido, campoTiempo) : [], tipo };
}));

// Construir diario
const diario = {};
let totalPeriodoMins = 0;

for (const { page, datos, tipo } of resultados) {
    for (const fila of datos) {
        const fe = H.parseDate(fila.fecha);
        if (!fe.isValid() || !fe.isSameOrAfter(fInicio, 'day') || !fe.isSameOrBefore(fFin, 'day')) continue;
        const mins = H.toMins(fila.duracion);
        if (mins <= 0) continue;
        const k = fe.format("YYYY-MM-DD");
        if (!diario[k]) diario[k] = { entradas: [], totalMins: 0 };
        diario[k].entradas.push({
            link: `[[${page.file.path}\\|${page.file.name.split(" - ").pop()}]]`,
            nombre: fila.descripcion, tiempo: H.toStr(mins), mins, tipo
        });
        diario[k].totalMins += mins;
        totalPeriodoMins += mins;
    }
}

// Render
dv.header(3, `📅 Registro Diario (${fInicio.format("DD/MM")} - ${fFin.format("DD/MM")})`);
dv.paragraph(`**Tiempo Total Registrado:** ${H.toStr(totalPeriodoMins)} hs`);
dv.paragraph("---");

const dias = Object.keys(diario).sort((a, b) => new Date(b) - new Date(a));
if (!dias.length) { dv.paragraph("⚠️ No hay registros de tiempo en este rango de fechas."); }
else {
    for (const dia of dias) {
        const d = diario[dia];
        const tareas = d.entradas.filter(e => e.tipo === 'tarea');
        const capacis = d.entradas.filter(e => e.tipo === 'capacitacion');
        const rutinas = d.entradas.filter(e => e.tipo === 'rutina');
        const sum = (arr) => arr.reduce((a, e) => a + e.mins, 0);
        dv.header(3, `${moment(dia).format("dddd DD [de] MMMM")} — Total: ${H.toStr(d.totalMins)} hs`);
        dv.paragraph(`> [!QUOTE] Actividades
>
>> [!TODO] 🛠️ Proyectos (${H.toStr(sum(tareas))})
${H.crearTablaMD(tareas, ">>")}
>
>> [!NOTE] 🎓 Capacitaciones (${H.toStr(sum(capacis))})
${H.crearTablaMD(capacis, ">>")}
>
>> [!EXAMPLE] ☕ Rutina (${H.toStr(sum(rutinas))})
${H.crearTablaMD(rutinas, ">>")}`);
    }
}
```
---
## Capacitaciones
`button-create-training`
> [!ABSTRACT] Panel de Control
> **Rango de Fechas:** `INPUT[date:reporte_inicio]` al `INPUT[date:reporte_fin]`
> **Horas reportadas:** 
> - Total `INPUT[text:ultimo_total_reportado]`(HH:MM)
> - Serfe `INPUT[text:ultimo_serfe_reportado]`(HH:MM)

> [!Note] Generador de Reporte de Capacitaciones (Tracker)
> ```dataviewjs
> await dv.view("80_Templates/Scripts/planificar_tareas_helper", {});
> const H = window._ptHelpers;
>
> const fInicio = H.parseDate(dv.current().reporte_inicio);
> const fFin = H.parseDate(dv.current().reporte_fin);
> const rawUltimoTotal = dv.current().ultimo_total_reportado || "00:00";
> const rawUltimoSerfe = dv.current().ultimo_serfe_reportado || "00:00";
>
> const allTrainingPages = dv.pages("#type/training");
> const groupedPages = {};
> for (let p of allTrainingPages) {
>     let cat = p.category || "General";
>     if (!groupedPages[cat]) groupedPages[cat] = [];
>     groupedPages[cat].push(p);
> }
>
> let outputText = "", totalCalculadoMins = 0, totalSerfeMins = 0;
>
> for (const catName of Object.keys(groupedPages).sort()) {
>     const pages = groupedPages[catName];
>     if (!pages.length) continue;
>     let sectionText = "";
>     pages.sort((a, b) => H.parseDate(a.created) - H.parseDate(b.created));
>     for (const page of pages) {
>         let minsPage = 0;
>         if (page.fecha && page.horas) {
>             const fechas = Array.isArray(page.fecha) ? page.fecha : [page.fecha];
>             const horas = Array.isArray(page.horas) ? page.horas : [page.horas];
>             fechas.forEach((f, i) => {
>                 const fe = H.parseDate(f);
>                 if (fe.isSameOrAfter(fInicio, 'day') && fe.isSameOrBefore(fFin, 'day'))
>                     minsPage += H.toMins(horas[i]);
>             });
>         }
>         if (minsPage <= 0) continue;
>         const pct = page.serfe_coverage_pct ?? 100;
>         totalCalculadoMins += minsPage;
>         totalSerfeMins += minsPage * (pct / 100);
>         sectionText += `- ${page.file.name.split(" - ").pop()}${pct<100?` (${pct}%)`:""} `.padEnd(60,".") + ` ${H.toStr(minsPage)} hs\n`;
>     }
>     if (sectionText) outputText += `Capacitaciones ${catName}\n${sectionText}\n`;
> }
>
> const avanceTotal = totalCalculadoMins - H.toMins(rawUltimoTotal);
> const avanceSerfe = totalSerfeMins - H.toMins(rawUltimoSerfe);
> outputText += `\nAvance de la semana:  ${H.toStr(avanceTotal)} hrs total / ${H.toStr(avanceSerfe)} hrs cubre Serfe`;
> outputText += `\nTotales acumulados:   ${H.toStr(totalCalculadoMins)} hrs total / ${H.toStr(totalSerfeMins)} hrs cubre Serfe`;
>
> dv.paragraph("```text\n" + outputText + "\n```");
> ```
### 🎓 Seguimiento de Capacitaciones
```dataviewjs
const pages = dv.pages('"20_Projects" and #type/training')
    .where(p => p.origin && p.origin.path === dv.current().file.path)
    .sort(p => [p.status, p.category, p.created], "asc");

dv.table(
    ["Nombre", "Categoría", "Estado", "Cobertura"],
    pages.map(p => [
        "[["+p.file.name+"|"+p.file.name.split(" - ").pop()+"]]",
        p.category || "-",
        p.status || "-",
        (p.serfe_coverage_pct || 0) + "%"
    ])
);
```
---
##  Proyectos
`button-new-project`
```dataview
LIST WITHOUT ID
	link(file.link, upper(project))
FROM "20_Projects" AND #type/project
WHERE origin = this.file.link
```
---
##  🏔️ Áreas
`button-new-area`
```dataview
LIST WITHOUT ID
	link(file.link, upper(area))
FROM "25_Areas" AND #type/area 
WHERE origin = this.file.link
```
---
## ☕ Registro de Tiempos del Día
```dataview
LIST
FROM "00_Inbox" AND #type/log
WHERE origin = this.file.link
SORT created DESC
LIMIT 5
```
---
# Notas
`button-new-inbox-note`
```dataview
LIST
FROM "00_Inbox" AND #type/inbox 
WHERE origin = this.file.link
```
