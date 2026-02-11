"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { authApi, type CreateAccountRequestDto } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      toast.success("Logged in successfully!");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to login");
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: CreateAccountRequestDto) => {
      return authApi.createAccount(data);
    },
    onSuccess: async (data, variables) => {
      toast.success("Account created successfully!");
      // Auto login after registration using the username and password from registration
      await signIn("credentials", {
        username: variables.username,
        password: variables.password,
        redirect: false,
      });
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false });
    },
    onSuccess: () => {
      toast.success("Logged out successfully!");
      queryClient.clear();
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to logout");
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      toast.success("Password reset link sent to your email!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to send password reset link");
    },
  });

  const verifyTokenMutation = useMutation({
    mutationFn: authApi.verifyToken,
  });

  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully!");
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password");
    },
  });

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    session,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    forgotPassword: forgotPasswordMutation.mutate,
    verifyToken: verifyTokenMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
  };
}
