// webpack.config.js
const path = require('path');
module.exports = {
  mode: "production",
  entry: {
    main: "./app/main.ts"
  },
  devtool: "source-map",
  output: {
    filename: '[name].js',
    library: "SOID",
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'dist'),
    globalObject: "this"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "ts-loader"],
        exclude: [path.resolve(__dirname, "node_modules")]
      },
    ]
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
};