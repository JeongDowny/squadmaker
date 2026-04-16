import Link from "next/link";
import { signInWithGoogle, signOut } from "@/features/auth/actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getSupabaseUser } from "@/lib/supabase/server";

export async function AppNavigation() {
  const user = await getSupabaseUser();
  const authConfigured = hasSupabaseEnv();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
          SquadMaker
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium text-slate-600 sm:gap-5">
          <Link href="/matches" className="transition hover:text-slate-950">
            경기 관리
          </Link>
          <Link href="/players" className="transition hover:text-slate-950">
            팀 관리
          </Link>
          <Link
            href="/matches/new"
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            새 경기
          </Link>
          {user ? (
            <form action={signOut}>
              <button type="submit" className="text-xs font-semibold text-slate-500">
                로그아웃
              </button>
            </form>
          ) : (
            <form action={signInWithGoogle}>
              <button
                type="submit"
                disabled={!authConfigured}
                className={
                  authConfigured
                    ? "text-xs font-semibold text-emerald-700"
                    : "cursor-not-allowed text-xs font-semibold text-slate-400"
                }
              >
                로그인
              </button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
}
