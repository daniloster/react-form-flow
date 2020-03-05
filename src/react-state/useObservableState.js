import { useEffect, useMemo, useState } from 'react';

export default function useObservableState(observable) {
  const [state, setState] = useState(observable.get());

  useEffect(() => {
    const subscriber = observable.subscribe({
      next: setState,
    });

    return () => {
      subscriber.unsubscribe();
    };
  }, [observable]);

  return useMemo(() => [Object.freeze(state), observable.set], [observable.set, state]);
}
