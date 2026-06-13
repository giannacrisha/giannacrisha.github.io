// src/pages/api/heart.ts
// Like or unlike a planting — stores counts in Upstash Redis.
// POST { issueNumber: number, action: 'like' | 'unlike' }
export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const kvUrl   = import.meta.env.KV_REST_API_URL;
const kvToken = import.meta.env.KV_REST_API_TOKEN;
const redis = kvUrl && kvToken ? new Redis({ url: kvUrl, token: kvToken }) : null;

// Sliding window: 30 heart actions per IP per 60 seconds, shared across all instances.
const ratelimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '60 s'), prefix: 'rl:heart' })
  : null;

export const POST: APIRoute = async ({ request }) => {
  // Prefer Vercel's trusted header over spoofable x-forwarded-for first-hop.
  const ip = request.headers.get('x-vercel-forwarded-for')
          ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
          ?? request.headers.get('x-real-ip')
          ?? 'unknown';

  if (ratelimit) {
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return new Response(JSON.stringify({ error: 'Too many requests.' }), { status: 429 });
    }
  }

  let body: { issueNumber?: unknown; action?: unknown };
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const { issueNumber, action } = body;
  if (typeof issueNumber !== 'number' || !Number.isInteger(issueNumber) || issueNumber < 1) {
    return new Response(JSON.stringify({ error: 'Invalid issue number' }), { status: 400 });
  }
  if (action !== 'like' && action !== 'unlike') {
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  }

  if (!redis) {
    return new Response(JSON.stringify({ ok: true, count: 0 }), { status: 200 });
  }

  const key = `hearts:${issueNumber}`;

  if (action === 'like') {
    const count = await redis.incr(key);
    return new Response(JSON.stringify({ ok: true, count }), { status: 200 });
  } else {
    // Decrement but never below 0
    const current = (await redis.get<number>(key)) ?? 0;
    const next    = Math.max(0, current - 1);
    await redis.set(key, next);
    return new Response(JSON.stringify({ ok: true, count: next }), { status: 200 });
  }
};
