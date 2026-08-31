import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Services: title + supporting copy shown as a card. `order` is the sole
// display-order authority (never rely on filesystem order).
const services = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string().min(3).max(80),
    summary: z.string().min(20).max(400),
    icon: z.enum(['institucional', 'contenido', 'optimizacion', 'autonomia']).optional(),
    order: z.number().int().positive(),
    draft: z.boolean().default(false),
  }),
});

// Projects: the markdown body is "Qué hice"; `context` is the distinct
// "Qué era" field (spec requires both, rendered under separate labels).
// `context` has no upper bound — the real brief copy exceeds any short cap.
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(3).max(80),
    client: z.string().min(2).max(80),
    context: z.string().min(20),
    summary: z.string().min(20).optional(),
    url: z.string().url(),
    displayUrl: z.string().min(3),
    stack: z.array(z.string().min(1)).min(1).max(8),
    year: z.number().int().min(2015).max(2100).optional(),
    order: z.number().int().positive(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, projects };
