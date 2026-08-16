import type { ApiResponse } from "@/types/api";
import {
  getAdminToken as _getAdminToken,
  removeAdminToken as _removeAdminToken,
} from "./token-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5075/api";

// ─── Token helpers — re-exported from token-store so all existing
// `import { getAdminToken } from '@/services/api-client'` paths keep working.
export {
  getAdminToken,
  setAdminToken,
  removeAdminToken,
  getCustomerToken,
  setCustomerToken,
  removeCustomerToken,
} from "./token-store";
export class ApiError extends Error {
  status: number;
  details?: string;

  constructor(message: string, status: number, details?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  headers?: Record<string, string>;
}

/**
 * Type-safe fetch wrapper for the BelGomla API.
 * Handles JSON serialization, error parsing, and auth headers.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token, headers: extraHeaders } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = "حدث خطأ غير متوقع";
    let errorDetails: string | undefined;

    if (response.status === 401) {
      _removeAdminToken();
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }

    let errMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const textBody = await response.text();
      console.error("API Error Response Text:", textBody);
      
      if (textBody) {
        try {
          const errorBody = JSON.parse(textBody);
          console.error("API Error Body Parsed:", errorBody);
          if (errorBody.errors) {
            errMessage = typeof errorBody.errors === 'string' ? errorBody.errors : JSON.stringify(errorBody.errors);
          } else if (errorBody.message) {
            errMessage = errorBody.message;
          } else if (errorBody.detail) {
            errMessage = errorBody.detail; // For ProblemDetails
          }
        } catch (jsonError) {
          errMessage = `${errMessage} - ${textBody.substring(0, 100)}`;
        }
      }
    } catch {
      // Ignored if text() fails
    }
    throw new Error(errMessage);
  }

  return response.json() as Promise<T>;
}

