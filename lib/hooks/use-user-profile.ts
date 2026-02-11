"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userProfileApi, type UserProfile } from "@/lib/api";
import { toast } from "sonner";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => userProfileApi.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => userProfileApi.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
}
