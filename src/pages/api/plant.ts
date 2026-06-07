// src/pages/api/plant.ts
// Serverless function — proxies pixel art submissions to GitHub Issues.
// The GITHUB_TOKEN env var is set in Vercel and never exposed to the browser.
export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const redis = new Redis({
  url:   import.meta.env.KV_REST_API_URL,
  token: import.meta.env.KV_REST_API_TOKEN,
});

// Sliding window: 3 plantings per IP per 10 minutes, shared across all instances.
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '600 s'),
  prefix:  'rl:plant',
});

import { REPO_OWNER, REPO_NAME, LABEL } from '../../config/github';
import { stripHtml, sanitizePixel } from '../../lib/sanitize';

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  // ── Rate limiting (Upstash Redis — persists across serverless instances) ──
  const ip = request.headers.get('x-vercel-forwarded-for')
          ?? request.headers.get('x-forwarded-for')?.split(',')[0].trim()
          ?? request.headers.get('x-real-ip')
          ?? 'unknown';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return new Response(JSON.stringify({ error: 'Too many plantings — try again later.' }), { status: 429 });
  }

  let body: { pixels?: unknown[]; name?: string; note?: string; website?: string; hp?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  // ── Honeypot (server-side) ────────────────────────────────────────────
  if (body.hp) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 }); // silent reject
  }

  const { pixels, name, note, website } = body;

  // ── Pixel validation ──────────────────────────────────────────────────
  if (!Array.isArray(pixels) || pixels.length !== 256) {
    return new Response(JSON.stringify({ error: 'Invalid pixel data' }), { status: 400 });
  }
  // Each pixel must be null or a valid hex color string — no arbitrary strings
  const safePixels: (string | null)[] = pixels.map(sanitizePixel);
  const painted = safePixels.filter(Boolean).length;
  if (painted < 4) {
    return new Response(JSON.stringify({ error: 'Draw something first!' }), { status: 400 });
  }

  // ── Text sanitization ─────────────────────────────────────────────────
  // stripHtml is defense-in-depth: Astro escapes on render but we keep storage clean
  const displayName = stripHtml((name ?? '').trim()).slice(0, 50) || 'anonymous';
  const safeNote    = stripHtml((note ?? '').trim()).slice(0, 280);

  // ── Website validation ────────────────────────────────────────────────
  const rawWebsite = (website ?? '').trim().slice(0, 200);
  let safeWebsite = '';
  if (rawWebsite) {
    try {
      const u = new URL(rawWebsite);
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        safeWebsite = u.toString(); // normalised by URL parser
      }
    } catch {
      // invalid URL — drop silently
    }
  }

  const issueBody = JSON.stringify({
    pixels:  safePixels,
    name:    displayName,
    note:    safeNote,
    website: safeWebsite,
    ts:      new Date().toISOString(),
  });

  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept:        'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title:  `[community-garden] ${displayName}`,
        body:   issueBody,
        labels: [LABEL],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    console.error('GitHub API error:', err);
    return new Response(JSON.stringify({ error: 'Failed to plant. Try again.' }), { status: 502 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
