"use client";

import { useQuery } from "@tanstack/react-query";
import { searchApi, type SearchParams } from "@/lib/api";

export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: ["search", params],
    queryFn: () => searchApi.search(params),
    enabled: !!params.query && params.query.length > 0,
  });
}
