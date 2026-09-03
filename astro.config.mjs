// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // The live Netlify address. Change this to the custom domain the day it is
  // connected — it sets canonical URLs, Open Graph tags and the sitemap.
  site: 'https://julienneblackburn.netlify.app',
  output: 'static',
  adapter: netlify({
    devFeatures: {
      // Netlify's Image CDN, emulated locally.
      images: true,
      // This project has no edge functions, and booting the local Deno runtime
      // for them crashes `astro dev` with an unhandled rejection.
      edgeFunctions: false,
      // Would pull env vars from a linked Netlify site; not needed locally.
      environmentVariables: false,
    },
  }),
  integrations: [react(), keystatic()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    responsiveStyles: true,
  },
});
