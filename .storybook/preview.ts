import decorators from './decorators'

export const parameters = {
  options: {
    storySort: (a, b) => {
      if (b[1].kind === 'Docs/Getting Started') {
        return 1
      }
      if (a[1].kind === 'Docs/Getting Started') {
        return -1
      }

      if (b[1].kind.includes('Docs/Recipes')) {
        if (!a[1].kind.includes('Recipes')) {
          return 2
        }

        if (b[1].kind.includes('Schema Builder')) {
          return 100;
        }
        if (a[1].kind.includes('Schema Builder')) {
          return -100;
        }

        if (b[1].kind.includes('Validations')) {
          return 101;
        }
        if (a[1].kind.includes('Validations')) {
          return -101;
        }

        if (b[1].kind.includes('useFormFlowItem')) {
          return 102;
        }
        if (a[1].kind.includes('useFormFlowItem')) {
          return -102;
        }

        return b[1].kind > a[1].kind ? -1 : 1;
      }

      // Sort the other stories by ID
      // https://github.com/storybookjs/storybook/issues/548#issuecomment-530305279
      return a[1].kind === b[1].kind
        ? 0
        : a[1].id.localeCompare(b[1].id, { numeric: true })
    },
  },
}

export { decorators }
