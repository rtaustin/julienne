# Julienne Blackburn Coaching

Marketing and resource website for Julienne Blackburn, a trauma-informed life coach.

- **Framework:** [Astro](https://astro.build) 7
- **Styling:** Tailwind CSS 4 (brand tokens live in `src/styles/global.css`)
- **CMS:** [Keystatic](https://keystatic.com) at `/keystatic`
- **Host:** Netlify, deployed from the `main` branch of this repo

## Local development

```bash
npm install
npm run dev
```

The site runs at `http://localhost:4321`, and the CMS at
`http://localhost:4321/keystatic`. In development Keystatic edits the files in
this folder directly — no GitHub login needed.

## Project layout

```
src/
  content/          Markdown written through the CMS
    prayers/        Printable deliverance prayers
    videos/         Teaching video entries
    gallery/        Survivor art (only shows when `approved: true`)
    testimonies/    Stories (only shows when `approved: true`)
    sunshine/       Grounding and outdoor practices
  data/             JSON for the fixed pages, also CMS-editable
  pages/            One file per route
  components/       Header, footer, icons, booking embed
  layouts/Base.astro  Shell: head tags, fonts, skip link, schema.org
  styles/global.css   Brand tokens, buttons, cards, forms, print styles
keystatic.config.ts   Every field Julienne sees in the CMS
```

## Content that needs approval

Gallery pieces and testimonies are hidden until their `approved` checkbox is
ticked in the CMS. Submissions arrive through Netlify Forms — they are never
published automatically.

## Deploying

Netlify builds `main` on every push. See `DEPLOYMENT.md` for the environment
variables the CMS needs in production, and for the forms and image settings.
