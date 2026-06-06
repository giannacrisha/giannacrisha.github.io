// src/pages/api/heart.ts
// Like or unlike a planting — stores counts in Upstash Redis.
// POST { issueNumber: number, action: 'like' | 'unlike' }
export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

// Rate limiting: max 30 actions per IP per minute
const _rl = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const times = (_rl.get(ip) ?? []).filter(t => now - t < 60_000);
  if (times.length >= 30) return true;
  _rl.set(ip, [...times, now]);
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
          ?? request.headers.get('x-real-ip')
          ?? 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests.' }), { status: 429 });
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
