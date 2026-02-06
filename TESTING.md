# Testing Guide: Central Square MVP

## Quick Start Checklist

Before testing, verify these are set up:

- [ ] **Environment Variables**: Check `.env.local` has:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
  - `DATABASE_URL` (Supabase PostgreSQL connection string)
  - `UPSTASH_REDIS_URL` (optional, for rate limiting)
  - `UPSTASH_REDIS_TOKEN` (optional)
  - `NEXT_PUBLIC_BASE_URL` (defaults to `http://localhost:3000`)

- [ ] **Database**: Run migrations:

  ```bash
  cd central-square
  npx prisma migrate dev --name init
  npx prisma generate
  ```

- [ ] **Development Server**: Start the server:

  ```bash
  npm run dev
  ```

- [ ] **Seed Data** (Optional): Add demo data:
  ```bash
  # Set DEMO_USER_ID in .env.local with a Supabase user ID
  npm run db:seed
  ```

---

## Step-by-Step Testing Scenarios

### 1. Test Public Square (No Auth Required)

**Goal**: Verify guests can browse the public Square feed

1. Open `http://localhost:3000` in your browser (incognito/private window)
2. **Expected**: Landing page shows "Step Into the Square"
3. Navigate to `/square` or click "Or browse the Square feed →"
4. **Expected**: See Square feed with posts (if any exist)
5. Try filtering by tag: add `?tag=education` to URL
6. **Expected**: Only posts from Circles with "education" tag appear

**What to verify**:

- ✅ Square loads without requiring login
- ✅ Posts display chronologically
- ✅ Tag filtering works
- ✅ Empty state shows if no posts

---

### 2. Test Authentication Flow

**Goal**: Sign up and create a profile

1. Click "Sign In" or "Sign Up" on landing page
2. Enter your email address
3. Click "Send magic link" / "Login"
4. **Expected**: Message "Check your email for the magic link!"
5. Check your email inbox (check spam folder)
6. Click the magic link in the email
7. **Expected**: Redirected to `/profile/create`
8. Fill out profile form:
   - Name: "Test User"
   - Handle: "testuser" (must be unique, lowercase, alphanumeric)
   - Bio: "Testing Central Square"
   - Interests: "tech, ai" (comma-separated)
9. Click "Save Profile"
10. **Expected**: Redirected to `/dashboard`

**What to verify**:

- ✅ Magic link email received
- ✅ Profile creation form works
- ✅ Handle uniqueness enforced (try duplicate handle)
- ✅ Dashboard loads after profile creation
- ✅ "My Circles" section visible (empty initially)

---

### 3. Test Circle Discovery

**Goal**: Find and view Circles

1. As authenticated user, navigate to `/discover`
2. **Expected**: See list of Circles
3. Search by name: Type "Education" in search box
4. **Expected**: Circles matching name appear
5. Filter by tag: Type "tech" in tag filter
6. **Expected**: Only Circles with "tech" tag appear
7. Click on a Circle name
8. **Expected**: Circle detail page loads showing:
   - Circle name, description, tags
   - Member count, post count
   - "Join Circle" button (if open)

**What to verify**:

- ✅ Search works (name and description)
- ✅ Tag filtering works
- ✅ Circle details display correctly
- ✅ Join button appears for open circles

---

### 4. Test Creating a Circle

**Goal**: Create your own Circle

1. Navigate to `/circles/create` (or click "Create Circle" in nav)
2. Fill out Circle form:
   - Name: "My Test Circle"
   - Description: "A test circle for testing"
   - Tags: "testing, demo" (comma-separated)
   - Visibility: "open"
3. Click "Create Circle"
4. **Expected**: Redirected to `/circles/[id]` (your new Circle)
5. **Expected**: See Circle details and empty feed
6. Verify Circle appears in `/discover` search

**What to verify**:

- ✅ Circle creation works
- ✅ You're automatically added as host
- ✅ Circle appears in discovery
- ✅ Settings page accessible at `/circles/[id]/settings`

---

### 5. Test Joining a Circle

**Goal**: Join an open Circle

1. As authenticated user, go to `/discover`
2. Find an open Circle (not one you created)
3. Click on the Circle
4. Click "Join Circle" button
5. **Expected**: Button disappears, compose box appears
6. **Expected**: Circle appears in your `/dashboard` under "My Circles"
7. Try posting in the Circle (see next section)

**What to verify**:

- ✅ Join button works for open circles
- ✅ Membership created
- ✅ Can access Circle feed after joining
- ✅ Circle appears in dashboard

---

### 6. Test Posting and Replying

**Goal**: Create posts and replies in a Circle

1. Navigate to a Circle you're a member of (`/circles/[id]`)
2. In the compose box, type a post (1-800 characters)
3. Click "Post"
4. **Expected**: Post appears in feed immediately
5. **Expected**: Post shows your name, handle, timestamp
6. Click "Reply" on a post
7. Type a reply (1-800 characters)
8. Click "Reply" button
9. **Expected**: Reply appears nested under the post

**What to verify**:

- ✅ Posts create successfully
- ✅ Posts appear chronologically (newest first)
- ✅ Replies nest correctly (one level only)
- ✅ Character count displays correctly
- ✅ Cannot post if not a member (try from different Circle)

---

### 7. Test Lantern Promotion (Host Only)

**Goal**: Promote a Circle post to appear on Square

**Note**: This requires API testing or UI button (not yet implemented)

1. As Circle host, create a post in your Circle
2. **Option A**: Use API directly:
   ```bash
   curl -X POST http://localhost:3000/api/posts/[POST_ID]/lantern \
     -H "Cookie: [your-auth-cookie]" \
     -H "Content-Type: application/json"
   ```
3. **Option B**: Check if promotion button exists in UI (T107 pending)
4. Navigate to `/square` (public feed)
5. **Expected**: Promoted post appears as "Lantern from [Circle Name]"

**What to verify**:

- ✅ Only host can promote (try as non-host - should fail)
- ✅ Lantern appears on Square feed
- ✅ Lantern shows Circle name
- ✅ Can demote (remove from Square)

---

### 8. Test Reporting and Moderation

**Goal**: Report posts and moderate content

1. As Circle member, find a post to report
2. Click "Report" button on a post
3. Fill out report dialog:
   - Reason: "Test report reason"
4. Click "Submit Report"
5. **Expected**: Success message, report created
6. As Circle host, go to `/circles/[id]/settings`
7. **Expected**: See moderation tools (if implemented - T125 pending)

**Soft Delete** (Host only):

- Use API: `POST /api/moderation/posts/[id]/soft-delete`
- **Expected**: Post disappears from feeds
- **Expected**: Post still exists in database (soft delete)

**What to verify**:

- ✅ Report creation works
- ✅ Rate limiting: Try reporting 6 times quickly (should fail on 6th)
- ✅ Soft delete works (host only)
- ✅ Deleted posts don't appear in feeds

---

### 9. Test Rate Limiting

**Goal**: Verify rate limits are enforced

1. **Posts**: Try posting 11 times in 1 minute
   - **Expected**: First 10 succeed, 11th returns 429 error
2. **Reports**: Try reporting 6 times in 1 minute
   - **Expected**: First 5 succeed, 6th returns 429 error
3. **Magic Links**: Try requesting 2 magic links in 60 seconds
   - **Expected**: First succeeds, second returns 429 error

**What to verify**:

- ✅ Rate limits return 429 status
- ✅ Error message includes retry time
- ✅ Limits reset after time window

---

### 10. Test Error Handling

**Goal**: Verify error handling works

1. **Invalid Handle**: Try creating profile with handle "ab" (too short)
   - **Expected**: Validation error
2. **Duplicate Handle**: Try using existing handle
   - **Expected**: "Handle already taken" error
3. **Invalid Post**: Try posting empty or >800 chars
   - **Expected**: Validation error
4. **Unauthorized**: Try accessing `/dashboard` without auth
   - **Expected**: Redirected to `/signin`
5. **Not Member**: Try posting in Circle you're not a member of
   - **Expected**: 403 Forbidden error

**What to verify**:

- ✅ Validation errors display clearly
- ✅ Unauthorized access blocked
- ✅ Authorization checks work
- ✅ Error messages are user-friendly

---

## Browser Testing Checklist

### Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Responsive Design

- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

---

## Performance Testing

### Quick Performance Checks

1. **First Contentful Paint (FCP)**:
   - Open Chrome DevTools → Network tab
   - Enable "Slow 3G" throttling
   - Reload `/square`
   - **Target**: FCP < 1.8s

2. **Bundle Size**:

   ```bash
   npm run build
   ```

   - Check build output for bundle sizes
   - **Target**: Initial bundle < 200KB

3. **API Response Time**:
   - Open DevTools → Network tab
   - Check API endpoint response times
   - **Target**: TTFB < 500ms

---

## Accessibility Testing

### Quick A11y Checks

1. **Keyboard Navigation**:
   - Tab through entire page
   - **Verify**: All interactive elements reachable
   - **Verify**: Focus visible on all elements

2. **Screen Reader**:
   - Enable VoiceOver (Mac) or NVDA (Windows)
   - Navigate through pages
   - **Verify**: All content readable, logical order

3. **Automated Testing**:
   - Install axe DevTools browser extension
   - Run scan on each page
   - **Target**: No critical violations

---

## Common Issues & Fixes

### Issue: "Cannot connect to database"

**Fix**:

- Check `DATABASE_URL` in `.env.local`
- Verify Supabase project is active
- Run `npx prisma migrate dev`

### Issue: "Magic link not received"

**Fix**:

- Check spam folder
- Verify email in Supabase dashboard
- Check rate limiting (1 per 60 seconds)
- Verify `NEXT_PUBLIC_BASE_URL` is correct

### Issue: "Posts not appearing"

**Fix**:

- Check if user is Circle member
- Verify post wasn't soft-deleted (`deletedAt IS NULL`)
- Check database connection
- Review browser console for errors

### Issue: "Rate limit not working"

**Fix**:

- Verify Upstash Redis credentials in `.env.local`
- Check Redis connection in `/lib/rate-limit.ts`
- Verify rate limit middleware is called

### Issue: "Build fails"

**Fix**:

- Run `npm install` to ensure dependencies installed
- Check TypeScript errors: `npx tsc --noEmit`
- Check ESLint: `npm run lint`
- Verify all environment variables set

---

## Next Steps After Testing

1. **If tests pass**: Ready for deployment!
2. **If issues found**:
   - Check error logs in browser console
   - Check server logs in terminal
   - Review database queries (enable Prisma logging)
   - Check network tab for failed requests

3. **For production**: Follow deployment checklist in `quickstart.md`

---

## Testing Checklist Summary

- [ ] Public Square loads without auth
- [ ] Magic link authentication works
- [ ] Profile creation works
- [ ] Dashboard displays correctly
- [ ] Circle discovery works
- [ ] Circle creation works
- [ ] Circle joining works
- [ ] Posting works
- [ ] Replying works
- [ ] Lantern promotion works (API)
- [ ] Reporting works
- [ ] Moderation works (soft delete)
- [ ] Rate limiting works
- [ ] Error handling works
- [ ] Cross-browser compatible
- [ ] Responsive design works
- [ ] Keyboard navigation works
- [ ] Performance meets targets

**Status**: Ready to test! 🚀
