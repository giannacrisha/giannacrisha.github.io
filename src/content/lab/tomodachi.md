---
title: tomodachi
description: A wearable digital wellness device inspired by the Tamagotchi
date_built: 2026-04-20
tools:
  - ESP32-S3
  - GC9A01 Touchscreen
  - TFT_eSPI
  - Adafruit DRV2605
  - Blender
  - Arduino
topics:
  - tech
  - design
growth_stage: spark
featured: false
cover_image: /lab/tomodachi.png
mux_video_id: xdu9rPbCOjatVb0201gxzmoIX3upeMtUA8KARhAGM6kgM
---

## Problem

Most wellness apps fail. Not because they're poorly designed, but because they use the wrong motivational model — surveillance, streaks, and shame. They extract attention rather than serve wellbeing. You miss a day and a red broken streak tells you you've failed. You keep a streak and feel anxious about losing it.

The behavior change literature (BJ Fogg, in particular) points to something different: small, immediate feedback loops tied to things you already care about work far better than punishment-based systems.

## Process

The starting hypothesis was the **Tomodachi Effect**: people form genuine emotional bonds with digital creatures, and those bonds change their behavior. If you care about the pet, you care for yourself.

Built as a macro-HCI prototype proposal with Mai Al Shaaban for Professor Dylan Cashman's HCI course at Brandeis.

Hardware constraints shaped every design decision. The 240×240 circular display is beautiful but small — pixel art was the right visual language. Magnetic attachment meant no permanent commitment; you clip it somewhere that makes sense for your day.

The hardest lesson: unchecked assumptions cost hours. I assumed the GC9A01 display had capacitive touch built in. It didn't — the touch layer is a separate component (CST816S) that needed its own integration. Building hardware means working backwards from what the system is *actually* doing, with no error logs to guide you.

The enclosure went through three printed iterations — each one tighter against the manufacturer STEP files, each one smaller than the last.

## Solution

A clip-on wearable device featuring:

- **Circular 240×240 color touchscreen** — pixel-art pet and environment rendered via `TFT_eSPI`
- **Touch input** — tap and swipe gestures via the CST816S gesture recognizer
- **Haptic feedback** — ambient vibration reminders via the Adafruit DRV2605, without pulling you out of what you're doing
- **Magnetic attachment** — N52 neodymium disc magnets snap to a clip, wristband, or bag strap
- **500mAh LiPo + USB-C charging** — all-day battery, no proprietary cables
- **3D-printed PLA enclosure** — ~35–40mm diameter, modeled in Blender

**The Tomodachi Effect in practice:** when you log self-care (sleep, water, focus breaks), the pet thrives — its environment brightens, it moves differently. When you skip it, the pet shows it. No streaks, no shame. Just a creature you care about.

## Links

- **Demo:** *(add video demo or showcase link)*
- **GitHub:** *(available upon request)*

<!-- VISUALS: Device photos, UI design mockups, pixel-art character designs — available in Downloads folder -->
