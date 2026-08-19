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
import { Logo } from "./Logo";
import { ProfileCard } from "./ProfileCard";
import { Button, SkillHourBadge, SkillTag } from "./ui";

const navItems = [
  { label: "Discover", icon: Compass },
  { label: "Matches", icon: Heart, badge: "3" },
  { label: "Messages", icon: MessageCircle, badge: "2" },
  { label: "Sessions", icon: CalendarDays },
  { label: "Skill Hours", icon: WalletCards },
  { label: "Profile", icon: UserRound },
];

const mobileItems = [
  { label: "Discover", icon: Compass },
  { label: "Matches", icon: Heart },
  { label: "Sessions", icon: CalendarDays },
  { label: "Chat", icon: MessageCircle, badge: true },
  { label: "Profile", icon: UserRound },
];

function MatchCelebration({ name, image, onClose }: { name: string; image: string; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div className="match-overlay" role="dialog" aria-modal="true" aria-label={`You connected with ${name}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="match-modal" initial={reduceMotion ? false : { opacity: 0, scale: 0.82, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ type: "spring", stiffness: 220, damping: 20 }}>
        <button className="match-modal__close" type="button" onClick={onClose} aria-label="Close"><X /></button>
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
          <Image src="/people/anna.jpg" alt="Your profile" width={168} height={168} />
          <span><Heart fill="currentColor" /></span>
          <Image src={image} alt={name} width={168} height={168} />
        </div>
        <span className="match-modal__eyebrow"><Sparkles size={14} /> It’s a skill match</span>
        <h2>You and {name} could learn a lot from each other.</h2>
        <p>Say hello and find a good time for your first skill session.</p>
        <Button onClick={onClose}>Send a message</Button>
        <button className="match-modal__keep" type="button" onClick={onClose}>Keep discovering</button>
      </motion.div>
    </motion.div>
  );
}

export function DiscoverApp() {
  const [activeNav, setActiveNav] = useState("Discover");
  const [query, setQuery] = useState("");
  const [activeSkill, setActiveSkill] = useState("For you");
  const [profileIndex, setProfileIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [matchOpen, setMatchOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredProfiles = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const byQuery = normalized
      ? profiles.filter((profile) => [...profile.teaches, ...profile.learns, profile.city, profile.name].some((value) => value.toLowerCase().includes(normalized)))
      : profiles;
    if (activeSkill === "For you" || activeSkill === "Nearby") return byQuery;
    return byQuery.filter((profile) => [...profile.teaches, ...profile.learns].some((skill) => skill.toLowerCase().includes(activeSkill.toLowerCase())));
  }, [activeSkill, query]);

  const safeProfiles = filteredProfiles.length ? filteredProfiles : profiles;
  const currentProfile = safeProfiles[profileIndex % safeProfiles.length];

  function moveNext(message?: string) {
    if (message) {
      setNotice(message);
      window.setTimeout(() => setNotice(""), 1800);
    }
    setProfileIndex((index) => (index + 1) % safeProfiles.length);
  }

  function toggleSave() {
    const alreadySaved = savedIds.includes(currentProfile.id);
    setSavedIds((ids) => alreadySaved ? ids.filter((id) => id !== currentProfile.id) : [...ids, currentProfile.id]);
    setNotice(alreadySaved ? "Removed from saved" : `${currentProfile.name} saved for later`);
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <main className="discover-app">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand"><Logo /></div>
        <nav className="app-sidebar__nav" aria-label="YUNO application navigation">
          {navItems.map(({ label, icon: Icon, badge }) => (
            <button className={activeNav === label ? "is-active" : ""} key={label} type="button" onClick={() => setActiveNav(label)}>
              <Icon size={20} /><span>{label}</span>{badge && <em>{badge}</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-invite">
          <span><UsersRound /></span>
          <strong>Learning is better together.</strong>
          <p>Invite a curious friend to YUNO.</p>
          <button type="button">Invite friends</button>
        </div>
        <button className="sidebar-help" type="button"><HelpCircle size={19} /> Help & support</button>
        <div className="sidebar-profile">
          <Image src="/people/anna.jpg" alt="Alessandra" width={72} height={72} />
          <div><strong>Alessandra</strong><span>View profile</span></div>
          <span className="sidebar-profile__more">•••</span>
        </div>
      </aside>

      <section className="discovery-main">
        <header className="mobile-app-header">
          <Logo />
          <div><SkillHourBadge compact /><button type="button" aria-label="Notifications"><Bell size={20} /></button></div>
        </header>

        <div className="discovery-main__header">
          <div>
            <span className="app-kicker">Meet your next teacher</span>
            <h1>Discover</h1>
            <p>What do you want to learn today?</p>
          </div>
          <div className="desktop-alerts">
            <button type="button" aria-label="Notifications"><Bell size={21} /><span /></button>
          </div>
        </div>

        <div className="discover-search-row">
          <label className="discover-search">
            <Search size={20} aria-hidden="true" />
            <input value={query} onChange={(event) => { setQuery(event.target.value); setProfileIndex(0); }} placeholder="Search a skill…" aria-label="Search a skill" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button>}
          </label>
          <button className="filter-button" type="button"><SlidersHorizontal size={19} /><span>Filters</span><em>2</em></button>
        </div>

        <div className="discover-filters" role="group" aria-label="Discovery filters">
          {["For you", "Nearby", "Spanish", "Design", "Photography"].map((skill) => (
            <button className={activeSkill === skill ? "is-active" : ""} type="button" key={skill} onClick={() => { setActiveSkill(skill); setProfileIndex(0); }}>{skill}</button>
          ))}
        </div>

        <div className="mobile-swipe-hint"><span>Swipe to explore</span><span><X size={13} /> skip</span><span><Heart size={13} fill="currentColor" /> connect</span></div>

        <div className="discovery-stage">
          <div className="card-stack-layer card-stack-layer--back" />
          <div className="card-stack-layer card-stack-layer--middle" />
          <AnimatePresence mode="wait">
            <motion.div className="discovery-stage__card" key={currentProfile.id} exit={{ opacity: 0, x: notice.includes("Not") ? -40 : 0, scale: 0.97 }} transition={{ duration: 0.2 }}>
              <ProfileCard
                profile={currentProfile}
                mode="discover"
                draggable
                saved={savedIds.includes(currentProfile.id)}
                onSkip={() => moveNext("Not this one — here’s someone new")}
                onSave={toggleSave}
                onConnect={() => setMatchOpen(true)}
              />
            </motion.div>
          </AnimatePresence>
          <div className="profile-progress" aria-label={`${profileIndex + 1} of ${safeProfiles.length} profiles`}>
            {safeProfiles.map((profile, index) => <span className={index === profileIndex % safeProfiles.length ? "is-active" : ""} key={profile.id} />)}
          </div>
        </div>

        <div className="mobile-card-context">
          <span><Clock3 size={15} /> {currentProfile.availability}</span>
          <span><Star size={15} fill="currentColor" /> 4.9 · 18 sessions</span>
        </div>
      </section>

      <aside className="context-panel">
        <div className="context-panel__top"><span>Your day</span><button type="button" aria-label="Panel settings">•••</button></div>
        <section className="balance-card">
          <div className="balance-card__header"><span><Clock3 size={17} /> Your Skill Hours</span><Sparkles size={16} /></div>
          <div className="balance-card__amount"><strong>4.5</strong><span>SH</span></div>
          <div className="balance-card__meter"><span /></div>
          <p>That’s 4.5 hours of learning waiting for you.</p>
          <button type="button">View activity <span>→</span></button>
        </section>

        <section className="next-session-card">
          <div className="context-card-heading"><span>Next session</span><button type="button">View all</button></div>
          <div className="session-person">
            <Image src="/people/sofia.jpg" alt="Sofia" width={84} height={84} />
            <div><strong>Spanish with Sofia</strong><span><span className="online-dot" /> Confirmed</span></div>
          </div>
          <div className="session-time">
            <span><CalendarDays size={17} /> Today</span>
            <span><Clock3 size={17} /> 18:30</span>
          </div>
          <button className="session-join" type="button">View session</button>
        </section>

        <section className="weekly-card">
          <div className="weekly-card__icon"><Sparkles /></div>
          <div><strong>You’re on a curiosity streak.</strong><p>3 new skills explored this week.</p></div>
        </section>

        <section className="popular-now">
          <div className="context-card-heading"><span>Popular near you</span></div>
          <div><SkillTag kind="teach">Italian</SkillTag><small>42 people</small></div>
          <div><SkillTag kind="learn">Piano</SkillTag><small>28 people</small></div>
          <div><SkillTag kind="neutral">Marketing</SkillTag><small>21 people</small></div>
        </section>
      </aside>

      <nav className="mobile-bottom-nav" aria-label="Mobile app navigation">
        {mobileItems.map(({ label, icon: Icon, badge }) => (
          <button className={activeNav === label || (label === "Chat" && activeNav === "Messages") ? "is-active" : ""} type="button" key={label} onClick={() => setActiveNav(label)}>
            <span><Icon size={22} />{badge && <em />}</span><small>{label}</small>
          </button>
        ))}
      </nav>

      <AnimatePresence>{matchOpen && <MatchCelebration name={currentProfile.name} image={currentProfile.image} onClose={() => { setMatchOpen(false); moveNext(`Connected with ${currentProfile.name}!`); }} />}</AnimatePresence>
      <AnimatePresence>{notice && <motion.div className="app-toast" initial={{ opacity: 0, y: 16, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 10, x: "-50%" }}><Check size={16} /> {notice}</motion.div>}</AnimatePresence>
    </main>
  );
}
