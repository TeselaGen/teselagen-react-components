const path = require("path");

module.exports = {
  type: "react-component",
  npm: {
    umd: false
  },
  webpack: {
    uglify: false,
    aliases: {
      // **** You can comment one or more of these in to override an npm module with a local module. *****
      // **** Just be sure to comment them back out before committing! *****
      // "ve-range-utils":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../ve-range-utils/src/"),
      // "ve-sequence-utils":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../ve-sequence-utils/src/"),
      // "bio-parsers":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../ve-sequence-parsers/src/parsers/"),
      // "open-vector-editor":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../openVectorEditor/src/"),
      // "teselagen-react-components":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../teselagen-react-components/src/"),
      // "@teselagen/platform-ux":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../teselagen-platform-ux/src/"),
      // "@teselagen/apollo-methods":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../teselagen-common/apollo-methods/src/"),

      //don't comment this out!
      react: path.resolve(__dirname, "node_modules/react")
    },
    extra: {
      devtool: "source-map",
      module: {
        rules: [{ test: /demo\/src\/examples\//, loader: "raw-loader" }]
      }
    }
  }
};

// webpack: {
//     extra: {
//         devtool: 'inline-source-map'
//     }
// }
