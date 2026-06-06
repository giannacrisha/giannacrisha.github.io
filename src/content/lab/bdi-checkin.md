---
title: BDI Check-In Forms
description: A touch-screen check-in system for the Brandeis Design & Innovation spaces — capturing structured visitor feedback and piping it directly to Google Sheets for real-time analysis.
date_built: 2026-01-01
tools:
  - Next.js
  - Google Sheets API
  - Bun
topics:
  - tech
  - design
growth_stage: star
featured: false
link: https://github.com/BrandeisMakerLab/bdi-check-in-form-v2
---

## Problem

Design and innovation spaces need real-time feedback to improve — but manual collection is fragmented, inconsistent, and hard to analyze at scale. Sticky notes and paper forms don't tell you trends. Spreadsheet manually updated by staff don't tell you anything in time to act on it.

The BDI spaces (Active Learning, Maker Lab, Design Studio Lab) needed a unified system that captured structured feedback without adding work for staff.

## Process

The interface needed to live on a 1024×600 touch-screen kiosk — not a standard web browsing context. That constraint shaped everything: large tap targets, minimal text input, fast flows. I designed around the assumption that most visitors are walking past, not sitting down.

The backend needed to be zero-maintenance: no database to manage, no admin panel to update. Google Sheets was the natural fit — the staff already lived there, and direct API integration meant data appeared instantly without anyone touching a CSV.

I built v1 as a proof of concept, learned what feedback categories were actually useful from a few weeks of real data, then rebuilt v2 with those learnings baked in.

## Solution

A web-based check-in system that:

- Accepts structured feedback from space visitors via touch-screen
- Pipes responses directly to Google Sheets — no manual data entry
- Tracks check-ins across multiple spaces (AL, ML, DSL)
- Runs on Bun for fast cold starts on the kiosk hardware

**Planned next:** checkout flows, gamification elements, and per-space ratings to surface qualitative trends alongside attendance numbers.

## Links

- **GitHub:** [BrandeisMakerLab/bdi-check-in-form-v2](https://github.com/BrandeisMakerLab/bdi-check-in-form-v2)
- **Live demo:** *(add deployment URL)*

<!-- VISUALS: Screenshots of the check-in form interface — available in Downloads/Screenshots folder -->
