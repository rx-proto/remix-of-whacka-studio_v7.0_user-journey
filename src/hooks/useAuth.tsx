import React, { createContext, useContext, useState, useCallback } from 'react';

interface User {
  email: string;
  name: string;
  avatar: string; // url or 'gradient-1' | 'gradient-2'
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (email: string, password: string) => { success: boolean; error?: string };
  completeOnboarding: (name: string, avatar: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface MockUser {
  email: string;
  password: string;
  name: string;
  avatar: string;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [mockUsers, setMockUsers] = useState<MockUser[]>([
    { email: 'yang@whacka.com', password: '123456', name: 'Yang', avatar: '' },
  ]);
  const [pendingEmail, setPendingEmail] = useState('');

  const isLoggedIn = user !== null;

  const login = useCallback((email: string, password: string) => {
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ email: found.email, name: found.name, avatar: found.avatar });
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, [mockUsers]);

  const register = useCallback((email: string, password: string) => {
    const exists = mockUsers.some(u => u.email === email);
    if (exists) return { success: false, error: 'Account already exists' };
    setMockUsers(prev => [...prev, { email, password, name: email.split('@')[0], avatar: '' }]);
    setPendingEmail(email);
    return { success: true };
  }, [mockUsers]);

  const completeOnboarding = useCallback((name: string, avatar: string) => {
    const email = pendingEmail;
    setMockUsers(prev => prev.map(u => u.email === email ? { ...u, name, avatar } : u));
    setUser({ email, name, avatar });
    setPendingEmail('');
  }, [pendingEmail]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, completeOnboarding, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
