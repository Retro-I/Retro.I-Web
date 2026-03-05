// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  app: {
    head: {
      title: "Retro.I",
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@vueuse/nuxt", "@pinia/nuxt"],
  build: {
    transpile: ["vuetify"],
  },
  css: ["@/assets/main.css"],
  vite: {
    plugins: [
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
