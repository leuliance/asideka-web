"use client";

import { apiClient, type ApiError } from "./client";

// Re-export for convenience
export { ApiError };

// Client-side wrapper that will be used by hooks
export async function makeAuthenticatedRequest<T>(
  endpoint: string,
  config: RequestInit & { requiresAuth?: boolean; token?: string } = {}
): Promise<T> {
  return apiClient<T>(endpoint, config);
}
