import React, { useContext, useState, createContext, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPrompt, requestLogin] = useState(false);
  const [user, setUser] = useState();

  const loginHandler = (userId) => {
    setIsLoggedIn((login) => !login);
  };

  useEffect(() => {
    let id = localStorage.getItem("id");
    let userEmail = localStorage.getItem("user");

    if (id) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        loginHandler,
        requestLogin,
        loginPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
