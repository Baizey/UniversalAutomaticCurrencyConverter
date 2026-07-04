# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Build
npm run build-prod        # Production bundles and zips for Chrome + Firefox
npm run build-dev         # Development build with file-watch rebuilds
npm run preview-dev       # Dev preview server for chrome_dev output on port 4173

# Test
npm test                  # Run all Jest tests
npm test -- tests/CurrencyRegex.test.ts  # Run a single test file
npm test -- --coverage    # With coverage report

# Component explorer
npm run storybook         # Storybook on port 6006, if stories are present
```

There is no dedicated lint command. TypeScript strict mode (`strict: true` in `tsconfig.json`) is the primary enforcement mechanism; `tsc` and Jest transform errors are the lint signal.

## Architecture

This is a browser extension for Chrome, Firefox, and Edge-style WebExtensions that automatically detects and converts currency amounts on web pages. The build outputs unpacked browser directories and zip files under `dist/`.

### Entry Points

| File | Role |
|------|------|
| `src/content.ts` | Content script injected into pages; loads configuration/localization, mounts the in-page UI, observes DOM changes, and converts detected currencies |
| `src/background.ts` | Background entry point; starts the service worker and reports errors through DI logging |
| `src/popup.ts` | Toolbar popup entry point; loads symbols/settings and mounts the mini converter UI |
| `src/options.ts` | Options page entry point; loads symbols/settings and mounts searchable settings sections |

`esbuild.build.ts` is the root build script. It bundles the four entry points, copies browser-specific assets from `public/{chrome,firefox}/`, concatenates shared CSS from `public/base/` into `shared.css`, updates manifest versions, and writes zipped artifacts.

`scripts/preview-dev.mjs` starts `npm run build-dev`, waits for `dist/chrome_dev`, serves it at `http://localhost:4173`, injects a Chrome API mock into extension HTML, and provides dashboard links for popup, options, and content-script previews.

### Key Layers

**`src/currencyConverter/`** - core domain logic
- `Detection/` - regex-based currency scanning plus pseudo-DOM, element, text, and site allowance detection
- `BackendApi/` - exchange-rate and symbol fetching with browser-storage caching and background delegation
- `Currency/` - amount and DOM element conversion models
- `Localization/` - active page localization and locale-aware currency interpretation
- `Live/TabState.ts` - tab-level conversion state and display updates

**`src/infrastructure/`** - platform abstractions
- `Browser/` - wraps browser API differences and extension metadata
- `Configuration/` - persistent settings backed by sync/local browser storage
- `BrowserMessengers/` - typed content, popup, tab, and background messaging
- `Logger/`, `Theme/`, `Version/` - logging, theme models, and semantic version helpers

**`src/serviceWorker/`** - background runtime
- `serviceWorker.ts` loads settings, initializes trace/localization state, checks major-version upgrades, registers context menus, and starts background message handlers
- `BackendApiCaller.ts` centralizes API calls that should run in the background context
- `contextMenuItem.ts` and `utils.ts` support context-menu actions and generated identifiers

**`src/ui3/`** - current UI layer
- Plain TypeScript DOM builders; no Preact or `src/ui2` component tree remains
- `Input.ts`, `Text.ts`, `Icons.ts`, and `Utils.ts` provide reusable DOM controls
- `ContentUi.ts` renders the in-page localization alert and context menu
- `PopupUi.ts` renders the mini converter and popup actions
- `OptionsUi.ts` renders searchable settings sections, version/update messaging, site allowance controls, disabled currencies, themes, shortcuts, and user/login UI stubs
- Styling lives in `public/base/*.css` and browser-specific content CSS under `public/{chrome,firefox}/content.css`

**`src/di/`** + **`src/provideable.ts`** - dependency injection wiring
- Uses `@baizey/dependency-injection`; `provideable.ts` combines infrastructure and currency-converter dependencies
- `di/hooks.ts` exposes `useProvider()`, `setMockProvider()`, `useServices()`, `handleError()`, and `log`
- Tests replace the real container with mocks from `tests/Container.mock.ts`

### Runtime Flow

**Content script**

1. `src/content.ts` loads configuration and active localization, then applies the selected theme.
2. Site allowance rules decide whether the page is allowed and whether conversions should show automatically.
3. `ContentUi.mount()` injects the in-page alert/context-menu root.
4. Keyboard shortcuts are registered from quality-of-life settings.
5. `ElementDetector` scans the page and later MutationObserver additions; each `CurrencyElement` converts, installs listeners, shows, and optionally highlights.

**Background/service worker**

1. `src/background.ts` calls `startServiceWorker()`.
2. Settings and active localization are loaded in service-worker mode.
3. A trace id is generated if missing.
4. Major extension upgrades can open `options.html`.
5. The browser context menu sends `openContextMenu` messages back to the active tab.
6. `backgroundHandlers.listen()` handles typed rate, symbol, detection, and account-related messages.

**Popup and options**

1. `src/popup.ts` and `src/options.ts` start loading symbols and configuration immediately.
2. On `DOMContentLoaded`, each page mounts its UI into `#uacc-root`.
3. Settings controls save directly through configuration settings; theme changes apply immediately through `ThemeHandler`.

### Browser Compatibility

Each browser gets its own manifest and static assets under `public/{chrome,firefox}/`. Shared CSS comes from `public/base/`. Keep browser-specific behavior behind `src/infrastructure/Browser/` and browser messaging abstractions so converter/domain code stays browser-agnostic.

### Testing Conventions

- Tests live in `tests/`; mocks are in `tests/*.mock.ts`
- Jest uses `ts-jest` in the default Node environment; DOM tests create JSDOM fragments through helpers such as `tests/Html.mock.ts`
- Use `setMockProvider()` from `src/di/hooks.ts` or helpers in `tests/Container.mock.ts` before exercising DI-backed code
- Keep detector, localization, amount, and DOM-conversion tests focused on domain behavior; no real browser runtime is required
