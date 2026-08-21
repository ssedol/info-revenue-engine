# Project Overview

## What This Project Is

`info-revenue-engine` is a reusable core project for ad-supported information sites.

The first site built on top of this core is a certification article site named `자격증 인사이트`.

This repository should be understood as two layers:

1. Core Engine
   - Shared foundation for future information sites.
   - Handles layout patterns, SEO helpers, ad slots, analytics placeholders, static data conventions, and build/deploy setup.
   - Should stay reusable when another topic is added later.

2. Site Implementation
   - The current implementation is the certification site.
   - Its content, categories, article data, official resource links, and Q-Net related information live under `src/sites/certifications`.
   - Pages in `src/app` render this site using the shared core.

## Current Site

Name: `자격증 인사이트`

Purpose:
- Publish readable article-style certification information.
- Help users compare certifications, understand study strategy, and find official reference links.
- Drive search traffic into article pages.
- Show ads only on article detail pages, not on the main/list/navigation pages.

Current content model:
- Articles are maintained as static TypeScript data in `src/sites/certifications/articles.ts`.
- Official/reference links are maintained in `src/sites/certifications/officialResources.ts`.
- Q-Net checked information for selected certifications is maintained in `src/sites/certifications/qnetOfficial.ts`.

## Core Engine Responsibilities

The core layer should contain reusable building blocks:

- `src/core/ads`
  - `AdSlot` and provider switching.
  - Kakao AdFit first, Google AdSense replaceable.
  - Placeholder mode works without real ad IDs.

- `src/core/analytics`
  - GA4 and Search Console placeholder wiring.
  - No analytics ID is required for local development.

- `src/core/config`
  - Site-level config such as name, URL, topic, and locale.

- `src/core/data`
  - Atomic JSON publishing helpers for future data pipelines.

- `src/core/seo`
  - Metadata, sitemap, robots, canonical, structured data, and SEO helpers.

- `src/core/ui`
  - Shared UI utilities such as breadcrumbs.

## Certification Site Responsibilities

The certification implementation should contain topic-specific logic only:

- Article content and article categories.
- Certification-specific SEO route definitions.
- Official Q-Net/reference resources.
- Certification-specific components such as Q-Net official panels.
- Certification data fixtures and published static JSON.

The site should not hard-code unrelated future topics into the certification implementation.

## Data And API Direction

Current MVP:
- No DB.
- No Auth.
- No Supabase, PostgreSQL, Prisma, or ORM.
- Static article content is enough to build and deploy.
- API collector scripts exist, but they are not part of the required build path.

Future direction:
- Data can be collected from official/public sources.
- Raw data should be preserved.
- Normalized data should be validated before publishing.
- Published files should be written atomically so partial/corrupt JSON is not exposed.

## Article Page Rules

Main/list pages:
- Show article lists clearly.
- Do not show ads.
- Do not add decorative text that does not help the user choose an article.

Article detail pages:
- May show ads.
- Must keep ads visually distinct from content.
- Must not disguise ads as menu items, official links, download buttons, or CTAs.
- Must show official/reference links as clear buttons when the article mentions official information.
- Must avoid meaningless UI text such as fake copy confirmations, fake comment counts, or placeholder labels.

## Adding A Future Site

When a second topic is selected later:

1. Keep shared functionality in `src/core`.
2. Add the new site under `src/sites/<topic>`.
3. Add app routes that render that topic.
4. Reuse `AdSlot`, SEO helpers, analytics placeholders, and static data conventions.
5. Do not mix the new topic's content into the certification site unless it is intentionally part of that site's editorial scope.

## Deployment Direction

Target deployment:
- GitHub repository as source of truth.
- Vercel connected to GitHub for automatic deployments.
- Mobile editing can happen through GitHub web/editor tools once the repository is pushed.

Required before production:
- Set `NEXT_PUBLIC_SITE_URL`.
- Set ad provider and ad unit IDs when available.
- Set analytics/search verification IDs when available.
- Re-check official links and article content before publishing publicly.
