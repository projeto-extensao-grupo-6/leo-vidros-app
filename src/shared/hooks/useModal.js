import { useState, useCallback } from 'react';

/**
 * Hook customizado para gerenciar estado de modais
 * @param {boolean} initialState - Estado inicial do modal (padrão: false)
 * @returns {Object} Estado e handlers do modal
 * 
 * @example
 * const { isOpen, open, close, toggle, data, setData } = useModal();
 * 
 * // Abrir modal com dados
 * const handleEdit = (item) => {
 *   setData(item);
 *   open();
 * };
 * 
 * // Fechar e limpar dados
 * const handleClose = () => {
 *   close();
 *   setData(null);
 * };
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  /**
   * Abre o modal
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Fecha o modal
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Alterna o estado do modal
   */
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  /**
   * Abre o modal com dados específicos
   * @param {*} modalData - Dados a serem passados para o modal
   */
  const openWith = useCallback((modalData) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  /**
   * Fecha o modal e limpa os dados
   */
  const closeAndClear = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    openWith,
    closeAndClear,
    data,
    setData,
  };
};

export default useModal;
