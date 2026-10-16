> [!tip] 📅 Hoy `button-daily-note` `button-weekly-review`
> ```dataview
> LIST WITHOUT ID
> 	"**" + dateformat(file.day, "dd-MM-yyyy") + "** → " + file.link
> FROM "30_Calendar" AND #type/daily
> SORT file.day DESC
> LIMIT 5
> ```

> [!summary]- 📋 Última Revisión
> ```dataview
> LIST WITHOUT ID
> 	"**" + week + "** → " + file.link + " (" + dateformat(file.mtime, "dd-MM-yyyy") + ")"
> FROM #type/weekly-review
> SORT file.mtime DESC
> LIMIT 1
> ```

> [!todo] 🏛️ Centro de Mando `button-new-area`
> 
> ```dataview
> TABLE WITHOUT ID
> 	link(file.link, upper(area)) AS "Área",
> 	dateformat(file.mtime, "dd-MM-yyyy") AS "Actualizado"
> FROM "25_Areas" AND #type/area 
> WHERE origin = this.file.link
> SORT file.name ASC
> ```

> [!todo] 📥 Capturas `button-new-inbox-note`
> ```dataview
> LIST
> FROM "00_Inbox"
> SORT file.ctime DESC
> LIMIT 5
> ```

> [!todo] 🧠 Últimas Ideas Procesadas | [[MOC_Zettelkasten|🗃️ Explorar Conocimiento]]
> ```dataview
> LIST
> FROM #type/zettel 
> SORT file.ctime DESC
> LIMIT 5
> ```

> [!warning]- ⏳ Esperando Respuesta
> ```dataview
> TABLE WITHOUT ID
> 	file.link AS "Tarea",
> 	waiting_for AS "Esperando a",
> 	dateformat(file.ctime, "dd-MM-yyyy") AS "Desde"
> FROM "20_Projects" AND #type/task
> WHERE waiting_for != "" AND status != "Cerrado" AND status != "Resuelto" AND status != "Archivado"
> SORT file.ctime ASC
> ```

> [!quote]- 🔮 Ideas Futuras
> [[MOC_Someday|📋 Ver Lista Completa]]
> ```dataview
> TABLE WITHOUT ID
> 	rows.file.link AS "Tipo",
> 	length(rows) AS "Cantidad"
> FROM ""
> WHERE status = "Futuro"
> GROUP BY type
> SORT rows.file.link ASC
> ```

> [!info]- 🗃️ Archivo (items con status Archivado)
> [[MOC_Archive|📋 Ver Archivo Completo]]
> ```dataview
> TABLE WITHOUT ID
> 	rows.file.link AS "Tipo",
> 	length(rows) AS "Cantidad"
> FROM ""
> WHERE status = "Archivado"
> GROUP BY type
> SORT rows.file.link ASC
> ```

> [!help]- 📘 Recursos de Ayuda
> - [[Guía del Vault|📖 Cómo usar este sistema]]
> - [[Guía Práctica - Cómo Crear Notas|🛠️ Guía Práctica: Paso a Paso]]
> - [[Configuracion_Botones|⚙️ Configuración de Botones]]