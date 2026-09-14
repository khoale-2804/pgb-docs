// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

// NOTE: function-form configs (`defineConfig(({ command }) => ...)`) are
// NOT invoked by astro 7.3.x — the integrations array is silently dropped.
// Object form only; branch Keystatic on NODE_ENV (set by the astro CLI:
// development for `astro dev`, production for `astro build`).
const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  // Set `site` + `base` to the deploy target when this goes public
  // (e.g. site 'https://khoale-2804.github.io', base '/pgb-docs').
  integrations: [
    // starlight() (which brings expressive-code) must come BEFORE mdx(),
    // and mdx() must be present — without it .mdx doc pages have no entry
    // type and every Starlight route 404s.
    starlight({
      title: 'pgb',
      description: 'Two-stage Postgres codegen with full ParadeDB support',
      favicon: '/favicon.svg',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/khoale-2804/pgb' },
      ],
      sidebar: [
        { label: 'Guides', items: [{ autogenerate: { directory: 'guides' } }] },
      ],
      customCss: ['./src/custom.css'],
      head: [
        // Starlight 0.42 themes are auto (system) by default, persisted in
        // localStorage. Preseed 'light' so first visit is light — the docs
        // asked for ParadeDB-style light default; users can still switch.
        {
          tag: 'script',
          attrs: { isInline: true },
          content:
            "try{if(!localStorage.getItem('starlight-theme'))localStorage.setItem('starlight-theme','light')}catch(e){}",
        },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
        { tag: 'link', attrs: { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' } },
      ],
    }),
    mdx(),
    // React renderer for Keystatic's admin UI.
    react(),
    // Keystatic's admin UI + API routes are dev-only, so `astro build`
    // stays a pure static export with no adapter needed.
    ...(isDev ? [keystatic()] : []),
  ],
});
