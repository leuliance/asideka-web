"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { policyApi, type AiQueryDto } from "@/lib/api";
import { toast } from "sonner";

export function useBusinessNews(params?: { limit?: number; category?: string }) {
  return useQuery({
    queryKey: ["business-news", params],
    queryFn: () => policyApi.getBusinessNews(params),
  });
}

export function useAiQuery() {
  return useMutation({
    mutationFn: (data: AiQueryDto) => policyApi.aiQuery(data),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to get AI response");
    },
  });
}
