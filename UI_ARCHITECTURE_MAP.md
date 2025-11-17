 Central Square Platform - UI Architecture Map

**Last Updated:** 2025-01-XX  
**Framework:** Next.js 16 (App Router) + React 18 + TypeScript

---

## 📋 Table of Contents

1. [Route Structure](#route-structure)
2. [Component Hierarchy](#component-hierarchy)
3. [Component Connections](#component-connections)
4. [Data Flow](#data-flow)
5. [Authentication Flow](#authentication-flow)
6. [Layout Structure](#layout-structure)

---

## 🗺️ Route Structure

### Root Layout
```
app/
├── layout.tsx (Root layout - wraps all pages)
├── page.tsx (Home page - renders CityHome)
└── globals.css (Global styles)
```

### Public Routes (No Auth Required)
```
app/
├── (public)/
│   └── square/
│       └── page.tsx (Legacy public square)
└── debug/
    └── page.tsx (Debug/testing page)
```

### Authentication Routes
```
app/
└── (auth)/
    ├── layout.tsx (Auth layout wrapper)
    └── signin/
        └── page.tsx → uses figma-login-frame.tsx
```

### Authenticated App Routes
```
app/
└── (app)/
    ├── [city]/
    │   └── feed/
    │       └── page.tsx → uses CityFeed (figma/CityFeed.tsx)
    │
    ├── square/
    │   └── page.tsx → uses Compose, PostCard, Nav
    │
    ├── dashboard/
    │   └── page.tsx → uses Nav, ArcadeCard
    │
    ├── discover/
    │   └── page.tsx → standalone component (discover page)
    │
    ├── global/
    │   ├── page.tsx → uses GlobalAgora.tsx
    │   └── arcades/
    │       └── page.tsx → uses GlobalArcadesPage.tsx
    │
    ├── global-agora/
    │   └── feed/
    │       └── page.tsx → uses GlobalFeed (figma/GlobalFeed.tsx)
    │
    ├── arcades/
    │   ├── create/
    │   │   └── page.tsx → uses CreateArcadeForm
    │   │
    │   └── [id]/
    │       ├── page.tsx → role-based rendering:
    │       │   ├── Host → ArcadeHomePage
    │       │   ├── Member → MemberArcadeJourney
    │       │   └── Non-member → LocalArcadePage
    │       │
    │       ├── dashboard/
    │       │   └── page.tsx → uses HostDashboard
    │       │
    │       ├── events/
    │       │   └── page.tsx → standalone events page
    │       │
    │       └── settings/
    │           └── page.tsx → settings page
    │
    ├── profile/
    │   └── create/
    │       └── page.tsx → uses ProfileSetup
    │
    ├── ai-host/
    │   ├── page.tsx → uses AIHostChat
    │   └── recommendations/
    │       └── page.tsx → AI recommendations page
    │
    └── demo/
        └── arcade/
            └── [id]/
                └── page.tsx → uses ArcadeHomePage (demo mode)
```

---

## 🏗️ Component Hierarchy

### Layout Components
```
layout/
└── nav.tsx
    ├── Links to: /square, /dashboard, /discover, /global, /ai-host, /arcades/create
    └── Conditionally renders based on auth state
```

### Page-Level Components

#### Landing & City Pages
```
CityHome.tsx
├── Links to: /discover, /arcades/create, /global, /[city]/feed
├── Links to: /arcades/[id] (arcade cards)
└── Uses: Image (Next.js), Link components

landing-page-new.tsx (Optional/Alternative landing)
├── Uses: Compose, PostCard
└── Links to: /signin, /square
```

#### Arcade Components
```
ArcadeHomePage.tsx (Host view)
├── Uses: Compose, PostCard
├── Tabs: Posts, Events, Media, Members
├── Sidebars: Events sidebar, Members sidebar (AI Host panel)
└── Links to: /arcades/[id]/events, /arcades/[id]/members

MemberArcadeJourney.tsx (Member view)
├── Uses: Compose, PostCard
├── Sidebars: User profile, My Arcades, Upcoming Events
├── Tabs: Feed, Events, People, Collaborations
└── Links to: /arcades/[id], /events

LocalArcadePage.tsx (Non-member public view)
├── Displays: Arcade info, stats, upcoming events, recent posts
└── Links to: /arcades/[id]/join

HostDashboard.tsx
├── Sidebar navigation: Overview, Events, Members, Feed, Collaborations, Insights, Settings
├── Main: Stats cards, Location card, Recent Activity, Upcoming Events, Active Members
└── Links to: /arcades/[id]/dashboard, /arcades/[id]/events, /arcades/[id]/settings
```

#### Global Pages
```
GlobalAgora.tsx
├── Links to: /global-agora/feed, /global/arcades, /discover
├── Sections: Global Highlights, Global Arcades Directory, Across the Cities, Global Voices
└── Uses: Image, Link components

GlobalArcadesPage.tsx
├── Displays: Global arcade organizations
└── Links to: /arcades/[id]

GlobalFeed.tsx (figma/GlobalFeed.tsx)
└── Content-only component (no page wrappers)

CityFeed.tsx (figma/CityFeed.tsx)
└── Content-only component (no page wrappers)
```

#### Feed Components
```
feed-square.tsx (Legacy)
└── Uses: PostCard

CityFeed.tsx (figma/CityFeed.tsx)
├── Compose section
├── Feed posts (with PostCard equivalent)
└── Sidebar: Upcoming Events, Arcade Highlights, Local Leaders

GlobalFeed.tsx (figma/GlobalFeed.tsx)
├── Compose section
├── Feed posts
└── Sidebar: Trending Conversations, From the Arcades, Cities Active Now
```

#### Form Components
```
create-arcade-form.tsx
├── Form fields: name, description, tags, visibility
└── POSTs to: /api/arcades

profile-setup.tsx
├── Form fields: name, handle, bio, location
└── POSTs to: /api/profiles

compose.tsx
├── Textarea for post body
├── Optional: arcadeId selection
└── POSTs to: /api/posts
```

#### Card Components
```
post-card.tsx
├── Displays: Author, body, timestamp, arcade badge
├── Uses: ReplyButton, PostActions
└── Links to: /arcades/[id] (if arcade exists)

arcade-card.tsx
├── Displays: Arcade name, description, member count, host
└── Links to: /arcades/[id]

reply-button.tsx
└── Opens reply modal/form

post-actions.tsx
├── Promote to Lantern (host only)
└── Soft Delete (host only)
```

#### Auth Components
```
figma-login-frame.tsx
├── Magic link form
└── POSTs to: /api/auth/magic-link
```

#### AI Components
```
ai-host-chat.tsx
├── Chat interface
└── POSTs to: /api/ai-host/chat
```

#### Utility Components
```
error-boundary.tsx
└── Error handling wrapper

report-dialog.tsx
├── Report form modal
└── POSTs to: /api/reports
```

---

## 🔗 Component Connections

### Navigation Flow

```
Landing Flow:
/ → CityHome → /discover → /arcades/[id]
            → /arcades/create
            → /global
            → /[city]/feed

Authentication Flow:
/ → /signin → /profile/create → /dashboard

Arcade Flow:
/dashboard → /arcades/[id]
/discover → /arcades/[id]

Arcade Role-Based Views:
/arcades/[id] → Host: ArcadeHomePage
             → Member: MemberArcadeJourney
             → Non-member: LocalArcadePage

Global Flow:
/global → /global-agora/feed
       → /global/arcades
```

### Component Import Dependencies

```
Nav Component:
├── Used in: /square, /dashboard, /discover, /global-agora/feed, /[city]/feed
└── Conditionally renders based on auth state

Compose Component:
├── Used in: /square, ArcadeHomePage, MemberArcadeJourney
├── Uses: /api/posts (POST)
└── Triggers: PostCard refresh

PostCard Component:
├── Used in: /square, ArcadeHomePage, MemberArcadeJourney, feed-square
├── Uses: ReplyButton, PostActions
└── Links to: /arcades/[id] (if arcade exists)

ArcadeCard Component:
├── Used in: /dashboard, /discover
└── Links to: /arcades/[id]
```

### Data Flow

```
API Routes → Components:

/api/feed/square → /square page → PostCard components
/api/arcades → /discover page → ArcadeCard components
/api/arcades/[id] → /arcades/[id] page → Role-based component
/api/posts → Compose component → Creates posts
/api/profiles → Nav component → Checks auth state
/api/auth/magic-link → figma-login-frame → Auth flow
```

---

## 🔐 Authentication Flow

```
Unauthenticated User:
/ → CityHome (no Nav)
  → /signin → figma-login-frame → Magic link → Callback → /profile/create

Authenticated User (no profile):
/dashboard → redirects to /profile/create

Authenticated User (with profile):
/ → CityHome (with Nav)
  → /dashboard → Shows arcades
  → /discover → Browse arcades
  → /square → Public feed with compose
  → /arcades/[id] → Role-based view
```

### Auth State Management

```
Nav Component:
├── Fetches: /api/profiles
├── Conditionally renders links based on auth
└── Handles: Sign out → /api/auth/signout

Route Protection:
├── Server-side: Uses sbServer() → getUser()
├── Redirects: Unauthenticated → /signin
└── Redirects: No profile → /profile/create
```

---

## 📐 Layout Structure

### Root Layout (`app/layout.tsx`)
```
<html>
  <body>
    {children} (No global Nav - each page handles its own)
  </body>
</html>
```

### Auth Layout (`app/(auth)/layout.tsx`)
```
{children} (No wrapper - just passes through)
```

### Page Layouts

**Public Pages:**
- `/` → CityHome (has its own header)
- `/square` → Conditional Nav (if authenticated)

**Authenticated Pages:**
- Most pages: Include `<Nav />` at top
- Layout structure: `<Nav />` → `<main>` → Content

**Arcade Pages:**
- Role-based rendering
- Host: Full dashboard UI
- Member: Member journey UI
- Non-member: Public arcade view

---

## 🎨 Component Categories

### **Page Components** (Full Pages)
- `CityHome.tsx`
- `GlobalAgora.tsx`
- `GlobalArcadesPage.tsx`
- `ArcadeHomePage.tsx`
- `MemberArcadeJourney.tsx`
- `LocalArcadePage.tsx`
- `HostDashboard.tsx`
- `landing-page-new.tsx`

### **Feed Components** (Content Only)
- `figma/GlobalFeed.tsx` (content-only)
- `figma/CityFeed.tsx` (content-only)
- `feed-square.tsx` (legacy)

### **Form Components**
- `create-arcade-form.tsx`
- `profile-setup.tsx`
- `compose.tsx`
- `figma-login-frame.tsx`

### **Card Components**
- `post-card.tsx`
- `arcade-card.tsx`

### **Action Components**
- `reply-button.tsx`
- `post-actions.tsx`

### **Layout Components**
- `layout/nav.tsx`

### **Utility Components**
- `error-boundary.tsx`
- `report-dialog.tsx`
- `ai-host-chat.tsx`

---

## 🔄 Data Flow Patterns

### **Server Components → Client Components**
```
Route (Server) → Component (Client)
/app/page.tsx → CityHome (client)
/app/(app)/arcades/[id]/page.tsx → ArcadeHomePage (client)
```

### **Client Components → API Routes**
```
Compose → POST /api/posts
CreateArcadeForm → POST /api/arcades
ProfileSetup → POST /api/profiles
Nav → GET /api/profiles
```

### **Component State Flow**
```
Compose → handlePost() → router.refresh() → PostCard updates
Nav → fetch /api/profiles → setUser() → conditional rendering
```

---

## 📍 Key Routes Summary

| Route | Component | Auth Required | Layout |
|-------|-----------|---------------|--------|
| `/` | CityHome | No | Custom header |
| `/signin` | figma-login-frame | No | Auth layout |
| `/square` | SquarePage | No (conditional features) | Conditional Nav |
| `/dashboard` | DashboardPage | Yes | Nav |
| `/discover` | DiscoverPage | No | Nav |
| `/global` | GlobalAgora | No | Nav |
| `/global-agora/feed` | GlobalFeed | No | Nav |
| `/[city]/feed` | CityFeed | No | Nav |
| `/arcades/create` | CreateArcadeForm | Yes | Nav |
| `/arcades/[id]` | Role-based | No (public view) | Role-based |
| `/arcades/[id]/dashboard` | HostDashboard | Yes (host) | Nav |
| `/arcades/[id]/events` | EventsPage | No | Nav |
| `/profile/create` | ProfileSetup | Yes | Nav |

---

## 🎯 Component Usage Matrix

| Component | Used In | Purpose |
|-----------|---------|---------|
| `Nav` | Most authenticated pages | Global navigation |
| `Compose` | Square, Arcade pages | Post creation |
| `PostCard` | Feeds, Arcade pages | Display posts |
| `ArcadeCard` | Dashboard, Discover | Display arcades |
| `CityHome` | Home page | City landing |
| `GlobalAgora` | Global page | Global landing |
| `ArcadeHomePage` | Arcade page (host) | Host dashboard |
| `MemberArcadeJourney` | Arcade page (member) | Member view |
| `LocalArcadePage` | Arcade page (public) | Public view |
| `HostDashboard` | Arcade dashboard | Host management |
| `CreateArcadeForm` | Create arcade page | Arcade creation |
| `ProfileSetup` | Profile creation | Profile setup |
| `GlobalFeed` | Global feed page | Global feed content |
| `CityFeed` | City feed page | City feed content |

---

## 🔍 Quick Reference: Component → Route Mapping

```
CityHome → /
figma-login-frame → /signin
ProfileSetup → /profile/create
SquarePage → /square
DashboardPage → /dashboard
DiscoverPage → /discover
GlobalAgora → /global
GlobalArcadesPage → /global/arcades
GlobalFeed → /global-agora/feed
CityFeed → /[city]/feed
CreateArcadeForm → /arcades/create
ArcadeHomePage → /arcades/[id] (host)
MemberArcadeJourney → /arcades/[id] (member)
LocalArcadePage → /arcades/[id] (public)
HostDashboard → /arcades/[id]/dashboard
EventsPage → /arcades/[id]/events
AIHostChat → /ai-host
```

---

## 📝 Notes

1. **Role-Based Rendering**: `/arcades/[id]` uses server-side role checking to render different components
2. **Content-Only Components**: `GlobalFeed` and `CityFeed` are content-only (no page wrappers) - they're wrapped by their route pages
3. **Conditional Navigation**: `/square` conditionally shows Nav based on auth state
4. **Layout Flexibility**: Most pages include Nav manually, not through a shared layout
5. **Figma Components**: Components in `components/figma/` are design-system aligned components from Figma designs

---

## 🚀 Future Architecture Considerations

1. **Shared Layout**: Consider creating `app/(app)/layout.tsx` to wrap all authenticated routes with Nav
2. **Component Organization**: Consider organizing by feature (e.g., `components/arcades/`, `components/feeds/`)
3. **Route Groups**: Leverage Next.js route groups for better organization
4. **Loading States**: Add consistent loading UI patterns
5. **Error Boundaries**: Expand error boundary usage across routes

---

**End of Architecture Map**

