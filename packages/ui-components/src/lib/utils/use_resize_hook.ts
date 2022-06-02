import { RefObject, useEffect } from 'react';

type ObserverCallback = (entry: DOMRectReadOnly) => void;

export const useResizeObserver = (
  ref: RefObject<HTMLElement>,
  callback: ObserverCallback
) => {
  useEffect(() => {
    if (ref.current !== null) {
      const resizeObserver = new window.ResizeObserver((entries) => {
        callback(entries[0].contentRect);
      });

      resizeObserver.observe(ref.current);

      return () => {
        resizeObserver.disconnect();
      };
    } else {
      return;
    }
  }, [ref]);
};
