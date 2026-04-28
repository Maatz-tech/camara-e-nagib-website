import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    image: z.string(),
    author: z.string().default('Câmara & Nagib'),
    authorImage: z
      .string()
      .default('/images/leaders/rafaela.webp'),
    category: z.enum([
      'Direito Imobiliário',
      'Direito de Família',
      'Sucessões',
      'Planejamento Patrimonial',
      'Notícias',
    ]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { blog };
