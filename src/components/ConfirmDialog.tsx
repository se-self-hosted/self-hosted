"use client";

import { ReactNode, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, X } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  /** "danger" for actions that discard data. */
  tone?: "default" | "danger";
  icon?: ReactNode;
  /** While true the dialog can't be dismissed and the confirm button shows a spinner. */
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * A centered, themed replacement for window.confirm. It renders into
 * document.body so it sits above any modal the trigger lives in.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "ยกเลิก",
  tone = "default",
  icon,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(busy);
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    busyRef.current = busy;
    onCancelRef.current = onCancel;
  });

  // Focus the safe choice on open, and hand focus back to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // Don't also close a modal the dialog was opened from.
        event.stopPropagation();
        if (!busyRef.current) onCancelRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled)")];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      role="presentation"
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="modal confirm-dialog"
      >
        <div className="modal__header">
          <div className="confirm-dialog__heading">
            {icon && (
              <span className={`confirm-dialog__icon${tone === "danger" ? " confirm-dialog__icon--danger" : ""}`}>
                {icon}
              </span>
            )}
            <div className="modal__heading">
              <h2 id={titleId} className="modal__title confirm-dialog__title">
                {title}
              </h2>
              <div id={descriptionId} className="modal__subtitle confirm-dialog__description">
                {description}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            aria-label="ปิดหน้าต่าง"
            className="modal__close-btn focus-ring"
          >
            <X aria-hidden="true" className="icon-18" />
          </button>
        </div>

        <div className="confirm-dialog__body">
          {error && (
            <p role="alert" className="modal__error">
              {error}
            </p>
          )}
        </div>

        <div className="modal__actions">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="modal__cancel-btn action-fill action-fill--accent focus-ring"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={
              tone === "danger"
                ? "confirm-dialog__danger-btn action-fill action-fill--danger focus-ring-danger"
                : "modal__submit-btn action-fill action-fill--accent focus-ring"
            }
          >
            {busy && <Loader2 aria-hidden="true" className="icon-16 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
