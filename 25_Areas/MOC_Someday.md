---
created: 2026-05-30
tags:
  - type/someday
status: Activo
---

# 🔮 Ideas Futuras

> Ideas, proyectos y áreas que **podrían** hacerse algún día pero no son compromiso hoy.
>
> Para marcar algo como Futuro: abrí su Panel de Control y cambiá el **Estado** a `Futuro`.
> Cuando quieras activarlo, volvé a `Activo` y definí la próxima acción.

---

## 📝 Ideas Sueltas

_Espacio para ideas que no ameritan un proyecto entero._

- 

---

## 🏗️ Proyectos (Futuro)

```dataview
TABLE WITHOUT ID
	file.link AS "Proyecto",
	priority AS "Prioridad",
	dateformat(file.ctime, "dd-MM-yyyy") AS "Creado"
FROM "20_Projects" AND #type/project
WHERE status = "Futuro"
SORT priority ASC, file.ctime DESC
```

## 🏔️ Áreas (Futuro)

```dataview
TABLE WITHOUT ID
	file.link AS "Área",
	dateformat(file.ctime, "dd-MM-yyyy") AS "Creado"
FROM "25_Areas" AND #type/area
WHERE status = "Futuro"
SORT file.ctime DESC
```
