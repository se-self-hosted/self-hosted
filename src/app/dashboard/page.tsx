"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Check,
  Clock3,
  LayoutGrid,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

type Room = {
  id: string;
  name: string;
  status: "active" | "ended";
  participants?: number;
  capacity: number;
};

const initialRooms: Room[] = [
  {
    id: "product-strategy-q3",
    name: "Product Strategy Q3",
    status: "active",
    participants: 7,
    capacity: 20,
  },
  {
    id: "design-review-sprint-42",
    name: "Design Review – Sprint 42",
    status: "active",
    participants: 4,
    capacity: 10,
  },
  {
    id: "engineering-stand-up",
    name: "Engineering Stand-up",
    status: "ended",
    capacity: 15,
  },
  {
    id: "investor-pitch-prep",
    name: "Investor Pitch Prep",
    status: "active",
    participants: 3,
    capacity: 8,
  },
  {
    id: "customer-success-sync",
    name: "Customer Success Sync",
    status: "ended",
    capacity: 12,
  },
  {
    id: "marketing-campaign-review",
    name: "Marketing Campaign Review",
    status: "ended",
    capacity: 10,
  },
];

export default function DashboardPage() {
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Check auth on mount
    checkAuth().finally(() => setIsChecking(false));
  }, [checkAuth]);

  useEffect(() => {
    // Redirect if completely finished checking and no user is found
    if (!isChecking && !isLoading && !user) {
      router.push("/login");
    }
  }, [isChecking, isLoading, user, router]);

  const closeModal = () => {
    setModalMode(null);
    setSelectedRoomId(null);
    setRoomName("");
    setCapacity("1");
    setFormError("");
  };

  const openCreateModal = () => {
    setSelectedRoomId(null);
    setRoomName("");
    setCapacity("1");
    setFormError("");
    setModalMode("create");
  };

  const openEditModal = (room: Room) => {
    setSelectedRoomId(room.id);
    setRoomName(room.name);
    setCapacity(String(room.capacity));
    setFormError("");
    setModalMode("edit");
  };

  const saveRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = roomName.trim();
    const parsedCapacity = Number(capacity);

    if (!trimmedName) {
      setFormError("กรุณากรอกชื่อห้องประชุม");
      return;
    }

    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 1) {
      setFormError("จำนวนผู้เข้าร่วมต้องมีอย่างน้อย 1 คน");
      return;
    }

    if (modalMode === "create") {
      setRooms((currentRooms) => [
        ...currentRooms,
        {
          id: `room-${Date.now()}`,
          name: trimmedName,
          capacity: parsedCapacity,
          participants: 0,
          status: "active",
        },
      ]);
    } else if (selectedRoomId) {
      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === selectedRoomId
            ? { ...room, name: trimmedName, capacity: parsedCapacity }
            : room,
        ),
      );
    }

    closeModal();
  };

  const deleteSelectedRoom = () => {
    if (!selectedRoomId) return;

    setRooms((currentRooms) => currentRooms.filter((room) => room.id !== selectedRoomId));
    closeModal();
  };

  const copyRoomLink = async (roomId: string) => {
    const meetingUrl = `${window.location.origin}/meet/${roomId}`;

    try {
      await navigator.clipboard.writeText(meetingUrl);
      setCopiedRoomId(roomId);
      window.setTimeout(() => setCopiedRoomId(null), 1800);
    } catch {
      setCopiedRoomId(null);
    }
  };

  if (isChecking || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d172b]">
        <p className="text-sm text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect shortly
  }

  const activeRoomCount = rooms.filter((room) => room.status === "active").length;

  return (
    <div className="min-h-screen bg-[#0d172b] text-slate-100 lg:flex">
      <aside className="border-b border-[#202c42] bg-[#0e182c] lg:fixed lg:inset-y-0 lg:left-0 lg:w-[236px] lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col">
          <div className="flex h-20 items-center justify-between px-5 lg:justify-start lg:gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#5447e9] shadow-[0_8px_24px_rgba(84,71,233,0.25)]">
                <Video aria-hidden="true" className="size-[18px]" strokeWidth={2.2} />
              </span>
              <span className="text-base font-bold tracking-tight text-white">MeetSync</span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              aria-label="ออกจากระบบ"
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-[#18243a] hover:text-white lg:hidden"
            >
              <LogOut aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label="เมนูหลัก" className="px-2 pb-4 lg:pt-0">
            <p className="mb-3 hidden px-3 text-[10px] font-medium text-[#52627e] lg:block">เมนู</p>
            <div className="grid grid-cols-2 gap-2 lg:block lg:space-y-1">
              <a
                href="#rooms"
                aria-current="page"
                className="flex h-10 items-center gap-3 rounded-lg bg-[#5145e5] px-3 text-sm font-semibold text-white"
              >
                <LayoutGrid aria-hidden="true" className="size-4" />
                แดชบอร์ด
              </a>
              <a
                href="#history"
                className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-[#8493ac] transition-colors hover:bg-[#18243a] hover:text-white"
              >
                <Clock3 aria-hidden="true" className="size-4" />
                ประวัติการประชุม
              </a>
            </div>
          </nav>

          <div className="mt-auto hidden border-t border-[#202c42] p-3 lg:block">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#5145e5] text-sm font-bold text-white">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-semibold text-white">
                  {user.name || "Host"}
                </span>
                <span className="block truncate text-[10px] text-slate-500">{user.email}</span>
              </span>
              <button
                type="button"
                onClick={() => logout()}
                aria-label="ออกจากระบบ"
                className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-[#202d44] hover:text-white"
              >
                <LogOut aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main id="rooms" className="w-full px-5 py-7 sm:px-8 lg:ml-[236px] lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1574px]">
          <header className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">ห้องประชุม</h1>
              <p className="mt-1.5 text-sm text-[#7183a2]">
                {activeRoomCount} ห้องใช้งานอยู่ · {rooms.length} ทั้งหมด
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex h-[42px] w-fit items-center justify-center gap-2 rounded-lg bg-[#5145e5] px-5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(81,69,229,0.2)] transition-colors hover:bg-[#6054ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8078ff]"
            >
              <Plus aria-hidden="true" className="size-[18px]" />
              สร้างห้องประชุม
            </button>
          </header>

          <section aria-label="รายการห้องประชุม" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {rooms.map((room) => {
              const isActive = room.status === "active";
              const wasCopied = copiedRoomId === room.id;

              return (
                <article
                  key={room.id}
                  className="flex min-h-[207px] flex-col rounded-xl border border-[#32415a] bg-[#1c293d] p-6 shadow-[0_10px_30px_rgba(2,8,23,0.08)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex size-10 items-center justify-center rounded-[10px] bg-[#0f1930] text-[#685cff]">
                      <Video aria-hidden="true" className="size-[18px]" strokeWidth={1.9} />
                    </span>
                    <span
                      className={
                        isActive
                          ? "inline-flex items-center gap-1.5 rounded-full bg-[#12433e] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#14e29b]"
                          : "rounded-full bg-[#293850] px-2.5 py-1 text-[11px] font-semibold leading-none text-[#8495af]"
                      }
                    >
                      {isActive && <span aria-hidden="true" className="size-2 rounded-full bg-[#0ee391]" />}
                      {isActive ? "Active" : "Ended"}
                    </span>
                  </div>

                  <div className="mt-3.5">
                    <h2 className="text-base font-bold tracking-[-0.02em] text-white">{room.name}</h2>
                    <p className="mt-1.5 text-xs text-[#6f83a5]">
                      {isActive ? `${room.participants} / ${room.capacity} คน` : `สูงสุด ${room.capacity} คน`}
                    </p>
                  </div>

                  <div className="mt-auto flex gap-2 pt-5">
                    <button
                      type="button"
                      onClick={() => copyRoomLink(room.id)}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-[#35465f] text-xs font-medium text-[#b6c4d9] transition-colors hover:border-[#526581] hover:bg-[#223149] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8078ff]"
                    >
                      {wasCopied && <Check aria-hidden="true" className="size-3.5 text-[#14e29b]" />}
                      {wasCopied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(room)}
                      aria-label={`แก้ไขห้อง ${room.name}`}
                      className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#35465f] text-[#8fa0b9] transition-colors hover:border-[#526581] hover:bg-[#223149] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8078ff]"
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </section>

          <span id="history" className="sr-only">ประวัติการประชุม</span>
        </div>
      </main>

      {modalMode && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#050b17]/75 p-4 backdrop-blur-[2px]"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-modal-title"
            className="w-full max-w-md rounded-xl border border-[#35445d] bg-[#1c293d] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-start justify-between border-b border-[#304057] px-6 py-5">
              <div>
                <h2 id="room-modal-title" className="text-lg font-bold text-white">
                  {modalMode === "create" ? "สร้างห้องประชุม" : "แก้ไขห้องประชุม"}
                </h2>
                <p className="mt-1 text-xs text-[#8191aa]">
                  {modalMode === "create"
                    ? "กรอกรายละเอียดสำหรับห้องประชุมใหม่"
                    : "แก้ไขชื่อหรือจำนวนผู้เข้าร่วมสูงสุด"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="ปิดหน้าต่าง"
                className="rounded-lg p-2 text-[#8191aa] transition-colors hover:bg-[#26354c] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8078ff]"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <form onSubmit={saveRoom} className="space-y-5 p-6">
              <div>
                <label htmlFor="room-name" className="mb-2 block text-sm font-medium text-[#d6deeb]">
                  ชื่อห้องประชุม
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(event) => {
                    setRoomName(event.target.value);
                    setFormError("");
                  }}
                  autoFocus
                  placeholder="เช่น Weekly Team Sync"
                  className="h-11 w-full rounded-lg border border-[#3a4b65] bg-[#111c30] px-3.5 text-sm text-white outline-none transition placeholder:text-[#596b88] focus:border-[#675cf0] focus:ring-2 focus:ring-[#5145e5]/25"
                />
              </div>

              <div>
                <label htmlFor="room-capacity" className="mb-2 block text-sm font-medium text-[#d6deeb]">
                  จำนวนผู้เข้าร่วมสูงสุด
                </label>
                <input
                  id="room-capacity"
                  type="number"
                  min="1"
                  step="1"
                  value={capacity}
                  onChange={(event) => {
                    setCapacity(event.target.value);
                    setFormError("");
                  }}
                  className="h-11 w-full rounded-lg border border-[#3a4b65] bg-[#111c30] px-3.5 text-sm text-white outline-none transition placeholder:text-[#596b88] focus:border-[#675cf0] focus:ring-2 focus:ring-[#5145e5]/25"
                />
              </div>

              {formError && (
                <p role="alert" className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#304057] pt-5 sm:flex-row sm:items-center">
                {modalMode === "edit" && (
                  <button
                    type="button"
                    onClick={deleteSelectedRoom}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-500/35 px-4 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 sm:mr-auto"
                  >
                    <Trash2 aria-hidden="true" className="size-4" />
                    ลบห้อง
                  </button>
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  className="h-10 rounded-lg border border-[#3a4b65] px-4 text-sm font-semibold text-[#b9c5d8] transition-colors hover:bg-[#26354c] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8078ff]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-[#5145e5] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#6054ef] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8078ff]"
                >
                  {modalMode === "create" ? "สร้างห้อง" : "บันทึก"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
