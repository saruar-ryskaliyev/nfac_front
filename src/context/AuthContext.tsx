"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { User, AuthState, UserInSignIn, UserInCreate } from "@/types/auth";
import { authService } from "@/services/auth";
import { getStoredToken } from "@/lib/axios";

interface AuthContextType extends AuthState {
  signin: (credentials: UserInSignIn) => Promise<void>;
  signup: (userData: UserInCreate) => Promise<void>;
  signout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const updateState = (updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const signin = async (credentials: UserInSignIn): Promise<void> => {
    try {
      updateState({ isLoading: true });
      const response = await authService.signin(credentials);

      updateState({
        user: response.user,
        accessToken: response.token.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  };

  const signup = async (userData: UserInCreate): Promise<void> => {
    try {
      updateState({ isLoading: true });
      const response = await authService.signup(userData);
      updateState({
        user: response.user,
        accessToken: response.token.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      updateState({ isLoading: false });
      throw error;
    }
  };

  const signout = useCallback((): void => {
    authService.signout();
    updateState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshUser = async (): Promise<void> => {
    try {
      const user = await authService.getUserInfo();
      updateState({ user });
    } catch (error) {
      signout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();

      if (!token) {
        updateState({ isLoading: false });
        return;
      }

      try {
        const user = await authService.getUserInfo();
        updateState({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        signout();
      }
    };

    initializeAuth();
  }, [signout]);

  const value: AuthContextType = {
    ...state,
    signin,
    signup,
    signout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
