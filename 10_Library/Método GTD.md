---
created: 2026-06-02
status: Evergreen
tags:
  - type/zettel
topic:
  - organización
origin: "[[Guía del Vault]]"
---
# 🧠 Idea: Método GTD

> [!ABSTRACT] 🧭 Panel de Control
> **Estado**: `INPUT[inlineSelect(option(Evergreen), option(Developing), option(Deprecated)):status]`  
> 
> **Topic**: `BUTTON[btn-add-topic]`  

---
## Concepto
**GTD (Getting Things Done)** es un sistema de productividad personal creado por **David Allen**. Se basa en la idea de que la productividad no se trata de hacer más, sino de **liberar la mente** para que no tenga que recordar lo que hay que hacer. El cerebro es para tener ideas, no para almacenarlas.

GTD tiene 5 fases: **Capturar → Clarificar → Organizar → Revisar → Ejecutar**.

---
## Implementación en el Vault

### 📥 1. Capturar
Todo entra al `00_Inbox/`. Ideas, correos, conversaciones, tareas sueltas.
- Botón `button-new-inbox-note` en cualquier MOC
- La nota capturada queda con `type/inbox` hasta procesarla

### 🔍 2. Clarificar (Procesar)
Cada nota del inbox se revisa y se le asigna:
- **Próxima acción** concreta
- **Proyecto** o **Área** destino (`origin`)
- **Estado** (Nuevo → Asignado → Revisión → etc.)

### 📂 3. Organizar — Contextos GTD en el Vault

| Contexto GTD | Dónde se refleja |
|---|---|
| **Próximas acciones** | Tareas con status `Nuevo` o `Asignado` en proyectos activos |
| **Proyectos** | `20_Projects/` con `#type/project` |
| **Esperando...** | Tareas con campo `waiting_for` + `waiting_since` |
| **Futuro/Algún Día** | [[MOC_Someday]] — proyectos/áreas con status `Futuro` |
| **Referencia** | `10_Library/` — zettels, guías, recursos |
| **Archivo** | [[MOC_Archive]] — notas con status `Archivado` |

### 🔄 4. Revisar (Weekly Review)
- **Weekly Review** desde `30_Calendar/` con `T_Weekly_Review`
- Se revisa inbox, proyectos activos, waiting, someday y zettels
- Acceso desde Dashboard → `button-weekly-review`

### 🎯 5. Ejecutar
- Por proyecto: desde el MOC del proyecto (tablas por estado)
- Por área: desde [[MOC_Personal]], [[MOC_Trabajo]], etc.
- Prioridades: campo `priority` en el YAML de cada tarea

---
## Notas relacionadas
`button-create-zettel`
```dataview
LIST
FROM "10_Library"
WHERE origin = this.file.link
```
---
`button-delete-note`
