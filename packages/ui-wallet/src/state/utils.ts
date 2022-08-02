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

/**
 * Save the previous Recoil state.
 *
 * In case of value being a [Loadable](https://recoiljs.org/docs/api-reference/core/Loadable), it only saves the content when the `state` is `hasvalue`.
 */
export function usePreviousStateRecoil(value: any) {
  const ref = useRef();

  // Check if value is Loadable class
  console.log(typeof value);
  console.log(value);

  // useEffect will run when the value of `value` changes
  useEffect(() => {
    // Assign the value of ref to the argument
    ref.current = value;
  }, [value]);
  return ref.current;
}
