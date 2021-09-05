import PropTypes from 'prop-types';

// eslint-disable-next-line
export const SchemaDataShape = PropTypes.shape({
  /**
   * List of paths that invalidates cache for validation
   */
  invalidationPaths: PropTypes.arrayOf(PropTypes.string),
  /**
   * Validation function which returns a list of validations
   */
  validate: PropTypes.func,
});
