# react-form-flow

Internationalise your app, extending config or factory new internationalised components.

[![NPM](https://img.shields.io/npm/v/react-form-flow.svg?style=flat-square) ![NPM](https://img.shields.io/npm/dm/react-form-flow.svg?style=flat-square)](https://www.npmjs.com/package/react-form-flow)
[![Build Status](https://img.shields.io/travis/daniloster/react-form-flow/master.svg?style=flat-square)](https://travis-ci.org/daniloster/react-form-flow)

## Docs

- [react-form-flow](https://github.com/daniloster/react-form-flow/blob/master/README.md)
- [react-form-flow/API](https://github.com/daniloster/react-form-flow/blob/master/API.md)

## Current core dependencies versions

- node: `^8.10.0 || ^9.10.0`
- yarn (version may be check at `package.json`)

## Peer dependencies

```js static
"prop-types": "^15.7.2",
"react": "^16.8.4",
"uuid": "^3.3.2"
```

## Consuming

Installing with npm

```bash
npm install react-form-flow
```

Installing with yarn

```bash
yarn add react-form-flow
```

## Getting started

`react-form-flow` as its name describes is a library to define a common and automated workflow to collect and validate form data. Allow user to consume the data and validation based on the json path.

_JSON PATH_ is a notation to navigate through the JSON object.

e.g.

```js
const data = {
  person: {
    id: 1,
    name: 'Jane Doe',
    email: 'jane@doe.dead'
    children:[
      {id: 2, name: 'John Doe'}
    ]
  }
}
```

So, observing the json above, the json path to access the name of first child is `person.chidlren[0].name`.

### Recipes

- Creating factory for validations
- Creating custom form fields

## Contributions rules

- Changes must be approved;
- Changes must have tests passing on Travis-CI;
- Changes must have coverage of 95% on Travis-CI for: statements, branches, functions and lines;
- Last commit message must have attribute `[release=major|minor|patch|no-release]`;
