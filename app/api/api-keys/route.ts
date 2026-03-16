import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { supabaseClient } from "@/lib/supabaseclient";

function generateApiKey() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const token = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `sk_live_${token}`;
}

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: user, error } = await supabaseClient
    .from("users")
    .select("id")
    .eq("email", session.user.email)
    .maybeSingle();

  if (error) {
    return { errorResponse: NextResponse.json({ error: error.message }, { status: 500 }) };
  }

  if (!user) {
    return { errorResponse: NextResponse.json({ error: "Authenticated user not found." }, { status: 404 }) };
  }

  return { userId: user.id };
}

export async function GET() {
  const auth = await getAuthenticatedUserId();
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const { data, error } = await supabaseClient
    .from("api_keys")
    .select("id, name, key, created_at, updated_at")
    .eq("user_id", auth.userId)
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedUserId();
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const body = (await request.json()) as { name?: string };
  const name = body.name?.trim();

  if (!name) {
    return NextResponse.json({ error: "API key name is required." }, { status: 400 });
  }

  const { data, error } = await supabaseClient
    .from("api_keys")
    .insert({
      user_id: auth.userId,
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
