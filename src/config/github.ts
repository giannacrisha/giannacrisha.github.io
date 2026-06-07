// src/config/github.ts
// Single source of truth for GitHub API constants used by CommunityGarden and plant.ts.
export const REPO_OWNER = import.meta.env.GITHUB_REPO_OWNER ?? 'giannacrisha';
export const REPO_NAME  = import.meta.env.GITHUB_REPO_NAME  ?? 'giannacrisha.github.io';
export const LABEL      = import.meta.env.GITHUB_GARDEN_LABEL ?? 'community-garden';
