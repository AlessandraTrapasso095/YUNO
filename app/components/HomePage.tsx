"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  Menu,
  Repeat2,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { floatingSkills, profiles } from "../data";
import { useI18n } from "../i18n/I18nProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";
import { ProfileCard } from "./ProfileCard";
import { AvatarStack, Button, SectionEyebrow } from "./ui";

const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : reveal}
      initial={reduceMotion ? undefined : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const links = [
    ["navigation.discover", "/discover"],
    ["navigation.howItWorks", "#how-it-works"],
    ["navigation.skillHours", "#skill-hours"],
    ["navigation.community", "#community"],
  ];

  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label={t("navigation.mainLabel")}>
        <Logo />
        <div className="site-header__links">
          {links.map(([labelKey, href]) => <a key={labelKey} href={href}>{t(labelKey)}</a>)}
        </div>
        <div className="site-header__actions">
          <LanguageSwitcher />
          <a className="login-link" href="/discover">{t("navigation.login")}</a>
          <Button href="/discover" icon>{t("navigation.join")}</Button>
        </div>
        <button className="mobile-menu-button" type="button" aria-expanded={open} aria-label={t("navigation.toggle")} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
            {links.map(([labelKey, href]) => <a key={labelKey} href={href} onClick={() => setOpen(false)}>{t(labelKey)}</a>)}
            <LanguageSwitcher variant="menu" />
            <a className="mobile-menu__login" href="/discover">{t("navigation.login")}</a>
            <Button href="/discover">{t("navigation.join")}</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroVisual() {
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  return (
    <div className="hero-visual" aria-label={t("homepage.hero.visualLabel")}>
      <motion.div className="hero-ambient hero-ambient--one" animate={reduceMotion ? undefined : { x: [0, 18, 0], y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="hero-ambient hero-ambient--two" animate={reduceMotion ? undefined : { x: [0, -14, 0], y: [0, 18, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="hero-card-back hero-card-back--left" initial={{ opacity: 0, rotate: -5, x: 30 }} animate={{ opacity: 1, rotate: -7, x: 0 }} transition={{ delay: 0.35, duration: 0.65 }}>
        <Image src={profiles[2].image} alt="Sofia" fill sizes="216px" />
        <span>{t("skills.spanish")}</span>
      </motion.div>
      <motion.div className="hero-card-back hero-card-back--right" initial={{ opacity: 0, rotate: 5, x: -30 }} animate={{ opacity: 1, rotate: 8, x: 0 }} transition={{ delay: 0.45, duration: 0.65 }}>
        <Image src={profiles[1].image} alt="Marco" fill sizes="216px" />
        <span>{t("skills.photography")}</span>
      </motion.div>
      <div className="hero-profile-shell">
        <motion.div className="hero-profile-float" animate={reduceMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}>
          <ProfileCard profile={profiles[0]} mode="hero" />
        </motion.div>
      </div>
      <motion.div className="hero-match-note" initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.9, type: "spring" }}>
        <span><Sparkles size={16} fill="currentColor" /></span>
        <div><strong>{t("homepage.hero.greatMatch")}</strong><small>{t("homepage.hero.matchReason")}</small></div>
      </motion.div>
    </div>
  );
}

function SkillCloud() {
  const { t } = useI18n();
  return (
    <div className="skill-cloud" aria-label={t("homepage.what.skillsLabel")}>
      {floatingSkills.map((skill, index) => (
        <motion.button
          key={skill}
          type="button"
          className={`floating-skill floating-skill--${(index % 4) + 1}`}
          style={{ "--skill-index": index } as React.CSSProperties}
          whileHover={{ y: -6, scale: 1.04, rotate: index % 2 ? 1 : -1 }}
          whileTap={{ scale: 0.96 }}
        >
          <span>{t(`skills.${skill}`)}</span>
          {index === 1 || index === 8 ? <Sparkles size={15} /> : <span className="floating-skill__dot" />}
        </motion.button>
      ))}
      <div className="skill-cloud__center">
        <Image src="/favicon.png" alt="" width={84} height={84} />
      </div>
    </div>
  );
}

export function HomePage() {
  const { isChanging, t } = useI18n();
  const loopSteps = [
    { id: "teach", n: "01", icon: <Zap /> },
    { id: "earn", n: "02", icon: <Clock3 /> },
    { id: "learn", n: "03", icon: <Sparkles /> },
    { id: "repeat", n: "04", icon: <Repeat2 /> },
  ];

  return (
    <main className="marketing-page">
      <Header />

      <section className="hero section-shell">
        <motion.div className="hero__copy" animate={{ opacity: isChanging ? 0 : 1 }} transition={{ duration: 0.11, ease: "easeOut" }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionEyebrow><span className="eyebrow-live" /> {t("homepage.hero.eyebrow")}</SectionEyebrow>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>
            {t("common.taglineFirst")}<br />
            <span>{t("common.taglineSecond")}</span>
          </motion.h1>
          <motion.p className="hero__support" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}>
            {t("homepage.hero.support")}
          </motion.p>
          <motion.div className="hero__actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }}>
            <Button href="/discover" icon>{t("homepage.hero.primaryCta")}</Button>
            <Button href="#how-it-works" variant="secondary">{t("homepage.hero.secondaryCta")} <ArrowDown size={16} /></Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.38 }}>
            <AvatarStack />
          </motion.div>
        </motion.div>
        <HeroVisual />
      </section>

      <section className="what-section section-shell" id="community">
        <Reveal className="what-section__copy">
          <SectionEyebrow>{t("homepage.what.eyebrow")}</SectionEyebrow>
          <h2>{t("common.brandQuestionLead")}<span className="gradient-text">YUNO?</span></h2>
          <p>{t("homepage.what.copy")}</p>
          <div className="what-section__microcopy"><span><Check size={14} /> {t("homepage.what.noCourses")}</span><span><Check size={14} /> {t("homepage.what.realPeople")}</span><span><Check size={14} /> {t("homepage.what.yourPace")}</span></div>
        </Reveal>
        <Reveal className="what-section__cloud" delay={0.12}>
          <SkillCloud />
        </Reveal>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-shell">
          <Reveal className="section-heading section-heading--center">
            <SectionEyebrow>{t("homepage.how.eyebrow")}</SectionEyebrow>
            <h2>{t("homepage.how.title")}</h2>
            <p>{t("homepage.how.copy")}</p>
          </Reveal>
          <Reveal className="loop-flow" delay={0.1}>
            {loopSteps.map((item, index) => (
              <div className="loop-step" key={item.id}>
                <div className="loop-step__top"><span>{item.n}</span><div>{item.icon}</div></div>
                <h3>{t(`homepage.how.steps.${item.id}.title`)}</h3>
                <p>{t(`homepage.how.steps.${item.id}.copy`)}</p>
                {index < 3 && <ArrowRight className="loop-step__arrow" aria-hidden="true" />}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="hours-section section-shell" id="skill-hours">
        <Reveal className="hours-section__copy">
          <SectionEyebrow>{t("common.skillHours")}</SectionEyebrow>
          <h2>{t("homepage.hours.title")}</h2>
          <p>{t("homepage.hours.copy")}</p>
          <div className="hours-rule">
            <Clock3 size={20} />
            <span><strong>{t("homepage.hours.ruleLead")}</strong> = +1 Skill Hour</span>
          </div>
          <Button href="/discover" variant="secondary" icon>{t("homepage.hours.explore")}</Button>
        </Reveal>
        <Reveal className="hours-story" delay={0.12}>
          <div className="hours-story__person">
            <Image src="/people/anna.jpg" alt="Anna" width={92} height={92} />
            <div><strong>{t("homepage.hours.annaTeaches")}</strong><span>{t("homepage.hours.toLuca")}</span></div>
            <span className="session-status"><Check size={13} /> {t("homepage.hours.done")}</span>
          </div>
          <div className="hours-story__line"><span /><ArrowDown /></div>
          <motion.div className="reward-card" whileInView={{ scale: [0.96, 1.03, 1] }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.55 }}>
            <div className="reward-card__glow" />
            <span className="reward-card__icon"><Sparkles fill="currentColor" /></span>
            <div><small>{t("homepage.hours.earned")}</small><strong>+1.0 <em>SH</em></strong></div>
          </motion.div>
          <div className="hours-story__line"><span /><ArrowDown /></div>
          <div className="hours-story__person hours-story__person--learn">
            <Image src="/people/marco.jpg" alt="Marco" width={92} height={92} />
            <div><strong>{t("homepage.hours.annaLearns")}</strong><span>{t("homepage.hours.fromMarco")}</span></div>
            <span className="session-status session-status--blue"><CalendarDays size={13} /> {t("homepage.hours.booked")}</span>
          </div>
          <p className="hours-story__note"><Sparkles size={14} /> {t("homepage.hours.noDirectMatch")}</p>
        </Reveal>
      </section>

      <section className="discover-preview">
        <div className="section-shell discover-preview__inner">
          <Reveal className="discover-preview__copy">
            <SectionEyebrow light>{t("homepage.discovery.eyebrow")}</SectionEyebrow>
            <h2>{t("homepage.discovery.title")}</h2>
            <p>{t("homepage.discovery.copy")}</p>
            <div className="discovery-points">
              <span><strong>96%</strong> {t("homepage.discovery.compatibility")}</span>
              <span><strong>3</strong> {t("homepage.discovery.wantedSkills")}</span>
              <span><strong>2 km</strong> {t("homepage.discovery.distance")}</span>
            </div>
            <Button href="/discover" icon>{t("homepage.discovery.cta")}</Button>
          </Reveal>
          <Reveal className="discover-preview__card" delay={0.12}>
            <div className="preview-orbit preview-orbit--camera"><Camera size={18} /><span>{t("skills.photography")}</span></div>
            <div className="preview-orbit preview-orbit--hours"><Clock3 size={18} /><span>4.5 SH</span></div>
            <ProfileCard profile={profiles[0]} mode="preview" />
          </Reveal>
        </div>
      </section>

      <section className="final-cta section-shell">
        <Reveal className="final-cta__panel">
          <div className="final-cta__mark"><Image src="/favicon.png" alt="" width={1254} height={1254} /></div>
          <div>
            <span>{t("common.brandQuestion")}</span>
            <h2>{t("homepage.finalCta.title")}</h2>
          </div>
          <Button href="/discover" icon>{t("navigation.join")}</Button>
          <div className="final-cta__orb final-cta__orb--one" />
          <div className="final-cta__orb final-cta__orb--two" />
        </Reveal>
      </section>

      <footer className="site-footer section-shell">
        <Logo />
        <p>{t("common.taglineFirst")} {t("common.taglineSecond")}</p>
        <div><a href="#how-it-works">{t("navigation.howItWorks")}</a><a href="#skill-hours">{t("navigation.skillHours")}</a><a href="/discover">{t("navigation.discover")}</a></div>
        <span>© 2026 YUNO</span>
      </footer>
    </main>
  );
}
