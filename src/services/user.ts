import { api } from "@/lib/axios";
import {
  User,
  UserResponse,
  UserListResponse,
  UserPaginatedResponse,
  UserInCreate,
  UserInUpdate,
  UserSearchParams,
} from "@/types/user";

export const userService = {
  /**
   * Get all users (admin only)
   * GET /api/v1/users
   */
  async getAllUsers(params?: UserSearchParams): Promise<{
    items: User[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const response = await api.get<UserPaginatedResponse>("/api/v1/users", {
      params,
    });
    return {
      items: response.data.data.data,
      total: response.data.data.meta.total,
      page: response.data.data.meta.current_page,
      limit: response.data.data.meta.limit,
      pages: response.data.data.meta.total_pages,
    };
  },

  /**
   * Get a user by ID (admin only)
   * GET /api/v1/users/{user_id}
   */
  async getUserById(userId: number): Promise<User> {
    const response = await api.get<UserResponse>(`/api/v1/users/${userId}`);
    return response.data.data;
  },

  /**
   * Create a new user (admin only)
   * POST /api/v1/users
   */
  async createUser(userData: UserInCreate): Promise<User> {
    const response = await api.post<UserResponse>('/api/v1/users', userData);
    return response.data.data;
  },

  /**
   * Update a user by ID (admin only)
   * PUT /api/v1/users/{user_id}
   */
  async updateUser(userId: number, userData: UserInUpdate): Promise<User> {
    const response = await api.put<UserResponse>(`/api/v1/users/${userId}`, userData);
    return response.data.data;
  },

  /**
   * Delete a user by ID (admin only)
   * DELETE /api/v1/users/{user_id}
   */
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/api/v1/users/${userId}`);
  },

  /**
   * Get user statistics (admin only)
   * GET /api/v1/admin/users/stats
   */
  async getUserStats(): Promise<{
    total_users: number;
    active_users: number;
    admin_users: number;
    recent_registrations: number;
  }> {
    const response = await api.get('/api/v1/admin/users/stats');
    return response.data.data;
  },
};