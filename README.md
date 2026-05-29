# gi's digital garden

A personal digital garden built with Astro.

## Running locally

```bash
npm install
npm run dev
```

Visit `http://localhost:4321`.

## Adding content

### Archives (essays, poems, thoughts)
Create `src/content/archives/your-slug.mdx`:
```mdx
---
title: your title
type: essay  # essay | poem | thought
date_written: 2025-01-01
date_published: 2025-01-15
growth_stage: spark  # dust | spark | star
tags: [optional, tags]
---

Your content here.
```

### Lab (projects)
Create `src/content/lab/your-slug.mdx`:
```mdx
---
title: your project
description: one-line description
date_built: 2025-01-01
date_published: 2025-01-15
tools: [Astro, Figma]
growth_stage: spark
link: https://yourproject.com  # optional
```

### Gallery
Create `src/content/gallery/your-slug.mdx`:
```mdx
---
title: artwork title
medium: watercolor
date_made: 2025-01-01
date_published: 2025-01-15
image: /images/gallery/your-image.jpg
growth_stage: star
```

Place images in `public/images/gallery/`.

### Library
Create `src/content/library/your-slug.mdx`:
```mdx
---
title: Film Title
creator: Director Name
year: 2000
type: film  # film | book | album | show | other
date_added: 2025-01-10
rating: 4.5
```

## Deploying

Connected to Vercel via GitHub. Push to `main` to deploy.

The design system is at `/system` (not in nav or sitemap).
