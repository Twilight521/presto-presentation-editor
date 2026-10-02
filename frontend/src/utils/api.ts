import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  throw new Error(
    "VITE_API_BASE_URL is not configured. Copy .env.example to .env.local.",
  );
}

const request = async (
  path: string,
  method: "GET" | "POST" | "PUT",
  body?: unknown,
  token?: string,
) => {
  try {
    const res = await axios({
      url: `${BASE_URL}${path}`,
      method,
      data: body,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.data?.error) {
        throw err.response.data.error;
      }
    }
    throw err;
  }
};

export const register = async (
  email: string,
  password: string,
  name: string,
) => {
  return request("/admin/auth/register", "POST", {
    email: email,
    password: password,
    name: name,
  });
};

export const login = async (email: string, password: string) => {
  return request("/admin/auth/login", "POST", {
    email: email,
    password: password,
  });
};

export const logout = async (token: string) => {
  return request("/admin/auth/logout", "POST", {}, token);
};

export const getStore = async (token: string) => {
  return request("/store", "GET", undefined, token);
};

export const setStore = async (token: string, store: unknown) => {
  return request("/store", "PUT", { store }, token);
};

export const fetchPresentations = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const data = await getStore(token);
  if (data.store && data.store.presentations) {
    return data.store.presentations;
  }
  return [];
};

export const isAuthError = (error: unknown) => {
  return String(error).includes("Invalid token");
};
