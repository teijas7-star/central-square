# Central Square MVP

A digital agora (public Central Square + private Arcades) where communities thrive and connect through curated Lantern posts, enhanced by AI Hosts that help users discover communities.

## Project Documentation

- **Feature Specification**: [specs/001-central-square/spec.md](../specs/001-central-square/spec.md)
- **Implementation Plan**: [specs/001-central-square/plan.md](../specs/001-central-square/plan.md)
- **Revised Architecture**: [specs/001-central-square/revised-architecture.md](../specs/001-central-square/revised-architecture.md)
- **Engineering Constitution**: [.specify/memory/constitution.md](../.specify/memory/constitution.md)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account and project
- Upstash Redis account (for rate limiting)
- OpenAI API key (for AI Host feature)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env.local
   # Fill in:
   # - SUPABASE_URL and SUPABASE_ANON_KEY
   # - DATABASE_URL (Supabase PostgreSQL connection string)
   # - UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
   # - OPENAI_API_KEY (for AI Host feature)
   ```

test

3. Run Prisma migrations:

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

4. Start development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/app` - Next.js App Router routes and API handlers
- `/components` - React components
- `/lib` - Shared utilities (Supabase, Prisma, validators, rate limiting, AI Host)
- `/prisma` - Database schema and migrations
- `/tests` - Test files (unit, integration, e2e)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: Tailwind CSS, shadcn/ui
- **Auth**: Supabase Auth (magic-link)
- **Database**: Supabase PostgreSQL, Prisma ORM
- **Rate Limiting**: Upstash Redis
- **Validation**: Zod
- **AI**: OpenAI GPT-4o-mini (for AI Host conversational interface)

## Key Features

- **Central Square**: Public discourse space showing Lanterns (promoted posts from Arcades)
- **Arcades**: Private organizational spaces for communities
- **AI Host**: Conversational AI assistant that learns user preferences and recommends Arcades
- **Discovery**: Search and filter Arcades by tags and keywords
- **Discourse**: Post and reply within Arcades, promote posts to Central Square

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
