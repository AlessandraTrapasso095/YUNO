# YUNO

**Teach what you know. Learn what you want.**

YUNO is a social skill-sharing product where people discover each other through the skills they can teach and want to learn. Teaching earns Skill Hours, which can be spent learning from any other member.

This repository currently contains the Phase 1 visual product:

- responsive public homepage
- desktop and mobile Discover experience
- reusable brand, button, tag, profile-card, navigation, and Skill Hour components
- realistic mock profiles and sessions
- Motion-powered interactions with reduced-motion support

The backend, authentication, persistence, and real matching logic are intentionally deferred.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Open `http://localhost:3001` for the homepage or `http://localhost:3001/discover` for the product experience.

## Quality checks

```bash
npm run lint
npm test
```

Design tokens and responsive product styles live in `app/globals.css`. Reusable UI lives under `app/components` and mock product data lives in `app/data.ts`.

