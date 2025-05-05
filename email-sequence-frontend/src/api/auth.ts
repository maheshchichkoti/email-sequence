import axiosInstance from "./api";

export interface AuthResponse {
  token: string;
}

export async function signup(email: string, password: string) {
  const res = await axiosInstance.post<AuthResponse>("/auth/signup", {
    email,
    password,
  });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await axiosInstance.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return res.data;
}
