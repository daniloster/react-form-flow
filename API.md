## react-form-flow



[\`npm: react-form-flow\`](https://www.npmjs.com/package/react-form-flow)


### src/I18nProvider.js

#### I18nProvider

Provider for localization.

prop | type | default | required | description
---- | :----: | :-------: | :--------: | -----------
**children** | node |  | :white_check_mark: | React node tree that expects the I18nProvider data.
**defaultLanguage** | string |  | :white_check_mark: | Default language. It is also the initialLanguage when it is not provided.
**initialLanguage** | string | null | :x: | Initial language.
**onChangeLanguage** | func | () => true | :x: | Action to change the current language externally.

