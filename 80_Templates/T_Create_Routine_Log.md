---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
tags:  
  - type/log
<% tp.file.include("[[script_detectar_origen]]") %>
---
# ☕ Registro de Tiempos del Día
## ⏱ Bitácora del Día
| Fecha                | Inicio | Fin   | Duración           | Tipo   | Tarea Realizada |
| :------------------- | :----- | :---- | :----------------- | :----- | :-------------- |
`BUTTON[btn-add-interruption]` `BUTTON[btn-recalcular-tiempos]`

## 📊 Gantt del Día
```dataviewjs
await dv.view("80_Templates/Scripts/planificar_tareas_helper", {});
const H = window._ptHelpers;
await H.renderGanttDia(dv.current().file.path);
```
`button-delete-note`