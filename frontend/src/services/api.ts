import { env } from "../config/env";

export type User = {
  id: number;
  email: string;
  username?: string;
};

export type TimestampData = {
  id: number | string;
  reading_timestamp: string;
  ai_soc: string;
  sensor_soc: string;
  soh_pct?: string;
  voltage_diff_v?: string;
  max_cell_voltage_v?: string;
  current_a?: string;
  power_kw?: string;
  voltage_v?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

type RegisterPayload = {
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

async function request<T>(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${env.apiBaseUrl}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.error || data?.message || `HTTP error! status: ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export const authApi = {
  me: () => request<User>("/auth/me"),
  register: (payload: RegisterPayload) =>
    request<{ message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: LoginPayload) =>
    request<{ message: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),
  deleteAccount: () =>
    request<{ message: string }>("/auth/delete", {
      method: "DELETE",
    }),
};

export const dataApi = {
  getTimestamps: () => request<TimestampData[]>("/data/timestamp"),
  getLatest: () => request<TimestampData[]>("/data/latest"),
};
