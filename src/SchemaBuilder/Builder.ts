import AggregatedValidator from './AggregatedValidator';
import ExtraArguments from './ExtraArguments';
import ResponseValidationProcessor from './ResponseValidationProcessor';
import SchemaValidationMethods from './SchemaValidationMethods';
import ValidationProcessorChecker from './ValidationProcessorChecker';
import ValidationProcessorFactory from './ValidationProcessorFactory';

type TestValidation<T> = (
  validation: string,
  isValid: ValidationProcessorChecker,
  response: ResponseValidationProcessor
) => T;
interface BaseBuilderNode<Main, Node> {
  check<T = any>(validation: string, extraArguments: Partial<ExtraArguments> & T): Node;
  // eslint-disable-next-line no-use-before-define
  end(): Main;
}

interface BuilderMain<T> {
  build(): SchemaValidationMethods;
  factory(name: string, extraArguments: any): ValidationProcessorFactory;
  with(path: string): T;
  with(path: string, invalidationPaths: Array<string>): T;
}

export interface BuilderNode extends BaseBuilderNode<BuilderMain<BuilderNode>, BuilderNode> {
  test: TestValidation<BuilderNode>;
  [key: string]: AggregatedValidator | any;
}

interface Builder extends BuilderMain<BuilderNode> {}

export default Builder;
