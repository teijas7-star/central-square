import { prisma } from "../lib/prisma";

async function main() {
  // Minimal seed: requires you to have at least one Supabase user id
  const demoUserId = process.env.DEMO_USER_ID!;
  const you = await prisma.profile.upsert({
    where: { id: demoUserId },
    update: {},
    create: { id: demoUserId, handle: "teijas", name: "Teijas", interests: ["ai","civics"] }
  });

  const a1 = await prisma.arcade.create({
    data: { name: "AI & Society", description: "Ethics and impact", tags: ["ai","ethics"], hostId: you.id, visibility: "open",
      memberships: { create: { userId: you.id, role: "host" } } }
  });

  const p1 = await prisma.post.create({
    data: { authorId: you.id, arcadeId: a1.id, body: "Welcome to AI & Society!" }
  });

  await prisma.post.update({ where: { id: p1.id }, data: { isLantern: true } });
  await prisma.post.create({ data: { authorId: you.id, body: "Hello, Square!" } });

  console.log("Seeded: user, arcade, posts");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(async ()=>{ await prisma.$disconnect(); });

