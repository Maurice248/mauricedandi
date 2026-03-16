import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { supabaseClient } from "@/lib/supabaseclient";

type Params = {
  params: Promise<{ id: string }>;
};

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

export async function GET(_: Request, { params }: Params) {
  const auth = await getAuthenticatedUserId();
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const { id } = await params;

  const { data, error } = await supabaseClient
    .from("api_keys")
    .select("id, name, key, usage, limit_count, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", auth.userId)
    .eq("deleted", false)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "API key not found." }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await getAuthenticatedUserId();
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const { id } = await params;
  const body = (await request.json()) as { name?: string; limit?: number | null };
  const name = body.name?.trim();
  const limit = body.limit;

  if (!name && typeof limit === "undefined") {
    return NextResponse.json({ error: "At least one field (name or limit) is required." }, { status: 400 });
  }

  if (limit !== null && typeof limit !== "undefined" && (!Number.isInteger(limit) || limit < 0)) {
    return NextResponse.json({ error: "Limit must be a non-negative integer." }, { status: 400 });
  }

  const updatePayload: { name?: string; limit_count?: number | null; updated_at: string } = {
    updated_at: new Date().toISOString(),
  };
  if (name) {
    updatePayload.name = name;
  }
  if (typeof limit !== "undefined") {
    updatePayload.limit_count = limit;
  }

  const { data, error } = await supabaseClient
    .from("api_keys")
    .update(updatePayload)
    .eq("id", id)
    .eq("user_id", auth.userId)
    .eq("deleted", false)
    .select("id, name, key, usage, limit_count, created_at, updated_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "API key not found." }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(_: Request, { params }: Params) {
  const auth = await getAuthenticatedUserId();
  if (auth.errorResponse) {
    return auth.errorResponse;
  }

  const { id } = await params;

  const { error } = await supabaseClient
    .from("api_keys")
    .update({ deleted: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", auth.userId)
    .eq("deleted", false);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return new NextResponse(null, { status: 204 });
}
