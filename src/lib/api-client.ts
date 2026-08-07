/**
 * Axios client for the FastAPI backend.
 *
 * Pulls the access token from the active Supabase session and attaches it as a
 * Bearer header on every request. The backend verifies the JWT in
 * `app/core/security.py`.
 */
import axios from "axios";

import { supabase } from "@/lib/supabase-client";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  // Only attach a token in the browser; SSR has no Supabase session.
  if (typeof window !== "undefined") {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
