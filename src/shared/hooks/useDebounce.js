import { useState, useEffect } from 'react';

/**
 * Hook customizado para debouncing de valores
 * Útil para inputs de busca e campos que disparam requisições
 * 
 * @param {*} value - Valor a ser debounced
 * @param {number} delay - Delay em milissegundos (padrão: 500ms)
 * @returns {*} Valor debounced
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     fetchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Criar timeout para atualizar o valor após o delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpeza: cancelar timeout se value ou delay mudarem
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook customizado para debouncing de callbacks
 * Útil para handlers que não devem ser executados a cada vez
 * 
 * @param {Function} callback - Função a ser debounced
 * @param {number} delay - Delay em milissegundos (padrão: 500ms)
 * @param {Array} dependencies - Dependências do callback
 * @returns {Function} Callback debounced
 * 
 * @example
 * const handleSearch = useDebouncedCallback((value) => {
 *   fetchResults(value);
 * }, 500);
 * 
 * <input onChange={(e) => handleSearch(e.target.value)} />
 */
export const useDebouncedCallback = (callback, delay = 500, dependencies = []) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies, delay]);
};

export default useDebounce;
