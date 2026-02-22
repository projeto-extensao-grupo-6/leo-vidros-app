import { useState, useEffect, useCallback, useRef } from 'react';

export function useModal(keys) {
  const initialRef = useRef(Object.fromEntries(keys.map((k) => [k, false])));
  const [modal, setModal] = useState(initialRef.current);

  const open = useCallback((key) => {
    setModal((m) => ({ ...m, [key]: true }));
  }, []);

  const close = useCallback((key) => {
    setModal((m) => ({ ...m, [key]: false }));
  }, []);

  const closeAll = useCallback(() => {
    setModal({ ...initialRef.current });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') closeAll();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeAll]);

  return { modal, open, close, closeAll };
}

export default useModal;
