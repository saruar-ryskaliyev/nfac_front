export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface UserInCreate {
  email: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
}

export interface UserInUpdate {
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UserResponse {
  message: string;
  data: User;
  detail: Record<string, any> | null;
}

export interface UserListResponse {
  message: string;
  data: User[];
  detail: Record<string, any> | null;
}

export interface UserPaginatedResponse {
  message: string;
  data: {
    data: User[];
    meta: {
      total: number;
      skip: number;
      limit: number;
      has_next: boolean;
      has_previous: boolean;
      total_pages: number;
      current_page: number;
    };
  };
  detail: Record<string, any> | null;
}

export interface UserSearchParams {
  search?: string;
  role?: UserRole;
  is_active?: boolean;
  page?: number;
  limit?: number;
  skip?: number;
}