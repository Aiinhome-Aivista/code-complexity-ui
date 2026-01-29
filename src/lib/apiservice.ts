interface FetchRequestConfig extends Omit<RequestInit, "body"> {
  data?: any;
  params?: Record<string, string>;
}

const getHeaders = (existingHeaders?: HeadersInit): Headers => {
  const headers = new Headers(existingHeaders);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // 2. Auth Interceptor Logic
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
};

/**
 * @param url - The endpoint or full URL
 * @param options - Fetch options (method, data, headers, etc.)
 * @returns The response data or null if status is 204
 */
const apiservice = async <T = any>(
  url: string,
  options: FetchRequestConfig = {}
): Promise<T | null> => {
  const { data, params, ...customConfig } = options;

  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams(params);
    const separator = fullUrl.includes("?") ? "&" : "?";
    fullUrl = `${fullUrl}${separator}${searchParams.toString()}`;
  }

  // Pass data to getHeaders to check for FormData
  const config: RequestInit = {
    ...customConfig,
    headers: getHeaders(customConfig.headers), // Note: we need to adjust getHeaders or handle it here. 
    // Actually, getHeaders doesn't see 'options.data' unless passed. 
    // Let's refactor slightly inline or pass it.
  };
  
  // Refined Logic for FormData support:
  const headers = new Headers(customConfig.headers);
  
  if (data instanceof FormData) {
     // Do NOT set Content-Type, let browser set it with boundary
  } else if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }
  
  config.headers = headers;

  if (data) {
    config.body = data instanceof FormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(fullUrl, config);

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      let errorMessage = "An unknown API error occurred.";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || response.statusText;
      } catch {
        errorMessage = response.statusText;
      }

      console.error("apiservice Error:", errorMessage);
      throw new Error(errorMessage);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("apiservice Error:", (error as Error).message);
    throw error;
  }
};

export default apiservice;
