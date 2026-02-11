"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  messageApi,
  type CreateMessageDto,
  type ChatDto,
} from "@/lib/api";
import { toast } from "sonner";

export function useMessageThreads() {
  return useQuery({
    queryKey: ["message-threads"],
    queryFn: () => messageApi.getThreads(),
  });
}

export function useThreadMessages(userId: string) {
  return useQuery({
    queryKey: ["thread-messages", userId],
    queryFn: () => messageApi.getThreadMessages(userId),
    enabled: !!userId,
  });
}

export function useMessages(params?: { userId?: string; limit?: number }) {
  return useQuery({
    queryKey: ["messages", params],
    queryFn: () => messageApi.getAll(params),
  });
}

export function useMessageThread(userId: string) {
  return useQuery({
    queryKey: ["message-thread", userId],
    queryFn: () => messageApi.getThreadMessages(userId),
    enabled: !!userId,
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMessageDto) => messageApi.create(data),
    onSuccess: () => {
      toast.success("Message sent!");
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["message-thread"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
}

export function useSendChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChatDto) => messageApi.chat(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      queryClient.invalidateQueries({ queryKey: ["message-thread"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send chat");
    },
  });
}
