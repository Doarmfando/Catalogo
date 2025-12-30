"use client";

import { createContext, useContext } from "react";

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'administrador' | 'personal';
  is_active: boolean;
}

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  isPersonal: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const value: UserContextType = {
    user,
    isAdmin: user?.role === 'administrador',
    isPersonal: user?.role === 'personal',
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
