---
title: gcalgroups
description: A Chrome extension that adds calendar grouping to Google Calendar — toggle all related calendars on or off with a single click instead of managing them one by one.
date_built: 2025-06-01
tools:
  - Chrome Extension API
  - JavaScript
  - CSS
topics:
  - tech
growth_stage: star
featured: false
link: https://github.com/giannacrisha/gcalgroups
---

## Problem

Anyone juggling more than four or five calendars in Google Calendar knows the friction: work, personal, side projects, shared team calendars, course schedules. Toggling visibility on and off is tedious — you click through each one individually every time your context shifts.

Google Calendar has no native concept of calendar groups. There's no way to say "show me only my school calendars right now" without manually clicking through all the others.

## Process

Chrome extensions are deceptively approachable — the APIs are well-documented and the manifest-to-content-script pattern is learnable in a day. The harder problem was understanding exactly how Google Calendar renders its sidebar and what DOM hooks were stable enough to build on without breaking every time Google shipped an update.

I kept the extension purely client-side: no backend, no auth, no data leaving the browser. That constraint made it faster to build, easier to trust, and simpler to maintain.

## Solution

A lightweight Chrome extension that:

- Lets you create named groups (e.g. *Work*, *Personal*, *Creative Projects*)
- Assigns any of your existing Google calendars to a group
- Toggles all calendars in a group visible/hidden with one click
- Saves time for anyone managing 5+ calendars
- Zero backend — everything stored in `chrome.storage.sync`

## Links

- **GitHub:** [giannacrisha/gcalgroups](https://github.com/giannacrisha/gcalgroups)
- **Chrome Web Store:** *(add link)*

<!-- VISUALS: Screenshots of grouping interface, before/after calendar organization — available in Downloads folder -->
