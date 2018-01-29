const path = require('path');
const isDevelopment = process.env.NODE_ENV === 'development';
const filename = 'data-sources-parser.js';

module.exports = {
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
  module: {}
};
