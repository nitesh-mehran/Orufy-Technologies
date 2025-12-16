import React, { createContext, useState, useEffect, useMemo } from "react";

export const UserContext = createContext(null);

const USER_STORAGE_KEY = "productr_user";

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user from localStorage (on app start)
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Failed to parse user from storage", err);
      localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Sync user with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // 🔹 Logout helper
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  // 🔹 Memoized context value (performance)
  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      loading,
      isAuthenticated: !!user,
    }),
    [user, loading]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
