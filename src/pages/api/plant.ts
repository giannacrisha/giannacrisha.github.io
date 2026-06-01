// src/pages/api/plant.ts
// Serverless function — proxies pixel art submissions to GitHub Issues.
// The GITHUB_TOKEN env var is set in Vercel and never exposed to the browser.
export const prerender = false;

import type { APIRoute } from 'astro';

const REPO_OWNER = 'giannacrisha';
const REPO_NAME  = 'giannacrisha.github.io';
const LABEL      = 'community-garden';

export const POST: APIRoute = async ({ request }) => {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500 });
  }

  let body: { pixels?: string[]; name?: string; note?: string; website?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { pixels, name, note, website } = body;

  // Basic validation
  if (!Array.isArray(pixels) || pixels.length !== 256) {
    return new Response(JSON.stringify({ error: 'Invalid pixel data' }), { status: 400 });
  }
  // Must have drawn something (at least 4 non-transparent pixels)
  const painted = pixels.filter(p => p !== null && p !== 'null' && p !== '').length;
  if (painted < 4) {
    return new Response(JSON.stringify({ error: 'Draw something first!' }), { status: 400 });
  }

  const displayName = (name ?? '').trim().slice(0, 50) || 'anonymous';
  const safeNote    = (note ?? '').trim().slice(0, 280);
  const safeWebsite = (website ?? '').trim().slice(0, 200);

  // Honeypot check (set by the form — bots fill it in)
  // (handled client-side; we trust the server to reject if it ever slips through)

  const issueBody = JSON.stringify({
    pixels,
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
