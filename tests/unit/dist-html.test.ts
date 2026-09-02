import { createHash } from 'node:crypto';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { parseHTML } from 'linkedom';
import matter from 'gray-matter';

const distIndex = fileURLToPath(new URL('../../dist/index.html', import.meta.url));
const servicesDir = fileURLToPath(new URL('../../src/content/services', import.meta.url));
const projectsDir = fileURLToPath(new URL('../../src/content/projects', import.meta.url));
const netlifyToml = fileURLToPath(new URL('../../netlify.toml', import.meta.url));

function readFrontmatter(dir: string) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map((f) => matter(readFileSync(`${dir}/${f}`, 'utf8')).data as Record<string, unknown>);
}

let html = '';
let doc: Document;

beforeAll(() => {
  if (!existsSync(distIndex)) {
    throw new Error('Run `npm run build` before vitest: dist/index.html not found');
  }
  html = readFileSync(distIndex, 'utf8');
  doc = parseHTML(html).document as unknown as Document;
});

describe('dist/index.html structure', () => {
  it('has exactly one <h1> and at least four <h2>', () => {
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelectorAll('h2').length).toBeGreaterThanOrEqual(4);
  });

  it('never skips a heading level in document order', () => {
    const levels = [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) =>
      Number(el.tagName[1]),
    );
    expect(levels[0]).toBe(1);
    let prev = 0;
    for (const level of levels) {
      expect(level).toBeLessThanOrEqual(prev + 1);
      prev = level;
    }
  });

  it('resolves every in-page anchor to a real id', () => {
    const anchors = [...doc.querySelectorAll('a[href^="#"]')] as HTMLAnchorElement[];
    expect(anchors.length).toBeGreaterThan(0);
    for (const a of anchors) {
      const id = a.getAttribute('href')!.slice(1);
      if (!id) continue;
      expect(doc.getElementById(id), `missing id #${id}`).not.toBeNull();
    }
  });

  it('exposes exactly one of each singleton landmark', () => {
    for (const tag of ['header', 'nav', 'main', 'footer']) {
      expect(doc.querySelectorAll(tag), `expected one <${tag}>`).toHaveLength(1);
    }
  });

  it('renders the four Spanish section ids in order inside <main>', () => {
    const main = doc.querySelector('main')!;
    const ids = ['servicios', 'proyectos', 'sobre-mi', 'contacto'];
    for (const id of ids) {
      const el = doc.getElementById(id)!;
      expect(el, `missing #${id}`).not.toBeNull();
      expect(main.contains(el), `#${id} not inside <main>`).toBe(true);
    }
    const order = ids.map((id) => html.indexOf(`id="${id}"`));
    expect([...order]).toEqual([...order].sort((a, b) => a - b));
  });
});

describe('dist/index.html content matches the content collections', () => {
  const services = readFrontmatter(servicesDir);
  const projects = readFrontmatter(projectsDir);

  it('renders all four service titles', () => {
    expect(services).toHaveLength(4);
    for (const s of services) {
      expect(html).toContain(String(s.title));
    }
  });

  it('renders every project title, url, displayUrl and stack entry', () => {
    expect(projects).toHaveLength(4);
    for (const p of projects) {
      expect(html, `title ${p.title}`).toContain(String(p.title));
      expect(html, `url ${p.url}`).toContain(String(p.url));
      expect(html, `displayUrl ${p.displayUrl}`).toContain(String(p.displayUrl));
      for (const tech of p.stack as string[]) {
        expect(html, `stack ${tech}`).toContain(tech);
      }
    }
  });

  it('renders the four live project hostnames', () => {
    for (const host of [
      'vozcatolica.com',
      'saintpetertorot.com',
      'ejerciciosespirituales.org',
      'maradentro.ive.org',
    ]) {
      expect(html).toContain(host);
    }
  });

  it('gives each project card a description paragraph and a Stack line', () => {
    expect(html.match(/>Stack</g) ?? []).toHaveLength(4);
    // A distinctive phrase from each project's markdown body must render.
    for (const phrase of [
      'sistemas de contenido dinámico a medida',
      'medir el alcance por país',
      'las herramientas que usa el equipo',
      'optimización para móviles',
    ]) {
      expect(html, phrase).toContain(phrase);
    }
  });

  it('renders the Spanish section headings', () => {
    for (const heading of ['Qué puedo hacer por vos', 'Proyectos', 'Sobre mí', 'Trabajemos juntos']) {
      expect(html).toContain(heading);
    }
  });
});

describe('dist/index.html head metadata', () => {
  it('sets lang, canonical and an absolute og:image', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('es-AR');
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://guillermobarazzutti.netlify.app/',
    );
    const og = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '';
    expect(og.startsWith('https://guillermobarazzutti.netlify.app/')).toBe(true);
  });

  it('emits a non-empty title and a Spanish description', () => {
    expect((doc.querySelector('title')?.textContent ?? '').trim().length).toBeGreaterThan(0);
    const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
    expect(desc.length).toBeGreaterThan(0);
    expect(desc).toMatch(/desarrollador|sitios|WordPress/i);
  });

  it('emits the OpenGraph and Twitter card tags', () => {
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image']) {
      expect(doc.querySelector(`meta[property="${prop}"]`), prop).not.toBeNull();
    }
    expect(doc.querySelector('meta[name="twitter:card"]')).not.toBeNull();
  });

  it('carries a JSON-LD Person block that parses', () => {
    const raw = doc.querySelector('script[type="application/ld+json"]')?.textContent ?? '';
    const data = JSON.parse(raw);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Guillermo Barazzutti');
  });
});

describe('dist/index.html contact + regression guards', () => {
  it('links email and WhatsApp with the verified values', () => {
    expect(doc.querySelector('a[href="mailto:guillermobarazzutti.dev@gmail.com"]')).not.toBeNull();
    const wa = [...doc.querySelectorAll('a[href]')].some((a) =>
      (a.getAttribute('href') ?? '').startsWith('https://wa.me/5493813667657'),
    );
    expect(wa).toBe(true);
  });

  it('opens external project links safely', () => {
    const externals = [...doc.querySelectorAll('a[target="_blank"]')] as HTMLAnchorElement[];
    expect(externals.length).toBeGreaterThan(0);
    for (const a of externals) {
      expect(a.getAttribute('rel') ?? '').toContain('noopener');
    }
  });

  it('contains no legacy English copy or stale paths', () => {
    for (const needle of [
      'passionate',
      "I'm learning React",
      'See my projects',
      'gbarazutti',
      '/personal-portfolio/',
    ]) {
      expect(html).not.toContain(needle);
    }
  });
});

describe('dist/index.html Netlify contact form', () => {
  it('renders a data-netlify form named "contacto" with a honeypot', () => {
    const form = doc.querySelector('form[name="contacto"]') as HTMLFormElement | null;
    expect(form).not.toBeNull();
    expect(form!.getAttribute('method')?.toUpperCase()).toBe('POST');
    expect(form!.getAttribute('data-netlify')).toBe('true');
    expect(form!.getAttribute('data-netlify-honeypot')).toBe('bot-field');
    expect(form!.getAttribute('action')).toBe('/gracias/');
    expect(form!.querySelector('input[type="hidden"][name="form-name"][value="contacto"]')).not.toBeNull();
    expect(form!.querySelector('input[name="bot-field"]')).not.toBeNull();
  });

  it('has labelled name, email and message fields, all required', () => {
    for (const [name, sel] of [
      ['nombre', 'input[name="nombre"]'],
      ['email', 'input[name="email"][type="email"]'],
      ['mensaje', 'textarea[name="mensaje"]'],
    ] as const) {
      const field = doc.querySelector(sel) as HTMLElement | null;
      expect(field, name).not.toBeNull();
      expect(field!.hasAttribute('required'), `${name} required`).toBe(true);
      const id = field!.getAttribute('id');
      expect(id, `${name} id`).toBeTruthy();
      expect(doc.querySelector(`label[for="${id}"]`), `${name} label`).not.toBeNull();
    }
  });
});

describe('dist/gracias success page', () => {
  const distGracias = fileURLToPath(new URL('../../dist/gracias/index.html', import.meta.url));

  it('is built and marked noindex', () => {
    expect(existsSync(distGracias)).toBe(true);
    const g = parseHTML(readFileSync(distGracias, 'utf8')).document as unknown as Document;
    expect(g.querySelector('meta[name="robots"]')?.getAttribute('content')).toContain('noindex');
    expect(g.querySelectorAll('h1')).toHaveLength(1);
  });
});

describe('netlify.toml security headers', () => {
  const toml = readFileSync(netlifyToml, 'utf8');
  const csp =
    toml.match(/Content-Security-Policy\s*=\s*"([^"]+)"/)?.[1] ?? '';

  it('declares a CSP and the standard hardening headers for "/*"', () => {
    expect(toml).toMatch(/for\s*=\s*"\/\*"/);
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("form-action 'self'");
    for (const header of [
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Referrer-Policy',
      'Permissions-Policy',
    ]) {
      expect(toml, header).toContain(header);
    }
  });

  it('whitelists every inline <script> the build emits by sha256 hash', () => {
    const pages = ['index.html', 'gracias/index.html', 'trayectoria/index.html'].map(
      (p) => fileURLToPath(new URL(`../../dist/${p}`, import.meta.url)),
    );
    const hashes = new Set<string>();
    for (const page of pages) {
      const pageHtml = readFileSync(page, 'utf8');
      for (const m of pageHtml.matchAll(
        /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g,
      )) {
        if (/application\/ld\+json/.test(m[1])) continue;
        hashes.add(`sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}`);
      }
    }
    expect(hashes.size).toBeGreaterThan(0);
    expect(csp).toContain("script-src 'self'");
    expect(csp).not.toContain("'unsafe-inline'");
    for (const hash of hashes) {
      expect(csp, `CSP is missing ${hash} — recompute the hashes in netlify.toml`).toContain(
        hash,
      );
    }
  });
});

describe('dist/trayectoria page', () => {
  const distTrayectoria = fileURLToPath(
    new URL('../../dist/trayectoria/index.html', import.meta.url),
  );
  let tHtml = '';
  let tDoc: Document;

  beforeAll(() => {
    expect(existsSync(distTrayectoria), 'dist/trayectoria/index.html not found').toBe(true);
    tHtml = readFileSync(distTrayectoria, 'utf8');
    tDoc = parseHTML(tHtml).document as unknown as Document;
  });

  it('has exactly one <h1>', () => {
    expect(tDoc.querySelectorAll('h1')).toHaveLength(1);
  });

  it('never skips a heading level in document order', () => {
    const levels = [...tDoc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((el) =>
      Number(el.tagName[1]),
    );
    expect(levels[0]).toBe(1);
    let prev = 0;
    for (const level of levels) {
      expect(level).toBeLessThanOrEqual(prev + 1);
      prev = level;
    }
  });

  it('is indexable — robots contains "index" and not "noindex"', () => {
    const robots = tDoc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
    expect(robots).toContain('index');
    expect(robots).not.toContain('noindex');
  });

  it('names the three roles, the AI group, both languages and the new section', () => {
    for (const needle of [
      'Voz Católica',
      'Dispack',
      'Independiente',
      'freelance',
      'IA en el desarrollo',
      'Más allá de WordPress',
      'Astro 5',
      'Español',
      'Inglés',
    ]) {
      expect(tHtml, needle).toContain(needle);
    }
  });

  it('links out to LinkedIn and GitHub', () => {
    expect(
      tDoc.querySelector('a[href="https://linkedin.com/in/gbarazzutti"]'),
      'LinkedIn href',
    ).not.toBeNull();
    expect(
      tDoc.querySelector('a[href="https://github.com/gbarazzutti"]'),
      'GitHub href',
    ).not.toBeNull();
  });
});
