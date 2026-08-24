"use client";

import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Hourglass,
  Laptop,
  MapPin,
  Sparkles,
  UserRound,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { profiles } from "../data";
import type {
  YunoSession,
  YunoSessionStatus,
} from "../lib/sessions-store";
import { useI18n } from "../i18n/I18nProvider";
import { SessionDetailModal } from "./SessionDetailModal";

type SessionsViewProps = {
  sessions: YunoSession[];
  onAcceptRequest: (sessionId: string) => void;
  onDeclineRequest: (sessionId: string) => void;
  onWithdrawRequest: (sessionId: string) => void;
  onCancelSession: (sessionId: string) => void;
  onRescheduleSession: (sessionId: string) => void;
};

const tabs: YunoSessionStatus[] = [
  "upcoming",
  "pending",
  "completed",
  "cancelled",
];

function statusIcon(status: YunoSessionStatus) {
  switch (status) {
    case "upcoming":
      return <CalendarDays size={16} />;
    case "pending":
      return <Hourglass size={16} />;
    case "completed":
      return <CheckCircle2 size={16} />;
    case "cancelled":
      return <XCircle size={16} />;
  }
}

export function SessionsView({
  sessions,
  onAcceptRequest,
  onDeclineRequest,
  onWithdrawRequest,
  onCancelSession,
  onRescheduleSession,
}: SessionsViewProps) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] =
    useState<YunoSessionStatus>("upcoming");
  const [selectedSessionId, setSelectedSessionId] =
    useState<string | null>(null);
  const [withdrawConfirmId, setWithdrawConfirmId] =
    useState<string | null>(null);

  const filteredSessions = useMemo(
    () =>
      sessions.filter(
        (session) => session.status === activeTab,
      ),
    [activeTab, sessions],
  );

  function countFor(status: YunoSessionStatus) {
    return sessions.filter(
      (session) => session.status === status,
    ).length;
  }

  function formatDate(date: string) {
    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  }

  return (
    <section className="sessions-view">
      <header className="sessions-view__header">
        <div>
          <span className="app-kicker">
            {t("sessionsView.kicker")}
          </span>

          <h1>{t("sessionsView.title")}</h1>

          <p>{t("sessionsView.copy")}</p>
        </div>

        <div className="sessions-view__summary">
          <CalendarDays size={16} />
          <strong>
            {countFor("upcoming") + countFor("pending")}
          </strong>
          <span>{t("sessionsView.next")}</span>
        </div>
      </header>

      <div
        className="sessions-tabs"
        role="tablist"
        aria-label={t("sessionsView.tabsLabel")}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? "is-active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {statusIcon(tab)}

            <span>
              {t(`sessionsView.tabs.${tab}`)}
            </span>

            <em>{countFor(tab)}</em>
          </button>
        ))}
      </div>

      {filteredSessions.length === 0 ? (
        <div className="sessions-empty">
          <span className="sessions-empty__icon">
            <CalendarDays size={27} />
          </span>

          <span className="app-kicker">
            {t(`sessionsView.empty.${activeTab}.kicker`)}
          </span>

          <h2>
            {t(`sessionsView.empty.${activeTab}.title`)}
          </h2>

          <p>
            {t(`sessionsView.empty.${activeTab}.copy`)}
          </p>
        </div>
      ) : (
        <div className="sessions-list">
          {filteredSessions.map((session) => {
            const profile = profiles.find(
              (item) => item.id === session.profileId,
            );

            if (!profile) return null;

            return (
              <article
                className={`session-card session-card--${session.status} session-card--${session.role}`}
                key={session.id}
              >
                <div className="session-card__top">
                  <div className="session-card__person">
                    <Image
                      src={profile.image}
                      alt={profile.name}
                      width={58}
                      height={58}
                    />

                    <div>
                      <span>
                        {session.role === "learner"
                          ? t("sessionsView.role.learning")
                          : t("sessionsView.role.teaching")}
                      </span>

                      <h2>{profile.name}</h2>
                    </div>
                  </div>

                  <span
                    className={`session-card__status session-card__status--${session.status}`}
                  >
                    {statusIcon(session.status)}
                    {t(
                      `sessionsView.status.${session.status}`,
                    )}
                  </span>
                </div>

                <div className="session-card__skill">
                  {session.role === "learner" ? (
                    <GraduationCap size={19} />
                  ) : (
                    <UserRound size={19} />
                  )}

                  <div>
                    <span>
                      {session.role === "learner"
                        ? t("sessionsView.skill.learn")
                        : t("sessionsView.skill.teach")}
                    </span>

                    <strong>
                      {t(`skills.${session.skill}`)}
                    </strong>
                  </div>
                </div>

                <div className="session-card__details">
                  <span>
                    <CalendarDays size={15} />
                    {formatDate(session.date)}
                  </span>

                  <span>
                    <Clock3 size={15} />
                    {session.time} · {session.durationMinutes} min
                  </span>

                  <span>
                    {session.mode === "online" ? (
                      <Laptop size={15} />
                    ) : (
                      <MapPin size={15} />
                    )}

                    {t(
                      `sessionsView.mode.${session.mode}`,
                    )}
                  </span>
                </div>

                <div className="session-card__footer">
                  <div>
                    <Sparkles size={15} />
                    <strong>{session.skillHours} SH</strong>

                    <span>
                      {session.role === "learner"
                        ? t("sessionsView.hours.learner")
                        : t("sessionsView.hours.teacher")}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedSessionId(session.id)}
                  >
                    {t("sessionsView.details")}
                  </button>
                </div>

                {session.status === "pending" && (
                  <div className="session-request">
                    {session.requestDirection === "incoming" ? (
                      <>
                        <div className="session-request__copy">
                          <strong>
                            {t("sessionsView.request.incomingTitle", {
                              name: profile.name,
                            })}
                          </strong>

                          <span>
                            {t("sessionsView.request.incomingCopy")}
                          </span>
                        </div>

                        <div className="session-request__actions">
                          <button
                            type="button"
                            className="session-request__decline"
                            onClick={() =>
                              onDeclineRequest(session.id)
                            }
                          >
                            {t("sessionsView.request.decline")}
                          </button>

                          <button
                            type="button"
                            className="session-request__accept"
                            onClick={() =>
                              onAcceptRequest(session.id)
                            }
                          >
                            {t("sessionsView.request.accept")}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="session-request__waiting-wrap">
                        <div className="session-request__waiting">
                          <Hourglass size={16} />

                          <div>
                            <strong>
                              {t("sessionsView.request.outgoingTitle")}
                            </strong>

                            <span>
                              {t("sessionsView.request.outgoingCopy", {
                                name: profile.name,
                              })}
                            </span>
                          </div>
                        </div>

                        {withdrawConfirmId === session.id ? (
                          <div className="session-request__withdraw-confirm">
                            <strong>
                              {t("sessionsView.request.withdrawConfirm.title")}
                            </strong>

                            <span>
                              {t("sessionsView.request.withdrawConfirm.copy")}
                            </span>

                            <div>
                              <button
                                type="button"
                                onClick={() =>
                                  setWithdrawConfirmId(null)
                                }
                              >
                                {t("sessionsView.request.withdrawConfirm.keep")}
                              </button>

                              <button
                                type="button"
                                className="session-request__withdraw-final"
                                onClick={() => {
                                  onWithdrawRequest(session.id);
                                  setWithdrawConfirmId(null);
                                }}
                              >
                                {t("sessionsView.request.withdrawConfirm.confirm")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="session-request__withdraw"
                            onClick={() =>
                              setWithdrawConfirmId(session.id)
                            }
                          >
                            {t("sessionsView.request.withdraw")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
      {selectedSessionId && (() => {
        const session = sessions.find(
          (item) => item.id === selectedSessionId,
        );

        if (!session) return null;

        const profile = profiles.find(
          (item) => item.id === session.profileId,
        );

        if (!profile) return null;

        return (
          <SessionDetailModal
            session={session}
            profile={profile}
            onClose={() => setSelectedSessionId(null)}
            onCancel={() => {
              onCancelSession(session.id);
              setSelectedSessionId(null);
            }}
            onReschedule={() => {
              onRescheduleSession(session.id);
              setSelectedSessionId(null);
            }}
          />
        );
      })()}
    </section>
  );
}
