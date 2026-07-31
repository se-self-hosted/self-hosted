export type MeetingRoomStatus = "active" | "ended";

export type MeetingRoom = {
  id: string;
  slug: string;
  name: string;
  status: MeetingRoomStatus;
  currentParticipants?: number;
  maxParticipants: number;
};
