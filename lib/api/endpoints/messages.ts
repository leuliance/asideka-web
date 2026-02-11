import { clientApiClient } from "../client";
import type { Message, CreateMessageDto, ChatDto, MessageThread } from "../types";

export const messageApi = {
  // Get all message threads
  getThreads: () =>
    clientApiClient<{ payload: MessageThread[] }>("/messages/thread", {
      method: "GET",
    }),

  // Get messages in a specific thread
  getThreadMessages: (userId: string) =>
    clientApiClient<{ payload: Message[] }>(`/messages/thread?userId=${userId}`, {
      method: "GET",
    }),

  // Get all messages (legacy)
  getAll: (params?: { userId?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append("userId", params.userId);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString();
    return clientApiClient<{ payload: Message[] }>(`/messages${query ? `?${query}` : ""}`, {
      method: "GET",
    });
  },

  // Create a message
  create: (data: CreateMessageDto) =>
    clientApiClient<Message>("/messages", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Send a chat message
  chat: (data: ChatDto) =>
    clientApiClient<Message>("/messages/chat", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
