// src/pages/api/plant.ts
// Serverless function — proxies pixel art submissions to GitHub Issues.
// The GITHUB_TOKEN env var is set in Vercel and never exposed to the browser.
export const prerender = false;

import type { APIRoute } from 'astro';

const REPO_OWNER = import.meta.env.GITHUB_REPO_OWNER ?? 'giannacrisha';
const REPO_NAME  = import.meta.env.GITHUB_REPO_NAME  ?? 'giannacrisha.github.io';
const LABEL      = 'community-garden';

// Valid pixel color: null, or a CSS hex color (#rgb, #rrggbb, #rrggbbaa)
const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

// Strip all HTML tags from a string (defense-in-depth alongside Astro escaping)
function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&(?:[a-z]+|#\d+);/gi, (e) => {
    const map: Record<string, string> = { '&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'" };
    return map[e] ?? e;
  });
}

// Simple in-memory rate limiter: max 3 submissions per IP per 10 minutes
const submissions = new Map<string, number[]>();
const RATE_WINDOW = 10 * 60 * 1000; // 10 min
const RATE_LIMIT  = 3;

function isRateLimited(ip: string): boolean {
  const now  = Date.now();
  const times = (submissions.get(ip) ?? []).filter(t => now - t < RATE_WINDOW);
  if (times.length >= RATE_LIMIT) return true;
  submissions.set(ip, [...times, now]);
  return false;
}

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  // ── Rate limiting ─────────────────────────────────────────────────────
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
          ?? request.headers.get('x-real-ip')
          ?? 'unknown';
  if (isRateLimited(ip)) {
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
  const safePixels: (string | null)[] = pixels.map(p => {
    if (p === null || p === undefined) return null;
    if (typeof p === 'string' && HEX_COLOR.test(p)) return p;
    return null; // silently drop any invalid value
  });
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
