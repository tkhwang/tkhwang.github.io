import { defineConfig } from "astro/config";

import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import spectre from "./package/src";

import node from "@astrojs/node";
import { spectreDark } from "./src/ec-theme";

// https://astro.build/config
export default defineConfig({
  site: "https://tkhwang.github.io/",
  output: "static",
  integrations: [
    expressiveCode({
      themes: [spectreDark],
    }),
    mdx(),
    sitemap(),
    spectre({
      name: "tkhwang.github.io",
      openGraph: {
        home: {
          title: "tkhwang.github.io",
          description: "personal tech blog",
        },
        blog: {
          title: "Blog",
          description:
            "This is my little thoughts 🤔 and journey 💻 into software development.",
        },
        projects: {
          title: "Projects",
        },
      },
      giscus: {
        repository: "tkhwang/tkhwang-blog-giscus-comments",
        repositoryId: "R_kgDOHOPQOQ",
        category: "Announcements",
        categoryId: "DIC_kwDOHOPQOc4COvJg",
        mapping: "pathname",
        strict: true,
        reactionsEnabled: true,
        emitMetadata: false,
        lang: "en",
      },
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
