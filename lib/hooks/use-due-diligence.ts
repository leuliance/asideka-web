"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dueDiligenceApi, type RequestDueDiligenceDto } from "@/lib/api";
import { toast } from "sonner";

export function useDueDiligence(params?: { limit?: number; page?: number; query?: string }) {
  return useQuery({
    queryKey: ["due-diligence", params],
    queryFn: () => dueDiligenceApi.getAll(params),
  });
}

export function useRequestDueDiligence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestDueDiligenceDto) => dueDiligenceApi.request(data),
    onSuccess: () => {
      toast.success("Due diligence request submitted!");
      queryClient.invalidateQueries({ queryKey: ["due-diligence"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit request");
    },
  });
}
