---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
status: Procesar
tags: 
  - type/inbox
<% tp.file.include("[[script_detectar_origen]]") %>
---
# 📥 Nueva Captura: <% tp.file.title.replace(tp.date.now("YYYY-MM-DD_HH-mm_"),"") %>
> [!ABSTRACT] 🧭 Panel de Control
> **Estado**: `INPUT[inlineSelect(option(Procesar), option(Revisión), option(Pausado), option(Archivado), option(Descartado)):status]`  

---
## 🖋️ Notas


---
`button-create-zettel` `button-delete-note`