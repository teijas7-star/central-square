# Central Square MVP - Testing Checklist

## 🚀 Server Status

✅ Development server running at **http://localhost:3000**

## 📋 Testing Checklist

### 1. Landing Page (`/`)

- [ ] Page loads without errors
- [ ] Header with logo and navigation
- [ ] Hero section with search
- [ ] Featured Arcades section (3 cards)
- [ ] Recent Discussions section
- [ ] Call-to-action buttons work
- [ ] Footer displays correctly

### 2. Authentication Flow

- [ ] Sign-in page (`/signin`)
- [ ] Magic link email functionality
- [ ] Redirect after sign-in works
- [ ] Profile creation flow (`/profile/create`)
- [ ] Sign-out functionality

### 3. Discovery Page (`/discover`)

- [ ] Page loads arcades from API
- [ ] Search functionality
- [ ] Filter buttons (Trending, Newest, By Interest)
- [ ] Arcade cards display correctly
- [ ] "Create Arcade" button works
- [ ] Clicking arcade card navigates to arcade page

### 4. Arcade Home Page (`/arcades/[id]`)

- [ ] Page loads arcade data
- [ ] Header with arcade name and AI Host status
- [ ] Subheader with description
- [ ] Tab navigation (Posts, Events, Media, Members)

#### Posts Tab

- [ ] Compose component appears (if member)
- [ ] AI Host suggestion appears
- [ ] Posts feed displays
- [ ] Post interactions (like, comment, share)
- [ ] Sidebar shows Events & Members

#### Events Tab

- [ ] AI Host event suggestion
- [ ] "Create Event" button (host only)
- [ ] Events grid displays 4 events
- [ ] Event cards show all info (date, time, location, RSVP)
- [ ] Recent Events section
- [ ] Sidebar shows Resources, Members, AI Footer

#### Members Tab

- [ ] Members header with counts
- [ ] Export List & Invite Members buttons (host only)
- [ ] Search members input
- [ ] Filter buttons (All, Online, Hosts, New, Active)
- [ ] Member cards with full details
- [ ] Pagination controls
- [ ] Sidebar shows AI Host Interaction Panel
  - [ ] AI Host Summary with metrics
  - [ ] Participation bar chart
  - [ ] Member Statistics
  - [ ] Recent Activity

#### Media Tab

- [ ] Placeholder message displays

### 5. Create Arcade (`/arcades/create`)

- [ ] Form loads correctly
- [ ] All form fields work
- [ ] Validation works
- [ ] Submit creates arcade
- [ ] Success modal appears
- [ ] Navigation to new arcade works

### 6. API Endpoints

Test these endpoints directly or through the UI:

#### Arcades

- [ ] `GET /api/arcades` - List arcades
- [ ] `POST /api/arcades` - Create arcade
- [ ] `GET /api/arcades/[id]` - Get arcade details
- [ ] `GET /api/arcades/[id]/members` - Get members
- [ ] `POST /api/arcades/[id]/join` - Join arcade
- [ ] `POST /api/arcades/[id]/invite` - Create invite

#### Posts

- [ ] `GET /api/posts?arcadeId=[id]` - Get posts
- [ ] `POST /api/posts` - Create post
- [ ] `POST /api/posts/[id]/lantern` - Toggle lantern

#### Discovery

- [ ] `GET /api/discovery` - Discover arcades
- [ ] `GET /api/discovery?q=search` - Search arcades

#### Feed

- [ ] `GET /api/feed/square` - Get Square feed
- [ ] `GET /api/feed/square?tag=tag` - Filter by tag

### 7. Responsive Design

Test on different screen sizes:

- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Sidebar collapses on mobile
- [ ] Navigation adapts to screen size

### 8. Error Handling

- [ ] Invalid arcade ID shows error
- [ ] Unauthorized access shows error
- [ ] Network errors handled gracefully
- [ ] Loading states display correctly

### 9. Component Interactions

- [ ] Compose component expands when clicked
- [ ] Tab switching works smoothly
- [ ] Pagination changes page
- [ ] Search filters results
- [ ] Buttons trigger correct actions

### 10. Data Persistence

- [ ] Created posts appear in feed
- [ ] Joined arcades appear in dashboard
- [ ] User profile persists
- [ ] Member counts update correctly

## 🐛 Common Issues to Watch For

1. **API Errors**: Check browser console for 500/400 errors
2. **Missing Data**: Ensure database has seed data (`npm run db:seed`)
3. **Auth Issues**: Verify Supabase credentials in `.env.local`
4. **Styling**: Check if Tailwind classes are applying correctly
5. **Navigation**: Verify all links work correctly

## 📝 Notes

- All components use Lucide React icons (no FontAwesome)
- Mock data is used for Events and Resources (until backend is implemented)
- AI Host features are UI-ready but may need backend integration
- Pagination and filtering work but may need optimization

## ✅ Quick Test Commands

```bash
# Check server status
curl http://localhost:3000

# Check API endpoint
curl http://localhost:3000/api/discovery

# Check if Prisma client is generated
ls node_modules/.prisma/client
```

## 🎯 Priority Test Areas

1. **Critical Path**: Landing → Sign In → Profile → Discover → Join Arcade → View Arcade
2. **Posts Tab**: Create post → View post → Reply
3. **Members Tab**: View members → Search → Filter
4. **Events Tab**: View events → View resources

Happy testing! 🚀
