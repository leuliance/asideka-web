import { clientApiClient } from "../client";
import type {
  CreatePostInteractionDto,
  Interaction,
  InteractionSummary,
} from "../types";

export const interactionApi = {
  // Create an interaction
  create: (data: CreatePostInteractionDto) =>
    clientApiClient<Interaction>("/interactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get user interactions
  getAll: (params?: { postId?: string; userId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.postId) searchParams.append("postId", params.postId);
    if (params?.userId) searchParams.append("userId", params.userId);

    const query = searchParams.toString();
    return clientApiClient<Interaction[]>(
      `/interactions${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  },

  // Check if user has interacted
  hasInteracted: (postId: string, type: string) =>
    clientApiClient<{ hasInteracted: boolean }>(
      `/interactions/has-interacted?postId=${postId}&type=${type}`,
      { method: "GET" }
    ),

  // Get interaction summary
  getSummary: (postId: string) =>
    clientApiClient<InteractionSummary>(`/interactions/summary?postId=${postId}`, {
      method: "GET",
    }),
};
