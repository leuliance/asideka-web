"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  businessApi,
  type CreateBusinessDto,
  type UpdateBusinessDto,
  type PaginationParams,
} from "@/lib/api";
import { toast } from "sonner";

export function useBusinessCategories() {
  return useQuery({
    queryKey: ["business-categories"],
    queryFn: businessApi.getCategories,
  });
}

export function useBusinesses(params?: PaginationParams) {
  return useQuery({
    queryKey: ["businesses", params],
    queryFn: () => businessApi.getAll(params),
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBusinessDto) => businessApi.create(data),
    onSuccess: (response) => {
      console.log({ response });
      
      // Check if the response status is "success" or "failed"
      if (response.status === "failed") {
        toast.error(response.message || "Failed to create business");
        return;
      }
      
      toast.success("Business created successfully!");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create business");
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBusinessDto) => businessApi.update(data),
    onSuccess: () => {
      toast.success("Business updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update business");
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: string) => businessApi.delete(businessId),
    onSuccess: () => {
      toast.success("Business deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete business");
    },
  });
}

export function useBusinessUsers(businessId: string) {
  return useQuery({
    queryKey: ["business-users", businessId],
    queryFn: () => businessApi.getUsers(businessId),
    enabled: !!businessId,
  });
}

export function useBusinessAffiliations(businessId: string) {
  return useQuery({
    queryKey: ["business-affiliations", businessId],
    queryFn: () => businessApi.getAffiliations(businessId),
    enabled: !!businessId,
  });
}
