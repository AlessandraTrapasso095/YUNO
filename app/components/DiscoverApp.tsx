"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  matchAvatarLeft,
  matchAvatarRight,
  matchHeart,
  matchParticleTransition,
  motionDuration,
} from "../lib/motion";
import {
  Bell,
  Clock3,
  Heart,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import {
  currentUserProfile,
  profiles,
  type CurrentUserProfile,
  type ProfileSkillId,
} from "../data";
import { type AppNavId } from "../lib/app-navigation";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AppContextPanel } from "./AppContextPanel";
import { AppShell } from "./AppShell";
import { ProfileCard } from "./ProfileCard";
import { playYunoSound } from "../lib/sound";
import { useMessagesStore } from "../lib/messages-store";
import { MatchesView } from "./MatchesView";
import { ConversationView } from "./ConversationView";
import { MessagesView } from "./MessagesView";
import { ProfileView } from "./ProfileView";
import { SkillHoursView } from "./SkillHoursView";
import { SessionsView } from "./SessionsView";
import { BookingModal } from "./BookingModal";
import { useSessionsStore } from "../lib/sessions-store";
import { DiscoverTutorial } from "./DiscoverTutorial";
import {
  DiscoverFiltersModal,
  emptyDiscoverFilters,
  type DiscoverFilters,
} from "./DiscoverFiltersModal";
import { Button, Input, Modal, Toast, Tooltip } from "./ui";

import {
  PROFILE_STORAGE_EVENT,
  PROFILE_STORAGE_KEY,
  writeCurrentUserProfile,
} from "../lib/profile-storage";
const discoveryFilters = [
  { id: "forYou", labelKey: "discover.filters.forYou" },
  { id: "nearby", labelKey: "discover.filters.nearby" },
  {
    id: "spanish",
    labelKey: "discover.filters.spanish",
    skillIds: ["spanish"],
  },
  {
    id: "design",
    labelKey: "discover.filters.design",
    skillIds: ["graphicDesign", "brandDesign", "webDesign"],
  },
  {
    id: "photography",
    labelKey: "discover.filters.photography",
    skillIds: ["photography"],
  },
] as const;

type Notice = { key: string; parameters?: Record<string, string | number> };

function MatchCelebration({
  name,
  image,
  yourImage,
  onMessage,
  onKeepDiscovering,
}: {
  name: string;
  image: string;
  yourImage: string;
  onMessage: () => void;
  onKeepDiscovering: () => void;
}) {
  const reduceMotion = useReducedMotion();

  const { t } = useI18n();
  return (
    <Modal
      ariaLabel={t("discover.match.dialogLabel", { name })}
      className="match-modal"
      reduceMotion={Boolean(reduceMotion)}
    >
        <button className="match-modal__close" type="button" onClick={onKeepDiscovering} aria-label={t("common.close")}><X /></button>
        {!reduceMotion && Array.from({ length: 10 }).map((_, index) => (
          <motion.span
            className="celebration-particle"
            key={index}
            style={{
              "--particle-color": index % 2 ? "#F044B7" : "#168BFF",
              "--particle-x": `${(index - 4.5) * 24}px`,
            } as React.CSSProperties}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{
              opacity: 0,
              x: (index - 4.5) * 24,
              y: -110 - (index % 3) * 20,
              scale: 1,
            }}
            transition={matchParticleTransition(index)}
          />
        ))}
        <div className="match-modal__avatars">
          <motion.div
            variants={reduceMotion ? undefined : matchAvatarLeft}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
          >
            <Image
              src={yourImage}
              alt={t("discover.match.yourProfile")}
              width={168}
              height={168}
              unoptimized={yourImage.startsWith("data:")}
            />
          </motion.div>

          <motion.span
            variants={reduceMotion ? undefined : matchHeart}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
          >
            <Heart fill="currentColor" />
          </motion.span>

          <motion.div
            variants={reduceMotion ? undefined : matchAvatarRight}
            initial={reduceMotion ? false : "hidden"}
            animate={reduceMotion ? undefined : "visible"}
          >
            <Image
              src={image}
              alt={name}
              width={168}
              height={168}
            />
          </motion.div>
        </div>
        <span className="match-modal__eyebrow"><Sparkles size={14} /> {t("common.brandMatch")}</span>
        <h2>{t("discover.match.title", { name })}</h2>
        <p>{t("discover.match.copy")}</p>
        <Button onClick={onMessage}>{t("discover.match.message")}</Button>
        <button
          className="match-modal__keep"
          type="button"
          onClick={onKeepDiscovering}
        >
          {t("discover.match.keepDiscovering")}
        </button>
    </Modal>
  );
}

const TUTORIAL_STORAGE_KEY = "yuno_discover_tutorial_seen";
const TUTORIAL_STORAGE_EVENT = "yuno-tutorial-storage-change";

function subscribeToProfileStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(PROFILE_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PROFILE_STORAGE_EVENT, callback);
  };
}

function getProfileStorageSnapshot() {
  return window.localStorage.getItem(PROFILE_STORAGE_KEY) ?? "";
}

function getProfileServerSnapshot() {
  return "";
}

function subscribeToTutorialStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(TUTORIAL_STORAGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(TUTORIAL_STORAGE_EVENT, callback);
  };
}

function getTutorialStorageSnapshot() {
  return window.localStorage.getItem(TUTORIAL_STORAGE_KEY) ?? "";
}

function getTutorialServerSnapshot() {
  return "true";
}

export function DiscoverApp() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const messageStore = useMessagesStore();
  const sessionsStore = useSessionsStore();
  const [activeNav, setActiveNav] = useState<AppNavId>("discover");
  const [bookingProfileId, setBookingProfileId] =
    useState<number | null>(null);
  const [rescheduleSessionId, setRescheduleSessionId] =
    useState<string | null>(null);
  const storedProfile = useSyncExternalStore(
    subscribeToProfileStorage,
    getProfileStorageSnapshot,
    getProfileServerSnapshot,
  );

  const userProfile = useMemo<CurrentUserProfile>(() => {
    if (!storedProfile) return currentUserProfile;

    try {
      return {
        ...currentUserProfile,
        ...JSON.parse(storedProfile),
      } as CurrentUserProfile;
    } catch {
      return currentUserProfile;
    }
  }, [storedProfile]);

  function setUserProfile(nextProfile: CurrentUserProfile) {
    try {
      writeCurrentUserProfile(nextProfile);
    } catch {
      // Backend persistence will replace this temporary storage later.
    }
  }

  const tutorialSeen = useSyncExternalStore(
    subscribeToTutorialStorage,
    getTutorialStorageSnapshot,
    getTutorialServerSnapshot,
  );

  const tutorialOpen = tutorialSeen !== "true";

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("forYou");
  const [appliedFilters, setAppliedFilters] =
    useState<DiscoverFilters>(emptyDiscoverFilters);
  const [draftFilters, setDraftFilters] =
    useState<DiscoverFilters>(emptyDiscoverFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [profileIndex, setProfileIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<number[]>([]);
  const [messageProfileId, setMessageProfileId] = useState<number | null>(null);
  const [matchOpen, setMatchOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [exitDirection, setExitDirection] = useState<-1 | 1>(-1);

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();

    return profiles.filter((profile) => {
      const matchesQuery =
        !normalized ||
        [
          ...profile.teaches.map((skill) => t(`skills.${skill}`)),
          ...profile.learns.map((skill) => t(`skills.${skill}`)),
          t(`profiles.${profile.key}.city`),
          t(`profiles.${profile.key}.country`),
          profile.name,
        ].some((value) =>
          value.toLocaleLowerCase().includes(normalized),
        );

      if (!matchesQuery) return false;

      const selectedFilter = discoveryFilters.find(
        (filter) => filter.id === activeFilter,
      );

      if (
        selectedFilter &&
        "skillIds" in selectedFilter &&
        !selectedFilter.skillIds.some((skill) =>
          profile.teaches.includes(skill),
        )
      ) {
        return false;
      }

      if (
        activeFilter === "nearby" &&
        profile.distanceKm > 10
      ) {
        return false;
      }

      if (
        appliedFilters.nearby &&
        profile.distanceKm > 10
      ) {
        return false;
      }

      if (
        appliedFilters.modes.length &&
        !appliedFilters.modes.some((mode) =>
          profile.modes.includes(mode),
        )
      ) {
        return false;
      }

      if (
        appliedFilters.languages.length &&
        !appliedFilters.languages.some((language) =>
          profile.languages.includes(language),
        )
      ) {
        return false;
      }

      if (
        appliedFilters.availability.length &&
        !appliedFilters.availability.some((availability) =>
          profile.availability.includes(availability),
        )
      ) {
        return false;
      }

      return true;
    });
  }, [activeFilter, appliedFilters, query, t]);

  const activeAdvancedFilterCount =
    appliedFilters.modes.length +
    appliedFilters.languages.length +
    appliedFilters.availability.length +
    (appliedFilters.nearby ? 1 : 0);

  const currentProfile = filteredProfiles.length
    ? filteredProfiles[profileIndex % filteredProfiles.length]
    : null;

  const matchedProfiles = profiles.filter((profile) =>
    matchedIds.includes(profile.id),
  );

  const messageProfile =
    profiles.find((profile) => profile.id === messageProfileId) ?? null;

  const bookingProfile =
    profiles.find((profile) => profile.id === bookingProfileId) ?? null;

  const rescheduleSession =
    sessionsStore.sessions.find(
      (session) => session.id === rescheduleSessionId,
    ) ?? null;

  const rescheduleProfile =
    rescheduleSession
      ? profiles.find(
          (profile) =>
            profile.id === rescheduleSession.profileId,
        ) ?? null
      : null;

  const heldSkillHours = sessionsStore.sessions
    .filter(
      (session) =>
        session.role === "learner" &&
        (session.status === "pending" ||
          session.status === "upcoming"),
    )
    .reduce(
      (total, session) => total + session.skillHours,
      0,
    );

  const forfeitedSkillHours = sessionsStore.sessions
    .filter(
      (session) =>
        session.role === "learner" &&
        session.status === "cancelled" &&
        session.cancellationOutcome === "forfeited",
    )
    .reduce(
      (total, session) => total + session.skillHours,
      0,
    );

  const availableSkillHours = Math.max(
    0,
    userProfile.skillHours -
      heldSkillHours -
      forfeitedSkillHours,
  );

  const nextUpcomingSession =
    [...sessionsStore.sessions]
      .filter(
        (session) =>
          session.status === "upcoming",
      )
      .sort((a, b) => {
        const first = `${a.date}T${a.time}`;
        const second = `${b.date}T${b.time}`;

        return first.localeCompare(second);
      })[0] ?? null;

  const nextSessionContext =
    nextUpcomingSession
      ? (() => {
          const profile = profiles.find(
            (item) =>
              item.id ===
              nextUpcomingSession.profileId,
          );

          if (!profile) return null;

          return {
            profile,
            skill: nextUpcomingSession.skill,
            date: nextUpcomingSession.date,
            time: nextUpcomingSession.time,
          };
        })()
      : null;


  const nearbyPopularSkills = Object.entries(
    profiles
      .filter((profile) => profile.distanceKm <= 10)
      .flatMap((profile) => [
        ...profile.teaches,
        ...profile.learns,
      ])
      .reduce<Record<string, number>>(
        (counts, skill) => ({
          ...counts,
          [skill]: (counts[skill] ?? 0) + 1,
        }),
        {},
      ),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill, count]) => ({
      skill: skill as ProfileSkillId,
      count,
    }));



  function completeTutorial() {
    try {
      window.localStorage.setItem(
        TUTORIAL_STORAGE_KEY,
        "true",
      );
      window.dispatchEvent(new Event(TUTORIAL_STORAGE_EVENT));
    } catch {
      // Backend persistence will replace this temporary storage later.
    }
  }

  function moveNext(nextNotice?: Notice, direction: -1 | 1 = -1) {
    setExitDirection(direction);

    if (nextNotice) {
      setNotice(nextNotice);
      window.setTimeout(() => setNotice(null), 1800);
    }

    if (!filteredProfiles.length) return;

    setProfileIndex((index) => (index + 1) % filteredProfiles.length);
  }

  function registerCurrentMatch() {
    if (!currentProfile) return;

    setMatchedIds((ids) =>
      ids.includes(currentProfile.id)
        ? ids
        : [...ids, currentProfile.id],
    );

    messageStore.ensureConversation(currentProfile.id);
  }

  function toggleSave() {
    if (!currentProfile) return;

    const alreadySaved = savedIds.includes(currentProfile.id);
    setSavedIds((ids) => alreadySaved ? ids.filter((id) => id !== currentProfile.id) : [...ids, currentProfile.id]);
    setNotice(alreadySaved
      ? { key: "discover.notices.removed" }
      : { key: "discover.notices.saved", parameters: { name: currentProfile.name } });
    window.setTimeout(() => setNotice(null), 1800);
  }

  return (
    <>
      <AppShell
      activeNav={activeNav}
      onNavigate={setActiveNav}
      matchCount={matchedProfiles.length}
      unreadMessageCount={messageStore.unreadCount}
      userProfile={userProfile}
      context={
        activeNav === "discover" ? (
          <AppContextPanel
            skillHours={availableSkillHours}
            nextSession={nextSessionContext}
            popularNearby={nearbyPopularSkills}
            onNavigate={setActiveNav}
            onDiscover={() => {
              setActiveNav("discover");

              window.requestAnimationFrame(() => {
                const search =
                  document.querySelector<HTMLInputElement>(
                    ".discover-search-row input",
                  );

                search?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });

                window.setTimeout(() => {
                  search?.focus();
                }, 350);
              });
            }}
          />
        ) : undefined
      }
      overlays={
        <>
          <AnimatePresence>
            {filtersOpen && (
              <DiscoverFiltersModal
                value={draftFilters}
                reduceMotion={Boolean(reduceMotion)}
                onChange={setDraftFilters}
                onClose={() => {
                  setDraftFilters(appliedFilters);
                  setFiltersOpen(false);
                }}
                onReset={() =>
                  setDraftFilters(emptyDiscoverFilters)
                }
                onApply={() => {
                  setAppliedFilters(draftFilters);
                  setProfileIndex(0);
                  setFiltersOpen(false);
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {matchOpen && currentProfile && (
              <MatchCelebration
                name={currentProfile.name}
                image={currentProfile.image}
                yourImage={userProfile.image}
                onMessage={() => {
                  setMessageProfileId(currentProfile.id);
                  setMatchOpen(false);
                  setActiveNav("messages");
                }}
                onKeepDiscovering={() => {
                  setMatchOpen(false);
                  moveNext(
                    {
                      key: "discover.notices.connected",
                      parameters: { name: currentProfile.name },
                    },
                    1,
                  );
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {notice && (
              <Toast>{t(notice.key, notice.parameters)}</Toast>
            )}
          </AnimatePresence>
        </>
      }
    >
      {activeNav === "matches" ? (
        <MatchesView
          matches={matchedProfiles}
          onDiscover={() => setActiveNav("discover")}
          onMessage={(profile) => {
            messageStore.ensureConversation(profile.id);
            messageStore.markConversationRead(profile.id);
            setMessageProfileId(profile.id);
            setActiveNav("messages");
          }}
          onBookSession={(profile) => {
            setBookingProfileId(profile.id);
          }}
          onRemove={(profileId) => {
            setMatchedIds((ids) =>
              ids.filter((id) => id !== profileId),
            );
          }}
        />
      ) : activeNav === "messages" && messageProfile ? (
        <ConversationView
          profile={messageProfile}
          messages={messageStore.getConversationMessages(
            messageProfile.id,
          )}
          onBack={() => setMessageProfileId(null)}
          onSend={(text) =>
            messageStore.sendMessage(
              messageProfile.id,
              text,
            )
          }
          onReceive={(text) =>
            messageStore.receiveMessage(
              messageProfile.id,
              text,
              false,
            )
          }
          onMarkRead={() =>
            messageStore.markConversationRead(
              messageProfile.id,
            )
          }
          onMarkMessageRead={
            messageStore.markMessageRead
          }
          onBookSession={(profile) => {
            setBookingProfileId(profile.id);
          }}
        />
      ) : activeNav === "messages" ? (
        <MessagesView
          profiles={profiles}
          conversations={messageStore.conversations}
          messages={messageStore.messages}
          onOpenConversation={(profile) => {
            messageStore.markConversationRead(profile.id);
            setMessageProfileId(profile.id);
          }}
          onDiscover={() => setActiveNav("discover")}
        />
      ) : activeNav === "profile" ? (
        <ProfileView
          profile={userProfile}
          onProfileChange={setUserProfile}
        />
      ) : activeNav === "skillHours" ? (
        <SkillHoursView
          profile={userProfile}
          sessions={sessionsStore.sessions}
          onTeach={() => setActiveNav("discover")}
        />
      ) : activeNav === "sessions" ? (
        <SessionsView
          sessions={sessionsStore.sessions}
          onAcceptRequest={(sessionId) =>
            sessionsStore.updateSessionStatus(
              sessionId,
              "upcoming",
            )
          }
          onDeclineRequest={(sessionId) =>
            sessionsStore.updateSessionStatus(
              sessionId,
              "cancelled",
            )
          }
          onWithdrawRequest={(sessionId) =>
            sessionsStore.updateSessionStatus(
              sessionId,
              "cancelled",
            )
          }
          onCancelSession={(sessionId) =>
            sessionsStore.cancelSession(sessionId)
          }
          onRescheduleSession={(sessionId) =>
            setRescheduleSessionId(sessionId)
          }
        />
      ) : (
        <>
        <div className="discovery-main__header">
          <div>
            <span className="app-kicker">{t("discover.header.kicker")}</span>
            <h1>{t("discover.header.title")}</h1>
            <p>{t("discover.header.question")}</p>
          </div>
          <div className="desktop-alerts">
            <LanguageSwitcher />
            <Tooltip content={t("navigation.notifications")}>
              <button type="button" aria-label={t("navigation.notifications")}>
                <Bell size={21} />
                <span />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="discover-search-row">
          <Input
            controlClassName="discover-search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setProfileIndex(0);
            }}
            placeholder={t("discover.search.placeholder")}
            aria-label={t("discover.search.label")}
            leadingIcon={<Search size={20} />}
            trailingAction={query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setProfileIndex(0);
                }}
                aria-label={t("discover.search.clear")}
              >
                <X size={17} />
              </button>
            ) : undefined}
          />
          <button
            className="filter-button"
            type="button"
            aria-expanded={filtersOpen}
            onClick={() => {
              setDraftFilters(appliedFilters);
              setFiltersOpen(true);
            }}
          >
            <SlidersHorizontal size={19} />
            <span>{t("discover.search.filters")}</span>
            {activeAdvancedFilterCount > 0 && (
              <em>{activeAdvancedFilterCount}</em>
            )}
          </button>
        </div>

        <div className="discover-filters" role="group" aria-label={t("discover.search.filtersLabel")}>
          {discoveryFilters.map((filter) => (
            <button className={activeFilter === filter.id ? "is-active" : ""} type="button" key={filter.id} onClick={() => { setActiveFilter(filter.id); setProfileIndex(0); }}>{t(filter.labelKey)}</button>
          ))}
        </div>

        <div className="mobile-swipe-hint"><span>{t("discover.swipe.hint")}</span><span><X size={13} /> {t("discover.swipe.skip")}</span><span><Heart size={13} fill="currentColor" /> {t("discover.swipe.connect")}</span></div>

        <div className="discovery-stage">
          {currentProfile ? (
            <>
              <div className="card-stack-layer card-stack-layer--back" />
              <div className="card-stack-layer card-stack-layer--middle" />

              <AnimatePresence mode="wait">
                <motion.div
                  className="discovery-stage__card"
                  key={currentProfile.id}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          x: exitDirection * 520,
                          rotate: exitDirection * 7,
                          scale: 0.96,
                        }
                  }
                  transition={{
                    duration: reduceMotion ? 0.01 : motionDuration.normal,
                  }}
                >
                  <ProfileCard
                    profile={currentProfile}
                    mode="discover"
                    draggable
                    saved={savedIds.includes(currentProfile.id)}
                    onSkip={() => {
                      void playYunoSound("skip");
                      moveNext(
                        { key: "discover.notices.skipped" },
                        -1,
                      );
                    }}
                    onSave={() => {
                      void playYunoSound("save");
                      toggleSave();
                    }}
                    onConnect={(source = "button") => {
                      void playYunoSound("connect");
                      registerCurrentMatch();

                      const celebrationDelay =
                        source === "swipe" ? 220 : 0;

                      window.setTimeout(() => {
                        setMatchOpen(true);

                        window.setTimeout(() => {
                          void playYunoSound("match");
                        }, 180);
                      }, celebrationDelay);
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {tutorialOpen && (
                <DiscoverTutorial onComplete={completeTutorial} />
              )}

              <div
                className="profile-progress"
                aria-label={t("discover.profileCount", {
                  current:
                    (profileIndex % filteredProfiles.length) + 1,
                  total: filteredProfiles.length,
                })}
              >
                {filteredProfiles.map((profile, index) => (
                  <span
                    className={
                      index === profileIndex % filteredProfiles.length
                        ? "is-active"
                        : ""
                    }
                    key={profile.id}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="discover-empty-state">
              <span className="discover-empty-state__icon">
                <Sparkles size={25} />
              </span>
              <strong>{t("discover.empty.title")}</strong>
              <p>{t("discover.empty.copy")}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveFilter("forYou");
                  setAppliedFilters(emptyDiscoverFilters);
                  setDraftFilters(emptyDiscoverFilters);
                  setProfileIndex(0);
                }}
              >
                {t("discover.empty.reset")}
              </button>
            </div>
          )}
        </div>

        {currentProfile && (
          <div className="mobile-card-context">
            <span>
              <Clock3 size={15} />{" "}
              {t(`profiles.${currentProfile.key}.availability`)}
            </span>
            <span>
              <Star size={15} fill="currentColor" />{" "}
              {t("discover.sessionCount")}
            </span>
          </div>
        )}
        </>
      )}
    </AppShell>

    {bookingProfile && (
      <BookingModal
        profile={bookingProfile}
        sessions={sessionsStore.sessions}
        availableSkillHours={availableSkillHours}
        onClose={() => setBookingProfileId(null)}
        onConfirm={(session) => {
          sessionsStore.addSession(session);
          setBookingProfileId(null);
          setActiveNav("sessions");
        }}
      />
    )}

    {rescheduleSession && rescheduleProfile && (
      <BookingModal
        profile={rescheduleProfile}
        sessions={sessionsStore.sessions}
        availableSkillHours={availableSkillHours}
        variant="reschedule"
        initialSession={rescheduleSession}
        onClose={() => setRescheduleSessionId(null)}
        onConfirm={(updated) => {
          sessionsStore.rescheduleSession(
            rescheduleSession.id,
            updated.date,
            updated.time,
          );
          setRescheduleSessionId(null);
        }}
      />
    )}
  </>
  );
}
