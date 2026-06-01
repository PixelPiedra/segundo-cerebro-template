# 📘 Manual Operativo del Vault

## 📑 Contenidos
- [[#⚡ Inicio Rápido]]
- [[#📂 Estructura del Vault (PARA + Zettelkasten + MOC)]]
- [[#Diccionario de Tags y Propiedades (La Gramática del Vault)]]
- [[#Tipos de Notas y Plantillas (El Catálogo)]]
- [[#✅ Conclusión: Reglas de Oro]]
- [[#⚙️ Sección: Mantenimiento Técnico]]
- [[#🔄 Backup y Sincronización con Git]]
- [[#🛠️ Sección: Guía de Personalización de Proyectos]]

---

## ⚡ Inicio Rápido

> **🆕 ¿Nunca usaste Obsidian?** Empezá por [[Onboarding Obsidian]] — cubre instalación, plugins, interfaz, y atajos.

Si es tu primera vez con este vault, seguí estos pasos:

### 1. Verificar que los plugins estén activos
Andá a **Settings → Community plugins** y asegurate de que estén **habilitados**:

**🔴 Requeridos (el sistema no funciona sin estos):**
- **Dataview** — consultas dinámicas y dashboards
- **Templater** — motor de plantillas con JavaScript (Settings → Templates → `80_Templates`)
- **Buttons** — botones accionables en notas
- **Meta Bind** — selectores y campos interactivos (Panel de Control)

**🟢 Opcionales pero recomendados:**
- **Periodic Notes** — necesario para Notas Diarias y Revisión Semanal (ver [[#📅 Notas Diarias y Semanales (Periodic Notes)|configuración abajo]]). El resto del vault funciona sin esto.
- **Todoist** — integración con Todoist en MOCs de proyecto/área (ver [[#🔗 Integración con Todoist|configuración abajo]]). El sistema de tareas nativo funciona independientemente.
- **Obsidian Git** — backup automático a GitHub (ver [[#🔄 Backup y Sincronización con Git|configuración abajo]]). Opcional pero muy recomendado.

### 2. Abrir el [[Dashboard]]
El archivo `Dashboard.md` es tu centro de mando. Desde acá ves tus áreas, capturas, esperando respuesta, ideas futuras, última revisión semanal, archivo, y últimas ideas. Todos los caminos empiezan acá.

### 3. Explorar el Dashboard
Desde el Dashboard podés:
- **📝 Nota Rápida** — capturar una idea al vuelo
- **📅 Nota del Día**, **`Ctrl+Shift+D`**, o clic en un día del calendario (barra derecha) — abrir la nota del día
- **➕ Nueva Área** — crear tu primera área de responsabilidad

Todas las acciones usan botones. No crees notas manualmente.

> **📌 Dos plugins de botones:** El vault usa **Meta Bind** para botones de acción (`` `BUTTON[btn-xxx]` ``: agregar tiempo, toggle, crear sub-tarea, etc.) y **Buttons** para crear notas y comandos (`` `button-xxx` ``: Nueva Área, Tarea, Zettel, etc.). Si ves un botón que no funciona, revisá [[Configuracion_Botones]] para la separación exacta. Los IDs con `btn-` los maneja Meta Bind; los que empiezan con `button-` los maneja Buttons.

### 4. Leer la Guía Práctica
Para instrucciones detalladas de todos los tipos de nota (Área, Proyecto, Tarea, Zettel, Nota Diaria, Revisión Semanal, Publicación, Archivo, Ideas Futuras, etc.), consultá [[Guía Práctica - Cómo Crear Notas|🛠️ Guía Práctica]].

---

Este Vault separa la **naturaleza** de la nota de su **ubicación**, utilizando una arquitectura de tres capas: Logística, Inteligencia y Navegación.

## 📂 Estructura del Vault (PARA + Zettelkasten + MOC)

### 1. La Capa de Logística: [[Método PARA|PARA]] (Carpetas)
Las carpetas definen el **flujo de trabajo** y la urgencia de la información. No clasifican temas, sino niveles de compromiso:

| **Carpeta**      | **Propósito**                                                           |
| ---------------- | ----------------------------------------------------------------------- |
| `00_Inbox`       | Punto de entrada para capturas rápidas y notas sin procesar.            |
| `10_Library`     | El "cerebro". Contiene notas atómicas (`#type/zettel`) y MOCs de temas. |
| `20_Projects`    | Gestión de proyectos con MOCs, ADRs y documentación.                    |
| `25_Areas`       | Gestión de áreas de responsabilidad (Trabajo, Personal, etc.).          |
| `30_Calendar`    | Notas diarias (`#type/daily`) y semanales (`#type/weekly-review`).      |
| `80_Templates`   | La lógica del sistema. **Infraestructura**.                             |
| `90_Admin`       | Configuración técnica, manuales y guías.                                |
| `99_Attachments` | Assets: PDFs, imágenes y adjuntos.                                      |

La carpeta `80_Templates` es el **"motor"** del sistema: sin ella no podrías mantener los metadatos (YAML) que hacen que el resto funcione.

### 2. La Capa de Inteligencia: [[Método Zettelkasten|Zettelkasten]] (Notas Atómicas)
Esta capa vive principalmente en **`10_Library`**. Aquí es donde el sistema "piensa":
- **Notas Atómicas (`#type/zettel`)**: Ideas individuales, breves, escritas con tus propias palabras.
- **Independencia**: A diferencia de las tareas o proyectos, estas notas son permanentes y no caducan; son los ladrillos de tu conocimiento personal.

### 3. La Capa de Navegación: [[Estrategia de navegación MOC (Map of Content|MOCs]] (Mapas de Contenido)
Los MOCs son tus mapas personales de conocimiento. No son meros resultados de búsqueda: **el valor del MOC está en tus notas y enlaces manuales** — vos decidís qué entra, en qué orden, y agregás contexto entre los links.

Cada MOC template incluye:
- **📝 Mis Notas** — un callout para que escribas tu contexto, prioridades y observaciones que la máquina no puede inferir
- **📌 Enlaces Manuales** (T_MOC_Topic) — links que vos elegís en orden significativo, con explicaciones
- **Listas automáticas Dataview (red de seguridad)** — listados automáticos que recolectan notas según su `origin` o `status`. Funcionan así:
  - **No requieren mantenimiento**: si creás una nota con `origin: [[MOC_Proyecto X]]`, aparece sola en su MOC. No necesitás acordarte de enlazarla manualmente.
  - **Atrapan lo que se te escapa**: si olvidaste enlazar una nota importante, la lista automática la muestra igual. Por eso es una "red de seguridad".
  - **Van al final del MOC**: primero va tu contexto manual (`📝 Mis Notas`), después tus enlaces elegidos a mano (`📌 Enlaces Manuales`), y al final la lista automática como respaldo. No reemplazan tu criterio, lo complementan.

Tipos de MOC:
- **MOC Central (Dashboard)**: Tu punto de control principal para ver todo el sistema.
- **MOC de Archivo (MOC_Archive)**: Vista central de todas las notas con estado `Archivado`.
- **MOC de Ideas Futuras (MOC_Someday)**: Lista central de proyectos y áreas con estado `Futuro` (ideas futuras).
- **MOCs de Estructura**: Plantillas específicas (`T_MOC_Area`, `T_MOC_Project`, `T_MOC_Topic`) que combinan tus anotaciones con Dataview.
- **Conexión**: Un MOC de un tópico en la librería conecta varias notas `zettel`, mientras que un MOC de proyecto organiza tus tareas por estado.

### Resumen del Ecosistema
| **Componente**   | **Función**                                                      | **Ubicación Principal**                  |
| ---------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| **PARA**         | **Logística**: Organiza por "cuándo" se necesita la información. | `20_Projects`, `25_Areas`, `00_Inbox`    |
| **Zettelkasten** | **Cerebro**: Almacena "qué" sabes de forma atómica.              | `10_Library` (`#type/zettel`)            |
| **MOC**          | **Brújula**: Crea mapas para "encontrar" y conectar todo.        | Notas `MOC_` en sus respectivas carpetas |
| **Templates**    | **Motor**: Automatiza la creación de metadatos y lógica.         | `80_Templates`                           |

---

## Diccionario de Tags y Propiedades (La "Gramática" del Vault)

El **Diccionario de Tags y Propiedades** es el ADN de tu Vault. Sin estos metadatos, las notas serían texto plano; con ellos, se convierten en una base de datos dinámica que **Dataview** puede leer para generar tus tableros y MOCs automáticamente.

### 1. Los Tags de Tipo (`#type/`)
Estos tags definen la **naturaleza** de la nota. Responden a la pregunta: _"¿Qué es este archivo?"_.

| **Tag**          | **Propósito**                                                | **Plantilla Asociada** |
| ---------------- | ------------------------------------------------------------ | ---------------------- |
| `#type/inbox`    | Notas rápidas que aún no han sido procesadas.                | `T_Create_Inbox_Note`  |
| `#type/zettel`   | Ideas atómicas y conocimiento permanente en la librería.     | `T_Create_Zettel`      |
| `#type/task`     | Acciones concretas con seguimiento de tiempo y prioridad.    | `T_Create_Task`        |
| `#type/task/sub` | Subtareas vinculadas al plan de desarrollo de una tarea.     | `T_Create_Sub_Task`    |
| `#type/project`  | MOCs que coordinan esfuerzos con una meta clara.             | `T_MOC_Project`        |
| `#type/area`     | MOCs de responsabilidades a largo plazo.                     | `T_MOC_Area`           |
| `#type/topic`    | Mapas de contenido que agrupan temas de conocimiento.        | `T_MOC_Topic`          |
| `#type/context`  | Información de soporte que da marco a un proyecto o área.    | `T_Create_Context`     |
| `#type/detail`   | Desgloses específicos de tareas o especificaciones técnicas. | `T_Create_Detail`      |
| `#type/training` | Registro de cursos y capacitaciones activas.                 | `T_Create_Training`    |
| `#type/log`      | Bitácoras de tiempos o registros de rutina diaria.           | `T_Create_Routine_Log` |
| `#type/daily`    | Notas diarias automáticas vía Periodic Notes.                | `T_Daily_Note`         |
| `#type/weekly-review` | Notas de revisión semanal automáticas.                 | `T_Weekly_Review`      |
| `#type/express`  | Publicaciones (blog, docs, tutoriales).                | `T_Create_Express`     |
| `#type/archive`  | MOC de items archivados (lectura, no se crea directamente).  | —                      |
| `#type/someday`  | MOC de ideas y proyectos futuros (Someday/Maybe de GTD).    | —                      |

### 2. Propiedades Universales (Frontmatter YAML)
Son los campos que aparecen al inicio de cada nota y permiten que el sistema "sepa" cómo conectarse.

- **`created`**: Fecha y hora de creación automática.
- **`origin`**: La propiedad más crítica. Almacena el enlace a la nota "padre" (MOC), permitiendo que la nota aparezca automáticamente en los listados del proyecto o área correspondiente.
- **`status`**: Define en qué etapa está la nota. Varía según el tipo:
    - **Capturas**: `Procesar`, `Revisión`, `Pausado`, `Archivado`, `Descartado`.
    - **Task**: `Nuevo`, `Asignado`, `Esperando`, `Revisión`, `Pruebas`, `Resuelto`, `Cerrado`, `Archivado`.
    - **Zettel**: `Perenne`, `Desarrollo`, `Deprecado`.
    - **Project**: `Activo`, `Pausado`, `Futuro`, `Completado`, `Archivado`.
    - **Area**: `Activo`, `Pausado`, `Futuro`, `Completado`, `Archivado`.
    - **Training**: `Activo`, `Completado`, `Pausado`, `Archivado`, `Cancelado`.
    - **Express**: `Borrador`, `Revisión`, `Publicado`, `Archivado`.

### 3. Propiedades Específicas (Funcionalidad Avanzada)

#### Para Desarrollo y Estimación (`#type/task`)
- **`ticket_id`**: Identificador del sistema de seguimiento externo (si usás uno).
- **`est_E`, `est_EE`, `est_P`**: Tríada de estimación (Optimista, Esperada, Pesimista).
- **`waiting_for`**: Persona/equipo del que se espera una acción (GTD "Esperando Respuesta"). Se llena cuando `status = Esperando`.
- **`waiting_since`**: Fecha desde la que se está esperando. Se completa automáticamente con `created` si no se especifica.

#### Para el Conocimiento (`#type/zettel` y `#type/training`)
- **`topic`**: Área temática a la que pertenece la idea.
- **`category`**: Clasificación para capacitaciones (ej. Habilidades Blandas, IT).
- **`distill`**: Capa de Destilación Progresiva (Original → Negrita → Destacado → Resumen → Remix). Se actualiza manualmente a medida que la nota madura.

#### Para Publicaciones (`#type/express`)
- **`format`**: Tipo de publicación (Artículo, Artículo Técnico, Documentación, Boletín, Tutorial, Nota Técnica).
- **`source_zettels`**: Lista de zettels fuente que inspiraron esta publicación.
- **`published_url`**: URL si fue publicada en algún lado.

#### Para Notas Semanales (`#type/weekly-review`)
- **`week`**: Número de semana ISO (`YYYY-[W]WW`).
- **`week_start`**: Fecha del lunes de la semana (calculado automáticamente al crear la nota).
- **`week_end`**: Fecha del domingo de la semana (calculado automáticamente).

### 4. Tipos de Relación entre Zettels (Conexiones Explicadas)

> Basado en el principio Zettelkasten: _"Junto a cada nota se debe especificar por qué está asociada a otra."_

En la sección `## 🔗 Conexiones` de cada zettel, usá estos prefijos para tipificar la relación:

| Prefijo | Significado                      | Ejemplo                                                                                        |
| ------- | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `→`     | **Desarrolla** / Lleva a         | `→ [[Arquitectura Hexagonal]] — aplica este principio al diseño de puertos y adaptadores`      |
| `←`     | **Proviene de** / Está basado en | `← [[Método PARA]] — esta idea sigue la misma lógica de organización por accionabilidad`       |
| `=`     | **Mismo concepto** / Equivalente | `‌= [[Zettelkasten]] — ambos sistemas priorizan la conexión sobre la clasificación`            |
| `≠`     | **Contrasta** / Diferente a      | `≠ [[GTD]] — mientras GTD organiza por contexto, Zettelkasten organiza por conexión semántica` |

**Regla**: Cada enlace en `## 🔗 Conexiones` debe ir acompañado de texto explicativo. No escribir solo el `[[link]]` vacío.

### 5. Por qué es importante respetar esta gramática
Si creas una nota de tarea y olvidás el tag `#type/task`, no aparecerá en el MOC de tu proyecto. Si `origin` está vacío, la nota queda **huérfana** y es difícil de encontrar.

> **Regla de oro:** Siempre usá las plantillas de `80_Templates`. Ellas escriben esta gramática por vos. Los botones usan estas plantillas.
---

## 🔧 Configuración de Plugins

### 📅 Notas Diarias y Semanales (Periodic Notes)

El plugin **Periodic Notes** ya viene instalado y configurado. Verificá en Settings → Periodic Notes que los valores sean:

| Campo | Daily Note | Weekly Review |
|-------|-----------|---------------|
| Folder | `30_Calendar` | `30_Calendar` |
| Format | `YYYY-MM-DD` | `YYYY-[W]WW` |
| Template | `80_Templates/T_Daily_Note` | `80_Templates/T_Weekly_Review` |

Si querés cambiar formato o carpeta, usá **Settings → Periodic Notes** desde Obsidian. No modifiques los templates.

**Atajos de teclado:** `Ctrl+Shift+D` (daily), `Ctrl+Shift+W` (weekly) — se configuran en Settings → Hotkeys → "Periodic Notes: Open daily note".

### 🔗 Integración con Todoist

Las secciones de Todoist en los MOCs de proyecto/área requieren:

1. Plugin **Todoist** instalado y activado
2. Token de API en modo **File-based** (obligatorio para los botones):
   - Andá a **Settings → Todoist → Token storage** y seleccioná **File-based**
   - Ingresá tu token de API en el campo que aparece
   - El plugin guarda el token en `.obsidian/todoist-token` automáticamente
   - El modo **Account** (por defecto) solo funciona para vistas, no para los botones
3. Una etiqueta `@[nombre-del-proyecto/área]` en Todoist (se crea automáticamente al crear el MOC)

El bloque ```` ```todoist ```` muestra tareas de Todoist filtradas por proyecto/área. No reemplaza el sistema de tareas nativo del vault — es complementario.

---

## Tipos de Notas y Plantillas (El "Catálogo")

### 1. Gestión y Navegación (MOCs)
- **Project MOC (`T_MOC_Project`)**: Gestiona el ciclo de vida de un proyecto. Separa tareas por estado (**Nuevo**, **Asignado**, **Esperando**, **Revisión**, **Pruebas**, **Resuelto**, **Cerrado**) e incluye sección `⏳ Esperando` con tabla de tareas esperando a alguien (quién y desde cuándo).
- **Area MOC (`T_MOC_Area`)**: Índice para una responsabilidad a largo plazo. Lista proyectos activos y sub-áreas.
- **Topic MOC (`T_MOC_Topic`)**: Agrupa todas las notas `#type/zettel` de un mismo tópico.
- **Ideas Futuras (`MOC_Someday`)**: Lista central de proyectos y áreas con estado `Futuro`. Incluye espacio para ideas sueltas y listas automáticas.

### 2. Ejecución y Trabajo Técnico
- **Task/Ticket (`T_Create_Task`)**: Incluye:
    - Estimación de tiempos (Optimista, Esperado, Pesimista).
    - Plan de Desarrollo con módulos y secuencia.
    - Bitácora de Ejecución con seguimiento automático.
    - Resumen de horas con DataviewJS (incluye subtareas).
    - Esperando: campo `waiting_for` + estado `Esperando` para tareas bloqueadas que dependen de terceros.
- **Sub-Task (`T_Create_Sub_Task`)**: Tarea que cuelga de una tarea padre. Se vincula al plan de desarrollo mediante `parent_task_id` y hereda `origin` y `project`.
- **Context (`T_Create_Context`)**: Define el marco general de un proyecto.
- **Detail (`T_Create_Detail`)**: Especificaciones técnicas o referencias dentro de una tarea.

### 3. Conocimiento y Aprendizaje
- **Zettel Note (`T_Create_Zettel`)**: Para ideas atómicas. Selector de tópicos existentes o creación de nuevos. Incluye sistema de **Destilación Progresiva** de 5 capas (Original → Negrita → Destacado → Resumen → Remix).
- **Training (`T_Create_Training`)**: Registro de cursos con bitácora de sesiones y cálculo de tiempo.

### 4. Temporal / Recurrente
- **Daily Note (`T_Daily_Note`)**: Capturas del día, pendientes, acceso a bitácora de tiempos y revisión diaria. Se crea con `button-daily-note` o `Ctrl+Shift+D`.
- **Weekly Review (`T_Weekly_Review`)**: Revisión semanal con inbox pendiente, proyectos activos, zettels de la semana, dailies, logros y prioridades. Se abre con `button-weekly-review`.

### 5. Publicaciones
- **Express (`T_Create_Express`)**: Convierte zettels en una publicación (blog, docs, tutorial). Incluye TL;DR, secciones de contenido, referencias a zettels fuente, y lista de verificación.

## ✅ Conclusión: Reglas de Oro

1. **Nunca crear notas manualmente**: Usar siempre los **Botones** y **Plantillas** para garantizar la integridad de los metadatos.
2. **Principio de Atomicidad**: Una nota Zettel debe contener una sola idea clara escrita con palabras propias.
3. **Destilá lo que aprendés**: Aplicá Destilación Progresiva en tus zettels (Original → Negrita → Destacado → Resumen → Remix).
4. **Archivá, no borres**: Cambiá el estado a `Archivado` en vez de eliminar. El conocimiento archivado sigue siendo valioso y visible en [[MOC_Archive]].
5. **Revisión semanal**: Usá `button-weekly-review` para procesar capturas, revisar proyectos y planificar la semana. Es el hábito que mantiene el sistema ordenado.
6. **Siempre desde el padre**: Creá las notas desde la nota donde querés que aparezcan (el `origin` se asigna automáticamente).

---

## ⚙️ Sección: Mantenimiento Técnico

- **Infraestructura**: Las plantillas en `80_Templates` contienen código Javascript (`<% ... %>`). No editar directamente sin verificar sintaxis: un error inhabilitará la creación de nuevas notas.
- **Botones**: La configuración está centralizada en [[Configuracion_Botones]]. Cualquier cambio en disparadores debe hacerse allí. El botón **🗑️ Eliminar nota actual** usa el comando `Delete current file` de Obsidian; si tenés Obsidian en otro idioma, cambiá `action` por el nombre del comando en ese idioma (ej: `Eliminar archivo actual` en español).
- **Periódicos (Daily/Weekly)**: Configurados en **Settings → Periodic Notes**. Si querés cambiar el formato de fecha o la carpeta, no tocar el template directamente.
- **Archivo**: [[MOC_Archive]] lista todo lo que tiene `status: Archivado`. Si querés excluir algún tipo de nota, editá las queries Dataview en ese archivo.
- **Ideas Futuras**: [[MOC_Someday]] lista proyectos y áreas con estado `Futuro`. Incluye espacio para ideas sueltas (manual) y listas automáticas de proyectos/áreas.
- **Esperando**: Las tareas con `waiting_for` poblado aparecen en el Dashboard (`⏳ Esperando Respuesta`) y en la sección `⏳ Esperando` del MOC de su proyecto.
- **Índice de Inteligencia**: [[MOC_Zettelkasten]] es el mapa de la biblioteca. Revisalo periódicamente para ver qué temas están creciendo y qué notas necesitan destilación.

---

## 🔄 Backup y Sincronización con Git

### 1. Preparar autenticación SSH (una sola vez)

Si vas a usar GitHub con SSH (recomendado), generá una llave específica para el vault:

```bash
# Linux / Mac
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_vault

# Windows (PowerShell como Admin)
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\id_rsa_vault
```

Agregá la llave pública (`id_rsa_vault.pub`) en **GitHub → Settings → SSH and GPG keys → New SSH key**.

Opcional: configurá `~/.ssh/config` para usar esta llave automáticamente:

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_vault
    IdentitiesOnly yes
```

Si ya tenés otras llaves SSH, usá un Host alias distinto (ej. `github.com-vault`) y acordate de usarlo al clonar.

### 2. Clonar el vault con la llave correcta

Si el repo ya existe en GitHub:

```bash
# Si configuraste el Host en ~/.ssh/config
git clone git@github.com:tu-usuario/tu-repo.git Segundo-Cerebro

# Si NO configuraste el Host (forzar llave específica)
git clone -c "core.sshCommand=ssh -i ~/.ssh/id_rsa_vault" git@github.com:tu-usuario/tu-repo.git
```

Después de clonar, fijar la llave para este repo (no afecta otros proyectos):

```bash
cd Segundo-Cerebro
git config core.sshCommand "ssh -i ~/.ssh/id_rsa_vault"
```

### 3. Activar el plugin Obsidian Git

El vault ya incluye el plugin. Solo hay que activarlo:

1. **Settings → Community plugins → Obsidian Git → Activar**
2. **Configurar backup automático:**
   - `Auto backup: after note change` → activar
   - `Auto commit interval (minutes)`: `15` o `30`
   - `Auto push interval (minutes)`: `30` o `60`
   - `Auto pull on startup` → activar
   - `Commit message`: `vault backup: {{date}} {{hostname}}`
3. **Verificar que funciona:** Settings → Obsidian Git → `Commit` y `Push` manual

### 4. Ignorar archivos locales

Creá o actualizá `.gitignore` en la raíz del vault:

```
.obsidian/workspace.json
.obsidian/workspace-mobile.json
.trash/
```

### 5. Windows — habilitar el servicio SSH Agent

Si estás en Windows y el paso 2 te da error de conexión:

```powershell
# PowerShell como Administrador
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add "$env:USERPROFILE\.ssh\id_rsa_vault"
```

> ⚠️ **Importante**: El vault de conocimiento es tan valioso como tu código. Perderlo por no tener backup duele más que configurarlo.

---

## 🛠️ Sección: Guía de Personalización de Proyectos

Dado que manejás proyectos técnicos diversos, esta sección te ayuda a decidir cuándo crear una herramienta nueva y cuándo adaptar la existente.

### Estrategia de Adaptación
Para evitar saturar `80_Templates`, seguí esta jerarquía:

1. **Modificación Ad-hoc (Recomendado)**: Usá la plantilla genérica de proyecto y añadí secciones manuales debajo de las consultas Dataview. Al ser Markdown libre, podés insertar tablas, diagramas o listas sin afectar los scripts.
2. **Plantillas Especializadas**: Solo creá una nueva plantilla si repetís la misma estructura manual más de 5 veces.
3. **Regla de Integridad**: Cualquier plantilla nueva **debe** conservar `tags: [type/...]` y `origin` para que los MOCs sigan funcionando.

---

## 📖 Lecturas Recomendadas

- [[Guía Práctica - Cómo Crear Notas|🛠️ Guía Práctica: Paso a Paso]]
- [[Configuracion_Botones|⚙️ Referencia de Botones]]
- [[MOC_Archive|🗃️ Archivo General]]
- [[MOC_Someday|🔮 Ideas Futuras]]
- [[MOC_Zettelkasten|🗃️ Índice de Conocimiento]]
- [[Método PARA|📐 Método PARA]]
- [[Método Zettelkasten|🧱 Método Zettelkasten]]
- [[Estrategia de navegación MOC (Map of Content|🧭 Estrategia MOC]]

---

# Templates
```dataview
TABLE
FROM "80_Templates"
```