import type { Issue, CreateIssueInput } from "@/types/issue";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

async function request(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `API-fel: ${response.status}`;
    try {
      const body = await response.json();
      if (typeof body.error === "string") message = body.error;
    } catch {
      // Svaret behöver inte innehålla JSON.
    }
    throw new Error(message);
  }

  return response;
}

export async function getIssues(): Promise<Issue[]> {
  const response = await request("/api/issues");
  return response.json();
}

export async function createIssue(input: CreateIssueInput): Promise<Issue> {
  const response = await request("/api/issues", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return response.json();
}

export async function resolveIssue(id: number): Promise<void> {
  await request(`/api/issues/${id}/resolve`, { method: "PATCH" });
}

export async function deleteIssue(id: number): Promise<void> {
  await request(`/api/issues/${id}`, { method: "DELETE" });
}
