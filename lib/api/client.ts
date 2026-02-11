export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://asideka-core-service-310046503952.us-central1.run.app";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
  token?: string;
}

export async function apiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { requiresAuth = true, token, headers = {}, ...restConfig } = config;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // Add authorization header if auth is required and token is provided
  if (requiresAuth && token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...restConfig,
      headers: requestHeaders,
      cache: "no-store", // Disable caching for API calls
    });

    // Handle empty responses
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!isJson) {
      if (!response.ok) {
        console.log(`API Error [${response.status}]: ${response.statusText} - ${url}`);
        throw new ApiError(response.status, response.statusText);
      }
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      console.log(`API Error [${response.status}]:`, data, "- URL:", url);
      throw new ApiError(response.status, response.statusText, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or other errors
    console.log("Network/API Error:", error, "- URL:", url);
    throw new Error(
      error instanceof Error ? error.message : "Network request failed"
    );
  }
}

// Client-side API client that automatically includes session token
export async function clientApiClient<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  // Dynamically import to avoid server-side issues
  if (typeof window !== "undefined") {
    const { getSession } = await import("next-auth/react");
    const session = await getSession();
    
    return apiClient<T>(endpoint, {
      ...config,
      token: session?.accessToken,
    });
  }
  
  // Server-side, no token available
  return apiClient<T>(endpoint, config);
}
