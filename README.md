# CCTVBench

The workbench for CCTV installers. A brand-neutral, free, open-source set of calculators and reference tools for security camera work, with a desktop app for device discovery and batch activation.

Status: early development. Nothing is deployed yet.

## Tools

Planned for the first release (web):

1. Storage calculator
2. Lens / DORI calculator with a simulated camera view
3. Bandwidth calculator
4. RTSP URL builder
5. PoE power budget

The desktop app (Tauri) will add device discovery (SADP, ONVIF WS-Discovery) and batch activation. See [docs/requirements.md](docs/requirements.md) for the full scope.

## Principles

1. Vendor-neutral: works with cameras from any brand
2. No accounts, no backend: every calculation runs in your browser
3. Private: device data never leaves your machine

## Development

Requires Node 22.22+ (see `.nvmrc`) and pnpm.

```sh
pnpm install
pnpm dev        # dev server
pnpm build      # production build to dist/
pnpm test       # Vitest
pnpm lint       # Biome
pnpm lint:fix   # Biome auto-fix and format
```

Deployment uses `./deploy.sh staging|production` with targets read from a git-ignored `.env` (see `.env.example`).

## Feedback

Bug reports and feature requests: GitHub Issues.

## License and trademarks

Code is released under the [MIT License](LICENSE).

CCTVBench, the CCTVBench logo and "Developed by Aegiron" are trademarks of Aegiron 旭璿實業 and are not covered by the MIT License. Hikvision, HiLook, Dahua, Uniview, Axis and other vendor names belong to their respective owners and are used only to describe compatibility.

Developed by [Aegiron](https://aegiron.com.tw).
