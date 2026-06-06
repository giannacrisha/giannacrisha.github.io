# Digital Garden Curation Plan

**Status**: Lab projects identified and prioritized  
**Date**: June 4, 2026  
**Next Step**: Add demo links, visuals, and review copy for garden integration

---

## Lab Projects (4 Total)

### 1. BDI (Brandeis Design & Innovation Check-in Forms)

**Category**: Internal Systems / Data Collection  
**Tech Stack**: Next.js, Google Sheets API, Bun  
**Status**: Deployed (v2 active)

#### Case Study Template

**Problem**  
Design and innovation spaces need real-time feedback to make data-driven improvements. Manual feedback collection is fragmented and hard to analyze.

**Process**  
Built a streamlined check-in system that connects directly to Google Sheets. Spaces can accept feedback via touch-screen forms (1024×600 UI), and data flows instantly to a centralized sheet for analysis.

**Solution**  
A web-based check-in form that:
- Captures structured feedback from space visitors
- Pipes data to Google Sheets (no manual entry)
- Tracks check-ins across multiple spaces (AL, ML, DSL)
- Planned features: checkout flows, gamification, ratings

**Demo/Link**  
[Add deployment URL or live demo link here]

**GitHub**  
https://github.com/BrandeisMakerLab/bdi-check-in-form-v2

**Visuals**  
[Screenshots of the check-in form interface - available in Downloads/Screenshots folder]

---

### 2. Tomodachi (Wellness Companion Device)

**Category**: Hardware / Embedded Systems  
**Tech Stack**: ESP32S3, GC9A01 circular touchscreen, haptic feedback, 3D-printed enclosure  
**Status**: V1 complete (electronics working, case refined through 3 iterations)

#### Case Study Template

**Problem**  
Most wellness apps rely on surveillance, streak-anxiety, and shame to motivate behavior change. They extract attention rather than serve wellbeing.

**Process**  
Designed a wearable device inspired by Tamagotchi that uses emotional attachment instead. When you log self-care (sleep, water, focus breaks), your digital pet thrives. When you skip self-care, it shows. The device delivers ambient feedback via haptic nudges without constant interruption.

**Solution**  
A small, clip-on device featuring:
- Circular color touchscreen displaying pixel-art pet and environment
- Magnetic attachment to accessories (clip, wristband)
- Haptic vibration reminders for check-ins
- Emotion-driven motivation based on B.J. Fogg's persuasive technology theory

**Technical Insight**  
Learned that unchecked assumptions (like capacitive touch on a non-touch screen) cost hours of debugging. Building hardware requires working backwards to understand what the system is actually doing—no error logs to guide you.

**Demo/Link**  
[Add video demo or live showcase link here]

**GitHub**  
[Add repo link or mark as available upon request]

**Visuals**  
[Device photos, UI design mockups, pixel-art character designs - available in Downloads folder]

---

### 3. shlife (Project Bookshelf Organizer)

**Category**: Web App / Design Tool  
**Tech Stack**: Next.js, Supabase, Three.js, Tailwind CSS  
**Status**: MVP (actively sharing "wet paint" / unfinished work)

#### Case Study Template

**Problem**  
Creative people accumulate projects everywhere—abandoned repos, random drives, forgotten ideas. Hard to revisit, harder to share the journey (not just the polished final product).

**Process**  
Built a beautiful bookshelf interface to organize, filter, and visualize side projects. The design celebrates the creative process, not just the outcome. Includes multiple views (shelf, table, filtered search) so users can explore and rediscover their work.

**Solution**  
A project organizer with:
- Visual bookshelf display for browsing projects
- Filter options (priority, deadline, last opened, custom)
- Table view with customizable columns
- Interactive pop-up details on hover
- Philosophy: embrace "wet paint"—share unfinished work comfortably

**Design Philosophy**  
"I still obsess over every pixel, every frame, every detail—but this is me getting comfortable with the wet paint." Designed to make sharing work-in-progress feel natural, not scary.

**Demo/Link**  
[Add live demo or deployed URL here]

**GitHub**  
https://github.com/giannacrisha/shlife

**Visuals**  
[Screenshots of bookshelf view, filter view, table view, pop-up interactions - available in Downloads folder]

---

### 4. gcalgroups (Google Calendar Grouping Extension)

**Category**: Browser Extension  
**Tech Stack**: Chrome Extension API, Vanilla JS/CSS  
**Status**: Published

#### Case Study Template

**Problem**  
People juggle multiple calendars (work, personal, side projects, shared team calendars). Switching visibility on/off is tedious; there's no way to organize related calendars into groups.

**Process**  
Built a Chrome extension that adds grouping functionality to Google Calendar. Users create groups (e.g., "Work", "Personal", "Creative Projects") and toggle visibility by group instead of individually.

**Solution**  
A lightweight extension that:
- Groups related calendars together
- Toggle all calendars in a group with one click
- Saves time for people managing 5+ calendars
- Lightweight—no backend, pure client-side

**Demo/Link**  
[Add Chrome Web Store link or demo video here]

**GitHub**  
https://github.com/giannacrisha/gcalgroups

**Visuals**  
[Screenshots of the grouping interface, before/after of calendar organization - available in Downloads folder]

---

## Gallery & Archives

**Status**: Not included in this phase. You'll curate separately.

---

## Next Steps

1. **Add Demo Links**: Insert live URLs, Chrome store links, or video demos for each project
2. **Add Visuals**: Gather screenshots, device photos, UI mockups from the Downloads/Screenshots folders
3. **Add Business Context** (optional): If any project solves a specific user problem or has measurable impact, add that
4. **Review Copy**: Read through and refine—adjust tone or emphasis as needed
5. **Integrate to Garden**: Move case studies to your giannacrisha.com Lab section

---

## Files Referenced

- Tomodachi Proposal: `HCI_Pair_Project_GiAndMai.pdf`
- Tomodachi Reflection: `COSI125A-prototype-reflection.pdf`
- shlife Vision: `shlife.pdf`
- Screenshots: Available in `~/Downloads/` and `~/Desktop/Screenshots/`

