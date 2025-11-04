# Central Square Platform - Visual Component Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ROOT LAYOUT                                    │
│                        (app/layout.tsx)                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
            ┌───────▼───────┐  ┌──────▼──────┐  ┌──────▼──────┐
            │   PUBLIC      │  │    AUTH     │  │     APP     │
            │   ROUTES      │  │   ROUTES    │  │   ROUTES    │
            └───────────────┘  └─────────────┘  └─────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
            ┌───────▼───────┐  ┌──────▼──────┐  ┌──────▼──────┐
            │               │  │              │  │              │
            │   /           │  │  /signin     │  │  /square    │
            │   CityHome    │  │  LoginFrame  │  │  SquarePage │
            │               │  │              │  │              │
            │  Links to:    │  │  Redirects: │  │  Uses:       │
            │  • /discover  │  │  • /profile  │  │  • Nav       │
            │  • /arcades   │  │    /create  │  │  • Compose   │
            │  • /global    │  │  • /dashboard│  │  • PostCard  │
            │  • /[city]/   │  │              │  │              │
            │    feed       │  │              │  │              │
            └───────────────┘  └──────────────┘  └──────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                          AUTHENTICATED ROUTES                            │
└──────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│  /dashboard │
│  Dashboard  │
│  Page       │
└──────┬──────┘
       │
       ├──► Uses: Nav
       ├──► Uses: ArcadeCard
       └──► Links: /arcades/[id]


┌─────────────┐
│  /discover  │
│  Discover   │
│  Page       │
└──────┬──────┘
       │
       ├──► Uses: Nav
       ├──► Uses: ArcadeCard
       └──► Links: /arcades/[id]


┌─────────────┐
│  /global    │
│  GlobalAgora│
└──────┬──────┘
       │
       ├──► Links: /global-agora/feed
       ├──► Links: /global/arcades
       └──► Links: /discover


┌──────────────────┐
│  /global-agora/  │
│  feed            │
│  GlobalFeed      │
└──────┬───────────┘
       │
       ├──► Uses: Nav
       └──► Content-only component


┌─────────────┐
│  /[city]/feed│
│  CityFeed    │
└──────┬───────┘
       │
       ├──► Uses: Nav
       └──► Content-only component


┌──────────────────┐
│  /arcades/create │
│  CreateArcadeForm│
└──────┬───────────┘
       │
       ├──► Uses: Nav
       └──► POSTs: /api/arcades


┌─────────────────────────────────────────────────────────────────────────┐
│                    ARCADE ROUTES (Role-Based)                            │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│  /arcades/[id]       │
│  (Server Route)      │
└──────┬───────────────┘
       │
       ├──► Checks: User role
       │
       ├──► HOST
       │    └──► Renders: ArcadeHomePage
       │         ├── Uses: Compose
       │         ├── Uses: PostCard
       │         ├── Tabs: Posts, Events, Media, Members
       │         └── Links: /arcades/[id]/dashboard
       │
       ├──► MEMBER
       │    └──► Renders: MemberArcadeJourney
       │         ├── Uses: Compose
       │         ├── Uses: PostCard
       │         ├── Tabs: Feed, Events, People, Collaborations
       │         └── Sidebars: Profile, My Arcades, Events
       │
       └──► NON-MEMBER
            └──► Renders: LocalArcadePage
                 ├── Shows: Arcade info, stats, events
                 └── Links: /arcades/[id]/join


┌──────────────────────┐
│  /arcades/[id]/      │
│  dashboard           │
│  HostDashboard       │
└──────┬───────────────┘
       │
       ├──► Uses: Nav
       ├──► Sidebar: Navigation
       ├──► Main: Stats, Activity, Events, Members
       └──► Links: /arcades/[id]/events, /arcades/[id]/settings


┌──────────────────────┐
│  /arcades/[id]/      │
│  events              │
│  EventsPage          │
└──────┬───────────────┘
       │
       ├──► Uses: Nav
       └──► Displays: Events list


┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT DEPENDENCIES                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│     Nav     │
└──────┬──────┘
       │
       ├──► Used in: Most authenticated pages
       ├──► Fetches: /api/profiles
       └──► Conditionally renders links


┌─────────────┐
│   Compose   │
└──────┬──────┘
       │
       ├──► Used in: /square, ArcadeHomePage, MemberArcadeJourney
       ├──► POSTs: /api/posts
       └──► Triggers: Refresh


┌─────────────┐
│  PostCard   │
└──────┬──────┘
       │
       ├──► Used in: /square, ArcadeHomePage, MemberArcadeJourney, feeds
       ├──► Uses: ReplyButton
       ├──► Uses: PostActions
       └──► Links: /arcades/[id]


┌─────────────┐
│ ArcadeCard  │
└──────┬──────┘
       │
       ├──► Used in: /dashboard, /discover
       └──► Links: /arcades/[id]


┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA FLOW                                      │
└─────────────────────────────────────────────────────────────────────────┘

USER ACTION → COMPONENT → API ROUTE → DATABASE → RESPONSE → COMPONENT UPDATE

Example Flow:
1. User types in Compose → handlePost()
2. POST /api/posts → Prisma → Create post
3. Response → router.refresh()
4. PostCard components re-render with new post


┌─────────────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

UNAUTHENTICATED:
/ → CityHome (no Nav) → /signin → LoginFrame → Magic Link → 
Callback → /profile/create → ProfileSetup → /dashboard

AUTHENTICATED (no profile):
/dashboard → Redirect → /profile/create

AUTHENTICATED (with profile):
/ → CityHome (with Nav) → Full access to all routes


┌─────────────────────────────────────────────────────────────────────────┐
│                      KEY NAVIGATION PATHS                                │
└─────────────────────────────────────────────────────────────────────────┘

LANDING → DISCOVER → ARCADE:
/ → CityHome → /discover → /arcades/[id]

CREATE FLOW:
/ → /signin → /profile/create → /dashboard → /arcades/create

GLOBAL EXPLORATION:
/ → /global → /global-agora/feed
          → /global/arcades

CITY FEED:
/ → CityHome → /[city]/feed

ARCADE MANAGEMENT:
/dashboard → /arcades/[id] → /arcades/[id]/dashboard
                        → /arcades/[id]/events
                        → /arcades/[id]/settings
```

