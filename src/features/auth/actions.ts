"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInWithGoogle() {
  if (!hasSupabaseEnv()) {
    redirect("/?auth=not-configured");
  }

  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin = headersList.get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/?auth=failed");
  }

  redirect(data.url);
}

export async function signOut() {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();

    await supabase.auth.signOut();
  }

  redirect("/");
}
