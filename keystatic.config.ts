import { config, fields, collection, singleton } from '@keystatic/core';

/**
 * Keystatic CMS — this is what powers the editor at /keystatic.
 *
 * Locally it reads and writes the files in this folder directly, with no login.
 * In production it runs through Keystatic Cloud: Julienne signs in with an email
 * address, and every save becomes a commit on `main`, which Netlify picks up and
 * redeploys automatically.
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * Keystatic Cloud project, as "team-slug/project-slug".
 *
 * Create it at https://keystatic.cloud and link it to the rtaustin/julienne
 * repo, then paste the identifier it gives you here. Cloud storage is what
 * lets Julienne sign in with an email address instead of needing a GitHub
 * account; the Hobby tier is free for one editor.
 *
 * TODO: replace this placeholder with the real project identifier.
 */
const CLOUD_PROJECT = 'REPLACE-ME/julienne-blackburn-coaching';

const richText = (label: string) =>
  fields.markdoc({
    label,
    // Write plain .md files so Astro can render them with no extra plugins.
    extension: 'md',
    options: {
      image: {
        directory: 'public/images/content',
        publicPath: '/images/content/',
      },
    },
  });

export default config({
  // Local mode in development edits these files directly, with no login.
  // In production, Keystatic Cloud handles sign-in and commits to GitHub.
  storage: isDev ? { kind: 'local' } : { kind: 'cloud' },
  cloud: { project: CLOUD_PROJECT },

  ui: {
    brand: { name: 'Julienne Blackburn Coaching' },
    navigation: {
      'Write & publish': ['prayers', 'videos', 'sunshine'],
      'From the community': ['gallery', 'testimonies'],
      'Page content': ['home', 'about', 'coaching', 'schedule', 'giving', 'contact'],
      Settings: ['site'],
    },
  },

  collections: {
    prayers: collection({
      label: 'Prayers',
      slugField: 'title',
      path: 'src/content/prayers/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'category', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Deliverance', value: 'Deliverance' },
            { label: 'Protection', value: 'Protection' },
            { label: 'Healing', value: 'Healing' },
            { label: 'Generational', value: 'Generational' },
            { label: 'Daily Strength', value: 'Daily Strength' },
            { label: 'Other', value: 'Other' },
          ],
          defaultValue: 'Deliverance',
        }),
        summary: fields.text({
          label: 'Short summary',
          description: 'One or two sentences, shown on the prayers list page.',
          multiline: true,
        }),
        scripture: fields.text({
          label: 'Scripture reference',
          description: 'Optional, e.g. "Psalm 91:1-4".',
        }),
        featured: fields.checkbox({ label: 'Feature this prayer', defaultValue: false }),
        draft: fields.checkbox({
          label: 'Draft (hide from the website)',
          defaultValue: false,
        }),
        content: richText('Prayer'),
      },
    }),

    videos: collection({
      label: 'Videos',
      slugField: 'title',
      path: 'src/content/videos/*',
      format: { contentField: 'content' },
      columns: ['title', 'topic', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({
          label: 'Date',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        platform: fields.select({
          label: 'Where is this video from?',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'Somewhere else (link only)', value: 'other' },
          ],
          defaultValue: 'youtube',
        }),
        videoId: fields.text({
          label: 'Video ID',
          description:
            'YouTube: the part after "v=" in the address. TikTok: the long number at the end of the address. Otherwise: paste the whole link.',
          validation: { isRequired: true },
        }),
        url: fields.url({ label: 'Full link to the video (optional)' }),
        topic: fields.select({
          label: 'Topic',
          options: [
            { label: 'Recognizing the Patterns', value: 'Recognizing the Patterns' },
            { label: 'Narcissistic Abuse', value: 'Narcissistic Abuse' },
            { label: 'Boundaries', value: 'Boundaries' },
            { label: 'Healing & Recovery', value: 'Healing & Recovery' },
            { label: 'Faith & Deliverance', value: 'Faith & Deliverance' },
            { label: 'Other', value: 'Other' },
          ],
          defaultValue: 'Recognizing the Patterns',
        }),
        summary: fields.text({ label: 'Short summary', multiline: true }),
        thumbnail: fields.image({
          label: 'Custom thumbnail (optional)',
          directory: 'public/images/videos',
          publicPath: '/images/videos/',
        }),
        featured: fields.checkbox({ label: 'Feature this video', defaultValue: false }),
        draft: fields.checkbox({ label: 'Draft (hide from the website)', defaultValue: false }),
        content: richText('Notes shown under the video'),
      },
    }),

    gallery: collection({
      label: 'Art gallery',
      slugField: 'title',
      path: 'src/content/gallery/*',
      format: { contentField: 'content' },
      columns: ['title', 'artist', 'approved'],
      schema: {
        title: fields.slug({ name: { label: 'Title of the piece' } }),
        artist: fields.text({ label: 'Artist name', defaultValue: 'Anonymous' }),
        medium: fields.text({
          label: 'Medium',
          description: 'e.g. "Acrylic on canvas", "Journal collage", "Poem".',
        }),
        image: fields.image({
          label: 'Image',
          directory: 'public/images/gallery',
          publicPath: '/images/gallery/',
          validation: { isRequired: true },
        }),
        alt: fields.text({
          label: 'Image description',
          description: 'Describe the piece for people using a screen reader.',
          validation: { isRequired: true },
        }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        approved: fields.checkbox({
          label: 'Reviewed, prayed over, and approved to publish',
          description: 'Nothing appears on the website until this is checked.',
          defaultValue: false,
        }),
        featured: fields.checkbox({ label: 'Feature this piece', defaultValue: false }),
        content: richText('The story behind the piece'),
      },
    }),

    testimonies: collection({
      label: 'Testimonies',
      slugField: 'headline',
      path: 'src/content/testimonies/*',
      format: { contentField: 'content' },
      columns: ['headline', 'name', 'approved'],
      schema: {
        headline: fields.slug({
          name: {
            label: 'Headline',
            description: 'A short line that captures the heart of the story.',
          },
        }),
        name: fields.text({
          label: 'Name to display',
          description: 'Use "Anonymous" or just a first initial if they asked to stay private.',
          defaultValue: 'Anonymous',
        }),
        location: fields.text({ label: 'Location (optional)' }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        approved: fields.checkbox({
          label: 'Approved to publish',
          description: 'Nothing appears on the website until this is checked.',
          defaultValue: false,
        }),
        featured: fields.checkbox({ label: 'Show on the home page', defaultValue: false }),
        content: richText('Their story'),
      },
    }),

    sunshine: collection({
      label: 'Sunshine page',
      slugField: 'title',
      path: 'src/content/sunshine/*',
      format: { contentField: 'content' },
      columns: ['title', 'category', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Outside', value: 'Outside' },
            { label: 'Grounding', value: 'Grounding' },
            { label: 'Nature', value: 'Nature' },
            { label: 'Movement', value: 'Movement' },
            { label: 'Stillness', value: 'Stillness' },
            { label: 'Creativity', value: 'Creativity' },
          ],
          defaultValue: 'Outside',
        }),
        summary: fields.text({
          label: 'Short summary',
          multiline: true,
          validation: { isRequired: true },
        }),
        minutes: fields.text({
          label: 'How long it takes',
          description: 'e.g. "5 minutes", "20 minutes".',
        }),
        image: fields.image({
          label: 'Image (optional)',
          directory: 'public/images/sunshine',
          publicPath: '/images/sunshine/',
        }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' } }),
        featured: fields.checkbox({ label: 'Feature this practice', defaultValue: false }),
        draft: fields.checkbox({ label: 'Draft (hide from the website)', defaultValue: false }),
        content: richText('The practice, step by step'),
      },
    }),
  },

  singletons: {
    site: singleton({
      label: 'Site settings',
      path: 'src/data/site',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Business name' }),
        shortName: fields.text({ label: 'Short name' }),
        role: fields.text({ label: 'Role / subtitle' }),
        description: fields.text({
          label: 'Site description (used by Google and link previews)',
          multiline: true,
        }),
        email: fields.text({ label: 'Contact email' }),
        phone: fields.text({ label: 'Phone (optional)' }),
        location: fields.text({ label: 'Location (optional)' }),
        social: fields.object({
          tiktok: fields.url({ label: 'TikTok' }),
          facebook: fields.url({ label: 'Facebook' }),
          instagram: fields.url({ label: 'Instagram' }),
          youtube: fields.url({ label: 'YouTube' }),
        }),
        footerNote: fields.text({ label: 'Footer safety note', multiline: true }),
      },
    }),

    home: singleton({
      label: 'Home page',
      path: 'src/data/home',
      format: { data: 'json' },
      schema: {
        heroEyebrow: fields.text({ label: 'Small line above the headline' }),
        heroHeading: fields.text({ label: 'Headline' }),
        heroSubheading: fields.text({ label: 'Sub-headline', multiline: true }),
        heroImage: fields.image({
          label: 'Hero photo',
          directory: 'public/images/brand',
          publicPath: '/images/brand/',
        }),
        heroImageAlt: fields.text({ label: 'Hero photo description' }),
        heroPrimaryLabel: fields.text({ label: 'Main button text' }),
        heroPrimaryHref: fields.text({ label: 'Main button link' }),
        heroSecondaryLabel: fields.text({ label: 'Second button text' }),
        heroSecondaryHref: fields.text({ label: 'Second button link' }),
        specialization: fields.text({ label: 'Specialization line', multiline: true }),
        bandTagline: fields.text({ label: 'Green banner tagline' }),
        welcomeEyebrow: fields.text({ label: 'Welcome — small line' }),
        welcomeHeading: fields.text({ label: 'Welcome — heading' }),
        welcomeBody: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Welcome — paragraphs',
          itemLabel: (props) => (props.value || '').slice(0, 60),
        }),
        welcomeQuote: fields.text({ label: 'Welcome — pull quote' }),
        servicesEyebrow: fields.text({ label: 'Services — small line' }),
        servicesHeading: fields.text({ label: 'Services — heading' }),
        services: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            linkLabel: fields.text({ label: 'Link text' }),
            href: fields.text({ label: 'Link' }),
            icon: fields.select({
              label: 'Icon',
              options: [
                { label: 'Compass', value: 'compass' },
                { label: 'Circle', value: 'circle' },
                { label: 'Leaf', value: 'leaf' },
              ],
              defaultValue: 'compass',
            }),
          }),
          { label: 'Services', itemLabel: (props) => props.fields.title.value }
        ),
        resourcesEyebrow: fields.text({ label: 'Resources — small line' }),
        resourcesHeading: fields.text({ label: 'Resources — heading' }),
        resources: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
            href: fields.text({ label: 'Link' }),
            cta: fields.text({ label: 'Link text' }),
          }),
          { label: 'Resource cards', itemLabel: (props) => props.fields.title.value }
        ),
        closingHeading: fields.text({ label: 'Closing — heading' }),
        closingBody: fields.text({ label: 'Closing — text', multiline: true }),
        closingCtaLabel: fields.text({ label: 'Closing — button text' }),
        closingCtaHref: fields.text({ label: 'Closing — button link' }),
      },
    }),

    about: singleton({
      label: 'About page',
      path: 'src/data/about',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Small line above the heading' }),
        heading: fields.text({ label: 'Heading' }),
        portrait: fields.image({
          label: 'Photo',
          directory: 'public/images/brand',
          publicPath: '/images/brand/',
        }),
        portraitAlt: fields.text({ label: 'Photo description' }),
        body: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Paragraphs',
          itemLabel: (props) => (props.value || '').slice(0, 60),
        }),
        beliefsHeading: fields.text({ label: 'Promises — heading' }),
        beliefs: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            description: fields.text({ label: 'Description', multiline: true }),
          }),
          { label: 'Promises', itemLabel: (props) => props.fields.title.value }
        ),
        quote: fields.text({ label: 'Closing quote' }),
      },
    }),

    coaching: singleton({
      label: 'Coaching page',
      path: 'src/data/coaching',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Small line above the heading' }),
        heading: fields.text({ label: 'Heading' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        oneOnOne: fields.object({
          title: fields.text({ label: 'Title' }),
          summary: fields.text({ label: 'Summary', multiline: true }),
          includes: fields.array(fields.text({ label: 'Point' }), {
            label: 'What is included',
            itemLabel: (props) => props.value,
          }),
          goodFor: fields.text({ label: 'Who it is for', multiline: true }),
          ctaLabel: fields.text({ label: 'Button text' }),
          ctaHref: fields.text({ label: 'Button link' }),
        }),
        groups: fields.object({
          title: fields.text({ label: 'Title' }),
          summary: fields.text({ label: 'Summary', multiline: true }),
          includes: fields.array(fields.text({ label: 'Point' }), {
            label: 'What is included',
            itemLabel: (props) => props.value,
          }),
          goodFor: fields.text({ label: 'Who it is for', multiline: true }),
          ctaLabel: fields.text({ label: 'Button text' }),
          ctaHref: fields.text({ label: 'Button link' }),
        }),
        faqHeading: fields.text({ label: 'FAQ heading' }),
        faq: fields.array(
          fields.object({
            q: fields.text({ label: 'Question' }),
            a: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'Questions', itemLabel: (props) => props.fields.q.value }
        ),
      },
    }),

    schedule: singleton({
      label: 'Scheduling page',
      path: 'src/data/schedule',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Small line above the heading' }),
        heading: fields.text({ label: 'Heading' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        oneOnOneHeading: fields.text({ label: 'One-on-one — heading' }),
        oneOnOneNote: fields.text({ label: 'One-on-one — note', multiline: true }),
        bookingEmbedUrl: fields.text({
          label: 'One-on-one booking link',
          description:
            'Paste the link to your booking page (Calendly, Acuity, TidyCal). The calendar appears right on this page.',
        }),
        bookingFallbackUrl: fields.text({
          label: 'One-on-one — "open in a new tab" link (optional)',
        }),
        groupHeading: fields.text({ label: 'Group — heading' }),
        groupNote: fields.text({ label: 'Group — note', multiline: true }),
        groupEmbedUrl: fields.text({ label: 'Group booking link' }),
        groupFallbackUrl: fields.text({ label: 'Group — "open in a new tab" link (optional)' }),
        policiesHeading: fields.text({ label: 'Notes — heading' }),
        policies: fields.array(fields.text({ label: 'Note', multiline: true }), {
          label: 'Practical notes',
          itemLabel: (props) => (props.value || '').slice(0, 60),
        }),
      },
    }),

    giving: singleton({
      label: 'Payment page',
      path: 'src/data/giving',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Small line above the heading' }),
        heading: fields.text({ label: 'Heading' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        methods: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            handle: fields.text({
              label: 'Your handle / email / phone',
              description: 'e.g. "@julienne-blackburn" or the email people should send to.',
            }),
            url: fields.text({ label: 'Direct link (optional)' }),
            note: fields.text({ label: 'Note', multiline: true }),
            enabled: fields.checkbox({ label: 'Show this option', defaultValue: true }),
          }),
          { label: 'Payment methods', itemLabel: (props) => props.fields.name.value }
        ),
        footnote: fields.text({ label: 'Footnote', multiline: true }),
        supportHeading: fields.text({ label: 'Support — heading' }),
        supportBody: fields.text({ label: 'Support — text', multiline: true }),
      },
    }),

    contact: singleton({
      label: 'Contact page',
      path: 'src/data/contact',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({ label: 'Small line above the heading' }),
        heading: fields.text({ label: 'Heading' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        crisisHeading: fields.text({ label: 'Crisis box — heading' }),
        crisisBody: fields.text({ label: 'Crisis box — text', multiline: true }),
      },
    }),
  },
});
