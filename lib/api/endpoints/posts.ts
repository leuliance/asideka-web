import { clientApiClient } from "../client";
import type {
  Post,
  CreatePostDto,
  PaginationParams,
  ApiResponse,
} from "../types";

export const postApi = {
  // Get all posts
  getAll: (params?: PaginationParams & { businessId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.businessId) searchParams.append("businessId", params.businessId);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    return clientApiClient<ApiResponse<Post[]>>(
      `/posts${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  },

  // Create a post
  create: (data: CreatePostDto) =>
    clientApiClient<ApiResponse<Post>>("/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
