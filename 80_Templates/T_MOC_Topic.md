---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
tags:
  - type/topic
<%*
let topic = String(tp.file.title).replace("MOC_","") || "";
  
if (!topic) return;

// escribir contenido del archivo
tR += `topic: ${topic}`;
%>
<% tp.file.include("[[script_detectar_origen]]") %>
---
# 🧠 <% topic %>

> [!QUOTE] 📝 Mis Notas
> _Explicá qué abarca este tópico, qué zettels son más importantes o fundacionales, y cómo se relacionan entre sí. Tus anotaciones son lo que diferencia un MOC de un tag de búsqueda._
> 
> Ejemplo: "Este tópico cubre los fundamentos de X. El zettel [[...]] es la entrada recomendada."

> [!QUOTE]- 📌 Enlaces Manuales
> _Enlaces manuales en orden significativo, con contexto entre cada uno:_
> 1. [[Zettel A]] — concepto fundacional
> 2. [[Zettel B]] — lo desarrolla aplicándolo a...
> 3. [[Zettel C]] — lo contrasta con...

```dataview
LIST
FROM "10_Library" AND #type/zettel
WHERE contains(topic, this.topic)
```
_⬆️ Listado automático (todos los zettels con este topic)_

`button-delete-note`