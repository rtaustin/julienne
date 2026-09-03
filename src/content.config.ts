import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Every collection below is editable from the CMS at /keystatic.
 * Files are plain Markdown with YAML frontmatter, committed to GitHub,
 * which is what triggers a new Netlify deploy.
 */

const prayers = defineCollection({
  loader: glob({ base: './src/content/prayers', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z
      .enum(['Deliverance', 'Protection', 'Healing', 'Generational', 'Daily Strength', 'Other'])
      .default('Other'),
    summary: z.string().optional(),
    scripture: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const videos = defineCollection({
  loader: glob({ base: './src/content/videos', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    platform: z.enum(['youtube', 'tiktok', 'other']).default('youtube'),
    /** YouTube video ID, TikTok video ID, or a full URL for "other". */
    videoId: z.string(),
    url: z.string().optional(),
    topic: z
      .enum([
        'Recognizing the Patterns',
        'Narcissistic Abuse',
        'Boundaries',
        'Healing & Recovery',
        'Faith & Deliverance',
        'Other',
      ])
      .default('Other'),
    summary: z.string().optional(),
    thumbnail: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ base: './src/content/gallery', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    artist: z.string().default('Anonymous'),
    medium: z.string().optional(),
    image: z.string(),
    alt: z.string(),
    date: z.coerce.date(),
    /** Julienne sets this to true only after reviewing and praying over the piece. */
    approved: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const testimonies = defineCollection({
  loader: glob({ base: './src/content/testimonies', pattern: '**/*.md' }),
  schema: z.object({
    name: z.string().default('Anonymous'),
    location: z.string().optional(),
    headline: z.string(),
    date: z.coerce.date(),
    approved: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const sunshine = defineCollection({
  loader: glob({ base: './src/content/sunshine', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    category: z
      .enum(['Outside', 'Grounding', 'Nature', 'Movement', 'Stillness', 'Creativity'])
      .default('Outside'),
    summary: z.string(),
    image: z.string().optional(),
    minutes: z.string().optional(),
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { prayers, videos, gallery, testimonies, sunshine };
