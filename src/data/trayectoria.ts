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

/** Grouped capabilities. No meters or percentages — scannable lists only. */
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
      'custom post types',
      'plantillas single/archive',
      'publicación de páginas y entradas',
      'biblioteca de medios',
      'mantenimiento de sitios',
    ],
  },
  {
    name: 'WooCommerce',
    items: [
      'fundamentos de WooCommerce',
      'mantenimiento de tienda y contenido',
      'configuración vía plugins',
      'actualización de productos y páginas',
      'ajustes de layout',
      'resolución de problemas básicos',
    ],
  },
  {
    name: 'Front-end',
    items: [
      'HTML5 y estructura semántica',
      'CSS3',
      'Flexbox',
      'Grid',
      'diseño responsive y mobile-first',
      'fundamentos de JavaScript',
      'comprensión del DOM',
      'Chrome DevTools',
      'pruebas cross-browser',
    ],
  },
  {
    name: 'Back-end / programación',
    items: [
      'PHP para personalización de WordPress',
      'desarrollo de temas a medida',
      'bases de MySQL/PostgreSQL',
      'consumo de REST API e integraciones básicas de API',
      'fundamentos de Ruby on Rails',
      'MVC y ActiveRecord',
    ],
  },
  {
    name: 'SEO y rendimiento',
    items: [
      'SEO on-page',
      'jerarquía de encabezados',
      'metadatos',
      'alt text',
      'internal links',
      'optimización de imágenes',
      'WebP y compresión',
      'lazy loading',
      'optimización de CSS/JS',
      'manejo de redirecciones',
    ],
  },
  {
    name: 'Herramientas y flujo de trabajo',
    items: [
      'Git y GitHub',
      'cPanel',
      'bases de DNS y SSL',
      'Google Drive',
      'Trello',
      'flujos ágiles básicos',
    ],
  },
  {
    name: 'IA en el desarrollo',
    items: [
      'uso diario de asistentes de IA',
      'depuración asistida',
      'generación y revisión de código',
      'optimización de flujos de trabajo',
    ],
  },
];
