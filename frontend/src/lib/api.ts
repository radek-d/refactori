import { RefactorAPIResponse, RefactorHistoryItem } from "@/lib/types";

// Backend URL (Railway production lub localhost)
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function callBackendAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? "Request failed");
  }

  return res.json();
}

export async function refactorCV(formData: FormData): Promise<RefactorAPIResponse> {
  return callBackendAPI<RefactorAPIResponse>("/api/v1/refactor", {
    method: "POST",
    body: formData,
  });
}

export async function getRefactor(refactorId: string): Promise<RefactorAPIResponse> {
  return callBackendAPI<RefactorAPIResponse>(`/api/v1/refactor/${refactorId}`);
}

export async function listRefactors(): Promise<{ items: RefactorHistoryItem[] }> {
  return callBackendAPI<{ items: RefactorHistoryItem[] }>("/api/v1/refactor/history");
}

export async function getUserCredits(): Promise<{ credits: number }> {
  return callBackendAPI<{ credits: number }>("/api/v1/payments/credits");
}
