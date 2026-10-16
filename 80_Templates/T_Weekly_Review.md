---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
tags:
  - type/weekly-review
week: <% tp.date.now("YYYY-[W]WW") %>
<%*
// Calcular lunes y domingo de esta semana
const now = new Date();
const dayOfWeek = now.getDay(); // 0=domingo
const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
const monday = new Date(now);
monday.setDate(now.getDate() + diffToMonday);
const sunday = new Date(monday);
sunday.setDate(monday.getDate() + 6);

const pad = n => String(n).padStart(2, '0');
const fmtDate = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtShort = d => `${pad(d.getDate())}/${pad(d.getMonth()+1)}`;

tR += `week_start: ${fmtDate(monday)}\n`;
tR += `week_end: ${fmtDate(sunday)}\n`;
%>
status: Activo
---

# 📋 Review Semanal — Semana <% tp.date.now("WW") %>

> [!info] 📅 Rango: <%* tR += fmtShort(monday) + " → " + fmtShort(sunday); %>

---
## 📥 Capturas — Procesar pendientes

- [ ] Revisar y clasificar cada nota del inbox
- [ ] Convertir a zettel, task, o descartar

```dataview
TABLE WITHOUT ID
	file.link AS "Nota",
	dateformat(file.ctime, "dd-MM HH:mm") AS "Creado"
FROM "00_Inbox"
WHERE status != "Archivado" AND status != "Descartado"
SORT file.ctime ASC
```

---
## 🏗️ Proyectos Activos
`button-new-project`

```dataview
TABLE WITHOUT ID
	file.link AS "Proyecto",
	status AS "Estado",
	priority AS "Prioridad"
FROM "20_Projects" AND #type/project
WHERE status != "Archivado" AND status != "Completado"
SORT priority ASC
```

---
## 🧠 Zettels Creados Esta Semana

```dataview
TABLE WITHOUT ID
	file.link AS "Zettel",
	distill AS "Destilado",
	topic AS "Topic"
FROM #type/zettel
WHERE date(file.ctime) >= date(this.week_start)
	AND date(file.ctime) <= date(this.week_end)
SORT file.ctime DESC
```

---
## 📅 Daily Notes de la Semana

```dataview
LIST WITHOUT ID
	file.link + " — " + dateformat(file.day, "dddd dd/MM")
FROM "30_Calendar" AND #type/daily
WHERE date(file.day) >= date(this.week_start)
	AND date(file.day) <= date(this.week_end)
SORT file.day ASC
```

---
## 🏆 Logros de la Semana

- 

## 📉 Desafíos / Obstáculos

- 

---
## 🎯 Prioridades para la Próxima Semana

1. 
2. 
3. 

> [!tip] Pro tip: Después de completar, pasá el estado a `Completado` y linkeá esta nota desde la daily del lunes próximo.
