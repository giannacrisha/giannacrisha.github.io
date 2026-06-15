# Features to develop

## Feature wall (`src/pages/index.astro` — `.featurewall` section)

- **Fix circle frame image clipping**: The project image inside `.frame-slot--circle` gets clipped by the ornate frame border. Need to add inset padding on the `.frame-project-img` so the full image is visible within the circular opening of `frame-circle.png`. The tomodachi cover image (`/lab/tomodachi.png`) is the test case — it's a locket/padlock photo with whitespace around it that should sit fully inside the circle cutout. Approach: add a per-shape CSS rule (e.g. `.frame-project-img--circle`) that uses `inset` + `object-fit: contain` to pull the image inside the frame's circular viewport, then calibrate the inset values visually against the frame overlay.
