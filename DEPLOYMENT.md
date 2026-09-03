# Deployment notes

## Netlify build settings

| Setting        | Value           |
| -------------- | --------------- |
| Build command  | `npm run build` |
| Publish dir    | `dist`          |
| Node version   | 22              |

These are already set in `netlify.toml`, so nothing needs configuring by hand.

## Environment variables (required for the CMS in production)

Keystatic runs in **local** mode during development and in **GitHub** mode on the
live site. GitHub mode needs a GitHub App so Julienne can log in with her GitHub
account and have her edits committed on her behalf.

1. Go to `https://<the-live-site>/keystatic/setup` and follow the wizard — it
   creates the GitHub App for you and prints the three values below.
2. Add them in Netlify under **Site configuration → Environment variables**:

| Variable                        | Where it comes from                      |
| ------------------------------- | ---------------------------------------- |
| `KEYSTATIC_GITHUB_CLIENT_ID`     | the setup wizard                        |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | the setup wizard                        |
| `KEYSTATIC_SECRET`               | the setup wizard (a random string)      |

3. Redeploy. `/keystatic` will then ask Julienne to sign in with GitHub.

The repo owner/name Keystatic writes to is set in `keystatic.config.ts`
(`rtaustin/julienne`). Update it if the repo ever moves.

## Forms

The contact, gallery-submission, and testimony forms use **Netlify Forms**. They
are detected automatically from the built HTML on the first deploy. After that:

- Netlify → **Forms** shows every submission, including uploaded artwork.
- Set up **Form notifications** so Julienne gets an email whenever one arrives.

## Images

Images are served through the Netlify Image CDN (`/.netlify/images`). If that
ever needs turning off, set the environment variable `PUBLIC_IMAGE_CDN=0` and
redeploy — the site will serve the original files instead.

## Custom domain

Add the domain in Netlify → **Domain management**, then update `site` in
`astro.config.mjs` and the `Sitemap:` line in `public/robots.txt` to match.
