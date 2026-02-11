import { clientApiClient } from "../client";
import type { SearchParams, SearchResult, ApiResponse } from "../types";

export const searchApi = {
  // Text search
  search: (params: SearchParams) => {
    const searchParams = new URLSearchParams();
    searchParams.append("query", params.query);
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.page) searchParams.append("page", params.page.toString());

    return clientApiClient<ApiResponse<SearchResult>>(`/search/text?${searchParams.toString()}`, {
      method: "GET",
    });
  },
};
