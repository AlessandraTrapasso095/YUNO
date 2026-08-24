"use client";

import Image from "next/image";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  Laptop,
  MapPin,
  Sparkles,
  X,
} from "lucide-react";
import {
  useMemo,
  useState,
} from "react";
import type {
  LearningMode,
  ProfileSkillId,
  WeekdayId,
  YunoProfile,
} from "../data";
import { useI18n } from "../i18n/I18nProvider";
import type {
  YunoSession,
} from "../lib/sessions-store";
import { Modal } from "./ui";

type BookingModalProps = {
  profile: YunoProfile;
  sessions: YunoSession[];
  availableSkillHours: number;
  variant?: "book" | "reschedule";
  initialSession?: YunoSession;
  onClose: () => void;
  onConfirm: (
    session: Omit<YunoSession, "id">,
  ) => void;
};

type CalendarDay = {
  date: Date;
  value: string;
  dayNumber: number;
  available: boolean;
  isPast: boolean;
  isToday: boolean;
};

const weekdayKeys = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

function dateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}

function weekdayForDate(date: Date): WeekdayId {
  const day = date.getDay();

  const map: Record<number, WeekdayId> = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday",
  };

  return map[day];
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}`;
}

function slotsForDate(
  profile: YunoProfile,
  date: Date,
) {
  const weekday = weekdayForDate(date);
  const ranges =
    profile.weeklyAvailability[weekday] ?? [];

  const slots: string[] = [];

  for (const range of ranges) {
    const start = timeToMinutes(range.start);
    const end = timeToMinutes(range.end);

    for (
      let current = start;
      current + 60 <= end;
      current += 60
    ) {
      slots.push(minutesToTime(current));
    }
  }

  return [...new Set(slots)].sort();
}

function blocksSlot(
  session: YunoSession,
) {
  return (
    session.status === "pending" ||
    session.status === "upcoming"
  );
}

export function BookingModal({
  profile,
  sessions,
  availableSkillHours,
  variant = "book",
  initialSession,
  onClose,
  onConfirm,
}: BookingModalProps) {
  const { t } = useI18n();

  const today = useMemo(
    () => startOfToday(),
    [],
  );

  const currentYear = today.getFullYear();

  const initialDate =
    initialSession?.date ?? "";

  const initialMonth =
    initialDate
      ? Number(initialDate.split("-")[1]) - 1
      : today.getMonth();

  const [visibleMonth, setVisibleMonth] =
    useState(initialMonth);

  const [skill, setSkill] =
    useState<ProfileSkillId>(
      initialSession?.skill ?? profile.teaches[0],
    );

  const [mode, setMode] =
    useState<LearningMode>(
      initialSession?.mode ?? profile.modes[0],
    );

  const [selectedDate, setSelectedDate] =
    useState(initialDate);

  const [selectedTime, setSelectedTime] =
    useState(initialSession?.time ?? "");

  const locale =
    typeof document !== "undefined" &&
    document.documentElement.lang === "it"
      ? "it-IT"
      : "en-US";

  const sessionsForProfile = useMemo(
    () =>
      sessions.filter(
        (session) =>
          session.profileId === profile.id &&
          session.id !== initialSession?.id &&
          blocksSlot(session),
      ),
    [initialSession?.id, profile.id, sessions],
  );

  function isSlotAvailable(
    date: string,
    time: string,
  ) {
    return !sessionsForProfile.some(
      (session) =>
        session.date === date &&
        session.time === time,
    );
  }

  function hasAvailableSlot(
    date: Date,
  ) {
    const value = dateValue(date);
    const slots = slotsForDate(profile, date);

    if (!slots.length) {
      return false;
    }

    return slots.some((slot) =>
      isSlotAvailable(value, slot),
    );
  }

  const calendarDays = (() => {
    const first =
      new Date(
        currentYear,
        visibleMonth,
        1,
      );

    const last =
      new Date(
        currentYear,
        visibleMonth + 1,
        0,
      );

    const days: CalendarDay[] = [];

    for (
      let day = 1;
      day <= last.getDate();
      day += 1
    ) {
      const date =
        new Date(
          currentYear,
          visibleMonth,
          day,
        );

      date.setHours(0, 0, 0, 0);

      const isPast =
        date.getTime() < today.getTime();

      const isToday =
        date.getTime() === today.getTime();

      days.push({
        date,
        value: dateValue(date),
        dayNumber: day,
        isPast,
        isToday,
        available:
          !isPast &&
          hasAvailableSlot(date),
      });
    }

    return {
      firstOffset:
        (first.getDay() + 6) % 7,
      days,
    };
  })();

  const selectedDay =
    calendarDays.days.find(
      (day) =>
        day.value === selectedDate,
    );

  const visibleSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    const [year, month, day] = selectedDate
      .split("-")
      .map(Number);

    const date = new Date(
      year,
      month - 1,
      day,
    );

    return slotsForDate(profile, date).map(
      (slot) => ({
        time: slot,
        available:
          !sessionsForProfile.some(
            (session) =>
              session.date === selectedDate &&
              session.time === slot,
          ),
      }),
    );
  }, [
    profile,
    selectedDate,
    sessionsForProfile,
  ]);

  const monthLabel =
    new Intl.DateTimeFormat(
      locale,
      {
        month: "long",
        year: "numeric",
      },
    ).format(
      new Date(
        currentYear,
        visibleMonth,
        1,
      ),
    );

  function selectCalendarDay(
    day: CalendarDay,
  ) {
    if (!day.available) return;

    setSelectedDate(day.value);
    setSelectedTime("");
  }

  function confirmBooking() {
    if (
      !skill ||
      !mode ||
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    onConfirm({
      profileId: profile.id,
      skill,
      role: "learner",
      requestDirection: "outgoing",
      status: "pending",
      mode,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: 60,
      skillHours: 1,
    });
  }

  return (
    <Modal
      ariaLabel={t("booking.aria")}
      className="booking-modal"
      overlayClassName="booking-modal__overlay"
    >
      <header className="booking-modal__header">
        <div>
          <span className="app-kicker">
            {t("booking.kicker")}
          </span>

          <h2>
            {variant === "reschedule"
              ? t("booking.reschedule.title")
              : t("booking.title")}
          </h2>

          <p>
            {variant === "reschedule"
              ? t("booking.reschedule.copy")
              : t("booking.copy")}
          </p>
        </div>

        <button
          type="button"
          className="booking-modal__close"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X size={19} />
        </button>
      </header>

      <div className="booking-person">
        <Image
          src={profile.image}
          alt={profile.name}
          width={58}
          height={58}
        />

        <div>
          <span>
            {t("booking.learningFrom")}
          </span>

          <strong>{profile.name}</strong>
        </div>

        <span className="booking-person__match">
          <Sparkles size={14} />
          {profile.match}%
        </span>
      </div>

      {variant === "book" && (
        <>
      <section className="booking-section">
        <div className="booking-section__heading">
          <span>1</span>

          <div>
            <strong>
              {t("booking.skill.title")}
            </strong>

            <small>
              {t("booking.skill.copy")}
            </small>
          </div>
        </div>

        <div className="booking-options">
          {profile.teaches.map((item) => (
            <button
              key={item}
              type="button"
              className={
                skill === item
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                setSkill(item)
              }
            >
              <GraduationCap size={16} />

              {t(`skills.${item}`)}

              {skill === item && (
                <Check size={14} />
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="booking-section">
        <div className="booking-section__heading">
          <span>2</span>

          <div>
            <strong>
              {t("booking.mode.title")}
            </strong>

            <small>
              {t("booking.mode.copy")}
            </small>
          </div>
        </div>

        <div className="booking-options booking-options--mode">
          {profile.modes.map((item) => (
            <button
              key={item}
              type="button"
              className={
                mode === item
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                setMode(item)
              }
            >
              {item === "online" ? (
                <Laptop size={17} />
              ) : (
                <MapPin size={17} />
              )}

              {item === "online"
                ? t(
                    "sessionsView.mode.online",
                  )
                : t(
                    "sessionsView.mode.inPerson",
                  )}

              {mode === item && (
                <Check size={14} />
              )}
            </button>
          ))}
        </div>
      </section>

        </>
      )}

      <section className="booking-section">
        <div className="booking-section__heading">
          <span>3</span>

          <div>
            <strong>
              {t("booking.date.title")}
            </strong>

            <small>
              {t("booking.date.copy")}
            </small>
          </div>
        </div>

        <div className="booking-calendar">
          <header className="booking-calendar__header">
            <button
              type="button"
              onClick={() => {
                setVisibleMonth(
                  (month) =>
                    Math.max(
                      0,
                      month - 1,
                    ),
                );
                setSelectedDate("");
                setSelectedTime("");
              }}
              disabled={visibleMonth === 0}
              aria-label={t(
                "booking.calendar.previous",
              )}
            >
              <ChevronLeft size={18} />
            </button>

            <strong>{monthLabel}</strong>

            <button
              type="button"
              onClick={() => {
                setVisibleMonth(
                  (month) =>
                    Math.min(
                      11,
                      month + 1,
                    ),
                );
                setSelectedDate("");
                setSelectedTime("");
              }}
              disabled={visibleMonth === 11}
              aria-label={t(
                "booking.calendar.next",
              )}
            >
              <ChevronRight size={18} />
            </button>
          </header>

          <div className="booking-calendar__weekdays">
            {weekdayKeys.map((weekday) => (
              <span key={weekday}>
                {t(
                  `booking.calendar.weekdays.${weekday}`,
                )}
              </span>
            ))}
          </div>

          <div className="booking-calendar__grid">
            {Array.from(
              {
                length:
                  calendarDays.firstOffset,
              },
              (_, index) => (
                <span
                  className="booking-calendar__blank"
                  key={`blank-${index}`}
                />
              ),
            )}

            {calendarDays.days.map(
              (day) => (
                <button
                  key={day.value}
                  type="button"
                  disabled={!day.available}
                  className={[
                    "booking-calendar__day",
                    day.available
                      ? "is-available"
                      : "is-unavailable",
                    selectedDate ===
                    day.value
                      ? "is-selected"
                      : "",
                    day.isToday
                      ? "is-today"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    selectCalendarDay(day)
                  }
                  aria-label={`${day.dayNumber} ${monthLabel}`}
                >
                  <span>
                    {day.dayNumber}
                  </span>

                  <small>
                    {day.available
                      ? t(
                          "booking.calendar.available",
                        )
                      : t(
                          "booking.calendar.unavailable",
                        )}
                  </small>
                </button>
              ),
            )}
          </div>

          <div className="booking-calendar__legend">
            <span>
              <i className="is-available" />
              {t(
                "booking.calendar.available",
              )}
            </span>

            <span>
              <i className="is-unavailable" />
              {t(
                "booking.calendar.unavailable",
              )}
            </span>
          </div>
        </div>
      </section>

      <section className="booking-section">
        <div className="booking-section__heading">
          <span>4</span>

          <div>
            <strong>
              {t("booking.time.title")}
            </strong>

            <small>
              {selectedDate
                ? t("booking.time.copy")
                : t(
                    "booking.time.chooseDate",
                  )}
            </small>
          </div>
        </div>

        {selectedDate ? (
          <div className="booking-slots">
            {visibleSlots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                className={[
                  slot.available
                    ? "is-available"
                    : "is-unavailable",
                  selectedTime ===
                  slot.time
                    ? "is-active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() =>
                  slot.available &&
                  setSelectedTime(
                    slot.time,
                  )
                }
              >
                <Clock3 size={15} />

                {slot.time}

                <small>
                  {slot.available
                    ? t(
                        "booking.calendar.available",
                      )
                    : t(
                        "booking.calendar.unavailable",
                      )}
                </small>
              </button>
            ))}
          </div>
        ) : (
          <div className="booking-slots-empty">
            <CalendarDays size={20} />
            <span>
              {t(
                "booking.time.chooseDate",
              )}
            </span>
          </div>
        )}
      </section>

      <section className="booking-summary">
        <div className="booking-summary__title">
          <span>
            <CalendarDays size={17} />
          </span>

          <div>
            <small>
              {t(
                "booking.summary.kicker",
              )}
            </small>

            <strong>
              {t(
                "booking.summary.title",
              )}
            </strong>
          </div>
        </div>

        <div className="booking-summary__grid">
          <div>
            <small>
              {t(
                "booking.summary.skill",
              )}
            </small>

            <strong>
              {t(`skills.${skill}`)}
            </strong>
          </div>

          <div>
            <small>
              {t(
                "booking.summary.when",
              )}
            </small>

            <strong>
              {selectedDay &&
              selectedTime
                ? `${selectedDay.dayNumber}/${String(
                    visibleMonth + 1,
                  ).padStart(
                    2,
                    "0",
                  )}/${currentYear} · ${selectedTime}`
                : "—"}
            </strong>
          </div>

          <div>
            <small>
              {t(
                "booking.summary.duration",
              )}
            </small>

            <strong>60 min</strong>
          </div>

          <div>
            <small>
              {t(
                "booking.summary.cost",
              )}
            </small>

            <strong>1 Skill Hour</strong>
          </div>
        </div>

        <p>
          <Sparkles size={15} />
          {t("booking.summary.held")}
        </p>
      </section>

      <footer className="booking-modal__actions">
        <button
          type="button"
          className="booking-modal__cancel"
          onClick={onClose}
        >
          {t("booking.cancel")}
        </button>

        <button
          type="button"
          className="booking-modal__confirm"
          onClick={confirmBooking}
          disabled={
            !selectedDate ||
            !selectedTime ||
            (variant === "book" &&
              availableSkillHours < 1)
          }
        >
          {variant === "reschedule"
            ? t("booking.reschedule.confirm")
            : t("booking.confirm")}
        </button>
      </footer>
    </Modal>
  );
}
