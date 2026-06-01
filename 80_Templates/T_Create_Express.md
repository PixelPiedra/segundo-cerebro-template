---
created: <% tp.date.now("YYYY-MM-DD HH:mm") %>
status: Borrador
tags:
  - type/express
format: 
source_zettels: 
published_url: 
<% tp.file.include("[[script_detectar_origen]]") %>
---

# 📝 <% tp.file.title %>

> [!ABSTRACT] 🧭 Panel de Control
> **Estado**: `INPUT[inlineSelect(option(Borrador), option(Revisión), option(Publicado), option(Archivado)):status]`  
> **Formato**: `INPUT[inlineSelect(option(Artículo), option(Artículo Técnico), option(Documentación), option(Boletín), option(Tutorial), option(Nota Técnica)):format]`
> **Zettels fuente**: `INPUT[text:source_zettels]`
> **URL publicada**: `INPUT[text:published_url]`

---
## 🎯 TL;DR
> Resumen ejecutivo de esta publicación en 2-3 líneas.

---

## 📖 Contenido

### Introducción

### Desarrollo

### Conclusión

---

## 🔗 Zettels Relacionados

```dataview
TABLE WITHOUT ID
	file.link AS "Zettel",
	distill AS "Destilado",
	topic AS "Topic"
FROM #type/zettel
WHERE contains(this.source_zettels, file.name)
	OR contains(this.source_zettels, file.link)
```

---
## ✅ Lista de Verificación

- [ ] Revisión ortográfica y gramatical
- [ ] Links funcionan
- [ ] Zettels fuente citados correctamente
- [ ] Público objetivo definido
- [ ] Listo para publicar → cambiar estado a `Publicado`
