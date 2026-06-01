---
title: Tomodachi
description: A small wearable wellness device inspired by the Tamagotchi — a round touchscreen pixel art pet that reflects how well you're taking care of yourself. Log sleep, water, and focus breaks and the dog thrives. Skip self-care and it shows.
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
growth_stage: spark
featured: false
---

Tomodachi is a macro-HCI prototype proposal built with Mai Al Shaaban for Professor Dylan Cashman's HCI course.

The core argument: most wellness apps fail because they rely on surveillance, streaks, and shame. Tomodachi uses emotional attachment instead — you care about the dog, so you care for yourself. This is the **Tomodachi Effect**: people form genuine emotional bonds with digital creatures and change their behavior as a result.

The device snaps onto accessories like a clip or wristband via embedded N52 neodymium magnets, and delivers ambient feedback (haptic nudges, a glance at the screen) without pulling you out of what you're doing — treating the body itself as a computing environment.

**Components**
- Seeed Studio XIAO ESP32-S3 — the brain (21×17mm, WiFi/Bluetooth ready)
- GC9A01 + CST816S — 240×240 round color touchscreen with tap/swipe input
- 500mAh LiPo battery + TP4056 USB-C charging module
- N52 neodymium disc magnets for modular accessory snapping

**Firmware**
- `TFT_eSPI` — pixel art rendering on the GC9A01
- `CST816S` Arduino library — gesture recognition
- `Adafruit_DRV2605` — haptic vibration patterns

The enclosure is modeled in Blender, verified against manufacturer STEP files, and 3D-printed in PLA at ~35–40mm diameter.
