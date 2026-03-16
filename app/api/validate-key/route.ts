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
    .select("id")
    .eq("key", apiKey)
    .eq("deleted", false)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ valid: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ valid: Boolean(data) });
}
