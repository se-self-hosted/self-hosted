"use client";

import { KeyboardEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Download } from "lucide-react";

export type SummaryExportOption = {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  onSelect: () => void;
};

const MENU_WIDTH = 288;

/** One "ส่งออก" button that opens a menu of export formats. */
export function SummaryExportMenu({ options }: { options: SummaryExportOption[] }) {
  const menuId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function open(focusIndex = 0) {
    // Open toward whichever side has room, so the menu never leaves the screen.
    const rect = triggerRef.current?.getBoundingClientRect();
    setAlignRight(Boolean(rect && rect.left + MENU_WIDTH > window.innerWidth - 16));
    setIsOpen(true);
    requestAnimationFrame(() => itemRefs.current[focusIndex]?.focus());
  }

  function close({ restoreFocus = true } = {}) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  // A click anywhere else closes the menu without stealing focus back.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      open(event.key === "ArrowUp" ? options.length - 1 : 0);
    }
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = itemRefs.current.filter((item): item is HTMLButtonElement => item !== null);
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    const focusAt = (index: number) => items[(index + items.length) % items.length]?.focus();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusAt(current + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusAt(current - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        // Don't also close a modal the summary is shown in.
        event.stopPropagation();
        close();
        break;
      case "Tab":
        close({ restoreFocus: false });
        break;
    }
  }

  function select(option: SummaryExportOption) {
    close();
    option.onSelect();
  }

  return (
    <div ref={wrapperRef} className="export-menu">
      <button
        ref={triggerRef}
        type="button"
        className="meeting-summary__export action-fill focus-ring"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={onTriggerKeyDown}
      >
        <Download aria-hidden="true" className="icon-14" />
        ส่งออก
        <ChevronDown aria-hidden="true" className={`icon-14 export-menu__chevron${isOpen ? " export-menu__chevron--open" : ""}`} />
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-label="เลือกรูปแบบไฟล์ที่จะส่งออก"
          className={`export-menu__panel${alignRight ? " export-menu__panel--right" : ""}`}
          onKeyDown={onMenuKeyDown}
        >
          <p className="export-menu__heading" aria-hidden="true">ส่งออกเป็น</p>
          {options.map((option, index) => (
            <button
              key={option.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              className="export-menu__item"
              onClick={() => select(option)}
            >
              <span className="export-menu__icon">{option.icon}</span>
              <span className="export-menu__text">
                <span className="export-menu__label">{option.label}</span>
                <span className="export-menu__description">{option.description}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
