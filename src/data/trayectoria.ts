// Typed content for the standalone /trayectoria page. Kept out of the content
// collections on purpose: this is page-local structured copy, not a collection.

export interface ExperienceEntry {
  /** Job title. */
  role: string;
  /** Company / employer. */
  org: string;
  /** Human-readable date range, e.g. "may 2022 – actualidad". */
  period: string;
  /** Responsibility / achievement bullets, most relevant first. */
  bullets: string[];
}

export interface SkillGroup {
  /** Group heading, rendered as an <h3>. */
  name: string;
  /** Flat list of capabilities shown as a chip row. */
  items: string[];
}

/** Roles, most-recent / current first. */
export const experiencia: ExperienceEntry[] = [
  {
    role: 'Web Developer & CMS Specialist',
    org: 'Voz Católica',
    period: 'may 2022 – actualidad',
    bullets: [
      'Administro y mantengo más de 20 sitios WordPress en producción activa.',
      'Construyo y actualizo páginas responsive con Elementor y Elementor Pro, WPBakery, ACF y LearnDash, con secciones y plantillas reutilizables.',
      'Personalizo estructura y contenido con HTML, CSS, JavaScript y PHP: campos ACF, custom post types, plantillas single/archive y contenido dinámico.',
      'Diagnostico problemas de maquetación, responsive, plugins y visualización con Chrome DevTools y un proceso de depuración estructurado.',
      'Aplico SEO on-page y buenas prácticas de estructura: jerarquía de encabezados, HTML semántico, metadatos, alt text e internal links.',
      'Mejoro el rendimiento: optimización de imágenes (WebP/compresión), lazy loading, reducción de assets y limpieza de front-end.',
      'Mantenimiento: actualización de plugins, backups, QA de contenido, chequeo de links y de responsive, estabilidad general.',
      'Trabajo con los equipos de contenido, diseño e internos para coordinar actualizaciones en varios sitios a la vez.',
    ],
  },
  {
    role: 'Ruby on Rails Developer',
    org: 'Dispack / SoffySoft',
    period: 'sep 2023 – may 2024',
    bullets: [
      'Desarrollé y mejoré funcionalidades en una aplicación de logística en Ruby on Rails, con PostgreSQL y ActiveRecord sobre modelos relacionales.',
      'Implementé y di soporte a integraciones con la API de Google Maps para ubicación de envíos y cálculo de precios.',
      'Participé en los flujos de testing con RSpec dentro de una aplicación MVC.',
    ],
  },
  {
    role: 'Desarrollador web freelance',
    org: 'Independiente',
    period: '2021 – actualidad',
    bullets: [
      'Desarrollo y mantengo sitios WordPress para proyectos propios y clientes.',
      'Construcción con page builders, ajustes de front-end a medida, layouts responsive y configuración de WordPress.',
      'Soluciones de punta a punta: de la maquetación al deploy y la publicación de contenido.',
    ],
  },
];

/** Grouped tools and techniques — terse tags, not task descriptions
    (those live in the Experiencia bullets). No meters or percentages. */
export const stack: SkillGroup[] = [
  {
    name: 'WordPress y CMS',
    items: [
      'WordPress',
      'Elementor / Elementor Pro',
      'Gutenberg',
      'WPBakery',
      'ACF',
      'LearnDash',
      'Theme Builder',
      'Custom post types',
      'Plantillas single/archive',
      'WooCommerce',
    ],
  },
  {
    name: 'Front-end',
    items: [
      'HTML5',
      'CSS3',
      'Flexbox',
      'Grid',
      'Responsive',
      'Mobile-first',
      'JavaScript',
      'DOM',
      'Chrome DevTools',
      'Testing cross-browser',
    ],
  },
  {
    name: 'Back-end y programación',
    items: [
      'PHP',
      'Temas WordPress a medida',
      'MySQL',
      'PostgreSQL',
      'REST APIs',
      'Ruby on Rails',
      'MVC',
      'ActiveRecord',
    ],
  },
  {
    name: 'SEO y rendimiento',
    items: [
      'SEO on-page',
      'HTML semántico',
      'Metadatos',
      'Core Web Vitals',
      'Optimización de imágenes',
      'WebP',
      'Lazy loading',
      'Minificación CSS/JS',
      'Redirecciones',
    ],
  },
  {
    name: 'Herramientas y flujo',
    items: [
      'Git / GitHub',
      'Astro',
      'Tailwind CSS',
      'Vitest',
      'Playwright',
      'CI/CD',
      'cPanel',
      'DNS / SSL',
      'Metodologías ágiles',
    ],
  },
  {
    name: 'IA en el desarrollo',
    items: [
      'Asistentes de IA (uso diario)',
      'Depuración asistida',
      'Generación y revisión de código',
      'Optimización de flujos',
    ],
  },
];
