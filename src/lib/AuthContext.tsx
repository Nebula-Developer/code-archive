'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { account } from '../lib/appwrite';
import { Models } from 'appwrite';

type User = Models.User<Models.Preferences>;
type UserUpdate = {
  oldPassword?: string;
} & User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  update: (data: Partial<UserUpdate>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    const currentUser = await account.get();
    setUser(currentUser);
  };

  const logout = async () => {
    await account.deleteSession('current');
    setUser(null);
  };

  const update = async (data: Partial<UserUpdate>) => {
    if (!user) throw new Error('User not authenticated');
    let promises = [];
    if (data.email && data.oldPassword && data.email !== user.email)
      promises.push(account.updateEmail(data.email, data.oldPassword));
    if (data.name && data.name !== user.name)
      promises.push(account.updateName(data.name));
    if (data.password && data.oldPassword && data.password !== data.oldPassword)
      promises.push(account.updatePassword(data.password, data.oldPassword));

    await Promise.all(promises);
    const updatedUser = await account.get();
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, update }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
