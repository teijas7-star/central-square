# Central Square iOS App - Modular Task Execution Specs

## Overview

This document outlines the modular development approach for the Central Square iOS app. Each module is self-contained with clear specs, deliverables, and acceptance criteria.

---

## Phase 1: Foundation (Week 1)

### Module 1.1: Project Setup ✅ COMPLETE

**Objective:** Create the base Expo project with all necessary configurations

**Tasks:**
- [x] Initialize Expo project with TypeScript
- [x] Configure NativeWind (Tailwind for React Native)
- [x] Set up Expo Router for navigation
- [x] Configure environment variables structure
- [x] Create folder structure (app, components, hooks, services, stores, constants)

**Deliverables:**
- `package.json` with all dependencies
- `app.json` with Expo configuration
- `tailwind.config.js` for NativeWind
- `tsconfig.json` with path aliases
- Working folder structure

**Acceptance Criteria:**
- [ ] `npm start` launches Expo dev server
- [ ] App loads without errors on iOS simulator
- [ ] NativeWind classes work on components

---

### Module 1.2: Design System

**Objective:** Implement the Central Square design system for React Native

**Tasks:**
- [x] Define color constants (dark theme + amber accent)
- [x] Create typography scale (serif headlines, sans-serif body)
- [x] Define spacing system
- [ ] Build base UI components

**Components to Build:**
```typescript
// Priority 1 - Core
components/ui/Button.tsx       // Primary, secondary, ghost variants
components/ui/Card.tsx         // Surface container with border
components/ui/Avatar.tsx       // User avatar with fallback
components/ui/Input.tsx        // Text input with validation states
components/ui/Badge.tsx        // Tags and status indicators

// Priority 2 - Layout
components/layout/Header.tsx   // Screen header with actions
components/layout/TabBar.tsx   // Custom tab bar (already in _layout)
components/layout/SafeArea.tsx // Safe area wrapper

// Priority 3 - Feedback
components/ui/Skeleton.tsx     // Loading skeleton
components/ui/Toast.tsx        // Toast notifications
components/ui/Modal.tsx        // Modal wrapper
```

**Deliverables:**
- Complete `constants/` folder with colors, typography, spacing
- Base UI component library
- Storybook-like preview screen (optional)

**Acceptance Criteria:**
- [ ] All components use design tokens from constants
- [ ] Components support dark mode by default
- [ ] Haptic feedback on interactive components
- [ ] Animations are smooth (60fps)

---

### Module 1.3: Authentication

**Objective:** Implement Supabase magic link authentication

**Tasks:**
- [x] Set up Supabase client for React Native
- [x] Create auth store with Zustand
- [x] Build welcome screen
- [x] Build sign-in screen
- [x] Build OTP verification screen
- [ ] Implement session persistence
- [ ] Add protected route handling

**Files:**
```
stores/authStore.ts           ✅ Complete
app/(auth)/welcome.tsx        ✅ Complete
app/(auth)/signin.tsx         ✅ Complete
app/(auth)/verify.tsx         ✅ Complete
app/(auth)/onboarding.tsx     🔲 TODO
```

**Deliverables:**
- Working magic link sign-in flow
- Persistent sessions across app restarts
- Protected route redirects

**Acceptance Criteria:**
- [ ] User can sign in with email magic link
- [ ] Session persists after app close/reopen
- [ ] Unauthenticated users redirect to welcome
- [ ] Sign out clears all stored data

---

## Phase 2: Core Features (Week 2-3)

### Module 2.1: Home Feed

**Objective:** Display scrollable feed of posts from The Square

**Tasks:**
- [x] Create posts hook with React Query
- [x] Build PostCard component
- [x] Implement Home tab screen
- [ ] Add pull-to-refresh
- [ ] Implement infinite scroll pagination
- [ ] Add optimistic updates for interactions

**API Integration:**
```typescript
GET /api/feed/square           // Global feed
GET /api/posts?arcadeId=X      // Arcade-specific feed

Response: {
  posts: Post[],
  pagination: { page, total, hasMore }
}
```

**Deliverables:**
- Scrollable feed with PostCard components
- Pull-to-refresh functionality
- Loading states and skeletons
- Empty state for no posts

**Acceptance Criteria:**
- [ ] Feed loads within 2 seconds
- [ ] Pull-to-refresh works smoothly
- [ ] Infinite scroll loads next page
- [ ] Post interactions have haptic feedback

---

### Module 2.2: Arcades

**Objective:** Browse and view community Arcades

**Tasks:**
- [x] Create arcades hook
- [x] Build ArcadeCard component
- [x] Implement Discover tab with search/filter
- [ ] Build arcade detail screen
- [ ] Implement join/leave functionality
- [ ] Add member list view

**Screens to Build:**
```
app/(tabs)/discover.tsx       ✅ Complete
app/arcade/[id]/index.tsx     🔲 TODO - Arcade home
app/arcade/[id]/feed.tsx      🔲 TODO - Arcade feed
app/arcade/[id]/members.tsx   🔲 TODO - Member list
app/arcade/[id]/events.tsx    🔲 TODO - Events list
```

**Deliverables:**
- Searchable arcade list
- Category filtering
- Arcade detail with tabs
- Join/leave with confirmation

**Acceptance Criteria:**
- [ ] Search filters arcade list in real-time
- [ ] Category chips filter correctly
- [ ] Join button updates optimistically
- [ ] Member list shows with pagination

---

### Module 2.3: Post Creation

**Objective:** Allow users to create and publish posts

**Tasks:**
- [x] Build Create tab screen
- [x] Implement character counter
- [ ] Add arcade selector bottom sheet
- [ ] Implement image/link attachments
- [ ] Add @mention autocomplete

**Deliverables:**
- Full-featured compose screen
- Arcade selection
- Media attachments (Phase 2)
- Successful post → navigate to post

**Acceptance Criteria:**
- [ ] Character limit enforced (2000)
- [ ] Post publishes successfully
- [ ] Arcade selector shows joined arcades
- [ ] Success haptic + navigation on post

---

## Phase 3: AI Host Integration (Week 3-4)

### Module 3.1: Chat Interface

**Objective:** Conversational AI Host experience

**Tasks:**
- [x] Build AI Host screen
- [x] Create chat bubble components
- [x] Implement message sending
- [ ] Add typing indicator
- [ ] Implement message streaming (if supported)
- [ ] Add conversation persistence

**API Integration:**
```typescript
GET /api/ai-host/chat          // Get conversation history
POST /api/ai-host/chat         // Send message

Request: { message: string }
Response: { response: string, aiHostId: string }
```

**Deliverables:**
- Chat interface with message bubbles
- Real-time message sending
- Conversation history

**Acceptance Criteria:**
- [ ] Messages appear instantly (optimistic)
- [ ] AI responses render correctly
- [ ] Scroll to bottom on new message
- [ ] Keyboard handling is smooth

---

### Module 3.2: Onboarding Flow

**Objective:** AI-guided onboarding for new users

**Tasks:**
- [ ] Create onboarding screen sequence
- [ ] Implement conversational interest gathering
- [ ] Build preference selection UI
- [ ] Connect to user preferences API

**Screens:**
```
app/(auth)/onboarding/index.tsx    // Start screen
app/(auth)/onboarding/interests.tsx // Interest selection
app/(auth)/onboarding/values.tsx    // Values selection
app/(auth)/onboarding/complete.tsx  // Success + recommendations
```

**Deliverables:**
- Multi-step onboarding flow
- Interest chips/selection
- AI conversation during onboarding
- Smooth transitions between steps

**Acceptance Criteria:**
- [ ] User can complete onboarding in < 2 min
- [ ] Preferences saved to backend
- [ ] Skip option available
- [ ] Can revisit from settings

---

### Module 3.3: Recommendations

**Objective:** Display AI-powered arcade recommendations

**Tasks:**
- [x] Fetch recommendations from API
- [x] Display recommendation cards in AI Host
- [ ] Add "Why this arcade" explanation
- [ ] Implement one-tap join
- [ ] Track recommendation interactions

**API Integration:**
```typescript
GET /api/ai-host/recommendations

Response: {
  recommendations: [{
    arcadeId: string,
    reason: string,
    confidence: number,
    arcade: Arcade
  }]
}
```

**Deliverables:**
- Recommendation cards with match percentage
- Explanation of why recommended
- Quick join button
- Refresh recommendations

**Acceptance Criteria:**
- [ ] Recommendations update after conversations
- [ ] Match percentage displayed
- [ ] Reason is clear and helpful
- [ ] Joining from card works

---

## Phase 4: Polish & Launch (Week 4-5)

### Module 4.1: Animations & Interactions

**Tasks:**
- [ ] Add screen transition animations
- [ ] Implement gesture-based interactions (swipe to reply)
- [ ] Add loading state animations
- [ ] Polish haptic feedback patterns

**Deliverables:**
- Smooth 60fps animations
- Consistent haptic patterns
- Delightful micro-interactions

---

### Module 4.2: Push Notifications

**Tasks:**
- [ ] Set up Expo Notifications
- [ ] Implement notification handling
- [ ] Build notification center UI
- [ ] Add deep linking from notifications

**Deliverables:**
- Working push notifications
- Notification center in Activity tab
- Deep links to posts/arcades

---

### Module 4.3: Profile & Settings

**Tasks:**
- [x] Build profile view
- [ ] Implement profile editing
- [ ] Build settings screen
- [ ] Add preference management
- [ ] Implement account deletion flow

**Deliverables:**
- Complete profile management
- Settings with all options
- Account safety features

---

## Development Commands

```bash
# Start development
cd ios_app
npm start                    # Start Expo dev server

# Run on iOS
npm run ios                  # iOS Simulator
npm run ios:device          # Physical device (requires Xcode)

# Type checking
npx tsc --noEmit            # Check TypeScript

# Linting
npm run lint                # Run ESLint

# Building
npm run build:preview       # Create preview build
npm run build:ios           # Production iOS build
```

---

## Environment Variables

Create `.env` file in `ios_app/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Testing Checklist

Before marking a module complete:

- [ ] All screens render without errors
- [ ] API calls work with real backend
- [ ] Loading states display correctly
- [ ] Error states handled gracefully
- [ ] Haptic feedback on all interactions
- [ ] Works on iOS 15+ devices
- [ ] No console warnings/errors
- [ ] TypeScript has no errors

---

## File Naming Conventions

```
Screens:      PascalCase.tsx or lowercase.tsx (Expo Router)
Components:   PascalCase.tsx
Hooks:        useCamelCase.ts
Services:     camelCase.ts
Stores:       camelCaseStore.ts
Constants:    camelCase.ts
Utils:        camelCase.ts
```

---

## Progress Tracking

| Module | Status | Completion |
|--------|--------|------------|
| 1.1 Project Setup | ✅ Complete | 100% |
| 1.2 Design System | 🟡 In Progress | 60% |
| 1.3 Authentication | 🟡 In Progress | 80% |
| 2.1 Home Feed | 🟡 In Progress | 70% |
| 2.2 Arcades | 🟡 In Progress | 50% |
| 2.3 Post Creation | 🟡 In Progress | 60% |
| 3.1 Chat Interface | ✅ Complete | 100% |
| 3.2 Onboarding Flow | 🔲 Not Started | 0% |
| 3.3 Recommendations | 🟡 In Progress | 70% |
| 4.1 Animations | 🔲 Not Started | 0% |
| 4.2 Notifications | 🔲 Not Started | 0% |
| 4.3 Profile/Settings | 🟡 In Progress | 40% |

**Overall Progress: ~55%**
