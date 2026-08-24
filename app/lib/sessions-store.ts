"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { LearningMode, ProfileSkillId } from "../data";

const STORAGE_KEY = "yuno_sessions_store";
const STORAGE_EVENT = "yuno-sessions-store-change";

export type YunoSessionStatus =
  | "upcoming"
  | "pending"
  | "completed"
  | "cancelled";

export type YunoSessionRole = "learner" | "teacher";
export type YunoSessionRequestDirection =
  | "incoming"
  | "outgoing";

export type YunoSession = {
  id: string;
  profileId: number;
  skill: ProfileSkillId;
  role: YunoSessionRole;
  requestDirection: YunoSessionRequestDirection;
  status: YunoSessionStatus;
  mode: LearningMode;
  date: string;
  time: string;
  durationMinutes: number;
  skillHours: number;
  cancelledBy?: "learner" | "teacher";
  cancellationOutcome?: "returned" | "forfeited";
  cancelledAt?: number;
};

type SessionsStore = {
  sessions: YunoSession[];
};

const demoSessions: YunoSession[] = [
  {
    id: "session-marco-photography",
    profileId: 2,
    skill: "photography",
    role: "learner",
    requestDirection: "outgoing",
    status: "upcoming",
    mode: "online",
    date: "2026-08-28",
    time: "18:30",
    durationMinutes: 60,
    skillHours: 1,
  },
  {
    id: "session-sofia-spanish",
    profileId: 3,
    skill: "spanish",
    role: "learner",
    requestDirection: "outgoing",
    status: "pending",
    mode: "inPerson",
    date: "2026-08-30",
    time: "17:00",
    durationMinutes: 60,
    skillHours: 1,
  },
  {
    id: "session-sofia-italian-request",
    profileId: 3,
    skill: "italian",
    role: "teacher",
    requestDirection: "incoming",
    status: "pending",
    mode: "inPerson",
    date: "2026-08-31",
    time: "18:00",
    durationMinutes: 60,
    skillHours: 1,
  },
  {
    id: "session-sofia-italian",
    profileId: 3,
    skill: "italian",
    role: "teacher",
    requestDirection: "incoming",
    status: "completed",
    mode: "inPerson",
    date: "2026-08-16",
    time: "18:00",
    durationMinutes: 60,
    skillHours: 1,
  },
  {
    id: "session-giulia-photography",
    profileId: 1,
    skill: "photography",
    role: "learner",
    requestDirection: "outgoing",
    status: "cancelled",
    mode: "inPerson",
    date: "2026-08-19",
    time: "16:30",
    durationMinutes: 60,
    skillHours: 1,
  },
];

const demoSnapshot = JSON.stringify({
  sessions: demoSessions,
});

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) ?? demoSnapshot;
}

function getServerSnapshot() {
  return demoSnapshot;
}

function parseStore(snapshot: string): SessionsStore {
  try {
    const parsed = JSON.parse(snapshot) as Partial<SessionsStore>;

    const storedSessions = Array.isArray(parsed.sessions)
      ? parsed.sessions.map((session) => ({
          ...session,
          requestDirection:
            session.requestDirection ??
            (session.role === "teacher"
              ? "incoming"
              : "outgoing"),
        }))
      : [];

    const storedIds = new Set(
      storedSessions.map((session) => session.id),
    );

    const missingDemoSessions = demoSessions.filter(
      (session) => !storedIds.has(session.id),
    );

    return {
      sessions: [
        ...storedSessions,
        ...missingDemoSessions,
      ] as YunoSession[],
    };
  } catch {
    return {
      sessions: demoSessions,
    };
  }
}

function readStore(): SessionsStore {
  try {
    return parseStore(
      window.localStorage.getItem(STORAGE_KEY) ?? demoSnapshot,
    );
  } catch {
    return {
      sessions: demoSessions,
    };
  }
}

function saveStore(store: SessionsStore) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(store),
  );

  window.dispatchEvent(
    new Event(STORAGE_EVENT),
  );
}

function addSession(
  session: Omit<YunoSession, "id">,
) {
  const store = readStore();

  const created: YunoSession = {
    ...session,
    id: `session-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
  };

  saveStore({
    sessions: [
      created,
      ...store.sessions,
    ],
  });

  return created;
}

function sessionDateTime(session: YunoSession) {
  return new Date(
    `${session.date}T${session.time}:00`,
  ).getTime();
}

function cancelSession(sessionId: string) {
  const store = readStore();

  const session = store.sessions.find(
    (item) => item.id === sessionId,
  );

  if (!session || session.status !== "upcoming") {
    return null;
  }

  const cancelledAt = Date.now();
  const hoursBefore =
    (sessionDateTime(session) - cancelledAt) /
    (1000 * 60 * 60);

  const cancelledBy = session.role;

  const cancellationOutcome =
    cancelledBy === "teacher" || hoursBefore >= 12
      ? "returned"
      : "forfeited";

  const updated: YunoSession = {
    ...session,
    status: "cancelled",
    cancelledBy,
    cancellationOutcome,
    cancelledAt,
  };

  saveStore({
    sessions: store.sessions.map((item) =>
      item.id === sessionId ? updated : item,
    ),
  });

  return updated;
}

function rescheduleSession(
  sessionId: string,
  date: string,
  time: string,
) {
  const store = readStore();

  const session = store.sessions.find(
    (item) => item.id === sessionId,
  );

  if (!session || session.status !== "upcoming") {
    return null;
  }

  const updated: YunoSession = {
    ...session,
    date,
    time,
  };

  saveStore({
    sessions: store.sessions.map((item) =>
      item.id === sessionId ? updated : item,
    ),
  });

  return updated;
}

function updateSessionStatus(
  sessionId: string,
  status: YunoSessionStatus,
) {
  const store = readStore();

  saveStore({
    sessions: store.sessions.map((session) =>
      session.id === sessionId
        ? {
            ...session,
            status,
          }
        : session,
    ),
  });
}

export function useSessionsStore() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const store = useMemo(
    () => parseStore(snapshot),
    [snapshot],
  );

  return {
    sessions: store.sessions,
    addSession,
    updateSessionStatus,
    cancelSession,
    rescheduleSession,
  };
}
