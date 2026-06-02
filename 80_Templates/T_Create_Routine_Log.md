---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
tags:  
  - type/log
<% tp.file.include("[[script_detectar_origen]]") %>
---
# ☕ Registro de Tiempos<% const r=tp.file.title.replace(/^\d{4}-\d{2}-\d{2}_/,"").replace(/_Routine$/,""); if(r) { %>: <% r %><% } %>
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