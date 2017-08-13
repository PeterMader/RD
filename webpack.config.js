const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
  entry: [
    'babel-polyfill',
    './lib/rd.js'
  ],
  output: {
    filename: 'dist/rd.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'lib'),
        loader: 'babel-loader',
        query: {
          presets: ["env", "es2015"]
        }
      }
    ],
  },
  plugins: [new BabiliPlugin()]
};
