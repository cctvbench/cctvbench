# CLAUDE.md

Requirements and scope: [docs/requirements.md](docs/requirements.md). Read it before proposing features.

## First principle

KISS. Keep code and requirements simple; do not add complexity without a reason.

When a new requirement comes in, always ask before building:
1. Does it conflict with an existing requirement?
2. Does it have real value for an installer?
3. Which details are still unclear?

## Public repository

This repo is public under MIT. Never commit:
1. Deployment targets (bucket names, distribution IDs, AWS profiles): they live in the git-ignored `.env`
2. Device identifiers from real sites (serial numbers, MAC addresses, passwords) in code, tests, fixtures or screenshots
3. Internal business notes. Those live outside the repo

## Commands

- `pnpm dev`: dev server
- `pnpm build`: production build
- `pnpm build:staging`: staging build to `dist-staging/`
- `pnpm deploy:staging` / `pnpm deploy:prod`: test + build + deploy (`./deploy.sh`)
- `pnpm test`: Vitest (also runs before every deploy)
- `pnpm lint`: Biome lint
- `pnpm lint:fix`: Biome auto-fix + format

## Code style

Formatting is Biome's job (single quotes, semicolons, indent 2, line width 140); do not restate config defaults.

1. Files kebab-case; variables camelCase; components PascalCase
2. A one-line `if` needs no braces: `if (condition) doSomething();`
3. Keep an object on one line when it fits with its surrounding code: `{ a: 1, b: 2 }`
4. Comments in English, only where the flow is not obvious
5. Imports use the `@/*` path alias
6. Calculation logic is pure functions in `.ts` files with Vitest tests next to them; React components only render and wire state

## Interactive elements

Tailwind 4's reset removes the default `cursor: pointer` on `<button>`, so:

1. `<a href>`: browser default already gives pointer, add nothing
2. `<button>`: always add `cursor-pointer`
3. Disabled state: add `disabled:cursor-not-allowed`
4. `<div>` or `<span>` with `onClick`: add `cursor-pointer`
5. Special cases as appropriate: `cursor-zoom-in`, `cursor-grab`

## i18n

English is the root locale; zh-TW lives under `/zh-tw/`. Every page exists in both. UI strings are a typed dictionary: `const zhTW: typeof en` so a missing key fails to compile.

## Traditional Chinese content rules

Apply to zh-TW UI strings and any Chinese documentation:

1. Parentheses after Chinese are full-width （） with no spaces; after English, half-width with a leading space (); if the content inside is Chinese, always full-width. Exception: tables stay compact with half-width and no spaces
2. Colons after Chinese are full-width （：）; after English, half-width (:)
3. Lists prefer numbers; nesting goes 1, 2, 3 → a, b, c → i, ii, iii
4. Prefer English for technical terms (Connection Pool rather than a translation); everyday words like 資料庫 stay Chinese

## Screenshots

Before adding or replacing any screenshot, mask:

1. Device identifiers: serial numbers (including short serials), MAC addresses
2. IPv6 link-local addresses (`fe80::…`), since they reveal the MAC
3. Passwords, security question answers, customer or staff names, site names
4. Safe to keep: private IPs (192.168.x.x), model names, firmware versions, already-dotted password fields
5. Mask only the value, keep the field label; no readable character at the edges; zoom in to check

## Docs in sync

Any change to build, deploy or project structure updates README.md in the same commit.
