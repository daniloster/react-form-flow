import { useContext, useCallback } from 'react';
import { set } from 'mutation-helper';
import FormFlowDataContext from './FormFlowDataContext';

/**
 * Creates a memoized Provider component to be used as form
 * @returns {React.Context}
 */
export default function useFormFlow() {
  const [data, setData] = useContext(FormFlowDataContext);
  // const dataRef = useRef(data);
  // useEffect(() => {
  //   dataRef.current = data;
  // }, [data]);
  const onChangeByPath = useCallback(
    (path, value) => {
      setData(oldData => {
        const newData = set(oldData, path, value);

        return newData;
      });
      // dataRef.current = set(dataRef.current, path, value);
      // setData(dataRef.current);
    },
    [setData]
  );

  return {
    data,
    onChangeByPath,
    setData,
  };
}
