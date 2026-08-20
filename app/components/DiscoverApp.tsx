"use client";

import { useMemo, useState } from "react";
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
import { profiles } from "../data";
import { type AppNavId } from "../lib/app-navigation";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AppContextPanel } from "./AppContextPanel";
import { AppShell } from "./AppShell";
import { ProfileCard } from "./ProfileCard";
import { playYunoSound } from "../lib/sound";
import { MatchesView } from "./MatchesView";
import { ConversationView } from "./ConversationView";
import { DiscoverTutorial } from "./DiscoverTutorial";
import {
  DiscoverFiltersModal,
  emptyDiscoverFilters,
  type DiscoverFilters,
} from "./DiscoverFiltersModal";
import { Button, Input, Modal, Toast, Tooltip } from "./ui";

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
  onMessage,
  onKeepDiscovering,
}: {
  name: string;
  image: string;
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
              src="/people/anna.jpg"
              alt={t("discover.match.yourProfile")}
              width={168}
              height={168}
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

export function DiscoverApp() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [activeNav, setActiveNav] = useState<AppNavId>("discover");
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
  const [tutorialOpen, setTutorialOpen] = useState(() => {
    if (typeof window === "undefined") return false;

    return !window.localStorage.getItem(
      "yuno_discover_tutorial_seen",
    );
  });

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

  function completeTutorial() {
    window.localStorage.setItem(
      "yuno_discover_tutorial_seen",
      "true",
    );
    setTutorialOpen(false);
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
    <AppShell
      activeNav={activeNav}
      onNavigate={setActiveNav}
      matchCount={matchedProfiles.length}
      context={
        activeNav === "discover" ? <AppContextPanel /> : undefined
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
            setMessageProfileId(profile.id);
            setActiveNav("messages");
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
          onBack={() => setActiveNav("matches")}
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
  );
}
