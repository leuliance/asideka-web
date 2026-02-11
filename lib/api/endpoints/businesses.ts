import { clientApiClient } from "../client";
import type {
  Business,
  BusinessCategory,
  CreateBusinessDto,
  UpdateBusinessDto,
  VerifyBusinessUserDto,
  DisableBusinessUserDto,
  AddBusinessUserDto,
  PaginationParams,
  ApiResponse,
  User,
} from "../types";

export const businessApi = {
  // Get business categories
  getCategories: () =>
    clientApiClient<ApiResponse<BusinessCategory[]>>("/businesses/categories", {
      method: "GET",
    }),

  // Get all businesses
  getAll: (params?: PaginationParams) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.categoryId) searchParams.append("categoryId", params.categoryId);
    if (params?.query) searchParams.append("query", params.query);
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

    const query = searchParams.toString();
    return clientApiClient<ApiResponse<Business[]>>(
      `/businesses${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  },

  // Create a business
  create: (data: CreateBusinessDto) =>
    clientApiClient<{ status: string; message: string; payload: Business | null }>("/businesses", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Update a business
  update: (data: UpdateBusinessDto) =>
    clientApiClient<Business>("/businesses", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete a business
  delete: (businessId: string) =>
    clientApiClient<{ message: string }>(`/businesses?businessId=${businessId}`, {
      method: "DELETE",
    }),

  // Get business affiliations
  getAffiliations: (businessId: string) =>
    clientApiClient<User[]>(`/businesses/affiliations?businessId=${businessId}`, {
      method: "GET",
    }),

  // Get business users
  getUsers: (businessId: string) =>
    clientApiClient<User[]>(`/businesses/users?businessId=${businessId}`, {
      method: "GET",
    }),

  // Verify business user
  verifyUser: (data: VerifyBusinessUserDto) =>
    clientApiClient<{ message: string }>("/businesses/users/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Disable business user
  disableUser: (data: DisableBusinessUserDto) =>
    clientApiClient<{ message: string }>("/businesses/users/disable", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Add business user
  addUser: (data: AddBusinessUserDto) =>
    clientApiClient<{ message: string }>("/businesses/users/add", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
