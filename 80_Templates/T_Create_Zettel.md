---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
status: Perenne
distill: Original
tags:
  - type/zettel
<%*
const FOLDER = "10_Library";

const files = app.vault.getMarkdownFiles()
  .filter(f => f.path.startsWith(FOLDER));

let topics = new Set();

for (const file of files) {
  const cache = app.metadataCache.getFileCache(file);
  const fm = cache?.frontmatter;

  if (fm?.topic) {
    if (Array.isArray(fm.topic)) {
      fm.topic.forEach(t => topics.add(String(t)));
    } else {
      topics.add(String(fm.topic));
    }
  }
}

let topicList = Array.from(topics).sort();

// opción para crear uno nuevo
topicList.unshift("➕ Nuevo topic");

const selected = await tp.system.suggester(
  topicList,
  topicList
);

let finalTopic;

if (selected === "➕ Nuevo topic") {
  finalTopic = await tp.system.prompt("Nombre del nuevo topic");
} else {
  finalTopic = selected;
}

// fallback de seguridad
finalTopic = finalTopic?.trim() || "General";

tR += `topic:\n  - ${finalTopic}\n`;
%> 
<% tp.file.include("[[script_detectar_origen]]") %>
---
# 🧠 Idea: <% tp.file.title %>
> [!ABSTRACT] 🧭 Panel de Control
> **Estado**: `INPUT[inlineSelect(option(Perenne), option(Desarrollo), option(Deprecado)):status]`  
> **Destilado**: `INPUT[inlineSelect(option(Original), option(Negrita), option(Destacado), option(Resumen), option(Remix)):distill]`
> **Topic**: `BUTTON[btn-add-topic]`  

> [!QUOTE]- 💎 Resumen Ejecutivo (Capa 4)
> _Escribí acá un resumen en 2-3 líneas cuando la nota esté madura._
> 
> **Idea central:**
> 
> **Puntos clave:**
> - 

---
## Concepto


---
## 🔗 Conexiones
> _Conexiones activas que creás manualmente. Explicá brevemente **por qué** se relaciona cada nota._
> 
> Usá estos prefijos para el tipo de relación: `→` desarrolla, `←` proviene de, `‌=` mismo concepto, `≠` contrasta.

- 

## 📎 Enlaces entrantes
> Notas que **apuntan a esta** (enlaces entrantes).

```dataview
LIST
FROM "10_Library"
WHERE contains(file.outlinks, this.file.link)
```

## 📡 Enlaces automáticos
> Notas creadas desde esta nota como contexto.

```dataview
LIST
FROM "10_Library"
WHERE origin = this.file.link
```

---
`button-create-zettel` `button-delete-note`