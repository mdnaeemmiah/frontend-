"use server";

import { cookies } from "next/headers";

const API =
  process.env.NEXT_PUBLIC_BASE_API || process.env.NEXT_PUBLIC_API_URL || "";

async function apiRequest(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (json?.success && json?.data) {
    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production";

    if (json.data.accessToken) {
      cookieStore.set({
        name: "accessToken",
        value: json.data.accessToken,
        httpOnly: true,
        path: "/",
        secure,
      });
    }

    if (json.data.refreshToken) {
      cookieStore.set({
        name: "refreshToken",
        value: json.data.refreshToken,
        httpOnly: true,
        path: "/",
        secure,
      });
    }
  }

  return json;
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export async function logoutUser() {
  const cookieStore = await cookies();
  // call backend logout
  await fetch(`${API}/oauth/logout`, {
    method: "POST",
    cache: "no-store",
  }).catch(() => null);

  // remove cookies
  try {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
  } catch (e) {
    // fallback: overwrite with empty
    cookieStore.set({ name: "accessToken", value: "", path: "/" });
    cookieStore.set({ name: "refreshToken", value: "", path: "/" });
  }

  return { success: true };
}

export async function getCurrentUser() {
  // try oauth/me then auth/me
  const primary = await fetch(`${API}/oauth/me`, { cache: "no-store" })
    .then((r) => r.json())
    .catch(() => null);
  if (primary) return primary;
  const fallback = await fetch(`${API}/auth/me`, { cache: "no-store" })
    .then((r) => r.json())
    .catch(() => null);
  return fallback;
}
