import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_BACKEND_URL + '/api';

// Axios instance with credentials (httpOnly cookie auth)
const authAxios = axios.create({
  baseURL: API,
  withCredentials: true,
});

const AuthContext = createContext(null);

/**
 * AuthContext states:
 *   null  = still checking (loading)
 *   false = not authenticated
 *   {...} = authenticated user object
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // null = loading
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef(null);

  // ── Safe user accessor ──────────────────────────────────────
  const safeUser = user && typeof user === 'object' ? user : null;

  // ── Restore session on mount ───────────────────────────────
  useEffect(() => {
    checkSession();
    return () => { if (refreshTimer.current) clearInterval(refreshTimer.current); };
  }, []);

  const checkSession = async () => {
    try {
      const { data } = await authAxios.get('/auth/me');
      const userData = data?.user || data;
      if (userData?.id) {
        console.log('AUTH USER:', userData);
        setUser(userData);
        scheduleRefresh();
      } else {
        setUser(false);
      }
    } catch {
      // 401 = not authenticated, not an error
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  // ── Refresh access token every 55 min ─────────────────────
  const scheduleRefresh = () => {
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(async () => {
      try {
        const { data } = await authAxios.post('/auth/refresh');
        if (data?.user) {
          // NEVER set user to null — always merge
          setUser(prev => ({ ...(prev || {}), ...data.user }));
          console.log('AUTH USER (refreshed):', data.user);
        }
      } catch {
        // Token expired — force logout
        setUser(false);
      }
    }, 55 * 60 * 1000);
  };

  // ── Login ──────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await authAxios.post('/auth/login', { email, password });
    const userData = data?.user || data;
    if (!userData?.id) throw new Error('Invalid response format');
    console.log('AUTH USER:', userData);
    setUser(userData);
    scheduleRefresh();
    return userData;
  };

  // ── Register ───────────────────────────────────────────────
  const register = async (email, password, name) => {
    const { data } = await authAxios.post('/auth/register', { email, password, name });
    const userData = data?.user || data;
    if (!userData?.id) throw new Error('Invalid response format');
    console.log('AUTH USER:', userData);
    setUser(userData);
    scheduleRefresh();
    return userData;
  };

  // ── Logout ─────────────────────────────────────────────────
  const logout = async () => {
    try { await authAxios.post('/auth/logout'); } catch { }
    if (refreshTimer.current) clearInterval(refreshTimer.current);
    // Clear all storage tokens
    localStorage.removeItem('ak_token');
    localStorage.removeItem('ak_user');
    sessionStorage.clear();
    setUser(false);
    console.log('AUTH USER: logged out');
  };

  // ── refreshUser — ALWAYS merges, NEVER sets null ──────────
  const refreshUser = useCallback(async (newData) => {
    if (newData && typeof newData === 'object') {
      // Direct merge with provided data
      setUser(prev => {
        if (!prev) return newData;
        const merged = { ...prev, ...newData };
        console.log('AUTH USER (merged):', merged);
        return merged;
      });
      return;
    }
    // Fetch fresh data from server
    try {
      const { data } = await authAxios.get('/auth/me');
      const userData = data?.user || data;
      if (userData?.id) {
        setUser(prev => {
          if (!prev) return userData;
          const merged = { ...prev, ...userData };
          console.log('AUTH USER (refreshed from server):', merged);
          return merged;
        });
      }
      // If no valid data, DO NOT set user to null — keep existing
    } catch {
      // Network error — keep existing user, don't logout
    }
  }, []);

  // ── Safe credit accessor ───────────────────────────────────
  const getCredits = () => safeUser?.ak_credits ?? 0;
  const getRank    = () => safeUser?.rank    ?? 'Rookie';
  const getLevel   = () => safeUser?.level   ?? 1;

  const value = {
    user: safeUser,
    loading,
    login,
    logout,
    register,
    refreshUser,
    getCredits,
    getRank,
    getLevel,
    isAuthenticated: !!safeUser,
    isAdmin: safeUser?.role === 'admin',
  };

  // Protect against crash if user is null during loading
  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

export default AuthContext;
