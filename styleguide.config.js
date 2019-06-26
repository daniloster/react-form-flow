/* eslint-disable */
const path = require('path');
const fs = require('fs');
const webpackConfig = require('./webpack.config');
const pack = require('./package.json');

const componentSections = [
  {
    components: './src/**/*.js',
    description: pack.description,
    ignore: (pack.styleguide || {}).ignore || [
      './README.md',
      '**/src/index.js',
      '**/*.spec.js',
      '**/__test__/**/*.js',
    ],
    name: pack.name,
  },
];

const sections = [
  {
    name: 'Intro',
    content: 'README.md',
  },
].concat(componentSections);

const node_modules = path.resolve('node_modules');

const reactDocgenDisplaynameHandler = require('react-docgen-displayname-handler');
const reactDocgen = require('react-docgen');

function customHandler(documentation, path) {
  // Calculate a display name for components based upon the declared class name.
  if (path.value.type === 'ClassDeclaration' && path.value.id.type === 'Identifier') {
    documentation.set('displayName', path.value.id.name);

    // Calculate the key required to find the component in the module exports
    if (path.parentPath.value.type === 'ExportNamedDeclaration') {
      documentation.set('path', path.value.id.name);
    }
  }

  // The component is the default export
  if (path.parentPath.value.type === 'ExportDefaultDeclaration') {
    documentation.set('path', 'default');
  }
}

function handlers(componentPath) {
  return []
    .concat(reactDocgen.defaultHandlers)
    .concat(customHandler, reactDocgenDisplaynameHandler.createDisplayNameHandler(componentPath));
}

module.exports = {
  ignore: [
    './README.md',
    '**/*.locale.js',
    '**/*.spec.js',
    '**/mockData.test/**',
    '**/lib/**',
    '**/test/**',
    '**/DEV/**',
    '**/demo/**',
    '**/.nyc_output/**',
    '**/coverage/**',
    '**/mochawesome-report/**',
    '**/mochawesome-reports/**',
    '**/tools/**',
    /* node_modules dependencies */
    node_modules,
  ],
  styleguideDir: 'docs',
  require: ['@babel/polyfill', './docs/components/loader'],
  // style references: https://github.com/styleguidist/react-styleguidist/blob/master/src/styles/theme.js
  theme: {
    baseBackground: '#fdfdfc',
    link: '#1978c8',
    linkHover: '#f28a25',
    border: '#e0d2de',
    font:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
  },
  styles: {
    Playground: {
      preview: {
        paddingLeft: 0,
        paddingRight: 0,
        borderWidth: [[0, 0, 1, 0]],
        borderRadius: 0,
      },
    },
    Markdown: {
      pre: {
        border: 0,
        background: 'none',
      },
      code: {
        fontSize: 14,
      },
    },
  },
  styleguideComponents: {
    StyleGuideRenderer: path.join(__dirname, 'docs/layout/StyleGuideRenderer'),
  },
  webpackConfig,
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  showUsage: true,
  sections: sections,
  handlers: handlers,
  moduleAliases: {
    'react-form-flow': path.resolve(__dirname, 'src'),
  },
};
/* eslint-enable */
