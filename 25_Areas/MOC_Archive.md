---
created: 2026-05-30
tags:
  - type/archive
status: Activo
---

# 🗃️ Archivo General

> Notas con `status: Archivado`. Se mantienen en sus carpetas originales (no se mueven físicamente) pero ya no aparecen en las vistas activas del Dashboard ni en los MOCs de áreas/proyectos.
>
> Para archivar una nota: abrí su Panel de Control y cambiá el **Estado** a `Archivado`.

---

## 📊 Resumen

```dataview
TABLE WITHOUT ID
	rows.file.link AS "Items Archivados"
FROM ""
WHERE status = "Archivado"
GROUP BY type
SORT rows.file.link ASC
```

---

## 🏗️ Proyectos Archivados

```dataview
TABLE WITHOUT ID
	file.link AS "Proyecto",
	dateformat(file.mtime, "dd-MM-yyyy") AS "Archivado"
FROM "20_Projects" AND #type/project
WHERE status = "Archivado"
SORT file.mtime DESC
```

## 🛠️ Tareas Archivadas

```dataview
TABLE WITHOUT ID
	file.link AS "Tarea",
	priority AS "Prioridad",
	dateformat(file.mtime, "dd-MM-yyyy") AS "Archivado"
FROM "20_Projects" AND #type/task
WHERE status = "Archivado"
SORT file.mtime DESC
```

## 🏔️ Áreas Archivadas

```dataview
TABLE WITHOUT ID
	file.link AS "Área",
	dateformat(file.mtime, "dd-MM-yyyy") AS "Archivado"
FROM "25_Areas" AND #type/area
WHERE status = "Archivado"
SORT file.mtime DESC
```

## 📥 Capturas Archivadas

```dataview
TABLE WITHOUT ID
	file.link AS "Nota",
	dateformat(file.mtime, "dd-MM-yyyy") AS "Archivado"
FROM "00_Inbox"
WHERE status = "Archivado"
SORT file.mtime DESC
```

## 🎓 Training Archivados

```dataview
TABLE WITHOUT ID
	file.link AS "Capacitación",
	dateformat(file.mtime, "dd-MM-yyyy") AS "Archivado"
FROM "20_Projects" AND #type/training
WHERE status = "Archivado"
SORT file.mtime DESC
```
