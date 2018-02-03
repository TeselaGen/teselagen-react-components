module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: false
  },
  webpack: {
    uglify: false,
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
