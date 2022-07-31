import { useEffect, useRef } from 'react';
import { useRecoilSnapshot } from 'recoil';

/**
 * Observe all state changes of Recoil package.
 */
export function DebugObserver(): JSX.Element | null {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    if (process.env['NODE_ENV'] !== 'production') {
      console.debug('The following atoms were modified:');

      for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
        console.debug(node.key, snapshot.getLoadable(node));
      }
    }
  }, [snapshot]);

  return null;
}

export function usePrevious(value: any) {
  const ref = useRef();

  console.log(value);
  // useEffect will run when the value of `value` changes
  useEffect(() => {
    // Assign the value of ref to the argument
    ref.current = value;
  }, [value]);
  return ref.current;
}
