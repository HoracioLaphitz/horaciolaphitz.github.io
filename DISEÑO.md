Documento de Requerimientos para Portfolio de Analista de Datos
Enfoque: Desarrollo Agentivo con Ingeniería de Prompts
Arquitectura Limpia, Principios SOLID, Scrum — No negociables

1. Introducción
1.1 Propósito
Este documento define los requerimientos funcionales y no funcionales, la arquitectura de software, el plan de acción y la metodología de desarrollo agentivo para construir un portfolio web profesional de un analista de datos. El sitio destacará habilidades técnicas, proyectos, visualizaciones y capacidad de comunicación, mediante una experiencia de usuario sofisticada con animaciones inteligentes, paleta cromática sobria y sistema de temas heredables (claro/oscuro).

1.2 Alcance
El producto es una aplicación web de página única (Single Page Application) que integra:

Secciones informativas: Inicio, Sobre mí, Proyectos, Habilidades, Contacto.

Sistema de temas: Conmutación claro/oscuro, variables CSS heredables, personalización de colores vía tokens de diseño.

Animaciones: Microinteracciones, desplazamientos suaves, revelaciones progresivas, transiciones de entrada/salida, usando bibliotecas como Framer Motion o GSAP.

Visualizaciones de datos: Gráficos interactivos desarrollados con D3.js o Chart.js (opcional, en proyectos destacados).

Arquitectura basada en Clean Architecture para separación de responsabilidades.

Aplicación estricta de los principios SOLID en el código fuente.

Gestión del proyecto con Scrum (backlog, sprints, ceremonias).

Desarrollo agentivo asistido por IA: Uso de agentes de lenguaje con ingeniería de prompts para acelerar la generación de código, pruebas y documentación, manteniendo la calidad arquitectónica.

2. Objetivos del Proyecto
Exhibir un portfolio profesional, moderno y elegante que refleje dominio técnico y sensibilidad estética.

Demostrar el uso de buenas prácticas de ingeniería de software (Clean Architecture, SOLID) incluso en un proyecto de frontend.

Implementar un sistema de temas escalable, heredable y mantenible por medio de design tokens y hojas de estilo en cascada.

Incorporar animaciones que mejoren la narrativa visual sin sacrificar rendimiento ni accesibilidad.

Ejecutar el desarrollo con un marco ágil (Scrum) y acelerar las entregas mediante desarrollo agentivo con IA e ingeniería de prompts.

3. Requisitos Funcionales
3.1 Secciones y Contenido
ID	Requisito	Descripción
RF‑01	Inicio / Hero	Título, subtítulo animado, botón de llamado a la acción (CTA). Fondo con efecto sutil de partículas o gradiente animado.
RF‑02	Sobre mí	Texto descriptivo, foto profesional, cronología de experiencia o formación con animación de scroll.
RF‑03	Proyectos	Galería de tarjetas con imagen, título, resumen, tecnologías y enlace a demo/repositorio. Animación de revelación al hacer scroll (fade in + slide up).
RF‑04	Habilidades	Visualización de competencias (barras, radar o nube de etiquetas). Gráficos animados al entrar en el viewport.
RF‑05	Contacto	Formulario con validación en tiempo real, envío por servicio backend (puede simularse). Animación en botón de envío y mensajes de estado.
RF‑06	Navegación	Menú fijo superior con indicador de sección activa (spy scroll), desplazamiento suave.
RF‑07	Conmutador de Tema	Botón flotante para alternar entre tema claro y oscuro, con transición de colores sin parpadeo. Preferencia almacenada en localStorage.
3.2 Sistema de Temas Heredados
ID	Requisito	Descripción
RF‑08	Definición de tokens	Paleta de colores definida en variables CSS (custom properties) en un archivo base. Dos conjuntos de valores: [data-theme="light"] y [data-theme="dark"].
RF‑09	Herencia	Los componentes deben heredar colores y tipografías desde las variables del ancestro más cercano, permitiendo sobreescrituras locales sin romper el tema global.
RF‑10	Animaciones adaptativas al tema	Las animaciones (ej. brillos, sombras) deben responder al tema activo, usando las mismas variables (ej. --shadow-color).
4. Requisitos No Funcionales
4.1 Rendimiento
Carga inicial inferior a 2 segundos (Lighthouse Performance ≥ 90).

Animaciones a 60 fps, utilizando will-change y transform solo cuando sea necesario.

Lazy loading de imágenes y componentes pesados.

4.2 Accesibilidad
Cumplimiento WCAG 2.1 nivel AA.

Contraste mínimo 4.5:1 en ambos temas.

Navegación completa por teclado.

Atributos ARIA en componentes interactivos.

4.3 Mantenibilidad y Escalabilidad
Código TypeScript estricto.

Estructura de carpetas basada en Clean Architecture (Domain, Application, Infrastructure, Presentation).

Estilos gestionados con Tailwind CSS y complementados con variables CSS para temas.

Pruebas unitarias con Vitest, pruebas de componentes con Testing Library.

4.4 Estética y Experiencia de Usuario
Paleta de colores sobria: Escala de grises fríos, azul petróleo, acentos en coral apagado o dorado viejo. Ejemplo de tokens: --color-surface, --color-text-primary, --color-accent.

Animaciones inteligentes: Solo se animan elementos cuando aportan claridad (jerarquía visual, feedback). Las transiciones duran entre 200‑400 ms con curvas ease-in-out. Efectos de parallax sutiles en el fondo.

Microinteracciones: Botones con cambio de escala al 98% al presionar, enlaces con subrayado animado, tarjetas con elevación al pasar el ratón.

Consistencia tipográfica: Fuente sans-serif geométrica para títulos (ej. Inter, Poppins) y serif elegante para citas (opcional).

4.5 Seguridad
Sanitización de datos del formulario.

Protección contra ataques XSS mediante escape automático de React.

CORS configurado en el servidor de API (si existe).

5. Arquitectura Limpia (Clean Architecture)
El sistema se estructura en cuatro capas concéntricas, con dependencias hacia adentro:

text
src/
├── domain/          # Entidades y casos de uso (interfaces abstractas)
│   ├── entities/    # Ej. Project, Skill, ContactMessage
│   └── usecases/    # Ej. GetProjects, SendContactMessage
├── application/     # Orquestación e interfaces de repositorio
│   └── interfaces/  # Puertos (IProjectRepository, IEmailService)
├── infrastructure/  # Implementaciones concretas (API, almacenamiento)
│   └── repositories/ # ProjectApiRepository, LocalStorageThemeRepository
└── presentation/    # Componentes UI, hooks, store (React)
    ├── components/  # Átomos, moléculas, organismos
    ├── hooks/       # Lógica de presentación reutilizable
    ├── styles/      # Tokens CSS, configuración de temas
    └── pages/       # Vistas compuestas (Home, About, Projects…)

Domain: Lógica de negocio pura, independiente del framework. Define entidades y casos de uso abstractos.

Application: Expone contratos (puertos) que la capa de presentación consume sin conocer los detalles de infraestructura.

Infrastructure: Adaptadores que implementan los puertos (llamadas a API mock, localStorage, etc.).

Presentation: Componentes React que usan hooks para consumir casos de uso inyectados mediante un contenedor de dependencias.

Justificación: Esta separación permite cambiar el origen de datos (de archivos JSON locales a un CMS headless) sin tocar la UI, y facilita las pruebas unitarias aislando cada capa.

6. Principios SOLID Aplicados
Cada uno de los cinco principios se refleja en el diseño e implementación:

S – Principio de Responsabilidad Única (SRP)
Cada componente React tiene una única razón de cambiar. Ej.: ThemeToggle solo gestiona la UI de cambio de tema; la lógica de almacenamiento y aplicación del tema reside en un hook useTheme.

O – Principio Abierto/Cerrado (OCP)
El sistema de temas está abierto a extensión (se pueden añadir nuevos temas como high-contrast) sin modificar el código base que consume los tokens. La galería de proyectos acepta distintos tipos de tarjeta mediante un patrón de composición.

L – Principio de Sustitución de Liskov (LSP)
Las implementaciones concretas de repositorios (ej. MockProjectRepository, ApiProjectRepository) pueden sustituir a la interfaz IProjectRepository sin que la capa de presentación note diferencia.

I – Principio de Segregación de Interfaces (ISP)
Las interfaces de repositorio son pequeñas y específicas: IProjectRepository, ISkillRepository, en lugar de un único IDataRepository genérico.

D – Principio de Inversión de Dependencias (DIP)
Los casos de uso dependen de abstracciones (puertos) y no de implementaciones concretas. La inyección de dependencias se realiza a nivel de aplicación, por ejemplo mediante React Context o un contenedor ligero.

7. Plan de Acción con Scrum (No Negociable)
7.1 Roles
Product Owner: Define y prioriza historias de usuario, valida prototipos de diseño.

Scrum Master: Facilita ceremonias, elimina impedimentos, vela por el proceso.

Development Team: 2‑3 desarrolladores (puede incluir perfiles fullstack) + diseñador UI/UX + QA. En el enfoque agentivo, cada desarrollador cuenta con asistencia de IA.

7.2 Ceremonias
Sprint Planning (cada 2 semanas)

Daily Scrum (15 min)

Sprint Review (demo funcional con stakeholders)

Sprint Retrospective (mejora continua)

7.3 Backlog Priorizado (Épicas e Historias de Usuario)
Épica 1: Fundación del Proyecto

HU‑01: Configuración de repositorio, entorno de desarrollo, linter, formateador.

HU‑02: Definición de la arquitectura de carpetas y contenedor de dependencias.

HU‑03: Configuración del sistema de temas y tokens de diseño (claro/oscuro).

Épica 2: Landing y Navegación

HU‑04: Componente Hero con animación de entrada.

HU‑05: Barra de navegación con scroll spy.

HU‑06: Botón flotante de cambio de tema con transición.

Épica 3: Secciones de Contenido

HU‑07: Sección “Sobre mí” con animación de revelación.

HU‑08: Galería de proyectos (tarjetas animadas, filtro por tecnología).

HU‑09: Visualización de habilidades (gráfico de radar animado).

HU‑10: Formulario de contacto con validación y feedback animado.

Épica 4: Refinamiento y Despliegue

HU‑12: Optimización de rendimiento.

HU‑13: Despliegue en Vercel, configuración de CI/CD.

1. Desarrollo Agentivo con Ingeniería de Prompts
8.1 Concepto
Se emplearán modelos de lenguaje de gran escala (LLM) como “agentes de desarrollo” que, mediante prompts detallados y contextualizados, generarán código, pruebas, documentación y estilos. Los desarrolladores humanos actuarán como revisores, integradores y garantes de la arquitectura. Cada prompt incluirá restricciones precisas sobre Clean Architecture, SOLID, tipo de componente y diseño.

8.2 Flujo de Trabajo Agentivo
Definición del prompt (ingeniería de prompts): se redacta una instrucción que especifica la tarea, el contexto arquitectónico, las interfaces, los principios SOLID, las herramientas de animación y los requisitos de estilo.

Generación mediante el agente IA (por ejemplo, Copilot Chat, ChatGPT API, Cursor).

Revisión humana: se verifica que el código generado cumpla los contratos, no introduzca dependencias incorrectas y respete las convenciones.

Integración en el repositorio con pruebas automáticas.

Iteración si es necesario, refinando el prompt.

Prompt para Generar el Sistema de Temas:

“Genera un módulo de temas para una aplicación React con TypeScript. Utiliza Clean Architecture: la lógica de temas es un caso de uso que depende de un puerto IThemeRepository para guardar/cargar preferencias. Implementa un hook useTheme que retorne { theme, toggleTheme }. Los estilos deben basarse en variables CSS (--color-bg, --color-text, etc.) aplicadas al atributo data-theme del :root. Aplica SRP separando el hook del componente ThemeToggle. El toggle debe ser un componente accesible con animación de desvanecimiento del icono (sol/luna) usando Framer Motion. Genera también el archivo CSS con tokens base para tema claro y oscuro.”

Prompt para el Componente ProjectCard con Animación:

*“Crea un componente React funcional ProjectCard que reciba un objeto Project (title, description, image, tags, liveUrl). Utiliza TypeScript y Framer Motion para animación de entrada (fade in + slide up al hacer scroll). Aplica el patrón de composición para que la imagen, el contenido y el footer sean subcomponentes intercambiables (ISP). Los estilos usarán Tailwind CSS, pero los colores de fondo y texto deben venir de variables CSS heredables. El componente no debe llamar directamente a ningún repositorio; recibirá los datos por props o a través de un contenedor superior (DIP). Implementa microinteracción hover (escala 1.02, sombra elevada). Asegura accesibilidad (enlace con aria-label). Escribe también el test unitario con Testing Library que verifique la animación de entrada.”*

Prompt para el Gráfico de Habilidades con D3:

“Genera un hook useRadarChart y un componente SkillsRadar que visualicen las habilidades del analista. El hook debe encargarse de la manipulación del DOM con D3.js, mientras que el componente solo debe pasar un contenedor ref. Aplica SRP e ISP: el hook expone una interfaz mínima { containerRef }. Los colores del gráfico deben obtenerse de variables CSS (tema heredable). La animación de dibujo debe ejecutarse cuando el elemento entre al viewport (Intersection Observer). El componente debe ser independiente del origen de datos; recibe skills como prop. Escribe el prompt de manera que la IA también proponga los tipos de datos necesarios.”

“Revisa el siguiente código del formulario de contacto y refactorízalo para cumplir con el Principio de Responsabilidad Única, segregando la validación, el estado del formulario y el envío en funciones/hooks separados. Aplica Inversión de Dependencias creando una interfaz IContactService que el componente consuma mediante contexto. Asegura que la función de envío sea independiente de la capa de presentación. Proporciona el código TypeScript final y los tests unitarios de la lógica de validación.”

Reducción del tiempo de codificación repetitiva.

Consistencia con los patrones definidos, ya que los prompts refuerzan continuamente la arquitectura.

Documentación implícita en la generación de código comentado y tipado.

Iteración rápida sobre variaciones de diseño (animaciones, estilos) sin reescribir desde cero.

# Stack Tecnológico 
Frontend: React 18+ con TypeScript, Next.js (opcional para SSG), Tailwind CSS, Framer Motion, React Hook Form, Zod (validación).

Gráficos: D3.js (o Recharts para alternativas más rápidas).

Pruebas: Vitest, Testing Library, Mock Service Worker.

CI/CD: GitHub Actions, despliegue en Vercel.

Agentes IA: GitHub Copilot, ChatGPT (GPT-4o), Cursor IDE.

Gestión del proyecto: Jira / Trello + ceremonias Scrum presenciales/virtuales.

10. Criterios de Aceptación y Definición de Hecho (DoD)
Código en TypeScript con cobertura de pruebas ≥ 80% en lógica de negocio.

Todos los componentes cumplen las reglas de arquitectura (sin dependencias de infraestructura en presentación).

El tema cambia instantáneamente sin recargar, respetando la preferencia guardada.

Animaciones fluidas y coherentes, sin jank medible en Lighthouse.

Pasa auditoría de accesibilidad automática (axe-core) y manual (navegación por teclado).

Historias de usuario demo funcional en la Sprint Review y aceptada por el Product Owner.