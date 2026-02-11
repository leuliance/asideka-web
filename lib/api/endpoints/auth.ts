import { apiClient, clientApiClient } from "../client";
import type { AuthenticateRequestDto, CreateAccountRequestDto, AuthResponse } from "../types";

export const authApi = {
  login: (data: AuthenticateRequestDto) =>
    apiClient<AuthResponse>("/authentication/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: CreateAccountRequestDto) =>
    apiClient<AuthResponse>("/authentication/create-account", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Alias for backward compatibility
  createAccount: (data: CreateAccountRequestDto) =>
    apiClient<AuthResponse>("/authentication/create-account", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    clientApiClient<{ message: string; status: string }>("/authentication/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Placeholder for forgot password
  forgotPassword: (data: { email: string }) =>
    apiClient<{ message: string; status: string }>("/authentication/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Placeholder for verify token
  verifyToken: (data: { token: string }) =>
    apiClient<{ message: string; status: string }>("/authentication/verify-token", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
