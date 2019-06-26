require('./babel-registration');

/**
 * Timezone local must be enforced to be different from +00:00, otherwise,
 * we will not be able to validate correctly the date in local time and utc
 */
process.env.TZ = 'GMT+02:00';

// setup file
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

const { JSDOM } = require('jsdom');
const chai = require('chai');

global.expect = chai.expect;
global.assert = chai.assert;

const exposedProperties = ['window', 'navigator', 'document'];
const dom = new JSDOM('', {
  url: 'https://example.org/',
  referrer: 'https://example.com/',
  contentType: 'text/html',
  includeNodeLocations: true,
  pretendToBeVisual: true,
  storageQuota: 10000000,
});
function matchMedia() {
  return {
    matches: false,
    addListener: () => {
      /* do nothing */
    },
    removeListener: () => {
      /* do nothing */
    },
  };
}
function emptyFunction() {}

global.window = dom.window;
global.document = dom.window.document;
global.document.window = dom.window;
global.window.matchMedia = matchMedia;
global.window.sessionStorage = { getItem: emptyFunction, setItem: emptyFunction };
global.window.localStorage = { getItem: emptyFunction, setItem: emptyFunction };
global.document.execCommand = () => {
  // do nothing
};
global.window.requestAnimationFrame = () => {
  // do nothing
};

Object.keys(document.window).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.window[property];
  }
});

global.Event =
  global.Event ||
  function Event() {
    /* do nothing */
  };
global.Element =
  global.Element ||
  function Element() {
    /* do nothing */
  };
global.HTMLDocument =
  global.HTMLDocument ||
  function HTMLDocument() {
    /* do nothing */
  };

global.navigator = {
  userAgent: 'node.js',
};

function setDefaultValueToStorage(value = {}) {
  global.window.localStorage = value;
}
setDefaultValueToStorage();
global.initLocalStorage = setDefaultValueToStorage;

module.exports = {};
