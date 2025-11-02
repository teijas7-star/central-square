import { z } from "zod";

export const ProfileUpdate = z.object({
  name: z.string().min(1),
  handle: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/i),
  avatarUrl: z.string().url().optional().nullable(),
  bio: z.string().max(240).optional().nullable(),
  interests: z.array(z.string().min(1)).max(10).optional().default([]),
});

export const ArcadeCreate = z.object({
  name: z.string().min(2),
  description: z.string().max(280).optional(),
  tags: z.array(z.string().min(1)).max(10).default([]),
  visibility: z.enum(["open", "invite"]).default("open"),
});

export const PostCreate = z.object({
  body: z.string().min(1).max(800),
  arcadeId: z.string().optional(),
  parentId: z.string().optional(),
});

export const ReportCreate = z.object({
  postId: z.string().min(1),
  reason: z.string().min(3).max(200),
});

export const InviteJoin = z.object({
  token: z.string().min(8),
});

export const magicLinkSchema = z.object({
  email: z.string().email(),
});
