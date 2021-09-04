import Validation from './SchemaBuilder/Validation';

type FormFlowDataType = {
  submitCount: number;
  dirty: { [key: string]: boolean };
  initialValues: Object;
  schemaData: Object;
  touched: { [key: string]: boolean };
  values: Object;
  validationsState: {
    allPaths: string[];
    allValidations: Validation[];
    byPath: { [key: string]: Validation[] };
    isAllValid: (paths: string[]) => boolean;
  };
};

export default FormFlowDataType;
