const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.js",
    baseUrl: "http://localhost:3333/",
    projectId: "gwixeq"
  }
});
