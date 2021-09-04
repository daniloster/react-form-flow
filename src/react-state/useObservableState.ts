import { useEffect, useMemo, useState } from 'react';
import ObservableState from './ObservableState';

export default function useObservableState<T>(observable: ObservableState<T>): [T, (transformer: (v: T) => T) => void] {
  const [state, setState] = useState<T>(observable.get());

  useEffect(() => {
    const subscriber = observable.subscribe({
      next: setState,
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [observable]);

  return useMemo(() => [Object.freeze(state) as T, observable.set as ((transformer: (v: T) => T) => void)], [observable.set, state]);
}
