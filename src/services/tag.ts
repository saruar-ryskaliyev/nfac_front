import { api } from "@/lib/axios";
import {
  Tag,
  TagResponse,
  TagListResponse,
  TagInCreate,
  TagInUpdate,
} from "@/types/tag";

export const tagService = {
  /**
   * Get all tags
   * GET /api/v1/tags
   */
  async getAllTags(skip?: number, limit?: number): Promise<Tag[]> {
    const params = new URLSearchParams();
    if (skip !== undefined) params.append('skip', skip.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    
    const response = await api.get<TagListResponse>(`/api/v1/tags?${params.toString()}`);
    return Array.isArray(response.data.data) ? response.data.data : [];
  },

  /**
   * Get a tag by ID
   * GET /api/v1/tags/{tag_id}
   */
  async getTagById(tagId: number): Promise<Tag> {
    const response = await api.get<TagResponse>(`/api/v1/tags/${tagId}`);
    return response.data.data as Tag;
  },

  /**
   * Create a new tag (admin only)
   * POST /api/v1/tags
   */
  async createTag(tagData: TagInCreate): Promise<Tag> {
    const response = await api.post<TagResponse>('/api/v1/tags', tagData);
    return response.data.data as Tag;
  },

  /**
   * Update a tag by ID (admin only)
   * PUT /api/v1/tags/{tag_id}
   */
  async updateTag(tagId: number, tagData: TagInUpdate): Promise<Tag> {
    const response = await api.put<TagResponse>(`/api/v1/tags/${tagId}`, tagData);
    return response.data.data as Tag;
  },

  /**
   * Delete a tag by ID (admin only)
   * DELETE /api/v1/tags/{tag_id}
   */
  async deleteTag(tagId: number): Promise<void> {
    await api.delete(`/api/v1/tags/${tagId}`);
  },
};