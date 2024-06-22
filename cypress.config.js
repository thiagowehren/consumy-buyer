import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173/',
    testIsolation: false
  },
});
