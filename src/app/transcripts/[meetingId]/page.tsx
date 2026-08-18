import { TranscriptViewer } from "@/features/transcript-viewer/components/TranscriptViewer";
import { getTranscriptFixture } from "@/features/transcript-viewer/fixtures";

type TranscriptPageProps = {
  params: Promise<{ meetingId: string }>;
};

export default async function TranscriptPage({ params }: TranscriptPageProps) {
  const { meetingId } = await params;

  // SHT-121/SHT-122 are UI-only. SHT-120 can replace this fixture boundary later.
  const state = getTranscriptFixture(meetingId);

  return <TranscriptViewer state={state} />;
}
