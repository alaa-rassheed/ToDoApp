import { createContext, useState, useCallback, useEffect } from 'react';
import { getToken, setToken, setUser, getUser, clearStorage } from '../utils/storage';
import { loginApi, getMeApi, logoutApi } from '../api/auth';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(getUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getMeApi()
        .then((res) => {
          setUserState(res.data.user);
          setUser(res.data.user);
        })
        .catch(() => {
          clearStorage();
          setUserState(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginApi({ email, password });
    const { token, user: userData } = res.data;
    setToken(token);
    setUser(userData);
    setUserState(userData);
    return userData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
    } finally {
      clearStorage();
      setUserState(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
