# Central Square - Claude Development Guide

## Project Identity

**Central Square** is the community marketplace — a new social layer of the internet where communities thrive, discover each other, and create economic opportunities without algorithmic manipulation or ads.

**Tagline:** "A digital agora where communities thrive"

---

## Architecture Overview

### Two Interconnected Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      THE SQUARE                              │
│         Public Discovery Layer - Cross-community            │
│    Serendipitous connections without algorithmic feeds      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      THE ARCADES                             │
│              Community Homes - Where people live             │
│   Discussions • Events • Members • Archives • Identity       │
└─────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Web (Current) | iOS App (Building) |
|-------|--------------|-------------------|
| Framework | Next.js 16 (App Router) | React Native + Expo |
| UI | Tailwind CSS + Framer Motion | NativeWind + Reanimated |
| Auth | Supabase | Supabase (shared) |
| Database | PostgreSQL via Prisma | API calls to existing backend |
| AI | OpenAI API | Same API endpoints |
| State | React hooks | Zustand + React Query |

---

## Business Model (B2B2C)

### Three Revenue Streams
1. **Communities Pay** ($50-500/month) - Professional infrastructure
2. **Enterprises Pay** ($5K-30K/month) - Adobe, Aspen Institute scale
3. **Marketplace Revenue** (15-20%) - Sponsorship facilitation

### Target Users (Year 1)
- Enterprise: Adobe (2.4M members), Microsoft, Aspen Institute
- SMB: Mid-size SaaS, universities, foundations
- Professional operators: Creator networks, industry associations

**NOT targeting initially:** Free hobbyist communities, casual organizers

---

## Design System

### Visual Identity

```
Colors:
├── Background: #000000 (black), #171717 (neutral-900)
├── Surface: #262626 (neutral-800), #404040 (neutral-700)
├── Text: #FAFAFA (white), #A3A3A3 (neutral-400)
├── Accent: #F59E0B (amber-500), #D97706 (amber-600)
└── Success/Online: #22C55E (green-500)

Typography:
├── Headlines: Serif (for personality)
├── Body: Sans-serif (for clarity)
└── Spacing: Generous, spacious, not cluttered

Aesthetic:
├── Human, lived-in, warm
├── Civic but not sterile
├── Clean but not corporate
├── Dark theme with warm amber accents
└── Network/constellation visual metaphors
```

### iOS-Specific Patterns

```
Navigation:
├── Tab Bar: Home, Discover, Create, Activity, Profile
├── Stack Navigation: Within each tab
├── Bottom Sheet: Quick actions, compose
└── Haptics: Subtle feedback on interactions

Components:
├── Cards: Rounded corners (16px), subtle shadows
├── Buttons: Full-width CTAs, pill-shaped secondary
├── Lists: Native-feeling with swipe actions
├── Pull-to-refresh: Custom animation with logo
└── Skeleton loaders: Smooth shimmer effect
```

---

## Data Models (Prisma Schema)

### Core Entities

```typescript
// User/Profile
Profile {
  id: string (Supabase auth ID)
  handle: string (unique)
  name: string
  avatarUrl?: string
  bio?: string
  interests: string[]
}

// Community
Arcade {
  id: string
  name: string
  description?: string
  visibility: 'open' | 'invite'
  tags: string[]
  hostId: string → Profile
}

// Membership
Membership {
  arcadeId → Arcade
  userId → Profile
  role: 'host' | 'member'
}

// Content
Post {
  id: string
  authorId → Profile
  arcadeId? → Arcade
  parentId? → Post (threading)
  body: string
  isLantern: boolean (highlighted)
}

// AI Host
AIHost {
  userId → Profile (1:1)
  name: string
  conversations: AIConversation[]
}

UserPreferences {
  userId → Profile
  interests: string[]
  values: string[]
  goals: string[]
  dislikes: string[]
}
```

---

## API Endpoints (Existing)

### Authentication
- `POST /api/auth/signout` - Sign out

### Profiles
- `GET /api/profiles` - Get current user profile
- `POST /api/profiles` - Create/update profile

### Arcades
- `GET /api/arcades` - List arcades
- `POST /api/arcades` - Create arcade
- `GET /api/arcades/[id]` - Get arcade details
- `POST /api/arcades/[id]/join` - Join arcade
- `POST /api/arcades/[id]/invite` - Create invite
- `GET /api/arcades/[id]/members` - List members

### Posts
- `GET /api/posts?arcadeId=X` - Get posts
- `POST /api/posts` - Create post
- `POST /api/posts/[id]/lantern` - Toggle lantern

### AI Host
- `GET /api/ai-host/chat` - Get conversation history
- `POST /api/ai-host/chat` - Send message
- `GET /api/ai-host/recommendations` - Get arcade recommendations

### Discovery
- `GET /api/discovery` - Discover arcades
- `GET /api/feed/square` - Global feed

---

## iOS App Structure

```
ios_app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigator
│   │   ├── index.tsx             # Home/Feed
│   │   ├── discover.tsx          # Discover arcades
│   │   ├── create.tsx            # Create post/arcade
│   │   ├── activity.tsx          # Notifications
│   │   └── profile.tsx           # User profile
│   ├── (auth)/                   # Auth flow
│   │   ├── welcome.tsx           # Onboarding
│   │   ├── signin.tsx            # Sign in
│   │   └── onboarding/           # AI Host onboarding
│   ├── arcade/[id]/              # Arcade screens
│   │   ├── index.tsx             # Arcade home
│   │   ├── feed.tsx              # Arcade feed
│   │   ├── events.tsx            # Events
│   │   └── members.tsx           # Members
│   ├── post/[id].tsx             # Post detail
│   ├── ai-host.tsx               # AI Host chat
│   └── _layout.tsx               # Root layout
├── components/
│   ├── ui/                       # Base components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── Input.tsx
│   │   └── BottomSheet.tsx
│   ├── arcade/                   # Arcade components
│   │   ├── ArcadeCard.tsx
│   │   ├── ArcadeHeader.tsx
│   │   └── MemberList.tsx
│   ├── post/                     # Post components
│   │   ├── PostCard.tsx
│   │   ├── ComposeSheet.tsx
│   │   └── ReplyThread.tsx
│   ├── ai-host/                  # AI Host components
│   │   ├── ChatBubble.tsx
│   │   ├── OnboardingFlow.tsx
│   │   └── RecommendationCard.tsx
│   └── layout/                   # Layout components
│       ├── TabBar.tsx
│       ├── Header.tsx
│       └── SafeArea.tsx
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useArcades.ts
│   ├── usePosts.ts
│   └── useAIHost.ts
├── services/                     # API services
│   ├── api.ts                    # Base API client
│   ├── auth.ts
│   ├── arcades.ts
│   ├── posts.ts
│   └── aiHost.ts
├── stores/                       # Zustand stores
│   ├── authStore.ts
│   ├── arcadeStore.ts
│   └── uiStore.ts
├── constants/                    # Constants
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── utils/                        # Utilities
│   ├── formatters.ts
│   └── validators.ts
├── assets/                       # Static assets
│   ├── images/
│   └── fonts/
├── app.json                      # Expo config
├── package.json
├── tailwind.config.js            # NativeWind config
├── tsconfig.json
└── babel.config.js
```

---

## Module-Based Task Execution

### Phase 1: Foundation (Week 1)
```
Module 1.1: Project Setup
├── Create Expo project with TypeScript
├── Configure NativeWind (Tailwind for RN)
├── Set up Expo Router navigation
├── Configure environment variables
└── Deliverable: Running skeleton app

Module 1.2: Design System
├── Implement color constants
├── Create typography scale
├── Build base UI components (Button, Card, Input)
├── Set up Reanimated for animations
└── Deliverable: Component library

Module 1.3: Authentication
├── Integrate Supabase auth
├── Build sign-in/sign-up screens
├── Implement auth persistence
├── Create protected routes
└── Deliverable: Working auth flow
```

### Phase 2: Core Features (Week 2-3)
```
Module 2.1: Home Feed
├── Build feed screen with infinite scroll
├── Create PostCard component
├── Implement pull-to-refresh
├── Add post interactions (like, reply, share)
└── Deliverable: Scrollable feed

Module 2.2: Arcades
├── Build arcade list/grid view
├── Create arcade detail screen
├── Implement join/leave functionality
├── Build member list component
└── Deliverable: Arcade browsing

Module 2.3: Post Creation
├── Build compose bottom sheet
├── Implement text input with mentions
├── Add arcade selector
├── Create post submission flow
└── Deliverable: Content creation
```

### Phase 3: AI Host (Week 3-4)
```
Module 3.1: Chat Interface
├── Build chat UI with bubbles
├── Implement streaming responses
├── Add typing indicators
├── Create message persistence
└── Deliverable: AI conversation

Module 3.2: Onboarding Flow
├── Build conversational onboarding
├── Create interest selection UI
├── Implement preference extraction
├── Build recommendation display
└── Deliverable: Personalized onboarding

Module 3.3: Recommendations
├── Build recommendation cards
├── Implement "why this arcade" explanations
├── Add one-tap join
├── Create recommendation refresh
└── Deliverable: AI-powered discovery
```

### Phase 4: Polish (Week 4-5)
```
Module 4.1: Animations
├── Add screen transitions
├── Implement gesture-based interactions
├── Create loading states
├── Add haptic feedback
└── Deliverable: Polished UX

Module 4.2: Notifications
├── Set up push notifications (Expo)
├── Build notification center
├── Implement deep linking
└── Deliverable: Engagement system

Module 4.3: Profile & Settings
├── Build profile view/edit
├── Create settings screen
├── Implement preference management
└── Deliverable: User management
```

---

## Development Commands

```bash
# iOS App Development
cd ios_app
npm start                    # Start Expo dev server
npm run ios                  # Run on iOS simulator
npm run ios:device          # Run on physical device
npm run build:ios           # Build for iOS

# Web (Existing)
cd central-square
npm run dev                 # Start Next.js dev
npm run build              # Production build
npm run db:seed            # Seed database

# Database
npx prisma studio          # Visual database browser
npx prisma migrate dev     # Run migrations
npx prisma generate        # Generate client
```

---

## Language & Terminology

### Use These Terms
- **Members** (not users)
- **Arcades** (not groups/communities)
- **The Square** (not feed/timeline)
- **Host** (not admin/moderator)
- **AI Host** (not chatbot/assistant)
- **Lantern** (not pin/highlight)

### Tone
- Professional but warm
- Human, not corporate
- Encouraging civic engagement
- Community-first language

---

## Key Decisions (Locked)

1. **B2B2C Model** - Community builders pay, not individual users
2. **Arcades as core unit** - All activity happens within Arcades
3. **Sponsorship marketplace** - Revenue through facilitation, not ads
4. **AI Host for discovery** - Personalized, not algorithmic
5. **Dark theme** - With warm amber accents
6. **React Native + Expo** - Cross-platform with native feel
7. **Shared backend** - iOS uses same API as web

---

## Current Traction

- **Adobe** (2.4M members) - Pilot discussions
- **Aspen Institute Spain** - Pilot customer
- **Wakelet** - Pilot customer
- **Aspen Institute UK** - In conversation

---

## Team

- **Teijas (CEO)** - Product, execution, customer relationships
- **William Powers (Co-founder/Advisor)** - Vision, institutional partnerships

---

## When Building Features, Ask:

1. "Is this solving for the community builder or the community member?"
2. "Does this feel human and warm, not corporate?"
3. "Are we using community-first language?"
4. "Does this work within an Arcade context?"
5. "Is the AI Host adding genuine value here?"

---

## File References

| Purpose | Web Location | iOS Equivalent |
|---------|-------------|----------------|
| Feed | `components/feed-square.tsx` | `app/(tabs)/index.tsx` |
| Arcade Home | `components/arcade-home-page.tsx` | `app/arcade/[id]/index.tsx` |
| AI Host | `components/ai-host-page.tsx` | `app/ai-host.tsx` |
| Post Card | `components/post-card.tsx` | `components/post/PostCard.tsx` |
| Compose | `components/compose.tsx` | `components/post/ComposeSheet.tsx` |
| Profile | `components/ProfilePage.tsx` | `app/(tabs)/profile.tsx` |
| Discovery | `app/(app)/discover/page.tsx` | `app/(tabs)/discover.tsx` |
