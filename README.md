# WhoKnowsMe — Build Blueprint, Phase 1

Phase 1 of the build order from the spec PDF: **database schema + quiz
creation flow.** This is a real, working Next.js app - not a mockup - built
and tested end-to-end against a local Postgres instance.

## What's built

- **Database schema** (`db/schema.ts`) - `quizzes`, `questions`, `responses`,
  `reports` tables via Drizzle ORM, matching the spec's Section 09 exactly
- **Quiz creation flow** (`/create`) - name + language -> pick from a
  ~30-question bank or write custom -> 4 options with correct answer marked ->
  review -> publish -> get a share link + a private results link
- **API routes**:
  - `POST /api/quiz` - creates a quiz (validated, rate-limited, spam-checked)
  - `GET /api/quiz/[slug]` - fetches a quiz for the taking flow (never
    exposes correct answers to the browser)
- **Dark theme design system** applied throughout, matching Section 11 of
  the spec (`#0D0D14` background, `#7C3AED` accent, etc.) - see
  `app/globals.css` for the full token set
- Security groundwork from Section 13: input sanitization (no HTML/links
  accepted anywhere user text is stored), rate limiting on quiz creation,
  hashed edit tokens, structural spam checks

## Not built yet (next phases)

- Taking flow (`/q/[slug]`) - answering questions and scoring
- Results page + share-card image generation (`@vercel/og`)
- Leaderboard + creator's private `/manage` page
- WhatsApp deep-link is wired on the success screen, but nothing exists yet
  for a taker to actually answer questions

## Running it locally

**Prerequisites:** Node 18+, a Postgres database (local, or a free Neon/
Supabase project).

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and IP_HASH_SALT
npx drizzle-kit migrate      # creates the 4 tables
npm run dev
```

Visit `http://localhost:3000`.

### Local Postgres, if you don't have one yet

```bash
# macOS
brew install postgresql@16 && brew services start postgresql@16
createdb whoknowsme

# Then in .env.local:
DATABASE_URL=postgres://<your-user>@localhost:5432/whoknowsme
```

### Using Neon or Supabase instead (recommended for anything beyond local dev)

1. Create a free project at neon.tech or supabase.com
2. Copy the connection string they give you into `DATABASE_URL`
3. Run `npx drizzle-kit migrate` once against it

## A note on fonts

The design spec calls for Inter (headings/body) and JetBrains Mono
(labels/data). This build uses system font stacks that closely match both
(`ui-sans-serif` / `ui-monospace` fallback chains in `app/globals.css`)
because the sandbox this was built in couldn't reach Google Fonts. If you
want the exact webfonts, swap the `font-family` values in `globals.css` for
`next/font/google` imports of Inter and JetBrains Mono - it's a five-minute
change and everything else (spacing, sizing, color) stays identical.

## Deploying

Matches the spec's free-tier stack exactly:

1. Push this repo to GitHub
2. Import it on vercel.com (free Hobby plan)
3. Set `DATABASE_URL` and `IP_HASH_SALT` in Vercel's project environment
   variables (use your Neon/Supabase connection string, not local Postgres)
4. Run `npx drizzle-kit migrate` once against production before first deploy

## Before opening this to real traffic

Straight from spec Section 13/14 - don't skip these:

- Wire `moderateText()` in `lib/validation.ts` to a real moderation API
  (OpenAI's moderation endpoint or Perspective API) - the current version is
  a structural-only placeholder
- Swap `lib/rate-limit.ts`'s in-memory limiter for Upstash Redis - the
  current one doesn't work across multiple serverless instances
- Add Cloudflare Turnstile to the create-quiz request (the TODO is marked in
  `app/api/quiz/route.ts`)
- Write an actual Privacy Policy / Terms page
- Set up the `/api/report` route and a real moderation review process (not
  built yet - comes with the taking flow in the next phase)

## Project structure

```
app/
  page.tsx                    landing page
  create/page.tsx             creation flow page
  api/quiz/route.ts           POST create quiz
  api/quiz/[slug]/route.ts    GET fetch quiz
  globals.css                 dark theme design tokens
components/
  CreateQuizFlow.tsx           the multi-step creation wizard
  QuestionPicker.tsx           question bank browser
  QuestionEditor.tsx           prompt + 4 options + correct-answer form
  StackedCard.tsx               signature card visual
  Button.tsx / TextField.tsx / ProgressBar.tsx
db/
  schema.ts                    Drizzle schema (4 tables)
  client.ts                    pooled Postgres connection
  migrations/                  generated SQL migration
lib/
  question-bank.ts             ~30 starter question templates
  validation.ts                input sanitization + spam checks
  rate-limit.ts                in-memory limiter (swap for Redis in prod)
  ids.ts                       slug/token generation, IP hashing
  whatsapp.ts                  wa.me share link helper
  draft-question.ts            client-side question draft type
```
