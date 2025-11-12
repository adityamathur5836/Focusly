// src/lib/api.js
const API_BASE = "http://localhost:5001";

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Registration failed");
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  return data;
}

export async function getUserById(id) {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("User not authenticated");

  const res = await fetch(`${API_BASE}/api/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch user data");
  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  window.location.href = "/login";
}
