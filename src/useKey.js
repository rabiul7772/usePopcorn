import { useEffect } from 'react';

export function useKey(key, action) {
  useEffect(() => {
    function callback(e) {
      if (e.key === key) action();
    }

    document.addEventListener('keydown', callback);

    return () => document.removeEventListener('keydown', callback);
  }, [action, key]);
}
