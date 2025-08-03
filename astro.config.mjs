// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import rehypeMermaid from "rehype-mermaid";

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import { SITE_URL } from "./src/consts";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    mdx({
      extendMarkdownConfig: true, // inherits rehypeMermaid from `markdown`
    }),
    sitemap(),
    tailwind(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: "img-svg",
          dark: true,
        },
      ],
    ],
  },
});
