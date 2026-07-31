"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Clock3,
  LayoutGrid,
  LogOut,
  Plus,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { MeetingRoomList } from "@/features/rooms/components/MeetingRoomList";
import { listMeetingRooms } from "@/features/rooms/data";
import type { MeetingRoom } from "@/features/rooms/types";
import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { user, isLoading, checkAuth, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [areRoomsLoading, setAreRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState<string | null>(null);
  const [copiedRoomId, setCopiedRoomId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("1");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Check auth on mount
    checkAuth().finally(() => setIsChecking(false));
  }, [checkAuth]);

  useEffect(() => {
    // Redirect if completely finished checking and no user is found
    if (isChecking || isLoading || !user) return;

    let isCancelled = false;

    listMeetingRooms()
      .then((loadedRooms) => {
        if (!isCancelled) setRooms(loadedRooms);
      })
      .catch(() => {
        if (!isCancelled) {
          setRoomsError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
        }
      })
      .finally(() => {
        if (!isCancelled) setAreRoomsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [isChecking, isLoading, user]);

  async function fetchRooms() {
    setAreRoomsLoading(true);
    setRoomsError(null);

    try {
      setRooms(await listMeetingRooms());
    } catch {
      setRoomsError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setAreRoomsLoading(false);
    }
  }

  const closeModal = () => {
    setModalMode(null);
    setSelectedRoomId(null);
    setSelectedRoomSlug(null);
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

  const openEditModal = (room: MeetingRoom) => {
    setSelectedRoomId(room.id);
    setSelectedRoomSlug(room.slug);
    setRoomName(room.name);
    setCapacity(String(room.maxParticipants));
    setFormError("");
    setModalMode("edit");
  };

  const saveRoom = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = roomName.trim();
    const parsedCapacity = Number(capacity);

    if (!trimmedName) {
      setFormError("กรุณากรอกชื่อห้องประชุม");
      return;
    }

    if (!Number.isInteger(parsedCapacity) || parsedCapacity < 2) {
      setFormError("จำนวนผู้เข้าร่วมต้องมีอย่างน้อย 2 คน");
      return;
    }

    if (modalMode === "create") {
      try {
        const response = await fetch("/api/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomName: trimmedName,
            maxParticipants: parsedCapacity,
          }),
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          setFormError(data.error || "ไม่สามารถสร้างห้องได้");
          return;
        }
    
        const newRoom: MeetingRoom = {
          id: data.room.id,
          slug: data.room.roomHash,
          name: data.room.roomName,
          maxParticipants: data.room.maxParticipants,
          status: "active",
        };
    
        setRooms((currentRooms) => [
          ...currentRooms,
          newRoom,
        ]);
      } catch (error) {
        console.error("Create room error:", error);
        setFormError("ไม่สามารถเชื่อมต่อกับ Server ได้");
        return;
      }

    } else if (selectedRoomId) {
      try {
        const response = await fetch(`/api/rooms/${selectedRoomSlug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: trimmedName,
            maxParticipants: parsedCapacity,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setFormError(data.error || "ไม่สามารถแก้ไขห้องได้");
          return;
        }

        setRooms((currentRooms) =>
          currentRooms.map((room) =>
            room.id === selectedRoomId
              ? {
                  ...room,
                  name: data.room.roomName,
                  maxParticipants: data.room.maxParticipants,
                  status: data.room.status === "ended" ? "ended" : "active",
                }
              : room,
          ),
        );
      } catch (error) {
        console.error("Update room error:", error);
        setFormError("ไม่สามารถเชื่อมต่อกับ Server ได้");
        return;
      }
    }

    closeModal();
  };

  const deleteSelectedRoom = async () => {
    if (!selectedRoomId || !selectedRoomSlug) return;
  
    try {
      const response = await fetch(`/api/rooms/${selectedRoomSlug}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const data = await response.json();
        setFormError(data.error || "ไม่สามารถลบห้องได้");
        return;
      }
  
      setRooms((currentRooms) => currentRooms.filter((room) => room.id !== selectedRoomId));
      closeModal();
    } catch (error) {
      console.error("Delete room error:", error);
      setFormError("ไม่สามารถเชื่อมต่อกับ Server ได้");
    }
  };

  const copyRoomLink = async (room: MeetingRoom) => {
    const meetingUrl = `${window.location.origin}/meeting/${room.slug}`;

    try {
      await navigator.clipboard.writeText(meetingUrl);
      setCopiedRoomId(room.id);
      window.setTimeout(() => setCopiedRoomId(null), 1800);
    } catch {
      setCopiedRoomId(null);
    }
  };

  if (isChecking || isLoading) {
    return (
      <div className="dashboard-loading">
        <p className="dashboard-loading__text">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect shortly
  }

  const activeRoomCount = rooms.filter((room) => room.status === "active").length;

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar__inner">
          <div className="sidebar__header">
            <div className="sidebar__brand">
              <span className="sidebar__brand-icon">
                <Video aria-hidden="true" className="icon-18" strokeWidth={2.2} />
              </span>
              <span className="sidebar__brand-name">MeetSync</span>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              aria-label="ออกจากระบบ"
              className="sidebar__logout-mobile"
            >
              <LogOut aria-hidden="true" className="icon-20" />
            </button>
          </div>

          <nav aria-label="เมนูหลัก" className="sidebar__nav">
            <p className="sidebar__nav-label">เมนู</p>
            <div className="sidebar__nav-grid">
              <a href="#rooms" aria-current="page" className="sidebar__nav-link--active">
                <LayoutGrid aria-hidden="true" className="icon-16" />
                แดชบอร์ด
              </a>
              <a href="#history" className="sidebar__nav-link">
                <Clock3 aria-hidden="true" className="icon-16" />
                ประวัติการประชุม
              </a>
            </div>
          </nav>

          <div className="sidebar__footer">
            <div className="sidebar__user-row">
              <span className="sidebar__avatar">
                {(user.name || user.email).charAt(0).toUpperCase()}
              </span>
              <span className="sidebar__user-info">
                <span className="sidebar__user-name">{user.name || "Host"}</span>
                <span className="sidebar__user-email">{user.email}</span>
              </span>
              <button
                type="button"
                onClick={() => logout()}
                aria-label="ออกจากระบบ"
                className="sidebar__logout-desktop"
              >
                <LogOut aria-hidden="true" className="icon-16" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main id="rooms" className="dashboard__main">
        <div className="dashboard__container">
          <header className="dashboard__header">
            <div>
              <h1 className="dashboard__title">ห้องประชุม</h1>
              <p className="dashboard__subtitle">
                {areRoomsLoading
                  ? "กำลังโหลดรายการห้องประชุม..."
                  : `${activeRoomCount} ห้องใช้งานอยู่ · ${rooms.length} ทั้งหมด`}
              </p>
            </div>
            <button type="button" onClick={openCreateModal} className="dashboard__create-btn focus-ring">
              <Plus aria-hidden="true" className="icon-18" />
              สร้างห้องประชุม
            </button>
          </header>

          <MeetingRoomList
            rooms={rooms}
            isLoading={areRoomsLoading}
            error={roomsError}
            copiedRoomId={copiedRoomId}
            onCopyLink={copyRoomLink}
            onEdit={openEditModal}
            onRetry={() => void fetchRooms()}
          />

          <span id="history" className="sr-only">ประวัติการประชุม</span>
        </div>
      </main>

      {modalMode && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          className="modal-overlay"
        >
          <div role="dialog" aria-modal="true" aria-labelledby="room-modal-title" className="modal">
            <div className="modal__header">
              <div>
                <h2 id="room-modal-title" className="modal__title">
                  {modalMode === "create" ? "สร้างห้องประชุม" : "แก้ไขห้องประชุม"}
                </h2>
                <p className="modal__subtitle">
                  {modalMode === "create"
                    ? "กรอกรายละเอียดสำหรับห้องประชุมใหม่"
                    : "แก้ไขชื่อหรือจำนวนผู้เข้าร่วมสูงสุด"}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="ปิดหน้าต่าง"
                className="modal__close-btn focus-ring"
              >
                <X aria-hidden="true" className="icon-20" />
              </button>
            </div>

            <form onSubmit={saveRoom} className="modal__form">
              <div>
                <label htmlFor="room-name" className="modal__label">
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
                  className="modal__input"
                />
              </div>

              <div>
                <label htmlFor="room-capacity" className="modal__label">
                  จำนวนผู้เข้าร่วมสูงสุด
                </label>
                <input
                  id="room-capacity"
                  type="number"
                  min="2"
                  step="1"
                  value={capacity}
                  onChange={(event) => {
                    setCapacity(event.target.value);
                    setFormError("");
                  }}
                  className="modal__input"
                />
              </div>

              {formError && (
                <p role="alert" className="modal__error">
                  {formError}
                </p>
              )}

              <div className="modal__actions">
                {modalMode === "edit" && (
                  <button
                    type="button"
                    onClick={deleteSelectedRoom}
                    className="modal__delete-btn focus-ring-danger"
                  >
                    <Trash2 aria-hidden="true" className="icon-16" />
                    ลบห้อง
                  </button>
                )}
                <button type="button" onClick={closeModal} className="modal__cancel-btn focus-ring">
                  ยกเลิก
                </button>
                <button type="submit" className="modal__submit-btn focus-ring">
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
