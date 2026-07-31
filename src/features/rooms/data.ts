import type { MeetingRoom } from "./types";

type ApiRoom = {
  id: string;
  roomHash: string;
  roomName: string;
  maxParticipants: number;
  status: string;
};

function mapApiRoom(room: ApiRoom): MeetingRoom {
  return {
    id: room.id,
    slug: room.roomHash,
    name: room.roomName,
    maxParticipants: room.maxParticipants,
    status: room.status === "ended" ? "ended" : "active",
  };
}

async function readApiResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Room request failed");
  }

  return data;
}

export async function listMeetingRooms(): Promise<MeetingRoom[]> {
  const response = await fetch("/api/rooms", { cache: "no-store" });
  const data = await readApiResponse<{ rooms: ApiRoom[] }>(response);
  return data.rooms.map(mapApiRoom);
}

export async function getMeetingRoomBySlug(slug: string): Promise<MeetingRoom | null> {
  const response = await fetch(`/api/rooms/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (response.status === 404) return null;

  const data = await readApiResponse<{ room: ApiRoom }>(response);
  return mapApiRoom(data.room);
}
