"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { KeyboardEvent, useEffect, useId, useRef, useState } from "react";

type HistoryDatePickerProps = {
  align?: "start" | "end";
  label: string;
  max?: string;
  min?: string;
  onChange: (value: string) => void;
  value: string;
};

const monthFormatter = new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" });
const selectedDateFormatter = new Intl.DateTimeFormat("th-TH", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const accessibleDateFormatter = new Intl.DateTimeFormat("th-TH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

function toDateValue(date: Date) {
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");
}

function fromDateValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isAllowed(value: string, min?: string, max?: string) {
  return (!min || value >= min) && (!max || value <= max);
}

function clampDate(value: string, min?: string, max?: string) {
  if (min && value < min) return min;
  if (max && value > max) return max;
  return value;
}

function monthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const firstVisible = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisible);
    date.setDate(firstVisible.getDate() + index);
    return date;
  });
}

export function HistoryDatePicker({
  align = "start",
  label,
  max,
  min,
  onChange,
  value,
}: HistoryDatePickerProps) {
  const today = toDateValue(new Date());
  const initialDate = fromDateValue(value || clampDate(today, min, max));
  const [isOpen, setIsOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState({
    year: initialDate.getFullYear(),
    month: initialDate.getMonth(),
  });
  const [focusedDate, setFocusedDate] = useState(toDateValue(initialDate));
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const dialogId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = requestAnimationFrame(() => {
      calendarRef.current
        ?.querySelector<HTMLButtonElement>(`[data-date="${focusedDate}"]`)
        ?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [focusedDate, isOpen, visibleMonth]);

  const openCalendar = () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const nextFocused = clampDate(value || today, min, max);
    const nextDate = fromDateValue(nextFocused);
    setFocusedDate(nextFocused);
    setVisibleMonth({ year: nextDate.getFullYear(), month: nextDate.getMonth() });
    setIsOpen(true);
  };

  const closeCalendar = (restoreFocus = false) => {
    setIsOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const chooseDate = (nextValue: string) => {
    if (!isAllowed(nextValue, min, max)) return;
    onChange(nextValue);
    closeCalendar(true);
  };

  const moveFocus = (days: number) => {
    const nextDate = fromDateValue(focusedDate);
    nextDate.setDate(nextDate.getDate() + days);
    const nextValue = clampDate(toDateValue(nextDate), min, max);
    const allowedDate = fromDateValue(nextValue);
    setFocusedDate(nextValue);
    setVisibleMonth({ year: allowedDate.getFullYear(), month: allowedDate.getMonth() });
  };

  const moveMonth = (offset: number) => {
    const current = fromDateValue(focusedDate);
    const targetMonth = new Date(visibleMonth.year, visibleMonth.month + offset, 1);
    const targetDay = Math.min(
      current.getDate(),
      new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate(),
    );
    const nextValue = clampDate(
      toDateValue(new Date(targetMonth.getFullYear(), targetMonth.getMonth(), targetDay)),
      min,
      max,
    );
    const nextDate = fromDateValue(nextValue);
    setFocusedDate(nextValue);
    setVisibleMonth({ year: nextDate.getFullYear(), month: nextDate.getMonth() });
  };

  const handleDayKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const movements: Partial<Record<string, number>> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const movement = movements[event.key];
    if (movement !== undefined) {
      event.preventDefault();
      moveFocus(movement);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const day = fromDateValue(focusedDate).getDay();
      moveFocus(event.key === "Home" ? -day : 6 - day);
      return;
    }
    if (event.key === "PageUp" || event.key === "PageDown") {
      event.preventDefault();
      moveMonth(event.key === "PageUp" ? -1 : 1);
    }
  };

  const previousMonthLastDay = toDateValue(new Date(visibleMonth.year, visibleMonth.month, 0));
  const nextMonthFirstDay = toDateValue(new Date(visibleMonth.year, visibleMonth.month + 1, 1));
  const days = monthDays(visibleMonth.year, visibleMonth.month);
  const weeks = Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7));

  return (
    <div
      ref={rootRef}
      className={`meeting-history__date meeting-history__date--${align}`}
    >
      <span id={labelId} className="meeting-history__date-label">{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className="meeting-history__date-trigger"
        aria-labelledby={`${labelId} ${labelId}-value`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        onClick={openCalendar}
      >
        <span id={`${labelId}-value`} className={value ? undefined : "meeting-history__date-placeholder"}>
          {value ? selectedDateFormatter.format(fromDateValue(value)) : "วัน/เดือน/ปี"}
        </span>
        <CalendarDays aria-hidden="true" className="icon-16" strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div
          id={dialogId}
          ref={calendarRef}
          role="dialog"
          aria-label={`เลือกวันที่${label}`}
          className="meeting-history__calendar"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeCalendar(true);
            }
          }}
        >
          <div className="meeting-history__calendar-header">
            <button
              type="button"
              className="meeting-history__calendar-nav focus-ring"
              aria-label="เดือนก่อนหน้า"
              disabled={Boolean(min && previousMonthLastDay < min)}
              onClick={() => moveMonth(-1)}
            >
              <ChevronLeft aria-hidden="true" className="icon-18" />
            </button>
            <strong aria-live="polite">
              {monthFormatter.format(new Date(visibleMonth.year, visibleMonth.month, 1))}
            </strong>
            <button
              type="button"
              className="meeting-history__calendar-nav focus-ring"
              aria-label="เดือนถัดไป"
              disabled={Boolean(max && nextMonthFirstDay > max)}
              onClick={() => moveMonth(1)}
            >
              <ChevronRight aria-hidden="true" className="icon-18" />
            </button>
          </div>

          <div role="grid" aria-label={`ปฏิทิน${label}`} className="meeting-history__calendar-grid">
            <div role="row" className="meeting-history__calendar-weekdays">
              {WEEKDAYS.map((weekday) => (
                <span key={weekday} role="columnheader">{weekday}</span>
              ))}
            </div>
            {weeks.map((week) => (
              <div key={toDateValue(week[0])} role="row" className="meeting-history__calendar-days">
                {week.map((date) => {
                  const dateValue = toDateValue(date);
                  const isSelected = dateValue === value;
                  const isToday = dateValue === today;
                  const isOutsideMonth = date.getMonth() !== visibleMonth.month;
                  const disabled = !isAllowed(dateValue, min, max);
                  const className = [
                    "meeting-history__calendar-day",
                    isSelected ? "meeting-history__calendar-day--selected" : "",
                    isToday ? "meeting-history__calendar-day--today" : "",
                    isOutsideMonth ? "meeting-history__calendar-day--outside" : "",
                  ].filter(Boolean).join(" ");

                  return (
                    <span key={dateValue} role="gridcell" aria-selected={isSelected}>
                      <button
                        type="button"
                        data-date={dateValue}
                        className={className}
                        aria-label={accessibleDateFormatter.format(date)}
                        aria-current={isToday ? "date" : undefined}
                        disabled={disabled}
                        tabIndex={dateValue === focusedDate ? 0 : -1}
                        onClick={() => chooseDate(dateValue)}
                        onKeyDown={handleDayKeyDown}
                      >
                        {date.getDate()}
                      </button>
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="meeting-history__calendar-actions">
            <button
              type="button"
              className="meeting-history__calendar-action focus-ring"
              disabled={!value}
              onClick={() => {
                onChange("");
                closeCalendar(true);
              }}
            >
              ล้าง
            </button>
            <button
              type="button"
              className="meeting-history__calendar-action meeting-history__calendar-action--today focus-ring"
              disabled={!isAllowed(today, min, max)}
              onClick={() => chooseDate(today)}
            >
              วันนี้
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
