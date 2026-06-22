import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
const BACKEND_API_SECRET = process.env.BACKEND_API_SECRET ?? "";

export async function POST(request: NextRequest) {
  // Auth guard — user must be logged in
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  // Append user_id to the form data
  const formData = await request.formData();
  formData.set("user_id", user.id);

  const response = await fetch(`${BACKEND_URL}/api/v1/refactor`, {
    method: "POST",
    headers: { "x-api-secret": BACKEND_API_SECRET },
    body: formData,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    const rawText = await response.text().catch(() => "Internal Server Error");
    data = { detail: rawText };
  }
  return NextResponse.json(data, { status: response.status });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const subPath = path && path.length > 0 ? `/${path.join("/")}` : "";
  
  const { searchParams } = new URL(request.url);
  searchParams.set("user_id", user.id);
  const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const response = await fetch(
    `${BACKEND_URL}/api/v1/refactor${subPath}${qs}`,
    { headers: { "x-api-secret": BACKEND_API_SECRET } }
  );

  let data;
  try {
    data = await response.json();
  } catch {
    const rawText = await response.text().catch(() => "Internal Server Error");
    data = { detail: rawText };
  }
  return NextResponse.json(data, { status: response.status });
}
