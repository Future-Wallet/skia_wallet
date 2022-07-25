import { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';

/**
 * Observe all state changes of Recoil package.
 */
export default function DebugObserver(): JSX.Element | null {
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    if (process.env['NODE_ENV'] !== 'production')
      console.debug('The following atoms were modified:');
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);

  return null;
}
