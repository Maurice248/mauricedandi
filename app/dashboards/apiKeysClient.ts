import type { ApiKeyRow } from "./types";

async function parsePayload<T>(response: Response): Promise<{ data?: T; error?: string }> {
  try {
    return (await response.json()) as { data?: T; error?: string };
  } catch {
    return {};
  }
}

export async function fetchApiKeys() {
  const response = await fetch("/api/api-keys", { cache: "no-store" });
  const payload = await parsePayload<ApiKeyRow[]>(response);

  if (!response.ok) {
    throw new Error(payload.error || "Failed to load API keys.");
  }

  return payload.data || [];
}

export async function createApiKey(name: string) {
  const response = await fetch("/api/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const payload = await parsePayload<ApiKeyRow>(response);

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || "Failed to create API key.");
  }

  return payload.data;
}

export async function updateApiKey(id: string, name: string) {
  const response = await fetch(`/api/api-keys/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const payload = await parsePayload<ApiKeyRow>(response);

  if (!response.ok || !payload.data) {
    throw new Error(payload.error || "Failed to update API key.");
  }

  return payload.data;
}

export async function deleteApiKey(id: string) {
  const response = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });

  if (!response.ok) {
    const payload = await parsePayload<unknown>(response);
    throw new Error(payload.error || "Failed to delete API key.");
  }
}
