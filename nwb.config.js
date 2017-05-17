module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
  },
  webpack: {
    extra: {
      devtool: 'source-map'
    },
  }
}


    
// webpack: {
//     extra: {
//         devtool: 'inline-source-map'
//     }
// }