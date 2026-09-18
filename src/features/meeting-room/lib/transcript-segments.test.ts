import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { mergeTranscriptSegments } from "./transcript-segments.ts";

type Segment = {
  id: string;
  startTime: number;
  spokenAt: string;
  text: string;
};

test("initial transcript response preserves segments received while the request was pending", () => {
  const fetched: Segment[] = [
    { id: "existing", startTime: 1, spokenAt: "2026-09-15T00:00:01.000Z", text: "existing" },
    { id: "live", startTime: 2, spokenAt: "2026-09-15T00:00:02.000Z", text: "stale copy" },
  ];
  const live: Segment = {
    id: "live",
    startTime: 2,
    spokenAt: "2026-09-15T00:00:02.000Z",
    text: "received live",
  };

  const segments = mergeTranscriptSegments([live], fetched);

  assert.deepEqual(segments.map(({ id, text }) => ({ id, text })), [
    { id: "existing", text: "existing" },
    { id: "live", text: "received live" },
  ]);
});
