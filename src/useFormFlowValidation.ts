import { useContext, useMemo } from 'react';
import { get } from './accessor';
import FormFlowDataContext from './FormFlowDataContext';
import { useObservableState } from './react-state';
import { clearIndexes } from './validationUtils';

const ACCEPTABLE_TYPES = ['boolean', typeof undefined];

function getBooleanFromMapPath(map: any): boolean {
  const type = typeof map;
  if (ACCEPTABLE_TYPES.includes(type)) return !!map;
  return Object.values(map).some(possibleBoolean => getBooleanFromMapPath(possibleBoolean));
}

const isFormDirty = getBooleanFromMapPath;
const isFormTouched = getBooleanFromMapPath;

const EMPTY_LIST: any[] = [];
/**
 * Perform validation over the form data based on the path provided
 */
export default function useFormFlowValidation(path = '') {
  const observableState = useContext(FormFlowDataContext);
  const [metadata] = useObservableState(observableState);
  const {
    dirty: mapDirty,
    submitCount,
    touched: mapTouched,
    validationsState: { allValidations, byPath, isAllValid },
    values: data,
  } = metadata;
  const pathIndexesCleared = clearIndexes(path);
  const validations = path
    ? byPath[path] || byPath[pathIndexesCleared] || EMPTY_LIST
    : allValidations;
  const isArrayWithNoIndex = pathIndexesCleared === path && path.includes('[]');
  const initialMapDirty = useMemo(() => {
    if (isArrayWithNoIndex) {
      return false;
    }
    return path ? get(mapDirty, path) : mapDirty;
  }, [isArrayWithNoIndex, mapDirty, path]);
  const initialMapTouched = useMemo(() => {
    if (isArrayWithNoIndex) {
      return false;
    }
    return path ? get(mapTouched, path) : mapTouched;
  }, [isArrayWithNoIndex, mapTouched, path]);
  const dirty = useMemo(() => isFormDirty(initialMapDirty), [initialMapDirty]);
  const touched = useMemo(() => isFormTouched(initialMapTouched), [initialMapTouched]);

  return {
    submitted: submitCount > 0,
    data,
    dirty,
    touched,
    isAllValid,
    validations,
  };
}
