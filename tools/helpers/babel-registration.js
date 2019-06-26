require('source-map-support').install({
  handleUncaughtExceptions: false,
  environment: 'node',
});
const path = require('path');
const registerBabel = require('@babel/register');

registerBabel({
  babelrc: false,
  presets: ['@babel/preset-react', '@babel/preset-env'],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-throw-expressions',
    ['styled-components', { ssr: true }],
    '@babel/transform-runtime',
  ],
  ignore: [
    filename => {
      const isIgnored =
        /dist\//.test(filename) || /lib\//.test(filename) || /node_modules/.test(filename);
      return isIgnored;
    },
  ],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
});
require('@babel/polyfill');
// require('@babel/runtime');
