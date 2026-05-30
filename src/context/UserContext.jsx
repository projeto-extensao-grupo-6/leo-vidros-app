/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import DefaultAvatar from "../assets/Avatar.jpg";
import Api from "../api/client/Api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    isAuthenticated: false,
    photo: null,
    firstLogin: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Api.get("/me", { skipAuthRedirect: true, silent: true })
      .then((res) => {
        const { id, nome, email, firstLogin } = res.data;
        const photo = localStorage.getItem(`leoVidros_userPhoto_${email}`) ?? null;
        setUser({
          id: String(id),
          name: nome,
          email,
          isAuthenticated: true,
          photo,
          firstLogin,
        });
      })
      .catch(() => {
        setUser({ id: null, name: "", email: "", isAuthenticated: false, photo: null, firstLogin: false });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(({ id, nome, email, firstLogin }) => {
    const photo = localStorage.getItem(`leoVidros_userPhoto_${email}`) ?? null;
    localStorage.setItem("userFirstLogin", String(firstLogin));
    setUser({
      id: String(id),
      name: nome,
      email,
      isAuthenticated: true,
      photo,
      firstLogin,
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.clear();
    setUser({
      id: null,
      name: "",
      email: "",
      isAuthenticated: false,
      photo: null,
      firstLogin: false,
    });
  }, []);

  const updatePhoto = useCallback((base64) => {
    setUser((prev) => {
      if (prev.email) {
        localStorage.setItem(`leoVidros_userPhoto_${prev.email}`, base64);
      }
      return { ...prev, photo: base64 };
    });
  }, []);

  const clearPhoto = useCallback(() => {
    setUser((prev) => {
      if (prev.email) {
        localStorage.removeItem(`leoVidros_userPhoto_${prev.email}`);
      }
      return { ...prev, photo: null };
    });
  }, []);

  const updateUser = useCallback((fields) => {
    setUser((prev) => ({ ...prev, ...fields }));
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updatePhoto,
        clearPhoto,
        updateUser,
        DefaultAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser() deve ser usado dentro de <UserProvider>");
  }
  return ctx;
}
