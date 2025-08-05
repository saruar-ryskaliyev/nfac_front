export interface Tag {
  id: number;
  name: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface TagInCreate {
  name: string;
}

export interface TagInUpdate {
  name: string;
}

export interface TagResponse {
  message: string;
  data: Tag | Tag[];
  detail: Record<string, any> | null;
}

export interface TagListResponse {
  message: string;
  data: Tag[];
  detail: Record<string, any> | null;
}