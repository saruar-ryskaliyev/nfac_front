export interface User {
  id: number;
  email: string;
  username: string;
  total_score: number;
  role: string;
  is_active?: boolean;
  is_verified?: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TokenInfo {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  user: User;
  token: TokenInfo;
  access_token?: string; // For backwards compatibility
}

export interface SignInApiResponse {
  message: string;
  data: User & { token: TokenInfo };
  detail: Record<string, any>;
}

export interface UserInfoApiResponse {
  message: string;
  data: User;
  detail: Record<string, any>;
}

export interface UserInCreate {
  email: string;
  username: string;
  password: string;
}

export interface UserInSignIn {
  email: string;
  password: string;
}

export interface ErrorResponse {
  app_exception: string;
  context: Record<string, unknown>;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
