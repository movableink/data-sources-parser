module.exports = {
  runtimeHelpers: true,
  include: ['src/**', 'test/**'],
  presets: [
    [
      '@babel/env',
      {
        modules: false
      }
    ]
  ],
  plugins: ['@babel/external-helpers', '@babel/transform-runtime']
};
