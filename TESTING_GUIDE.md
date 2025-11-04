# Testing Guide - Route Groups & Redirects

## Prerequisites

1. **Start the development server:**
   ```bash
   cd central-square
   npm run dev
   ```

2. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Open browser DevTools (F12) to check Network tab for redirects

---

## Test Checklist

### ✅ 1. Root Redirect (/)

**Test:** Visit `http://localhost:3000`

**Expected Behavior:**
- If **not signed in** → Shows public landing page (city chooser)
- If **signed in** with `profile.city` set → Redirects to `/${city}` (e.g., `/boston`)
- If **signed in** without `profile.city` → Shows public landing page

**How to verify:**
- Check URL in address bar after redirect
- Check Network tab for 301 redirect status (if redirect occurred)

---

### ✅ 2. Global Routes (/agora and /agora/feed)

**Test A:** Visit `http://localhost:3000/agora`

**Expected:**
- ✅ Shows Global Agora page (GlobalAgora component)
- ✅ Nav appears **once** at the top
- ✅ No duplicate Nav components
- ✅ Links work correctly

**How to verify:**
- Check page content matches GlobalAgora design
- Inspect DOM: Only one `<nav>` element should exist
- Check that "Explore Global Conversations" link points to `/agora/feed`

**Test B:** Visit `http://localhost:3000/agora/feed`

**Expected:**
- ✅ Shows Global Feed page (GlobalFeed component)
- ✅ Nav appears **once** at the top
- ✅ Page title: "Global Agora Feed"

**How to verify:**
- Check page content shows feed
- Inspect DOM: Only one `<nav>` element should exist

---

### ✅ 3. City Routes (/boston and /boston/feed)

**Test A:** Visit `http://localhost:3000/boston`

**Expected:**
- ✅ Shows City Home page (CityHome component)
- ✅ Nav appears **once** at the top
- ✅ City name appears in content
- ✅ Links work correctly

**How to verify:**
- Check page shows city-specific content
- Inspect DOM: Only one `<nav>` element should exist
- Check that "Join Your City's Square" button links to `/boston/feed`

**Test B:** Visit `http://localhost:3000/boston/feed`

**Expected:**
- ✅ Shows City Feed page (CityFeed component)
- ✅ Nav appears **once** at the top
- ✅ Page title: "Boston Feed" (or city name)

**How to verify:**
- Check page shows city feed content
- Inspect DOM: Only one `<nav>` element should exist
- Try different cities: `/london`, `/new-york`, etc.

---

### ✅ 4. Arcade Routes (/arcades)

**Test A:** Visit `http://localhost:3000/arcades/create`

**Expected:**
- ✅ Shows Create Arcade form
- ✅ Nav appears **once** at the top
- ✅ Form works correctly

**Test B:** Visit `http://localhost:3000/arcades/[some-arcade-id]`

**Expected:**
- ✅ Shows arcade page with role-based rendering:
  - **Host** → ArcadeHomePage component
  - **Member** → MemberArcadeJourney component
  - **Non-member** → LocalArcadePage component
- ✅ Nav appears **once** at the top

**Test C:** Visit `http://localhost:3000/arcades/[id]/dashboard`

**Expected:**
- ✅ Shows Host Dashboard (only if you're the host)
- ✅ Nav appears **once** at the top

**Test D:** Visit `http://localhost:3000/arcades/[id]/events`

**Expected:**
- ✅ Shows Events page
- ✅ Nav appears **once** at the top
- ✅ Tab navigation works

**Test E:** Visit `http://localhost:3000/arcades/[id]/settings`

**Expected:**
- ✅ Shows Settings page (only if you're the host)
- ✅ Nav appears **once** at the top

**How to verify:**
- Check role-based rendering works correctly
- Inspect DOM: Only one `<nav>` element should exist per page
- Test navigation between arcade pages

---

### ✅ 5. Static Redirects (301)

**Test A:** Visit `http://localhost:3000/global`

**Expected:**
- ✅ **301 Permanent Redirect** to `/agora`
- ✅ URL changes to `/agora`
- ✅ Shows Global Agora page

**How to verify:**
- Open Network tab in DevTools
- Look for request to `/global` with status `301` or `308`
- Check final URL is `/agora`

**Test B:** Visit `http://localhost:3000/global-agora`

**Expected:**
- ✅ **301 Permanent Redirect** to `/agora`
- ✅ URL changes to `/agora`

**Test C:** Visit `http://localhost:3000/global-agora/feed`

**Expected:**
- ✅ **301 Permanent Redirect** to `/agora/feed`
- ✅ URL changes to `/agora/feed`

**How to verify:**
- Check Network tab for redirect status codes
- Verify final destination URLs

---

### ✅ 6. Dynamic Redirect (/square)

**Test:** Visit `http://localhost:3000/square`

**Expected Behavior:**
- If **signed in** with `profile.city` set → **301 Redirect** to `/${city}/feed` (e.g., `/boston/feed`)
- If **signed in** without `profile.city` → **301 Redirect** to `/` (city chooser)
- If **not signed in** → **301 Redirect** to `/` (city chooser)

**How to verify:**
- Check Network tab for redirect status `301`
- Verify final destination URL
- Test with different user states:
  1. Sign out → Visit `/square` → Should redirect to `/`
  2. Sign in (no city) → Visit `/square` → Should redirect to `/`
  3. Sign in (with city) → Visit `/square` → Should redirect to `/${city}/feed`

---

### ✅ 7. Nav Appears Once Per Group (No Duplicates)

**Manual Check:**

1. **Open DevTools Console:**
   ```javascript
   // Run this in browser console on any page
   document.querySelectorAll('nav').length
   ```

2. **Expected Result:** Should return `1` (or `0` if no Nav on public pages)

3. **Visual Check:**
   - Look at the page - there should be only **one navigation bar** at the top
   - No duplicate nav bars stacked vertically

**Test Pages:**
- `/agora` → Should have 1 Nav
- `/agora/feed` → Should have 1 Nav
- `/boston` → Should have 1 Nav
- `/boston/feed` → Should have 1 Nav
- `/arcades/[id]` → Should have 1 Nav
- `/arcades/[id]/events` → Should have 1 Nav
- `/` (public) → May have 0 Nav (if public pages don't show Nav)

---

### ✅ 8. Internal Links Point to New Paths

**Test Navigation:**

1. **From Global Agora page (`/agora`):**
   - Click "Explore Global Conversations" → Should go to `/agora/feed` (not `/global-agora/feed`)
   - Check footer links → Should point to `/agora` (not `/global`)

2. **From City Home (`/boston`):**
   - Click "Join Your City's Square" → Should go to `/boston/feed`
   - Click "Step into the Global Agora" → Should go to `/agora` (not `/global`)

3. **From Nav bar:**
   - Click "Global Agora" → Should go to `/agora` (not `/global`)

4. **From Arcade pages:**
   - All links should use `/arcades/...` format
   - No references to old `/circles/...` paths

**How to verify:**
- Hover over links to see destination URLs in browser status bar
- Click links and verify they navigate correctly
- Check for any 404 errors in console

---

## Quick Test Script

Run this in your browser console to test redirects:

```javascript
// Test redirects
async function testRedirects() {
  const tests = [
    { url: '/global', expected: '/agora' },
    { url: '/global-agora', expected: '/agora' },
    { url: '/global-agora/feed', expected: '/agora/feed' },
  ];

  for (const test of tests) {
    try {
      const response = await fetch(test.url, { redirect: 'manual' });
      const location = response.headers.get('location');
      console.log(`✅ ${test.url} → ${location || 'No redirect'}`);
      if (location && location.includes(test.expected)) {
        console.log(`   ✓ Correct redirect`);
      } else {
        console.log(`   ✗ Expected redirect to ${test.expected}`);
      }
    } catch (error) {
      console.error(`✗ ${test.url}:`, error);
    }
  }
}

testRedirects();
```

---

## Common Issues & Solutions

### Issue: Nav appears twice
**Solution:** Check that pages don't import Nav directly - they should only receive Nav from layout

### Issue: Redirect not working
**Solution:** 
- Restart dev server: `npm run dev`
- Clear browser cache
- Check `next.config.ts` syntax

### Issue: 404 errors on city routes
**Solution:** 
- Verify city name is lowercase in URL
- Check that `(city)/[city]/page.tsx` exists

### Issue: Arcade routes not working
**Solution:** 
- Verify arcade ID is valid
- Check database for arcade records
- Ensure user is authenticated

---

## Automated Testing (Optional)

You can also create a simple test file:

```bash
# Create test file
touch test-routes.sh
chmod +x test-routes.sh
```

Add curl commands to test redirects:

```bash
#!/bin/bash
BASE_URL="http://localhost:3000"

echo "Testing redirects..."
curl -I "$BASE_URL/global" | grep -i "location"
curl -I "$BASE_URL/global-agora" | grep -i "location"
curl -I "$BASE_URL/global-agora/feed" | grep -i "location"
```

---

## Summary

✅ **All tests passing?** You should see:
- Correct redirects with 301 status codes
- Nav appears once per page
- All links point to new canonical paths
- City routes work with dynamic city names
- Arcade routes work with role-based rendering
- Root redirect works based on user state

**If any test fails, check:**
1. Dev server is running
2. Browser cache is cleared
3. Files exist in correct locations
4. No console errors

