// src/pages/api/hearts.ts
// Returns heart counts for a list of issue numbers from Upstash Redis.
// GET /api/hearts?issues=1,2,3
export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

export const GET: APIRoute = async ({ url }) => {
  const param = url.searchParams.get('issues') ?? '';
  const issueNumbers = param
    .split(',')
    .map(s => parseInt(s.trim()))
    .filter(n => Number.isInteger(n) && n > 0)
    .slice(0, 200); // hard cap

  if (!issueNumbers.length) {
    return new Response(JSON.stringify({}), { status: 200 });
  }

  const keys    = issueNumbers.map(n => `hearts:${n}`);
  const values  = await redis.mget<(number | null)[]>(...keys);
  const counts: Record<number, number> = {};
  issueNumbers.forEach((n, i) => { counts[n] = values[i] ?? 0; });

  return new Response(JSON.stringify(counts), {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
};
