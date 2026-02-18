# Agent Architecture — Feedback & Technical Roadmap

**Source:** AI Innovation Lead feedback session
**Date:** February 2026

---

## 1. General Memory — RAG System

**Feedback:** All integrations and agents should pull information into a general memory layer. RAG (Retrieval-Augmented Generation) system. Reference: Microsoft's GraphRAG which builds knowledge graphs from social network data.

**Current state:** No RAG. Ellie uses simple tag-overlap matching and per-conversation preference extraction via OpenAI. No persistent memory across conversations.

**Architecture proposal:**

```
┌─────────────────────────────────────────────────┐
│                 GENERAL MEMORY                   │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ WhatsApp │  │Instagram │  │Eventbrite│  ... │
│  │  Agent   │  │  Agent   │  │  Agent   │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │              │              │            │
│       ▼              ▼              ▼            │
│  ┌──────────────────────────────────────┐       │
│  │       Ingestion Pipeline             │       │
│  │  (normalize → chunk → embed → store) │       │
│  └──────────────┬───────────────────────┘       │
│                 ▼                                │
│  ┌──────────────────────────────────────┐       │
│  │       Vector Store (pgvector)        │       │
│  │  + Knowledge Graph (relationships)   │       │
│  └──────────────┬───────────────────────┘       │
│                 ▼                                │
│  ┌──────────────────────────────────────┐       │
│  │       RAG Query Layer                │       │
│  │  (Ellie retrieves context per query) │       │
│  └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

**Implementation approach:**
- **Vector store:** Use `pgvector` extension on Supabase PostgreSQL — no new infra needed
- **Embeddings:** OpenAI `text-embedding-3-small` (cheap, fast, 1536 dims)
- **Chunking:** Each message/post/event → chunk with metadata (source, timestamp, community, member)
- **GraphRAG consideration:** Build entity-relationship graph on top of vector store. Entities = members, topics, events, channels. Edges = interactions, mentions, co-attendance. This powers Ellie's understanding of community dynamics, not just keyword matching
- **Query flow:** User asks Ellie → embed query → retrieve top-k relevant chunks → inject as context → LLM generates answer grounded in real community data

**Cost note:** Embeddings are ~$0.02 per 1M tokens. The expensive part is LLM calls for summarization/graph construction. Batch these off-peak.

---

## 2. Baileys — WhatsApp Integration

**Feedback:** Use Baileys library to solve the WhatsApp data problem. Clawd bot used this approach.

**What is Baileys:** Open-source TypeScript library that implements the WhatsApp Web API. Connects to WhatsApp via WebSocket (mimics WhatsApp Web), no official API needed. Avoids WhatsApp Business API costs ($0.05-0.08 per conversation).

**Architecture:**

```
┌────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  WhatsApp      │────▶│  Baileys Agent   │────▶│  General     │
│  Community     │◀────│  (Node.js)       │     │  Memory      │
│  Group Chat    │     │                  │     │  (pgvector)  │
└────────────────┘     │  • Listen to msgs│     └─────────────┘
                       │  • Send polls    │
                       │  • Reply to @bot │
                       │  • Pull history  │
                       └──────────────────┘
```

**Key considerations:**
- **Session management:** Baileys uses QR code auth (like WhatsApp Web). Need persistent session storage (Redis or DB) so it doesn't need re-auth on restart
- **Rate limits:** WhatsApp will ban numbers that send too aggressively. Need message queuing with backoff
- **Multi-device:** Baileys supports multi-device (MD) protocol — one phone number can connect to multiple clients
- **Risk:** Baileys is unofficial. WhatsApp could break it at any time. For production at scale, may eventually need to add official WhatsApp Business API as a fallback. But for MVP / cold-start, Baileys is the right move — zero cost, full group chat access
- **Hosting:** Needs a persistent process (not serverless). Run on a Cloudflare Worker with Durable Objects, or a small VPS/Railway container

**Data we can pull via Baileys:**
- All group messages (text, images, reactions)
- Member join/leave events
- Poll responses
- Message read receipts
- Group metadata (name, description, participants, admins)

---

## 3. Two-Way Agent Interface

**Feedback:** Allow operators to push content (polls, announcements) INTO community chats, AND allow members to ask the agent questions directly within the chat.

**Architecture — Bidirectional Agent:**

```
OUTBOUND (Operator → Community)          INBOUND (Community → Agent)
┌──────────────┐                         ┌──────────────┐
│  Operator     │                         │  Member in   │
│  Dashboard    │                         │  Group Chat  │
│  "Send poll"  │                         │  "@ellie     │
│  "Announce"   │                         │  when's the  │
└──────┬───────┘                         │  next event?"│
       │                                  └──────┬───────┘
       ▼                                         ▼
┌──────────────────────────────────────────────────┐
│              AGENT MESSAGE ROUTER                 │
│                                                   │
│  Outbound Queue          Inbound Handler          │
│  • Polls                 • @mention detection     │
│  • Announcements         • DM detection           │
│  • Event reminders       • Query → RAG → respond  │
│  • Nudges                • Escalate if unsure      │
│  • Scheduled sends       • Log to General Memory   │
└──────────────────────────────────────────────────┘
```

**Inbound trigger methods:**
1. **@mention in group:** Member types `@Ellie when is the next meetup?` — agent picks it up, queries RAG, replies in-thread
2. **DM to bot number:** Member sends a direct WhatsApp message to the bot's number — private 1:1 interaction
3. **Keyword trigger:** Configurable keywords (e.g. "!help", "!events") that trigger bot responses

**Outbound capabilities:**
- Operator schedules a poll from the dashboard → agent sends it to the WhatsApp group
- Automated event reminders (e.g. 24h before Eventbrite event)
- Weekly engagement digest sent to the group
- Targeted nudges to inactive members (via DM, not group spam)

**Safety guardrails:**
- Rate limit outbound messages (max N per hour per group)
- Operator approval queue for automated sends
- Member opt-out: anyone can DM "stop" to mute the bot
- Ellie should flag low-confidence answers for operator review rather than guessing

---

## 4. Platform Agent Framework

**Feedback:** Build a framework to create an agent for each platform, given how the business operates across many channels.

**Proposed framework — `CommunityAgent` base class:**

```
┌─────────────────────────────────────────────────────┐
│                  CommunityAgent (Base)                │
│                                                      │
│  • connect()          — Auth & establish connection  │
│  • listen()           — Subscribe to platform events │
│  • send(message)      — Send outbound message        │
│  • poll(question, options) — Create a poll           │
│  • getHistory(since)  — Pull historical data         │
│  • getMembers()       — List community members       │
│  • ingest(data)       — Push data to General Memory  │
│  • handleQuery(msg)   — RAG-powered response         │
│  • disconnect()       — Clean shutdown               │
│                                                      │
│  Config:                                             │
│  • platform: string                                  │
│  • communityId: string                               │
│  • credentials: encrypted                            │
│  • rateLimits: { outbound, inbound }                 │
│  • features: { polls, dms, reactions, media }        │
└──────────────┬──────────────────────────────────────┘
               │
    ┌──────────┼──────────┬──────────────┬────────────┐
    ▼          ▼          ▼              ▼            ▼
┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐
│WhatsApp│ │Insta   │ │Eventbrite│ │Discord │ │WeChat  │
│Agent   │ │Agent   │ │Agent     │ │Agent   │ │Agent   │
│(Baileys│ │(Graph  │ │(Webhook) │ │(Bot    │ │(Mini   │
│  lib)  │ │  API)  │ │          │ │  SDK)  │ │Program)│
└────────┘ └────────┘ └──────────┘ └────────┘ └────────┘
```

**Each platform agent implements:**
1. **Adapter layer:** Platform-specific API calls (Baileys for WhatsApp, Graph API for Instagram, etc.)
2. **Normalizer:** Converts platform-specific message format into a standard `CommunityEvent` schema
3. **Feature flags:** Not all platforms support all features (e.g. Eventbrite doesn't have polls)

**Standard event schema:**
```typescript
interface CommunityEvent {
  id: string
  platform: "whatsapp" | "instagram" | "eventbrite" | "discord" | "wechat"
  communityId: string
  type: "message" | "reaction" | "join" | "leave" | "poll_response" | "event_rsvp"
  author: { platformId: string; name?: string }
  content: string
  metadata: Record<string, unknown>
  timestamp: Date
}
```

All events flow through the normalizer into General Memory — Ellie queries the same knowledge base regardless of which platform the data came from.

---

## 5. WeChat Integration

**Feedback:** Could unlock a large community user base from China.

**Approach — WeChat Mini Program:**
- WeChat doesn't allow traditional bots. Integration must be via a **Mini Program** (小程序) — essentially a lightweight app inside WeChat
- The Mini Program would serve as a Central Square portal: members access community features, events, and Ellie directly within WeChat
- Data flows back to General Memory via WeChat's server-side APIs
- **Regulatory note:** China data must stay in China (PIPL compliance). Would need a separate data region (e.g. Tencent Cloud) with sync to the main platform for non-PII aggregated insights

**Priority:** Lower than WhatsApp/Instagram for MVP, but architecturally the agent framework should be designed to support it from day one.

---

## 6. Beckn Protocol — India Communities

**Feedback:** Beckn Protocol could be a route into the Indian community market.

**What is Beckn:** Open protocol for decentralized digital commerce. Think of it as an "internet of commerce" — any platform can become a provider or consumer of services without needing bilateral integrations.

**How it fits Central Square:**
- Central Square communities could expose their events, services, and memberships as Beckn catalog items
- Indian community operators could discover and join Central Square via Beckn-compatible apps (like ONDC apps)
- Members in India could interact with communities through local Beckn apps they already use
- Creates a network effect: communities on Central Square become discoverable across the entire Beckn ecosystem

**Implementation:**
- Build a Beckn Provider Adapter that exposes community catalogs (events, memberships, services)
- Integrate with Beckn Gateway for discovery
- **Priority:** Phase 2/3 — requires the agent framework and core platform to be solid first

---

## 7. Cost-Optimized Agent Architecture

**Feedback:** Build architecture smartly to get the best from agents while keeping costs minimal.

**Cost breakdown of an agent-heavy system:**

| Component | Cost Driver | Optimization |
|-----------|------------|--------------|
| LLM calls (Ellie responses) | $0.15/1M input, $0.60/1M output (GPT-4o-mini) | Cache common queries, batch summarization |
| Embeddings | $0.02/1M tokens | Embed on ingest only, not on every query |
| Vector DB queries | Supabase pgvector — included in plan | No additional cost |
| Agent processes | Persistent connections (Baileys etc.) | Shared worker pools, not 1 process per community |
| Message queue | Outbound rate-limited sends | Batch + schedule |

**Key cost strategies:**

### a) Tiered AI responses
```
Member query → Check cache (free)
            → Simple pattern match (free)
            → RAG retrieval only, no LLM (cheap)
            → Full LLM response (expensive) — only when needed
```

### b) Batch ingestion, not real-time
Don't embed every message the instant it arrives. Batch messages into 5-minute windows, deduplicate, then embed. Reduces embedding API calls by ~80%.

### c) Shared agent workers
Don't spin up a separate Baileys process per community. Use a worker pool:
- 1 worker handles N WhatsApp connections (Baileys supports multiple sessions)
- Scale workers horizontally as communities grow
- Idle communities get deprioritized (check every 5 min instead of real-time)

### d) Summary-based memory, not raw storage
Instead of storing every message verbatim in the vector store, periodically run a summarization pass:
- Every 24h: summarize the day's conversations into key topics, sentiment, and events
- Store summaries as embeddings (fewer, higher-quality vectors)
- Keep raw messages in cold storage (cheap) for audit/replay

### e) Cost per community target
| Tier | Communities | Monthly AI cost target |
|------|------------|----------------------|
| MVP | 10 | < $50 total |
| Growth | 100 | < $2/community |
| Scale | 1000+ | < $0.50/community |

At scale, the cost of AI per community should be negligible relative to the $25-500/mo subscription price.

---

## Priority Roadmap

| Priority | Item | Effort | Impact |
|----------|------|--------|--------|
| **P0** | General Memory (pgvector + RAG) | 2 weeks | Foundation for everything else |
| **P0** | WhatsApp Agent via Baileys | 2 weeks | Cold-start strategy, core value prop |
| **P1** | Two-way agent interface | 1 week | Differentiator from passive analytics |
| **P1** | Platform Agent Framework (`CommunityAgent` base) | 1 week | Enables rapid platform expansion |
| **P2** | Instagram Agent (Graph API) | 1 week | Second channel |
| **P2** | Cost optimization (batching, caching, tiers) | Ongoing | Keeps unit economics viable |
| **P3** | WeChat Mini Program | 3-4 weeks | China market |
| **P3** | Beckn Protocol integration | 2-3 weeks | India market |

---

## References

- **Baileys:** `github.com/WhiskeySockets/Baileys` — TypeScript WhatsApp Web API
- **GraphRAG (Microsoft):** Builds knowledge graphs from unstructured text for enhanced RAG
- **pgvector:** PostgreSQL extension for vector similarity search (native on Supabase)
- **Beckn Protocol:** `becknprotocol.io` — Open protocol for decentralized commerce
- **WeChat Mini Programs:** `developers.weixin.qq.com/miniprogram/en/dev/`
