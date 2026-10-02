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
featured: true
frame_shape: circle
cover_image: /lab/tomodachi.png
mux_video_id: xdu9rPbCOjatVb0201gxzmoIX3upeMtUA8KARhAGM6kgM
challenge: Design a prototype solving a problem related to Macro-HCI.
with: "COSI 125: Human Computer Interaction"
role: Design Engineer (end-to-end)
timeline: Spring 2026
team:
  - Gianna Saludo (protoype)
  - Mai Al Shaaban (presentation)
---

<!-- How to fill this page:
     Media slots: put an image inside the empty figure, e.g.
       <figure class="cs-media" data-label="sketches"><img src="/lab/tomodachi-sketches.png" alt="sketches"></figure>
     Part links: set href to the amazon url and data-img to the part's image path, e.g.
       <a class="cs-part" href="https://www.amazon.com/..." data-img="/lab/round-display.png">round display</a> -->

<div class="cs-split">
<div>

## Summary

<figure class="cs-media"><tomodachi-demo></tomodachi-demo></figure>

</div>
<div>

## Concept

### Sketch

I started out by sketching what the device would look like and i went through a bunch of iterations and CAD-ed two of my top choices.

<figure class="cs-media" data-label="sketches"></figure>

### What do I need?

I wanted it to be a circular keychain, so that I could carry it around. I also know I needed a microcontroller that had a type-C port. I want it to be as energy efficient as possible with a tiny battery. With all those information, I built my list:

- <a class="cs-part" href="" data-img="">round display</a>
- <a class="cs-part" href="" data-img="">microcontroller</a>
- <a class="cs-part" href="" data-img="">battery</a>
- <a class="cs-part" href="" data-img="">case</a>

</div>
</div>

---

## Design

It’s a prototype, so I wanted it to be really simple. After my parts came in, it was time to figure out how to build the device.

### Circuit Design

With the help of previous physics knowledge, i sketched the diagram and tried it out on my breadboard. I spent an hour or two, trying to figure this out. Once I finally got it working, I connected it all!

<figure class="cs-media" data-label="picture"></figure>

### Visual Design

I was inspired by the Tamagotchi and its resurgence on the web, and I wanted to make something close to that so I thought of the word “*<span class="cs-tip" data-tip="友達 (ともだち) · friend">Tomodachi</span>.*” I also liked the show *Smiling Friends*, so I thought it would be a great idea to mesh the two and have the tomodachi switch faces when the user interacts (or doesn’t!) with the app. So, I animated four sprites with different colors and emotions for the display.

<figure class="cs-media" data-label="sprites"></figure>

### App Design

<figure class="cs-media" data-label="figma board"></figure>

### PCB Design

This was the version I submitted for the project, however, I wanted to take it to the next level and design my own PCB, so I decided to learn KiCAD for this. After many youtube videos and articles, I designed my first PCB!

<figure class="cs-media" data-label="schematic"></figure>

### Case Design

So, it was time to piece everything together and 3d print the case. This case is going to be a simple one, with a type-c hole. At first, I wanted it to look like the house from Smiling Friends, but I realized it was too bulky and I would not want to carry it like that. So, it took me five revisions until I was satisfied with how it looked like.

<figure class="cs-media" data-label="revisions"></figure>

And after I got the custom pcb, I needed to refine the case design again.

<figure class="cs-media" data-label="revisions (custom pcb)"></figure>

---

## Challenges

1. The colors were off at first and I was stuck for a while, and I implemented a fix in the arduino and it worked.
2. Designing a case and working with the components was a challenge! Greg, my mentor and Head of the MakerLab, helped me out a lot and answered my questions.
3. I ordered the wrong display without the touch layer. However, upon evaluation, having a companion app was better since the screen was small and I wanted it to be a keychain.

---

## Conclusion

Tomodachi was a fun project that taught me how to design a product end to end. I’d definitely make other tomodachi’s in the future. For instance, a Claude and Codex tomodachi signals me whenever my agents needed input or permissions.
