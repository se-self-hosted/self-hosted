import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripper requires an explicit TypeScript extension.
import { createRecordingBus } from "./recording-bus.ts";

type FakeTrack = { id: string; readyState: "live" | "ended" };

function setup() {
  const connected = new Set<string>();
  const destination = { stream: { id: "bus-stream" } };
  const context = {
    closed: false,
    createMediaStreamDestination: () => destination,
    createMediaStreamSource: (stream: { track: FakeTrack }) => ({
      connect: () => connected.add(stream.track.id),
      disconnect: () => connected.delete(stream.track.id),
    }),
    resume: async () => {},
    close: async () => { context.closed = true; },
  };
  (globalThis as { MediaStream?: unknown }).MediaStream = class {
    track: FakeTrack;
    constructor([track]: FakeTrack[]) { this.track = track; }
  };
  const bus = createRecordingBus(context as unknown as AudioContext);
  return { bus, connected, context, destination };
}

test("the recorded stream stays the same while the mic track is swapped", () => {
  const h = setup();
  const raw: FakeTrack = { id: "raw", readyState: "live" };
  const processed: FakeTrack = { id: "rnnoise", readyState: "live" };

  h.bus.setTrack(raw as unknown as MediaStreamTrack);
  const stream = h.bus.stream;
  assert.deepEqual([...h.connected], ["raw"]);

  raw.readyState = "ended";
  h.bus.setTrack(processed as unknown as MediaStreamTrack);
  assert.equal(h.bus.stream, stream);
  assert.equal(stream, h.destination.stream);
  assert.deepEqual([...h.connected], ["rnnoise"]);
});

test("a missing or ended track feeds silence instead of the old track", () => {
  const h = setup();
  const track: FakeTrack = { id: "mic", readyState: "live" };
  h.bus.setTrack(track as unknown as MediaStreamTrack);

  h.bus.setTrack(undefined);
  assert.equal(h.connected.size, 0);

  h.bus.setTrack({ id: "dead", readyState: "ended" } as unknown as MediaStreamTrack);
  assert.equal(h.connected.size, 0);

  h.bus.setTrack(track as unknown as MediaStreamTrack);
  h.bus.close();
  assert.equal(h.connected.size, 0);
  assert.equal(h.context.closed, true);
});
