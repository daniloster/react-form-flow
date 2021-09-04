import Dictionary from '../Dictionary';
import ResponseValidationProcessor from './ResponseValidationProcessor';

interface ExtraArguments extends Dictionary<ResponseValidationProcessor | any> {
  response: ResponseValidationProcessor;
  [key: string]: any;
}

export default ExtraArguments;
