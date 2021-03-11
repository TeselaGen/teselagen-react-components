const path = require("path");
const StatsPlugin = require("stats-webpack-plugin");
let plugins = [];
if (process.env.ANALYZE_BUNDLE) {
  plugins.push(new StatsPlugin("stats.json", { chunkModules: true }));
}

module.exports = {
  type: "react-component",
  npm: {
    umd: false
  },
  babel: {
    runtime: false,
    // env: {
    //   targets: {
    //     // chrome: "78",
    //     chrome: "59"
    //   }
    // },
  },
  webpack: {
    aliases: {
      // **** You can comment one or more of these in to override an npm module with a local module. *****
      // **** Just be sure to comment them back out before committing! *****
      // "ve-sequence-utils":
      //   console.log("comment me back out!") ||
      //   path.resolve("../../ve-sequence-utils/src/"),
      // "@teselagen/react-table":
      //   console.log("comment me back out!") ||
      //   path.resolve("../react-table/src/"),
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

      //don't comment this out!
      react: path.resolve(__dirname, "node_modules/react")
    },
    extra: {
      plugins,
      devtool: "source-map"
    }
  }
};

// webpack: {
//     extra: {
//         devtool: 'inline-source-map'
//     }
// }
