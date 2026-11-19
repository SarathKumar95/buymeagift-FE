# Frontend Engineering Instructions

## Scope

This file governs work inside `frontend/` only.

- Do not modify `backend/` unless the user explicitly asks for a full-stack change.
- Do not modify `AGENTS.md`, `CODE_STRUCTURE.md`, README files, Docker files,
  package manifests, lockfiles, or environment files unless the user explicitly
  requests that exact documentation, infrastructure, or dependency change.

## Stack

- Next.js 15 with the App Router
- React 19
- TypeScript with strict mode enabled
- Global styling in `app/globals.css`
- No component library is currently installed

Prefer existing platform and project capabilities over adding dependencies.

## Current Structure

- `app/page.tsx`: landing page
- `app/auth/page.tsx`: authentication page
- `app/dashboard/page.tsx`: account dashboard
- `app/order/page.tsx`: order flow
- `app/layout.tsx`: root layout and metadata
- `app/globals.css`: global styles and shared UI classes

Keep page-specific behavior in its page initially. Extract a shared component only
when it is reused by two or more routes or has meaningful independent behavior.

## Client and Server Boundaries

- Use Server Components by default.
- Add `"use client"` only for pages or components that need browser APIs,
  event handlers, React state, or effects.
- Keep API base-URL access centralized through
  `NEXT_PUBLIC_API_URL`, with the existing localhost fallback.
- Do not expose secrets through `NEXT_PUBLIC_*` variables.

## API Integration

- Preserve existing backend endpoint paths and request/response shapes unless the
  user explicitly approves backend contract changes.
- Include `credentials: "include"` for authenticated API requests.
- Surface useful API errors to the user; do not silently ignore failed requests.
- When a form adds data that must be persisted, update both the form contract and
  its corresponding API contract only with explicit approval for the backend work.

## UI and Accessibility

- Preserve the existing visual language: warm paper background, coral accent,
  Playfair Display headings, DM Sans body text, rounded controls.
- Use semantic HTML, associated labels, visible focus states, and native controls
  before custom interactive widgets.
- Keep layouts responsive at mobile widths.
- Do not replace the established design or rewrite unrelated pages while adding a
  feature.

## Form Behavior

- Use controlled form fields for submitted user input.
- Validate required fields in the browser, but treat server validation as
  authoritative.
- Disable submit controls while a request is in progress.
- Maintain entered data after a recoverable request failure.

## Verification

After frontend changes:

1. Run `npm run build` from `frontend/`.
2. Verify the changed route manually where possible.
3. Report commands run, outcomes, and anything that could not be tested.
4. Do not alter tests or configuration solely to make a build pass.