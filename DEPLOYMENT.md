# Deployment notes

## Netlify build settings

| Setting        | Value           |
| -------------- | --------------- |
| Build command  | `npm run build` |
| Publish dir    | `dist`          |
| Node version   | 22              |

These are already set in `netlify.toml`, so nothing needs configuring by hand.

## Getting the CMS working in production

Keystatic runs in **local** mode during development (no login, edits files directly)
and in **Keystatic Cloud** mode on the live site, so Julienne signs in with an email
address rather than needing a GitHub account. The Hobby tier is free for one editor
and one repo.

Until the cloud project exists, `/keystatic` on the live site will not sign in.

### Setup

1. Create a project at https://keystatic.cloud and link it to `rtaustin/julienne`.
2. Put the identifier it gives you — `team-slug/project-slug` — into `CLOUD_PROJECT`
   at the top of `keystatic.config.ts`, replacing the placeholder.
3. Under **Project URLs**, set the Primary URL to where the site is deployed —
   currently `https://julienneblackburn.netlify.app`. This is an allowlist: sign-in
   only works from a URL listed here.
4. Invite Julienne as the editor.
5. Commit and push. No environment variables are needed.

> **When the custom domain is connected**, go back to the Keystatic Cloud project and
> add it under Project URLs with **+ Add**. Miss this and `/keystatic` stops signing
> in the moment the domain goes live, with no clue as to why. Keep the netlify.app
> URL in the list too — deploy previews and the fallback address still use it.

Richard does not need a cloud seat: editing the repo directly is the same thing, and
the free tier only covers one editor.

### Fallback: GitHub storage mode

Free, unlimited editors, but every editor needs a GitHub account and repo access.
To switch, set `storage` back to
`{ kind: 'github', repo: { owner: 'rtaustin', name: 'julienne' } }`, drop the `cloud`
key, and set these in Netlify under **Site configuration → Environment variables**:

| Variable | Notes |
| --- | --- |
| `KEYSTATIC_GITHUB_CLIENT_ID` | from the GitHub App |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | from the GitHub App — secret |
| `KEYSTATIC_SECRET` | random string, signs the session cookie |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | the app's slug |

The last one is `PUBLIC_`, so it is inlined at build time — setting it does nothing
until the site rebuilds.

> **Run the `/keystatic/setup` wizard locally, never on the deployed site.** After
> creating the GitHub App it writes the credentials to a `.env` file. Netlify's
> filesystem is read-only, so that write throws a 500 and the client secret — shown
> only once — is lost, leaving an orphaned GitHub App behind. Run it against a local
> dev server with `storage` temporarily forced to `github`, then copy the values out
> of the generated `.env` into Netlify.

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
