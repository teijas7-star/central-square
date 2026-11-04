# centralsquare.ai: knowledge graph

`site-graph.json` (74 nodes, 88 relations) · `site-graph.png` / `site-graph.html` (view) · crawled 2026-11-04 from the 2 public pages (home and /customers/wakelet). Raw text: `site/pages.json`, `site/home.txt`, `site/wakelet.txt`.

**Node types:** Page · Organization · Product (Ellie) · Positioning / Mission / Problem · Step (goal → view → approve) · Capability · Integration · ExampleGoal · Offer · Policy · Claim · Customer · Person · story facts (Context, Team, Before, With Ellie, Hard part, Outcome) · DataSource · Quote · WatchQuestion · ExampleData (must carry an "EXAMPLE DATA" label) · CTA.

**Main relations:** `org:csai —builds→ product:ellie`; `product:ellie —works_in→ step:*` (chained by `then`); `product:ellie —can→ cap:*`; `cap:channels —reads→ int:*`; `customer:wakelet —uses→ product:ellie`; `customer:wakelet —has→ fact:*`; `fact:before —replaced_by→ fact:after —led_to→ fact:time / fact:ambassadors`; `fact:hard —solved_by→ cap:identity`; `person:james —said→ quote:james —supports→ cap:quiet`; `watch:0 —shown_as→ example:dashboard`.

Every node carries its `source` URL. Use the graph as the copy source of truth for films (see `motion-studio/CLAUDE.md` §5–6).
