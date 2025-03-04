const babel = require('rollup-plugin-babel');

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/data-sources-parser.amd.js',
      format: 'amd'
    },
    {
      file: 'dist/data-sources-parser.cjs',
      format: 'cjs'
    }
  ],
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
