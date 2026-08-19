"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Bell,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  Heart,
  HelpCircle,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  WalletCards,
  X,
} from "lucide-react";
import { profiles } from "../data";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ProfileCard } from "./ProfileCard";
import { Button, SkillHourBadge, SkillTag } from "./ui";

const navItems = [
  { id: "discover", labelKey: "navigation.discover", icon: Compass },
  { id: "matches", labelKey: "navigation.matches", icon: Heart, badge: "3" },
  { id: "messages", labelKey: "navigation.messages", icon: MessageCircle, badge: "2" },
  { id: "sessions", labelKey: "navigation.sessions", icon: CalendarDays },
  { id: "skillHours", labelKey: "navigation.skillHours", icon: WalletCards },
  { id: "profile", labelKey: "navigation.profile", icon: UserRound },
];

const mobileItems = [
  { id: "discover", labelKey: "navigation.discover", icon: Compass },
  { id: "matches", labelKey: "navigation.matches", icon: Heart },
  { id: "sessions", labelKey: "navigation.sessions", icon: CalendarDays },
  { id: "messages", labelKey: "navigation.chat", icon: MessageCircle, badge: true },
  { id: "profile", labelKey: "navigation.profile", icon: UserRound },
];

const discoveryFilters = [
  { id: "forYou", labelKey: "discover.filters.forYou" },
  { id: "nearby", labelKey: "discover.filters.nearby" },
  { id: "spanish", labelKey: "discover.filters.spanish", skillId: "spanish" },
  { id: "design", labelKey: "discover.filters.design", skillId: "design" },
  { id: "photography", labelKey: "discover.filters.photography", skillId: "photography" },
] as const;

type Notice = { key: string; parameters?: Record<string, string | number> };

function MatchCelebration({ name, image, onClose }: { name: string; image: string; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  return (
    <motion.div className="match-overlay" role="dialog" aria-modal="true" aria-label={t("discover.match.dialogLabel", { name })} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="match-modal" initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
        <button className="match-modal__close" type="button" onClick={onClose} aria-label={t("common.close")}><X /></button>
        {!reduceMotion && Array.from({ length: 10 }).map((_, index) => (
          <motion.span
            className="celebration-particle"
            key={index}
            style={{ "--particle-color": index % 2 ? "#F044B7" : "#168BFF", "--particle-x": `${(index - 4.5) * 24}px` } as React.CSSProperties}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
            animate={{ opacity: 0, x: (index - 4.5) * 24, y: -120 - (index % 3) * 22, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.14 + index * 0.025 }}
          />
        ))}
        <div className="match-modal__avatars">
          <Image src="/people/anna.jpg" alt={t("discover.match.yourProfile")} width={168} height={168} />
          <span><Heart fill="currentColor" /></span>
          <Image src={image} alt={name} width={168} height={168} />
        </div>
        <span className="match-modal__eyebrow"><Sparkles size={14} /> {t("common.brandMatch")}</span>
        <h2>{t("discover.match.title", { name })}</h2>
        <p>{t("discover.match.copy")}</p>
        <Button onClick={onClose}>{t("discover.match.message")}</Button>
        <button className="match-modal__keep" type="button" onClick={onClose}>{t("discover.match.keepDiscovering")}</button>
      </motion.div>
    </motion.div>
  );
}

export function DiscoverApp() {
  const { t } = useI18n();
  const [activeNav, setActiveNav] = useState("discover");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("forYou");
  const [profileIndex, setProfileIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [matchOpen, setMatchOpen] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const byQuery = normalized
      ? profiles.filter((profile) => [
          ...profile.teaches.map((skill) => t(`skills.${skill}`)),
          ...profile.learns.map((skill) => t(`skills.${skill}`)),
          t(`profiles.${profile.key}.city`),
          t(`profiles.${profile.key}.country`),
          profile.name,
        ].some((value) => value.toLocaleLowerCase().includes(normalized)))
      : profiles;
    const selectedFilter = discoveryFilters.find((filter) => filter.id === activeFilter);
    if (!selectedFilter || !("skillId" in selectedFilter)) return byQuery;
    return byQuery.filter((profile) => [...profile.teaches, ...profile.learns].includes(selectedFilter.skillId));
  }, [activeFilter, query, t]);

  const safeProfiles = filteredProfiles.length ? filteredProfiles : profiles;
  const currentProfile = safeProfiles[profileIndex % safeProfiles.length];

  function moveNext(nextNotice?: Notice) {
    if (nextNotice) {
      setNotice(nextNotice);
      window.setTimeout(() => setNotice(null), 1800);
    }
    setProfileIndex((index) => (index + 1) % safeProfiles.length);
  }

  function toggleSave() {
    const alreadySaved = savedIds.includes(currentProfile.id);
    setSavedIds((ids) => alreadySaved ? ids.filter((id) => id !== currentProfile.id) : [...ids, currentProfile.id]);
    setNotice(alreadySaved
      ? { key: "discover.notices.removed" }
      : { key: "discover.notices.saved", parameters: { name: currentProfile.name } });
    window.setTimeout(() => setNotice(null), 1800);
  }

  return (
    <main className="discover-app">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand"><Logo /></div>
        <nav className="app-sidebar__nav" aria-label={t("navigation.appLabel")}>
          {navItems.map(({ id, labelKey, icon: Icon, badge }) => (
            <button className={activeNav === id ? "is-active" : ""} key={id} type="button" onClick={() => setActiveNav(id)}>
              <Icon size={20} /><span>{t(labelKey)}</span>{badge && <em>{badge}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-invite">
          <span><UsersRound /></span>
          <strong>{t("discover.sidebar.title")}</strong>
          <p>{t("discover.sidebar.copy")}</p>
          <button type="button">{t("discover.sidebar.invite")}</button>
        </div>
        <button className="sidebar-help" type="button"><HelpCircle size={19} /> {t("navigation.help")}</button>
        <div className="sidebar-profile">
          <Image src="/people/anna.jpg" alt="Alessandra" width={72} height={72} />
          <div><strong>Alessandra</strong><span>{t("navigation.viewProfile")}</span></div>
          <span className="sidebar-profile__more">•••</span>
        </div>
      </aside>

      <section className="discovery-main">
        <header className="mobile-app-header">
          <Logo />
          <div><SkillHourBadge compact /><LanguageSwitcher variant="flag" /><button type="button" aria-label={t("navigation.notifications")}><Bell size={20} /></button></div>
        </header>

        <div className="discovery-main__header">
          <div>
            <span className="app-kicker">{t("discover.header.kicker")}</span>
            <h1>{t("discover.header.title")}</h1>
            <p>{t("discover.header.question")}</p>
          </div>
          <div className="desktop-alerts">
            <LanguageSwitcher />
            <button type="button" aria-label={t("navigation.notifications")}><Bell size={21} /><span /></button>
          </div>
        </div>

        <div className="discover-search-row">
          <label className="discover-search">
            <Search size={20} aria-hidden="true" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setProfileIndex(0); }} placeholder={t("discover.search.placeholder")} aria-label={t("discover.search.label")} />
            {query && <button type="button" onClick={() => setQuery("")} aria-label={t("discover.search.clear")}><X size={17} /></button>}
          </label>
          <button className="filter-button" type="button"><SlidersHorizontal size={19} /><span>{t("discover.search.filters")}</span><em>2</em></button>
        </div>

        <div className="discover-filters" role="group" aria-label={t("discover.search.filtersLabel")}>
          {discoveryFilters.map((filter) => (
            <button className={activeFilter === filter.id ? "is-active" : ""} type="button" key={filter.id} onClick={() => { setActiveFilter(filter.id); setProfileIndex(0); }}>{t(filter.labelKey)}</button>
          ))}
        </div>

        <div className="mobile-swipe-hint"><span>{t("discover.swipe.hint")}</span><span><X size={13} /> {t("discover.swipe.skip")}</span><span><Heart size={13} fill="currentColor" /> {t("discover.swipe.connect")}</span></div>

        <div className="discovery-stage">
          <div className="card-stack-layer card-stack-layer--back" />
          <div className="card-stack-layer card-stack-layer--middle" />
          <AnimatePresence mode="wait">
            <motion.div className="discovery-stage__card" key={currentProfile.id} exit={{ opacity: 0, x: notice?.key === "discover.notices.skipped" ? -40 : 0, scale: 0.97 }} transition={{ duration: 0.2 }}>
              <ProfileCard
                profile={currentProfile}
                mode="discover"
                draggable
                saved={savedIds.includes(currentProfile.id)}
                onSkip={() => moveNext({ key: "discover.notices.skipped" })}
                onSave={toggleSave}
                onConnect={() => setMatchOpen(true)}
              />
            </motion.div>
          </AnimatePresence>
          <div className="profile-progress" aria-label={t("discover.profileCount", { current: profileIndex + 1, total: safeProfiles.length })}>
            {safeProfiles.map((profile, index) => <span className={index === profileIndex % safeProfiles.length ? "is-active" : ""} key={profile.id} />)}
          </div>
        </div>

        <div className="mobile-card-context">
          <span><Clock3 size={15} /> {t(`profiles.${currentProfile.key}.availability`)}</span>
          <span><Star size={15} fill="currentColor" /> {t("discover.sessionCount")}</span>
        </div>
      </section>

      <aside className="context-panel">
        <div className="context-panel__top"><span>{t("discover.context.yourDay")}</span><button type="button" aria-label={t("discover.context.panelSettings")}>•••</button></div>
        <section className="balance-card">
          <div className="balance-card__header"><span><Clock3 size={17} /> {t("discover.context.yourSkillHours")}</span><Sparkles size={16} /></div>
          <div className="balance-card__amount"><strong>4.5</strong><span>SH</span></div>
          <div className="balance-card__meter"><span /></div>
          <p>{t("discover.context.balanceCopy")}</p>
          <button type="button">{t("discover.context.viewActivity")} <span>→</span></button>
        </section>

        <section className="next-session-card">
          <div className="context-card-heading"><span>{t("discover.context.nextSession")}</span><button type="button">{t("discover.context.viewAll")}</button></div>
          <div className="session-person">
            <Image src="/people/sofia.jpg" alt="Sofia" width={84} height={84} />
            <div><strong>{t("discover.context.spanishWithSofia")}</strong><span><span className="online-dot" /> {t("discover.context.confirmed")}</span></div>
          </div>
          <div className="session-time">
            <span><CalendarDays size={17} /> {t("discover.context.today")}</span>
            <span><Clock3 size={17} /> 18:30</span>
          </div>
          <button className="session-join" type="button">{t("discover.context.viewSession")}</button>
        </section>

        <section className="weekly-card">
          <div className="weekly-card__icon"><Sparkles /></div>
          <div><strong>{t("discover.context.streakTitle")}</strong><p>{t("discover.context.streakCopy")}</p></div>
        </section>

        <section className="popular-now">
          <div className="context-card-heading"><span>{t("discover.context.popular")}</span></div>
          <div><SkillTag kind="teach">{t("skills.italian")}</SkillTag><small>{t("discover.context.people", { count: 42 })}</small></div>
          <div><SkillTag kind="learn">{t("skills.piano")}</SkillTag><small>{t("discover.context.people", { count: 28 })}</small></div>
          <div><SkillTag kind="neutral">{t("skills.marketing")}</SkillTag><small>{t("discover.context.people", { count: 21 })}</small></div>
        </section>
      </aside>

      <nav className="mobile-bottom-nav" aria-label={t("navigation.mobileAppLabel")}>
        {mobileItems.map(({ id, labelKey, icon: Icon, badge }) => (
          <button className={activeNav === id ? "is-active" : ""} type="button" key={id} onClick={() => setActiveNav(id)}>
            <span><Icon size={22} />{badge && <em />}</span><small>{t(labelKey)}</small>
          </button>
        ))}
      </nav>

      <AnimatePresence>{matchOpen && <MatchCelebration name={currentProfile.name} image={currentProfile.image} onClose={() => { setMatchOpen(false); moveNext({ key: "discover.notices.connected", parameters: { name: currentProfile.name } }); }} />}</AnimatePresence>
      <AnimatePresence>{notice && <motion.div className="app-toast" initial={{ opacity: 0, y: 16, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}><Check size={16} /> {t(notice.key, notice.parameters)}</motion.div>}</AnimatePresence>
    </main>
  );
}
