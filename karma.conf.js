const isDevelopment = process.env.NODE_ENV === 'development';

// Karma configuration
// Generated on Mon Jun 19 2017 15:14:27 GMT-0400 (EDT)
module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['qunit'],

    files: [
      'src/index.js',
      'test/**/*.js'
    ],

    preprocessors: {
      'src/index.js': ['webpack'],
      'test/**/*.js': ['webpack']
    },

    reporters: isDevelopment ? ['progress'] : ['dots'],
    port: 6789,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: !isDevelopment,
    client: {
      captureConsole: !isDevelopment
    },
    concurrency: Infinity,
    webpack: {
      devtool: 'inline-source-map',
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
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
