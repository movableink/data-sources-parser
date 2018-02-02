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
      'src/index.js': ['rollup'],
      'test/**/*.js': ['rollup']
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

    rollupPreprocessor: {
      output: {
        name: 'dataSourcesParser',
        format: 'iife'
      }
    }
  });
};
