module.exports = {
  overrides: [
    {
      files: ["*.js"],
      processor: "@graphql-eslint/graphql",
      plugins: ["@graphql-eslint"],
      parserOptions: {
        schema: "../../server/src/graphql-lims/schema/schema.gql",
      },
    },
  ],
};