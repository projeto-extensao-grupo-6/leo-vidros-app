import React, { createContext, useContext, useState, useCallback } from 'react';
import DefaultAvatar from '../assets/Avatar.jpg';

/**
 * UserContext — fonte única de verdade para os dados do utilizador autenticado.
 *
 * Substitui o anti-pattern de ler sessionStorage diretamente + window.addEventListener
 * no Header e dispersar window.dispatchEvent / window.updateHeaderUserInfo pelo Perfil.
 *
 * Expõe:
 *   user       → { id, name, email, photo, isAuthenticated }
 *   login(data)    → popula o estado após autenticação
 *   logout()       → limpa estado e sessionStorage
 *   updatePhoto(b64) → persiste foto no localStorage e atualiza o estado
 *   clearPhoto()    → remove foto do localStorage e reseta para o avatar padrão
 */

const UserContext = createContext(null);

/** Lê o estado inicial a partir do storage (suporte a refresh de página) */
function readInitialState() {
  const id    = sessionStorage.getItem('userId')    ?? localStorage.getItem('userId')    ?? null;
  const name  = sessionStorage.getItem('userName')  ?? localStorage.getItem('userName')  ?? '';
  const email = sessionStorage.getItem('userEmail') ?? localStorage.getItem('userEmail') ?? '';
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const photo = id ? (localStorage.getItem(`leoVidros_userPhoto_${id}`) ?? null) : null;

  return { id, name, email, isAuthenticated, photo };
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(readInitialState);

  /** Chamado após login bem-sucedido */
  const login = useCallback(({ id, nome, email, firstLogin }) => {
    // Mantém o storage para compatibilidade com ProtectedRoute que ainda lê sessionStorage
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userId', String(id));
    sessionStorage.setItem('userName', nome);
    sessionStorage.setItem('userEmail', email);
    sessionStorage.setItem('userFirstLogin', String(firstLogin));
    localStorage.setItem('userName', nome);
    localStorage.setItem('userFirstLogin', String(firstLogin));

    const photo = localStorage.getItem(`leoVidros_userPhoto_${id}`) ?? null;
    setUser({ id: String(id), name: nome, email, isAuthenticated: true, photo });
  }, []);

  /** Chamado ao fazer logout */
  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser({ id: null, name: '', email: '', isAuthenticated: false, photo: null });
  }, []);

  /** Atualiza a foto do utilizador (base64 ou URL) */
  const updatePhoto = useCallback((base64) => {
    setUser(prev => {
      if (prev.id) {
        localStorage.setItem(`leoVidros_userPhoto_${prev.id}`, base64);
      }
      return { ...prev, photo: base64 };
    });
  }, []);

  /** Remove a foto e volta ao avatar padrão */
  const clearPhoto = useCallback(() => {
    setUser(prev => {
      if (prev.id) {
        localStorage.removeItem(`leoVidros_userPhoto_${prev.id}`);
      }
      return { ...prev, photo: null };
    });
  }, []);

  /** Atualiza campos do utilizador (name, email, etc.) */
  const updateUser = useCallback((fields) => {
    setUser(prev => {
      const updated = { ...prev, ...fields };
      if (fields.name !== undefined) {
        sessionStorage.setItem('userName', fields.name);
        localStorage.setItem('userName', fields.name);
      }
      if (fields.email !== undefined) {
        sessionStorage.setItem('userEmail', fields.email);
      }
      return updated;
    });
  }, []);

  return (
    <UserContext.Provider value={{ user, login, logout, updatePhoto, clearPhoto, updateUser, DefaultAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook de conveniência — lança erro se usado fora do UserProvider.
 *
 * @returns {{ user, login, logout, updatePhoto, clearPhoto, DefaultAvatar }}
 */
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser() deve ser usado dentro de <UserProvider>');
  }
  return ctx;
}
