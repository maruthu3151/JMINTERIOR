import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth, loginWithUsername, logoutAdmin, getAdminProfile } from '../services/authService';
import { AdminProfile } from '../types';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminProfile | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    try {
      const p = await getAdminProfile();
      setAdminProfile(p);
    } catch (e) {
      console.warn('Could not load admin profile:', e);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const login = async (username: string, pass: string) => {
    const loggedUser = await loginWithUsername(username, pass);
    setUser(loggedUser);
    await fetchProfile();
  };

  const logout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        adminProfile,
        loading,
        login,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
