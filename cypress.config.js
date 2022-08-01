const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // console.log(config); // see everything in here!

      config.specPattern = "cypress/integration/**/*.js";
      config.baseUrl = "http://localhost:3333/";
      config.projectId = "gwixeq";
      return config;
    }
  }
});
