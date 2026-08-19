"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
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
  const links = [
    ["Discover", "/discover"],
    ["How it works", "#how-it-works"],
    ["Skill Hours", "#skill-hours"],
    ["Community", "#community"],
  ];

  return (
    <header className="site-header">
      <nav className="site-header__inner" aria-label="Main navigation">
        <Logo />
        <div className="site-header__links">
          {links.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        </div>
        <div className="site-header__actions">
          <a className="login-link" href="/discover">Log in</a>
          <Button href="/discover" icon>Join YUNO</Button>
        </div>
        <button className="mobile-menu-button" type="button" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <motion.div className="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
          <Button href="/discover">Join YUNO</Button>
        </motion.div>
      )}
    </header>
  );
}

function HeroVisual() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="hero-visual" aria-label="YUNO member discovery preview">
      <motion.div className="hero-ambient hero-ambient--one" animate={reduceMotion ? undefined : { x: [0, 18, 0], y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="hero-ambient hero-ambient--two" animate={reduceMotion ? undefined : { x: [0, -14, 0], y: [0, 18, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="hero-card-back hero-card-back--left" initial={{ opacity: 0, rotate: -5, x: 30 }} animate={{ opacity: 1, rotate: -7, x: 0 }} transition={{ delay: 0.35, duration: 0.65 }}>
        <Image src={profiles[2].image} alt="Sofia" fill sizes="216px" />
        <span>Spanish</span>
      </motion.div>
      <motion.div className="hero-card-back hero-card-back--right" initial={{ opacity: 0, rotate: 5, x: -30 }} animate={{ opacity: 1, rotate: 8, x: 0 }} transition={{ delay: 0.45, duration: 0.65 }}>
        <Image src={profiles[1].image} alt="Marco" fill sizes="216px" />
        <span>Photography</span>
      </motion.div>
      <motion.div className="hero-profile-shell" animate={reduceMotion ? undefined : { y: [0, -8, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}>
        <ProfileCard profile={profiles[0]} mode="hero" />
      </motion.div>
      <motion.div className="hero-match-note" initial={{ opacity: 0, scale: 0.7, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.9, type: "spring" }}>
        <span><Sparkles size={16} fill="currentColor" /></span>
        <div><strong>Great match</strong><small>You both love design</small></div>
      </motion.div>
    </div>
  );
}

function SkillCloud() {
  return (
    <div className="skill-cloud" aria-label="Popular skills on YUNO">
      {floatingSkills.map((skill, index) => (
        <motion.button
          key={skill}
          type="button"
          className={`floating-skill floating-skill--${(index % 4) + 1}`}
          style={{ "--skill-index": index } as React.CSSProperties}
          whileHover={{ y: -6, scale: 1.04, rotate: index % 2 ? 1 : -1 }}
          whileTap={{ scale: 0.96 }}
        >
          <span>{skill}</span>
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
  return (
    <main className="marketing-page">
      <Header />

      <section className="hero section-shell">
        <div className="hero__copy">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <SectionEyebrow><span className="eyebrow-live" /> A new way to grow, together</SectionEyebrow>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>
            Teach what you know.<br />
            <span>Learn what you want.</span>
          </motion.h1>
          <motion.p className="hero__support" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}>
            Everyone knows something worth sharing. Meet curious people, exchange real skills, and turn your time into new possibilities.
          </motion.p>
          <motion.div className="hero__actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.24 }}>
            <Button href="/discover" icon>Start matching</Button>
            <Button href="#how-it-works" variant="secondary">See how YUNO works <ArrowDown size={16} /></Button>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.38 }}>
            <AvatarStack />
          </motion.div>
        </div>
        <HeroVisual />
      </section>

      <section className="what-section section-shell" id="community">
        <Reveal className="what-section__copy">
          <SectionEyebrow>Skills live everywhere</SectionEyebrow>
          <h2>What do <span className="gradient-text">YUNO?</span></h2>
          <p>That thing you do without thinking could be the thing someone else has always wanted to learn.</p>
          <div className="what-section__microcopy"><span><Check size={14} /> No courses</span><span><Check size={14} /> Real people</span><span><Check size={14} /> Your pace</span></div>
        </Reveal>
        <Reveal className="what-section__cloud" delay={0.12}>
          <SkillCloud />
        </Reveal>
      </section>

      <section className="how-section" id="how-it-works">
        <div className="section-shell">
          <Reveal className="section-heading section-heading--center">
            <SectionEyebrow>One simple loop</SectionEyebrow>
            <h2>Learn more by sharing what’s already yours.</h2>
            <p>No awkward direct swaps. Your time becomes a universal learning currency.</p>
          </Reveal>
          <Reveal className="loop-flow" delay={0.1}>
            {[
              { n: "01", title: "Teach", copy: "Share a skill you know well.", icon: <Zap /> },
              { n: "02", title: "Earn", copy: "Get one Skill Hour per hour.", icon: <Clock3 /> },
              { n: "03", title: "Learn", copy: "Spend it with any member.", icon: <Sparkles /> },
              { n: "04", title: "Repeat", copy: "Keep curiosity moving.", icon: <Repeat2 /> },
            ].map((item, index) => (
              <div className="loop-step" key={item.title}>
                <div className="loop-step__top"><span>{item.n}</span><div>{item.icon}</div></div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                {index < 3 && <ArrowRight className="loop-step__arrow" aria-hidden="true" />}
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="hours-section section-shell" id="skill-hours">
        <Reveal className="hours-section__copy">
          <SectionEyebrow>Skill Hours</SectionEyebrow>
          <h2>Your knowledge is worth something.</h2>
          <p>Teach anyone on YUNO, earn time, then learn from anyone else. The right teacher doesn’t need to be your perfect barter match.</p>
          <div className="hours-rule">
            <Clock3 size={20} />
            <span><strong>1 hour teaching</strong> = +1 Skill Hour</span>
          </div>
          <Button href="/discover" variant="secondary" icon>Explore Skill Hours</Button>
        </Reveal>
        <Reveal className="hours-story" delay={0.12}>
          <div className="hours-story__person">
            <Image src="/people/anna.jpg" alt="Anna" width={92} height={92} />
            <div><strong>Anna teaches English</strong><span>to Luca · 60 min</span></div>
            <span className="session-status"><Check size={13} /> Done</span>
          </div>
          <div className="hours-story__line"><span /><ArrowDown /></div>
          <motion.div className="reward-card" whileInView={{ scale: [0.96, 1.03, 1] }} viewport={{ once: true }} transition={{ delay: 0.35, duration: 0.55 }}>
            <div className="reward-card__glow" />
            <span className="reward-card__icon"><Sparkles fill="currentColor" /></span>
            <div><small>Skill Hours earned</small><strong>+1.0 <em>SH</em></strong></div>
          </motion.div>
          <div className="hours-story__line"><span /><ArrowDown /></div>
          <div className="hours-story__person hours-story__person--learn">
            <Image src="/people/marco.jpg" alt="Marco" width={92} height={92} />
            <div><strong>Anna learns Photography</strong><span>from Marco · next week</span></div>
            <span className="session-status session-status--blue"><CalendarDays size={13} /> Booked</span>
          </div>
          <p className="hours-story__note"><Sparkles size={14} /> Luca and Marco never need to match.</p>
        </Reveal>
      </section>

      <section className="discover-preview">
        <div className="section-shell discover-preview__inner">
          <Reveal className="discover-preview__copy">
            <SectionEyebrow light>Discover people, not listings</SectionEyebrow>
            <h2>Your next skill starts with a person.</h2>
            <p>Skill-first matching brings you closer to people who can teach what you’re curious about — and want what you can share.</p>
            <div className="discovery-points">
              <span><strong>96%</strong> skill compatibility</span>
              <span><strong>3</strong> skills you want</span>
              <span><strong>2 km</strong> from you</span>
            </div>
            <Button href="/discover" icon>Meet people like Giulia</Button>
          </Reveal>
          <Reveal className="discover-preview__card" delay={0.12}>
            <div className="preview-orbit preview-orbit--camera"><Camera size={18} /><span>Photography</span></div>
            <div className="preview-orbit preview-orbit--hours"><Clock3 size={18} /><span>4.5 SH</span></div>
            <ProfileCard profile={profiles[0]} mode="preview" />
          </Reveal>
        </div>
      </section>

      <section className="final-cta section-shell">
        <Reveal className="final-cta__panel">
          <div className="final-cta__mark"><Image src="/favicon.png" alt="" width={1254} height={1254} /></div>
          <div>
            <span>What do YUNO?</span>
            <h2>Someone wants to learn it.</h2>
          </div>
          <Button href="/discover" icon>Join YUNO</Button>
          <div className="final-cta__orb final-cta__orb--one" />
          <div className="final-cta__orb final-cta__orb--two" />
        </Reveal>
      </section>

      <footer className="site-footer section-shell">
        <Logo />
        <p>Teach what you know. Learn what you want.</p>
        <div><a href="#how-it-works">How it works</a><a href="#skill-hours">Skill Hours</a><a href="/discover">Discover</a></div>
        <span>© 2026 YUNO</span>
      </footer>
    </main>
  );
}
