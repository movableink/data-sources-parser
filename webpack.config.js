const path = require('path');
const version = require('./package.json').version;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const uglifier = new UglifyJsPlugin({
  sourceMap: true,
  uglifyOptions: {
    // Necessary because of Safari 10 bug
    // https://bugs.webkit.org/show_bug.cgi?id=171041
    mangle: {
      safari10: true
    }
  }
});

const isDevelopment = process.env.NODE_ENV === 'development';
const plugins = isDevelopment ? [] : [uglifier];
const filename = 'html-normalizer.js';

module.exports = {
  plugins,
  entry: ['./src/index.js'],
  output: {
    filename,
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'source-map',
  devServer: {
    port: 1215,
    host: 'movableink.localhost'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      }
    ]
  }
};
