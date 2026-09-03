# Deployment notes

## Netlify build settings

| Setting        | Value           |
| -------------- | --------------- |
| Build command  | `npm run build` |
| Publish dir    | `dist`          |
| Node version   | 22              |

These are already set in `netlify.toml`, so nothing needs configuring by hand.

## Getting the CMS working in production

Keystatic runs in **local** mode during development (no login, edits the files
directly) and in **GitHub** mode on the live site. GitHub mode needs a GitHub App so
edits can be committed on the editor's behalf. Until it is configured, `/keystatic`
shows a "Sign in with GitHub" button that returns **HTTP 500** — that is the missing
configuration, not a broken deploy or a missing custom domain.

### Setup

1. Visit `/keystatic/setup` on the live site. The wizard creates the GitHub App and
   prints the values below.
2. Add all four in Netlify under **Site configuration → Environment variables**:

| Variable | Notes |
| --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | from the wizard |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | from the wizard — secret |
| `KEYSTATIC_SECRET` | from the wizard — random string, signs the session cookie |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | the app's slug, e.g. `julienne-blackburn-cms` |

   The first three are read at request time. The fourth is `PUBLIC_`, so it is baked
   in **at build time** — after setting it you must trigger a fresh deploy, not just
   restart. Setting the vars alone changes nothing until the site rebuilds.

3. Redeploy. `/keystatic` will then sign in properly.

The repo Keystatic writes to is set in `keystatic.config.ts` (`rtaustin/julienne`).
Update it if the repo moves.

### Alternative: Keystatic Cloud

Keystatic Cloud replaces the GitHub login with an email login, so a non-technical
editor never needs a GitHub account. The Hobby tier is free for one editor and one
repo. To switch, create a project at keystatic.cloud and change the `storage` block
in `keystatic.config.ts` to `{ kind: 'cloud' }` with the `cloud.project` name — the
GitHub env vars above are then unnecessary.

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
