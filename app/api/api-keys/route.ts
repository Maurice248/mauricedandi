import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

function generateApiKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `sk_live_${token}`;
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, name, key, created_at, updated_at")
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string };
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "API key name is required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .insert({
      name,
      key: generateApiKey(),
    })
    .select("id, name, key, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
