import { useState, useEffect, useCallback } from 'react';

/**
 * Hook customizado para persistência em localStorage
 * Sincroniza estado local com localStorage
 * 
 * @param {string} key - Chave do localStorage
 * @param {*} initialValue - Valor inicial se não houver nada no localStorage
 * @returns {Array} [value, setValue, removeValue] - Estado e setters
 * 
 * @example
 * const [user, setUser, removeUser] = useLocalStorage('user', null);
 * 
 * // Salvar usuário
 * setUser({ name: 'João', email: 'joao@example.com' });
 * 
 * // Remover usuário
 * removeUser();
 */
export const useLocalStorage = (key, initialValue) => {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Pegar do localStorage
      const item = window.localStorage.getItem(key);
      
      // Parse JSON ou retornar initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Retornar uma versão wrapped do useState setter
  const setValue = useCallback((value) => {
    try {
      // Permitir que value seja uma função como useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Salvar estado
      setStoredValue(valueToStore);
      
      // Salvar no localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Erro ao salvar no localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remover valor do localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Erro ao remover localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Sincronizar com mudanças em outras tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erro ao sincronizar localStorage key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
};

/**
 * Hook simplificado para localStorage sem sincronização
 * Mais leve para casos simples
 * 
 * @param {string} key - Chave do localStorage
 * @param {*} initialValue - Valor inicial
 * @returns {Array} [value, setValue, removeValue]
 */
export const useLocalStorageSimple = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStorageValue = useCallback((newValue) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Erro ao salvar localStorage: ${error}`);
    }
  }, [key, value]);

  const removeStorageValue = useCallback(() => {
    try {
      setValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erro ao remover localStorage: ${error}`);
    }
  }, [key, initialValue]);

  return [value, setStorageValue, removeStorageValue];
};

export default useLocalStorage;
