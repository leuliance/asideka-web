import { clientApiClient } from "../client";
import type { AiQueryDto, AiQueryResponse, BusinessNews } from "../types";

export const policyApi = {
  // AI query
  aiQuery: (data: AiQueryDto) =>
    clientApiClient<AiQueryResponse>("/policies/ai-query", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Get business news
  getBusinessNews: (params?: { limit?: number; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.category) searchParams.append("category", params.category);

    const query = searchParams.toString();
    return clientApiClient<{ payload: BusinessNews[] }>(
      `/policies/business-news${query ? `?${query}` : ""}`,
      { method: "GET" }
    );
  },
};
