import { api } from "@/lib/axios";
import { Tag } from "@/types/quiz";

export const tagService = {
  async getAllTags(): Promise<Tag[]> {
    const response = await api.get<{ message: string; data: Tag[] }>("/api/v1/tags/");
    return response.data.data;
  },
};