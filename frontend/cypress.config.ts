import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import * as cucumber from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      // 🧩 Cucumber plugin entegrasyonu
      await cucumber.addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      return config;
    },

    // 🗂 Feature dosyalarının yolu
    specPattern: "cypress/e2e/features/**/*.feature",
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    video: true,
    videoCompression: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 8000,
  },
});
