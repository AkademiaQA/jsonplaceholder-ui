import type { ApiResponse } from "../types";

export const BASE_URL = "https://jsonplaceholder.typicode.com";

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    const data: T = await res.json();
    return { data, status: res.status, method, url, error: null };
  } catch (err) {
    return {
      data: null,
      status: 0,
      method,
      url,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export const api = {
  getAll: <T>(resource: string) => request<T[]>("GET", `/${resource}`),
  getById: <T>(resource: string, id: number) =>
    request<T>("GET", `/${resource}/${id}`),
  post: <T>(resource: string, body: Partial<T>) =>
    request<T>("POST", `/${resource}`, body),
  put: <T>(resource: string, id: number, body: T) =>
    request<T>("PUT", `/${resource}/${id}`, body),
  patch: <T>(resource: string, id: number, body: Partial<T>) =>
    request<T>("PATCH", `/${resource}/${id}`, body),
  delete: (resource: string, id: number) =>
    request<Record<string, never>>("DELETE", `/${resource}/${id}`),
};
