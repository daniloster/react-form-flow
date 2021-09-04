interface ValidationArgs {
  /**
   * The whole data form
   */
  data: any;
  /**
   * The path to be validated
   */
  path: string;
  /**
   * The value related to the path in the form
   */
  value: any;
  /**
   * The dependency values for conditionals
   */
  dependencies: Array<any>;
  /**
   * Method to get value given a form data and json path
   * @param data - the form data
   * @param path - the json path
   * @returns {any}
   */
  get(data: any, path: string): any;

  [key: string]: any;
}

export default ValidationArgs;
