import { createContext, useContext, useState, type ReactNode } from "react";

import type { IUser, IAuthData, AuthUser } from "../types/auth";
import { authStorage } from "../api/authStorage";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (data: IAuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(authStorage.getUser());

  const [token, setToken] = useState<string | null>(authStorage.getToken());

  const login = (data: IAuthData) => {
    setUser(data.user);
    setToken(data.token);

    authStorage.setUser(data.user);
    authStorage.setToken(data.token);
    authStorage.setRefreshToken(data.refreshToken);
  };

  const logout = () => {
    setUser(null);

    setToken(null);

    authStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
