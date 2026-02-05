const API_BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Erreur serveur" }));
    throw new Error(error.detail || `Erreur ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

// Auth
export const auth = {
  register: (data: { email: string; password: string; name: string }) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: { email: string; password: string }) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  me: () => request<User>("/auth/me"),
};

// Contacts
export const contacts = {
  list: () => request<Contact[]>("/contacts/"),
  get: (id: number) => request<Contact>(`/contacts/${id}`),
  create: (data: ContactInput) =>
    request<Contact>("/contacts/", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<ContactInput>) =>
    request<Contact>(`/contacts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: number) =>
    request(`/contacts/${id}`, { method: "DELETE" }),
};

// Types
export type User = {
  id: number;
  email: string;
  name: string;
  created_at: string;
};

export type Contact = {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactInput = {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  job_title?: string;
  status?: string;
  notes?: string;
};
