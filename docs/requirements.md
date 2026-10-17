# CCTVBench Requirements

Status: living document. Open decisions are tracked in section 8.

## 1. Positioning

1. In one sentence: a brand-neutral, free, open-source toolbox for CCTV installers. The web version offers every calculator and reference tool; the desktop version (Tauri) adds what a browser cannot do: device discovery and batch activation on the local network.
2. Audience:
   a. Security installers and dealers in Taiwan (primary)
   b. Installers worldwide
   c. Aegiron's own team, which activates cameras in volume
3. Goals:
   a. Become the tool installers bookmark and install on their laptops
   b. Earn installers' goodwill toward Aegiron through "Developed by Aegiron"
4. Non-goals:
   a. Not a marketing or SEO vehicle for aegiron.com.tw
   b. No VMS, recording or live video
   c. Not positioned as a replacement for any vendor's tool
   d. No accounts, no backend, no collection of device data

## 2. Naming

| Use | Value |
|---|---|
| Product name (display) | CCTVBench (one word, CCTV in capitals + Bench) |
| Tagline (English) | TBD, proposed "The workbench for CCTV installers" |
| Tagline (zh-TW) | TBD, proposed 「監控工程師的工作台」 |
| Domain | cctvbench.com (primary), cctvbench.app (301 to .com) |
| GitHub | cctvbench/cctvbench (web and desktop in one repo) |
| package.json name | cctvbench (private: true, never published to npm) |
| Tauri productName | CCTVBench |
| Tauri identifier | com.cctvbench.desktop (immutable after first release: affects signing and auto-update) |
| Executable | cctvbench |
| License | MIT (code); the CCTVBench name and logo are trademarks of Aegiron |

Naming rules:
1. The product name and domain contain no vendor or company brand (no Aegiron, Hik, HiLook, Dahua and so on)
2. Nominative use in copy is fine: "Supports Hikvision, HiLook, Dahua, Uniview and Axis devices"
3. Never claim to replace a specific vendor tool

## 3. Architecture

1. Frontend: Astro 7 + React 19 + Tailwind 4 + Biome + Vitest + pnpm. TypeScript strict, `@/*` path alias to `src/`
2. Output: fully static (`astro build`). No backend, no accounts; every calculation runs in the browser
3. Deployment: S3 + CloudFront. Content-hashed assets are immutable, HTML has a short cache, each deploy invalidates. Bucket names and distribution IDs live in a git-ignored `.env`, never in the repo
4. i18n: English is the root (`/`), Traditional Chinese lives under `/zh-tw/`. Both locales cover every page from day one with complete hreflang. UI strings are a typed dictionary where `const zhTW: typeof en` makes a missing key a compile error
5. Desktop: Tauri 2 in `src-tauri/` in the same repo. The WebView loads the same static output. Native capabilities (UDP multicast, device HTTP APIs) live in Rust; the frontend gates them behind `isTauri()`
6. CI: GitHub Actions. Pull requests run lint and tests. A release workflow builds macOS (universal) and Windows x64, signs, publishes to GitHub Releases and feeds the Tauri updater
7. Not in scope: PWA, service worker, Linux desktop build (first release)
8. One page per tool: a pre-rendered explainer (purpose, formula, assumptions, FAQ) plus a React island. Calculator state is serialised into the URL so results can be shared

## 4. Code inherited from the Aegiron website

The storage and lens calculators started life on aegiron.com.tw. They are moved here and stripped of anything tied to a single vendor's catalogue.

Moves as-is (pure logic, with tests):
1. Lens calculator: optics, person model, simulated scene renderer
2. Storage calculator: URL state serialiser, bitrate reference table, HDD combination picker
3. Shared select styling

Removed or rewritten:
1. Recorder recommendations (NVR/DVR model matching, HDD bundles, PoE switch pairing): removed entirely
2. Any import of the vendor product catalogue: removed
3. Model combobox (pick a camera model to fill sensor, lens and resolution): replaced by manual input plus generic presets (sensors 1/2.8" and 1/1.8"; focal lengths 2.8, 4, 6 and 12 mm; resolutions 2, 4, 5 and 8 MP)
4. UI strings: rebuilt from scratch in this repo

Follow-ups on aegiron.com.tw once this site is live: its calculator pages redirect (301) here and its support hub links out.

## 5. Scope

### Phase 1: Web MVP

1. Storage calculator (migrated, vendor-neutral)
2. Lens / DORI calculator with simulated camera view (migrated, vendor-neutral)
3. Bandwidth calculator: resolution, fps, codec and channel count to total Mbps, plus the upload bandwidth needed for remote viewing
4. RTSP URL builder: mainstream formats (Hikvision / HiLook, Dahua, Uniview, Axis and others), main and sub stream, credentials, one-click copy
5. PoE power budget: 802.3af / at / bt classes, switch budget, cable length losses
6. Home page (tool list), About page ("Developed by Aegiron"), SEO content per page, OG images
7. Redirects and outbound links from the Aegiron website

### Phase 2: Desktop

1. SADP spike (go / no-go, first thing): from Rust, discover and activate one inactive HiLook camera. Confirm whether plain UDP multicast (239.255.255.250:37020) is enough or raw Ethernet frames (Npcap / BPF, heavy install friction) are required. References: the hiktools Python project and Wireshark captures of the official SADP tool
2. Tauri shell, code signing, GitHub Releases, auto-update
3. Device discovery: SADP plus ONVIF WS-Discovery. Columns: model, serial, IP, MAC, activation state, firmware, DHCP
4. Single and batch activation (set admin password), IP change (static / DHCP), CSV export
5. Network tool pages on the web show "Requires the desktop app" with a download button

### Phase 3: Backlog (by demand)

1. Subnet / IP calculator, cable voltage drop (12 V DC), RAID usable capacity, common ports and defaults reference
2. Batch configuration over ISAPI (NTP, time zone, OSD, streams), batch firmware upgrade
3. Community-maintained device database (JSON: model to sensor, lens, resolution) so the lens calculator can offer models without binding to one brand

## 6. Non-functional requirements

1. Offline: every desktop tool works offline (static assets bundled)
2. Performance: every tool page scores 90 or more on all four Lighthouse categories; no non-essential JS above the fold
3. Privacy: no accounts, no backend. Device data (IP, MAC, serial, passwords) never leaves the machine, never reaches analytics, never gets logged
4. Safety (desktop): batch operations list the affected devices and ask for confirmation first; password fields never echo and are never persisted; updates are verified against the Tauri updater public key
5. Quality: all calculation logic is pure functions covered by Vitest; key formulas are regression-tested against known reference values (Hikvision and Axis official calculators)
6. Support: evergreen browsers (last two versions); desktop macOS 12+ and Windows 10+
7. Accessibility and interaction: keyboard operable; every `<button>` gets `cursor-pointer` (see CLAUDE.md)
8. Content format for zh-TW: full-width punctuation after Chinese, numbered list hierarchy, English for technical terms (see CLAUDE.md)
9. Screenshots: serial numbers, MAC addresses and IPv6 link-local addresses are always masked (see CLAUDE.md)

## 7. Brand presence

1. Footer: "Developed by Aegiron 旭璿實業" linking to aegiron.com.tw. The About page may add a paragraph on why the tool exists
2. No product advertising, no product links, no contact form. Feedback goes through GitHub Issues
3. README: "Developed by Aegiron". License and trademark are stated separately (code under MIT; the CCTVBench name and logo are Aegiron trademarks)

## 8. Open decisions

1. Taglines (English and zh-TW)
2. Analytics: GA4, Plausible, Umami or none at launch
3. Confirm the five Phase 1 tools
4. macOS: one universal binary or separate Intel and Apple Silicon builds (universal proposed)

Decided: English at the root locale; MIT license; Astro 7.
