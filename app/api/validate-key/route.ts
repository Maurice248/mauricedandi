import { NextResponse } from "next/server";

import { supabaseClient } from "@/lib/supabaseclient";

export async function POST(request: Request) {
  const body = (await request.json()) as { apiKey?: string };
  const apiKey = body.apiKey?.trim();

  if (!apiKey) {
    return NextResponse.json({ valid: false, error: "API key is required." }, { status: 400 });
  }

  const { data, error } = await supabaseClient
    .from("api_keys")
    .select("id, usage, limit_count")
    .eq("key", apiKey)
    .eq("deleted", false)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ valid: false, message: "Invalid API key" });
  }

  const usage = data.usage ?? 0;
  const limit = data.limit_count;
  if (typeof limit === "number" && usage >= limit) {
    return NextResponse.json({
      valid: false,
      limitReached: true,
      message: "API key is already on its limit.",
    });
  }

  return NextResponse.json({ valid: true, message: "Valid API key" });
}
