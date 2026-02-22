import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook para gerenciar estado de múltiplos modais com suporte a Escape.
 *
 * @param {string[]} keys - Chaves dos modais (ex.: ['novo', 'editar', 'confirm'])
 * @returns {{ modal: object, open: (key: string) => void, close: (key: string) => void, closeAll: () => void }}
 *
 * @example
 * const { modal, open, close, closeAll } = useModal(['novo', 'editar', 'confirm']);
 * // Abrir: open('novo')
 * // Fechar: close('novo') ou closeAll()
 * // Verificar: modal.novo
 */
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

  // Fechar todos os modais com a tecla Escape
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
