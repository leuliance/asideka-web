"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postApi,
  type CreatePostDto,
  type PaginationParams,
} from "@/lib/api";
import { toast } from "sonner";

export function usePosts(
  params?: PaginationParams & { businessId?: string }
) {
  return useQuery({
    queryKey: ["posts", params],
    queryFn: () => postApi.getAll(params),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => postApi.create(data),
    onSuccess: () => {
      toast.success("Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create post");
    },
  });
}
