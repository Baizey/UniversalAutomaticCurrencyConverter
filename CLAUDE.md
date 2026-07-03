# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
npm run build-prod        # Production bundle for Chrome + Firefox
npm run build-dev         # Development build with watch mode

# Test
npm test                  # Run all Jest tests
npm test -- tests/CurrencyRegex.test.ts  # Run a single test file
npm test -- --coverage    # With coverage report

# Component explorer
npm run storybook         # Storybook on port 6006
```

There is no dedicated lint command. TypeScript strict mode (`strict: true` in tsconfig) is the primary enforcement mechanism; tsc errors are the lint signal.

## Architecture

This is a browser extension (Chrome, Firefox, Edge) that automatically detects and converts currency amounts on any web page. The build outputs to `dist/` with separate subdirectories per browser.

### Entry Points

| File | Role |
|------|------|
| `src/content.tsx` | Injected into every web page; detects and replaces currency text |
| `src/background.ts` | Service worker; owns exchange-rate API calls and cross-tab state |
| `src/popup.tsx` | Extension toolbar popup (quick converter UI) |
| `src/options.ts` | Extension options page (full settings) |

### Key Layers

**`src/currencyConverter/`** — core domain logic
- `Detection/` — regex-based currency scanning, element and text detectors
- `BackendApi/` — exchange-rate fetching (fixer.io / openexchangerates.org) with browser-storage caching
- `Currency/`, `Localization/` — amount representation, locale-aware formatting, 170+ currency symbols

**`src/infrastructure/`** — platform abstractions
- `Browser/` — wraps Chrome/Firefox API differences
- `Configuration/` — persistent user settings (stored in browser storage)
- `BrowserMessengers/` — typed message-passing between content ↔ background ↔ popup
- `Logger/`, `Theme/`

**`src/ui2/`** — component library (Preact, atomic design)
- `atoms/` → `molecules/` → composed into `options/`, `popup/`, `content/` page-level components
- Styled with `@baizey/styled-preact` (CSS-in-JS)
- Reactive state via `@preact/signals`

**`src/di/`** + **`src/provideable.ts`** — dependency injection wiring
- Uses `@baizey/dependency-injection`; all services are registered here
- `di/hooks.ts` exposes `useProvider()` for components
- Tests swap the real container with `tests/Container.mock.ts`

### Data Flow (content script)

1. Content script boots → reads `Configuration` from browser storage
2. `ElementDetector` / `TextDetector` walk the DOM using `CurrencyRegex` patterns
3. Matched amounts sent to `BackendApi` for rate lookup (cached)
4. `Localization` formats the converted value; DOM nodes are replaced/highlighted
5. Tab-level on/off state tracked via `TabState` and synced through `BrowserMessengers` to the background worker

### Browser Compatibility

Each browser gets its own manifest under `public/{chrome,firefox}/`. The esbuild script (`src/esbuild.build.ts`) handles per-browser bundling. The `Browser` abstraction in `src/infrastructure/Browser/` isolates API differences so domain code stays browser-agnostic.

### Testing Conventions

- Tests live in `tests/`; mocks are in `tests/*.mock.ts`
- jsdom provides the DOM environment; no real browser needed
- The DI container is replaced globally in tests via `Container.mock.ts` — most test files call `setMockProvider()` or equivalent before exercising domain logic
