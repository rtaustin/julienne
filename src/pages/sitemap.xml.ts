import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const staticPaths = [
  '/',
  '/about',
  '/coaching',
  '/schedule',
  '/giving',
  '/prayers',
  '/videos',
  '/sunshine',
  '/gallery',
  '/gallery/submit',
  '/testimonies',
  '/testimonies/share',
  '/contact',
  '/disclaimer',
];

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://julienneblackburn.netlify.app')).origin;

  const [prayers, sunshine, gallery] = await Promise.all([
    getCollection('prayers', ({ data }) => !data.draft),
    getCollection('sunshine', ({ data }) => !data.draft),
    getCollection('gallery', ({ data }) => data.approved),
  ]);

  const urls = [
    ...staticPaths,
    ...prayers.map((entry) => `/prayers/${entry.id}/`),
    ...sunshine.map((entry) => `/sunshine/${entry.id}/`),
    ...gallery.map((entry) => `/gallery/${entry.id}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
