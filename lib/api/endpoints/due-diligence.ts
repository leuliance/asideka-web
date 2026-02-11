import { clientApiClient } from "../client";
import type { DueDiligence, RequestDueDiligenceDto, ApiResponse } from "../types";

export const dueDiligenceApi = {
  // Get all due diligence requests
  getAll: (params?: { limit?: number; page?: number; query?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.query) searchParams.append("query", params.query);

    const query = searchParams.toString();
    return clientApiClient<{
      payload: DueDiligence[];
      metadata: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        nextPage: boolean;
      };
    }>(
      `/due-diligence${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  },

  // Request due diligence
  request: (data: RequestDueDiligenceDto) =>
    clientApiClient<DueDiligence>("/due-diligence", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
