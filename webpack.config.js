// webpack.config.js
const path = require('path');
module.exports = {
  mode: "production",
  target: "electron-renderer",
  entry: {
    main: "./app/main.ts"
  },
  output: {
    filename: '[name].js',
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
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
};