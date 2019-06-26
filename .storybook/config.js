import { addDecorator, addParameters, configure } from '@storybook/react';
import { themes } from '@storybook/theming';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';

addDecorator((storyFn, context) => withConsole()(storyFn)(context));

setConsoleOptions({
  panelExclude: [],
});

// Option defaults.
addParameters({
  options: {
    theme: themes.light,
  },
});

function loadStories() {
  require('../stories/index');
}

configure(loadStories, module);
