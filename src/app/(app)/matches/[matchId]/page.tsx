import { MatchEditorScreen } from "@/features/matches/components/match-editor-screen";
import { createInitialMatchDraft } from "@/features/matches/lib/match-editor";

type PageProps = {
  params: Promise<{ matchId: string }>;
};

export default async function MatchEditorPage({ params }: PageProps) {
  const { matchId } = await params;

  return <MatchEditorScreen initialDraft={createInitialMatchDraft(matchId)} />;
}
