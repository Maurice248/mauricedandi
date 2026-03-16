import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { supabaseClient } from "@/lib/supabaseclient";

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: requiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: requiredEnv("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        console.error("[next-auth][signIn] Missing email for authenticated user.");
        return true;
      }

      const { error } = await supabaseClient.from("users").upsert(
        {
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          provider: account?.provider ?? "google",
          provider_account_id: account?.providerAccountId ?? null,
          last_sign_in_at: new Date().toISOString(),
        },
        { onConflict: "email" },
      );

      if (error) {
        console.error("[next-auth][signIn] Failed to upsert user in Supabase:", error.message);
      }

      return true;
    },
  },
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error("[next-auth][error]", code, metadata);
    },
    warn(code) {
      console.warn("[next-auth][warn]", code);
    },
    debug(code, metadata) {
      console.debug("[next-auth][debug]", code, metadata);
    },
  },
};
