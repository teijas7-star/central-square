# MVP Flow Review & Integration Checklist

## Current State Analysis

### ✅ Components Created
1. **CityHome** - City landing page (✅ integrated in `/`)
2. **GlobalAgora** - Global Agora page (❌ needs route)
3. **GlobalArcadesPage** - Global arcades directory (❌ needs route)
4. **LocalArcadePage** - Local arcade public view (❌ needs route)
5. **MemberArcadeJourney** - Member view inside arcade (❌ needs integration)
6. **HostDashboard** - Host dashboard (❌ needs route)
7. **ArcadeHomePage** - Current arcade home (✅ integrated, but should switch based on role)

### ✅ Routes Working
- `/` - City Home (CityHome component)
- `/signin` - Sign in (FigmaLoginFrame)
- `/square` - Public Square feed
- `/discover` - Discover arcades
- `/arcades/create` - Create arcade
- `/arcades/[id]` - Arcade page (uses ArcadeHomePage - needs role-based switching)

### 🔄 Missing Integrations

1. **Arcade Page Role-Based Switching**
   - Currently always shows `ArcadeHomePage` (host view)
   - Should show `MemberArcadeJourney` for members
   - Should show `LocalArcadePage` for non-members
   - Should show `HostDashboard` for hosts (or use dashboard route)

2. **Missing Routes**
   - `/global` - Global Agora page
   - `/global/arcades` - Global arcades page
   - `/arcades/[id]/dashboard` - Host dashboard
   - `/arcades/[id]/members` - Members page (partially exists)

3. **Navigation Links**
   - CityHome → Global Agora link
   - Global Agora → Global Arcades link
   - Navigation should include proper links

## Flow Issues to Fix

### 1. Authentication Flow
- ✅ Magic link sign-in works
- ✅ Redirects to `/dashboard` or `/profile/create`
- ⚠️ Need to verify profile creation redirects properly

### 2. Arcade Access Flow
- ⚠️ Need to check if joining arcade redirects correctly
- ⚠️ Need role-based view switching on arcade page

### 3. Navigation Flow
- ⚠️ Global routes not accessible
- ⚠️ Host dashboard not accessible

## Recommended Fixes

1. **Update Arcade Page** to detect user role and show appropriate component
2. **Create missing routes** for Global pages
3. **Add navigation links** between pages
4. **Test end-to-end flow**

