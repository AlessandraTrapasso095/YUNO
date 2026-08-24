"use client";

import Image from "next/image";
import {
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Hourglass,
  Laptop,
  MapPin,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { YunoProfile } from "../data";
import type {
  YunoSession,
  YunoSessionStatus,
} from "../lib/sessions-store";
import { useI18n } from "../i18n/I18nProvider";
import { Modal } from "./ui";

type SessionDetailModalProps = {
  session: YunoSession;
  profile: YunoProfile;
  onClose: () => void;
  onCancel: () => void;
  onReschedule: () => void;
};

function statusIcon(status: YunoSessionStatus) {
  switch (status) {
    case "upcoming":
      return <CalendarDays size={15} />;
    case "pending":
      return <Hourglass size={15} />;
    case "completed":
      return <CheckCircle2 size={15} />;
    case "cancelled":
      return <XCircle size={15} />;
  }
}

export function SessionDetailModal({
  session,
  profile,
  onClose,
  onCancel,
  onReschedule,
}: SessionDetailModalProps) {
  const { t } = useI18n();
  const [cancelConfirmOpen, setCancelConfirmOpen] =
    useState(false);

  const [cancellationPreview, setCancellationPreview] =
    useState<
      "teacher" | "learnerRefund" | "learnerLose" | null
    >(null);

  function openCancellationConfirm() {
    if (session.role === "teacher") {
      setCancellationPreview("teacher");
      setCancelConfirmOpen(true);
      return;
    }

    const sessionDateTime = new Date(
      `${session.date}T${session.time}:00`,
    ).getTime();

    const hoursBefore =
      (sessionDateTime - Date.now()) /
      (1000 * 60 * 60);

    setCancellationPreview(
      hoursBefore >= 12
        ? "learnerRefund"
        : "learnerLose",
    );

    setCancelConfirmOpen(true);
  }

  function downloadCalendarEvent() {
    const [year, month, day] = session.date
      .split("-")
      .map(Number);

    const [hour, minute] = session.time
      .split(":")
      .map(Number);

    const start = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0,
    );

    const end = new Date(
      start.getTime() + session.durationMinutes * 60 * 1000,
    );

    function toIcsDate(date: Date) {
      return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}Z$/, "Z");
    }

    function escapeIcs(value: string) {
      return value
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
    }

    const skillName = t(`skills.${session.skill}`);

    const modeLabel =
      session.mode === "online"
        ? t("sessionsView.mode.online")
        : t("sessionsView.mode.inPerson");

    const title = `YUNO — ${skillName} · ${profile.name}`;

    const description = [
      `YUNO`,
      `${skillName}`,
      `${profile.name}`,
      `${t("sessionDetail.mode")}: ${modeLabel}`,
      `${t("sessionDetail.duration")}: ${session.durationMinutes} min`,
    ].join("\n");

    const uid =
      `yuno-${session.id}@yuno.app`;

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//YUNO//Sessions//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${toIcsDate(new Date())}`,
      `DTSTART:${toIcsDate(start)}`,
      `DTEND:${toIcsDate(end)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      `LOCATION:${escapeIcs(modeLabel)}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      `yuno-${session.date}-${session.time.replace(":", "-")}.ics`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  function formatDate(date: string) {
    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  }

  return (
    <Modal
      ariaLabel={t("sessionDetail.aria", {
        name: profile.name,
      })}
      className="session-detail-modal"
      overlayClassName="session-detail-modal__overlay"
    >
      <header className="session-detail-modal__header">
        <div>
          <span className="app-kicker">
            {t("sessionDetail.kicker")}
          </span>

          <h2>{t("sessionDetail.title")}</h2>

          <p>{t("sessionDetail.copy")}</p>
        </div>

        <button
          type="button"
          className="session-detail-modal__close"
          onClick={onClose}
          aria-label={t("common.close")}
        >
          <X size={19} />
        </button>
      </header>

      <div className="session-detail-person">
        <Image
          src={profile.image}
          alt={profile.name}
          width={62}
          height={62}
        />

        <div>
          <span>
            {session.role === "learner"
              ? t("sessionsView.role.learning")
              : t("sessionsView.role.teaching")}
          </span>

          <strong>{profile.name}</strong>
        </div>

        <span
          className={`session-detail-status session-detail-status--${session.status}`}
        >
          {statusIcon(session.status)}
          {t(`sessionsView.status.${session.status}`)}
        </span>
      </div>

      <section className="session-detail-skill">
        <span>
          {session.role === "learner" ? (
            <GraduationCap size={20} />
          ) : (
            <UserRound size={20} />
          )}
        </span>

        <div>
          <small>
            {session.role === "learner"
              ? t("sessionsView.skill.learn")
              : t("sessionsView.skill.teach")}
          </small>

          <strong>{t(`skills.${session.skill}`)}</strong>
        </div>
      </section>

      <div className="session-detail-grid">
        <section>
          <span>
            <CalendarDays size={18} />
          </span>
          <small>{t("sessionDetail.date")}</small>
          <strong>{formatDate(session.date)}</strong>
        </section>

        <section>
          <span>
            <Clock3 size={18} />
          </span>
          <small>{t("sessionDetail.time")}</small>
          <strong>{session.time}</strong>
        </section>

        <section>
          <span>
            <Clock3 size={18} />
          </span>
          <small>{t("sessionDetail.duration")}</small>
          <strong>{session.durationMinutes} min</strong>
        </section>

        <section>
          <span>
            {session.mode === "online" ? (
              <Laptop size={18} />
            ) : (
              <MapPin size={18} />
            )}
          </span>
          <small>{t("sessionDetail.mode")}</small>
          <strong>
            {t(`sessionsView.mode.${session.mode}`)}
          </strong>
        </section>
      </div>

      <section className="session-detail-hours">
        <span>
          <Sparkles size={19} />
        </span>

        <div>
          <small>{t("sessionDetail.skillHours")}</small>
          <strong>{session.skillHours} Skill Hour</strong>
          <p>
            {session.role === "learner"
              ? t("sessionDetail.hoursLearner")
              : t("sessionDetail.hoursTeacher")}
          </p>
        </div>
      </section>

      {(session.status === "upcoming" ||
        session.status === "pending") && (
        <section className="session-detail-policy">
          <strong>{t("sessionDetail.policy.title")}</strong>
          <p>{t("sessionDetail.policy.copy")}</p>

          <div>
            <span>
              <CheckCircle2 size={15} />
              {t("sessionDetail.policy.before")}
            </span>

            <span>
              <XCircle size={15} />
              {t("sessionDetail.policy.after")}
            </span>
          </div>
        </section>
      )}

      {session.status === "upcoming" && (
        <section className="session-calendar-action">
          <button
            type="button"
            onClick={downloadCalendarEvent}
          >
            <CalendarPlus size={16} />
            {t("sessionDetail.addToCalendar")}
          </button>
        </section>
      )}

      {session.status === "upcoming" && (
        <section className="session-cancel-zone">
          {!cancelConfirmOpen ? (
            <div className="session-upcoming-actions">
              <button
                type="button"
                className="session-reschedule-button"
                onClick={onReschedule}
              >
                {t("sessionDetail.reschedule")}
              </button>

              <button
                type="button"
                className="session-cancel-zone__open"
                onClick={openCancellationConfirm}
              >
                {t("sessionDetail.cancelSession")}
              </button>
            </div>
          ) : (
            <div className="session-cancel-confirm">
              <strong>
                {t("sessionDetail.cancelConfirm.title")}
              </strong>

              <p>
                {cancellationPreview === "teacher"
                  ? t(
                      "sessionDetail.cancelConfirm.teacher",
                    )
                  : cancellationPreview === "learnerRefund"
                    ? t(
                        "sessionDetail.cancelConfirm.learnerRefund",
                      )
                    : t(
                        "sessionDetail.cancelConfirm.learnerLose",
                      )}
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => setCancelConfirmOpen(false)}
                >
                  {t("sessionDetail.cancelConfirm.keep")}
                </button>

                <button
                  type="button"
                  className="session-cancel-confirm__confirm"
                  onClick={onCancel}
                >
                  {t("sessionDetail.cancelConfirm.confirm")}
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      <footer className="session-detail-modal__footer">
        <button type="button" onClick={onClose}>
          {t("sessionDetail.close")}
        </button>
      </footer>
    </Modal>
  );
}
