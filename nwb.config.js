const path = require("path");
const StatsPlugin = require("stats-webpack-plugin");
const plugins = [];
if (process.env.ANALYZE_BUNDLE) {
  plugins.push(new StatsPlugin("stats.json", { chunkModules: true }));
}

module.exports = {
  type: "react-component",
  npm: {
    umd: false
  },
  // babel: { //tnr: comment this back in once we're at a higher version of cypress on lims
  //   runtime: false,
  //   // env: {
  //   //   targets: {
  //   //     // chrome: "78",
  //   //     chrome: "59"
  //   //   }
  //   // },
  // },
  webpack: {
    aliases: {
      // **** You can comment one or more of these in to override an npm module with a local module. *****
      // **** Just be sure to comment them back out before committing! *****
      // "@teselagen/react-table":
      //   console.log("comment me back out!") ||
      //   path.resolve("../react-table/src/"),

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
