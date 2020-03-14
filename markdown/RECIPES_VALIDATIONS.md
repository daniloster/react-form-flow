# Recipes

The idea here is to show how to optimise your performance by reusing some strategies. For this, we are going to use factory methods to build validations.

## Quick reminder

The `schemaData` object is built indexing validations by provided JSON PATH.

## Factories

Factory method is a creational pattern to deal with creation of objects in general. Its definition could be also expanded to creation of contracts.

Following the examples below we are going to factory a required validation. So, these validations have the same type of check varying on the message, path and key returned.

### Factoring required

Factory a required validation pre-defining the key and path uniquely and allowing end consumer to define the message returned.

The return of the validation function must provide the interface below.

```js
/**
 * @typedef Validation
 * @property {object} data
 * @property {any} value
 * @property {string} path
 * @property {string} key
 * @property {boolean} isValid
 * @property {string|React.node} message
 * */
```

```js
/**
 * Creates a function validation to be used in the schemaData object.
 * @param {string} message is the text/React.node returned from the validation
 *
 * */
function  createRequiredValidation(message) {
  return ({ data, value, path }) => {
    const key = `${path}-required`;
    const isValid = hasValue(value);

    return { data, value, path, key, isValid, message };
  };
}
```

### Factoring max length

For the max length validation, the constraint and the message needed to be provided by the end consumer in order to perform all checks and ensure a decent feedback. Ok, but, what if you need a dynamic message. Then, you can receive the message as function or component.

In the example below we are using `Message` as a component.

```jsx
function  MaxLengthMessage({ length, max }) {
  return `You have reached the limit of ${max}. (${length - max} character(s) beyond it)`;
}
```

```jsx
/**
 * Creates a function validation to be used in the schemaData object.
 * */
function  createMaxLengthValidation(max, Message) {
  return args => {
    const { data, value, path } = args;
    const key = `${path}-min-length`;
    const isValid = !hasValue(value) || value.length <= max;
    const { length } = value || '';
    const message = <Message length={length} max={max} />;

    return { data, value, path, key, isValid, message };
  };
}
```

### Using on schemaData

To create our schemaData we need to make use of the `createValidations`, this function will receive a list of fields that could invalidate cache for the validation (e.g. fields that validation depends on another field).

```jsx
import { createValidations } from 'react-form-flow';

const schemaData = {
  name: createValidations(
    [], // Invalidation Json Paths
    createRequiredValidation('Name is required!'),
    createMaxLengthValidation(50, MaxLengthMessage)
  ),
};
```

### Multiple dependencies

Lets say you have a validation for range, but, this information is obtained from 2 fields which would have `min`, `max` constraints for the value and a list of acceptable units e.g. `['seconds', 'minutes', 'hours']`.

```js
import { createValidations } from 'react-form-flow';

function  MinMaxLengthMessage({ min, max, unit }) {
  return `Only values between ${min} and ${max} is allowed for ${unit}.`;
}

/**
 * Creates a function validation to be used in the schemaData object.
 * */
function createMinMaxLengthValidation(mins, maxs, Message) {
  return args => {
    const { data, get, value, path } = args;
    const key = `${path}-min-max`;
    const unit = get('passport.visa.unit');
    const min = mins[unit];
    const max = maxs[unit];
    const isValid = !hasValue(value) || (value <= max && value >= min);
    const message = <Message min={min} max={max} unit={unit} />;

    return { data, value, path, key, isValid, message };
  };
}

const mins = {
  seconds: 1,
  minutes: 1,
  hours: 1,
};

const maxs = {
  seconds: 60,
  minutes: 60,
  hours: 24,
};

const schemaData = {
  'passport.visa.value': createValidations(
    /* ['passport.visa.unit'], // Invalidation Json Paths */
    /* Alternative to define invalidation */
    ['$.unit'],
    createRequiredValidation('The visa must indicate how many days is allowed to stay.'),
    createMinMaxLengthValidation(mins, max, MinMaxLengthMessage)
  ),
  'passport.visa.unit': createValidations(
    [],
    createRequiredValidation('Please select a unit to define how long the visa is valid.')
  ),
};
```

By doing this, every time that the `unit` is changed the validation for `value` is also computed.

#### Ivalidation Json Paths

The invalidation paths can be defined by absolute and relative paths. Being `$.` to navigate to parent node in relative path. We can better see it through examples.

##### For our first case, let see how to navigate multiple levels

```js
const schemaData = {
  'passport.age': createValidations(
    [],
    ...
  ),
  'passport.visa.unit': createValidations(
    [],
    ...
  ),
  'passport.visa.value': createValidations(
    ['$.unit', '$.$.age'],
    ...
  ),
}
```

Taking `passport.visa.value` and breaking into partial paths `["passport", "visa", "value"]`, the navigation `$.` refers going back to `visa`. Whereas `$.$.`, it would refer to `passport`.

##### Handling array dependencies

Let say, you need a validation to be performed for changes in correlated data based on indexes. Before going straight to the example, we need to understand a notation to refer to the indexes.

Given the rule `contacts[]`, this means we have validations running for each element of the array contacts. To correlated indexes, we can user the reference to ocurency of `[]` as `$N`, being `N` the index where the `[]` occurs in the original rule.

Ok, I get it too. It seems complex. Lets make it simple by examples.

- Given the rule `people[].contacts[]`, invalidation paths `['$.friends[$1]']`
  - Everytime friends at `N` changes, the people `people[i].contacts[N]` will be re-validated
  - This because the index of `[]` for `contacts` in the original rule is `1`, then, it is referred at `friends` as `$1`
- Given the rule `store.foods[]`, invalidation paths `['$.stocks[$0]']`
  - Everytime stocks at `N` changes, the foods `store.foods[N]` will be re-validated
  - This because the index of `[]` for `foods` in the original rule is `0`, then, it is referred at `stocks` as `$0`



```js
const schemaData = {
  'store.stocks[]': createValidations(
    [],
    ...
  ),
  'store.foods[]': createValidations(
    ['$.stocks[$0]'],
    ...
  ),
}
```
