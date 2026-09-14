import { collection, config, fields } from '@keystatic/core';

// Schema shared by every docs collection.
// NOTE: Keystatic drops frontmatter keys that are NOT in this schema when a
// page is saved through the UI. Starlight-only keys (template, hero,
// sidebar.order, prev/next, ...) are hand-edit-only unless declared here —
// use fields.ignored to preserve a key you never want edited.
const docSchema = {
  title: fields.slug({
    name: { label: 'Title', validation: { isRequired: true } },
  }),
  description: fields.text({ label: 'Description', multiline: true }),
  body: fields.mdx({ label: 'Body' }),
};

export default config({
  storage: {
    // local = Keystatic writes files straight into this repo (dev only).
    // Upgrade path: kind 'github' + hybrid output + adapter + GitHub App.
    kind: 'local',
  },
  ui: {
    brand: { name: 'pgb docs' },
    // section label → collection keys (NOT { label } objects — the UI does
    // keys.map() on these values and crashes on anything but an array)
    navigation: {
      Docs: ['docs'],
      Guides: ['guides'],
    },
  },
  collections: {
    docs: collection({
      label: 'Docs',
      slugField: 'title',
      path: 'src/content/docs/*',
      format: { contentField: 'body' },
      schema: docSchema,
    }),
    guides: collection({
      label: 'Guides',
      slugField: 'title',
      path: 'src/content/docs/guides/*',
      format: { contentField: 'body' },
      schema: docSchema,
    }),
  },
});
