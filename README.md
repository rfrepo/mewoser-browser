# Meowsers Browser

A small Expo + React Native app for browsing your uploaded cat images, voting, favouriting, and uploading new ones via TheCatAPI.

## Quick start (dev build)

### 1) Prerequisites

- Node.js (LTS recommended) + npm
- Expo tooling (you can use `npx expo ...` without installing anything globally)
- iOS: Xcode + CocoaPods
- Android: Android Studio + an emulator (or a physical device)

### 2) Install dependencies

```bash
npm install
```

### 3) Set up environment variables (TheCatAPI key)

This app reads your API key from `EXPO_PUBLIC_THE_CAT_API_KEY`.

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set your key:

```bash
EXPO_PUBLIC_THE_CAT_API_KEY=your_key_here
```

### 4) Start a dev build

Metro is the JavaScript bundler used by React Native. Expo starts Metro for you (and shows logs/dev tools) when you run the app.

#### iOS

```bash
npm run ios
```

#### Android

```bash
npm run android
```

If you already have a native build installed and just want Metro running (for reloads, logs, and dev tools):

```bash
npm start
```

## Alternative: Expo Go (fastest)

If you prefer Expo Go:

```bash
npm start
```

Then scan the QR code from the Expo Go app.

## Useful commands

- **Run Metro/Expo**: `npm start`
- **Run iOS**: `npm run ios`
- **Run Android**: `npm run android`
- **Unit tests**: `npm test`
- **Lint**: `npm run lint`
- **Format**: `npm run format` (check: `npm run format:check`)

## Architecture (design considerations)

### Redux Toolkit (RTK) + RTK Query

We use Redux Toolkit as a scalable foundation for state and data-flow as the app grows:

- **Predictable state**: a single place to reason about app-wide state.
- **Clear boundaries**: feature code calls hooks; the store owns reducers/middleware.
- **Network-first patterns**: RTK Query gives caching, request deduping, invalidation, and consistent loading/error states out of the box.

In this repo the store is wired in `src/store/index.ts`, and API access uses RTK Query base query in `src/services/state/cat-api/catApiBaseQuery.ts`.

### Unistyles

Unistyles is used because it’s fast and feature-rich, with an architecture that sits close to the native layer:

- **Avoids unnecessary re-renders** by keeping styling computation efficient.
- **Supports breakpoints** and responsive design patterns cleanly.
- **Strong theming model** that scales as you add surfaces and variants.

### MMKV (local persistence)

MMKV is used for local persistence because it’s very quick and close to the native layer:

- **Fast reads/writes** for small, frequently accessed values.
- **Good fit for lightweight persistence** (identities, small caches, outcome tracking).

You can see it used in `src/services/persistence/installation-identity/installationIdentity.ts` and `src/services/persistence/upload-asset-key/uploadAssetKeyStore.ts`.

### Feature-first structure

Most user-facing behaviour lives in `src/features/*` (screens, components, hooks, and small domain modules). Shared cross-cutting code lives under `src/services/*` and `src/shared/*`.

## Core principles

- **Single responsibility first**: keep modules small and focused (one reason to change).
- **Composition over cleverness**: build new behaviour by composing existing components + hooks, rather than creating large “do everything” abstractions.
- **Separation of concerns**: UI components stay presentational; orchestration (navigation, mutations, side effects) lives in dedicated hooks/modules.

## Enhancements and improvements

- Add e2e tests
- Handle app state: when the app is backgrounded, pause HTTP requests
- Handle background retry if HTTP calls fail to load
- Display an offline banner UX
- Offline handling of interactions so when the app comes back online queue favourites, voting, etc
- Prevent duplicate file uploads so we don’t bombard the server
- Batch upvote and favouriting
- Notify when voting/favouring fails and display that in the UI
- Improve the upload flow into a better sequence of checks, possibly using the command pattern
- Test across a few devices

