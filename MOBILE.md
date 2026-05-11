# Web → native mobile

Ideal **Expo** candidate: mood + journal + static resources. Move **`localStorage`** to **AsyncStorage** or **SQLite**; keep prompts + crisis links as a JSON module in `src/lib/resources.ts` shared with web.

## PWA

**vite-plugin-pwa** precaches the app shell; `manifest.webmanifest` adds install shortcuts. After first visit, the UI loads offline; sync still needs network if you add a backend later.
