module.exports = {
  include: ['src/**', 'test/**'],
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          browsers: ['Last 2 versions', 'IE 11']
        }
      }
    ]
  ],
  plugins: ['@babel/external-helpers', '@babel/transform-runtime']
};
