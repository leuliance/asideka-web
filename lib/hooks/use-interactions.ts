"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  interactionApi,
  type CreatePostInteractionDto,
} from "@/lib/api";
import { toast } from "sonner";

export function useInteractions(params?: { postId?: string; userId?: string }) {
  return useQuery({
    queryKey: ["interactions", params],
    queryFn: () => interactionApi.getAll(params),
    enabled: !!(params?.postId || params?.userId),
  });
}

export function useInteractionSummary(postId: string) {
  return useQuery({
    queryKey: ["interaction-summary", postId],
    queryFn: () => interactionApi.getSummary(postId),
    enabled: !!postId,
  });
}

export function useHasInteracted(postId: string, type: string) {
  return useQuery({
    queryKey: ["has-interacted", postId, type],
    queryFn: () => interactionApi.hasInteracted(postId, type),
    enabled: !!(postId && type),
  });
}

export function useCreateInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostInteractionDto) => interactionApi.create(data),
    onSuccess: (_, variables) => {
      // Show toast only for like and comment
      if (variables.type === "like") {
        toast.success("Post liked!");
      } else if (variables.type === "comment") {
        toast.success("Comment added!");
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ 
        queryKey: ["interaction-summary", variables.postId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["has-interacted", variables.postId] 
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to interact with post");
    },
  });
}

export function useToggleInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { postId: string; interactionType: "like" | "comment" | "share" | "view" }) => 
      interactionApi.create({ postId: data.postId, type: data.interactionType }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
      queryClient.invalidateQueries({ 
        queryKey: ["interaction-summary", variables.postId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ["has-interacted", variables.postId] 
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
