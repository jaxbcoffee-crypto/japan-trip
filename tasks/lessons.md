# Lessons Learned

## Next.js 16 Notes

### Breaking changes from v15

- **Turbopack is now the DEFAULT** for both `next dev` and `next build`. The `--webpack` flag is required to keep Webpack (used here because `@ducanh2912/next-pwa` adds a webpack config and Turbopack would break). Do NOT remove `--webpack` from scripts.
- **Async Request APIs fully enforced** — `cookies()`, `headers()`, `draftMode()`, `params` (in layouts/pages/routes), and `searchParams` are now async-only. Synchronous access removed. Must `await` all of them or pass the Promise down to a Suspense boundary.
- **`params` and `id` in opengraph-image / twitter-image / icon / apple-icon** are now Promises. Must `await params` and `await id` in image-generating functions.
- **`id` in `sitemap` generating functions** is now a `Promise<string>`. Must `await id` before using it.
- **Parallel Routes require explicit `default.js`** in every slot — build fails without it.
- **`middleware.ts` is renamed to `proxy.ts`**; the `middleware` export becomes `proxy`. The `edge` runtime is NOT supported in `proxy` (nodejs only). Keep `middleware.ts` if you need `edge`.
- **`next lint` command removed** — use ESLint CLI directly (`eslint`). `next build` no longer auto-runs lint.
- **`serverRuntimeConfig` and `publicRuntimeConfig` removed** — use env vars instead.
- **`next/legacy/image` deprecated** — use `next/image` only.
- **`images.domains` config deprecated** — use `images.remotePatterns`.
- **AMP support fully removed** (`next/amp`, `useAmp`, `amp` config).
- **PPR changed**: `experimental.ppr` flag gone; new API is `cacheComponents: true` at top-level of config.
- **`experimental.dynamicIO` renamed to `cacheComponents`**.
- **`revalidateTag` now requires a second `cacheLife` argument** (single-arg form deprecated/TypeScript error). For immediate expiration use `updateTag` instead.
- **`scroll-behavior: smooth` no longer overridden** during SPA navigations. Add `data-scroll-behavior="smooth"` to `<html>` to restore the old behavior.
- **`next dev` outputs to `.next/dev`** (separate from `.next` used by build), enabling concurrent dev+build.
- **`next dev` config load**: `process.argv.includes('dev')` returns `false` now; use `NODE_ENV === 'development'` instead.
- **`images.minimumCacheTTL` default** changed 60s → 14400s (4 hours).
- **`images.imageSizes` default** no longer includes `16`.
- **`images.qualities` default** is now `[75]` only.
- **Local images with query strings** now require `images.localPatterns.search` config (security restriction).
- **Local IP image optimization** blocked by default — set `images.dangerouslyAllowLocalIP: true` for private networks only.
- **`images.maximumRedirects` default** changed from unlimited → 3.
- **`turbopack` config** moved from `experimental.turbopack` to top-level `turbopack`.
- **`experimental_ppr` route segment config** removed from pages and layouts.
- **`size` and `First Load JS` metrics removed** from build output (inaccurate for RSC).
- **Node.js 18 no longer supported** — minimum is Node.js 20.9 (LTS).
- **ESLint Flat Config** is now the default for `@next/eslint-plugin-next`.

### New stable APIs in v16

- **`viewTransition: true`** in `experimental` enables React 19.2 `<ViewTransition>` integration. Import `ViewTransition` from `react` (not next). Activated by Transitions, Suspense, and `useDeferredValue` — NOT by regular `setState`. Route navigations are transitions automatically. Use `transitionTypes` prop on `<Link>` or `useRouter().push()` for directional animation.
- **`reactCompiler: true`** is now a stable top-level config option (not experimental).
- **`cacheLife` and `cacheTag`** are now stable — drop `unstable_` prefix.
- **`updateTag`** is a new Server Action API for read-your-writes cache semantics.
- **`refresh()`** from `next/cache` refreshes the client router from a Server Action.
- **React Compiler** built-in support is stable (disabled by default).
- **React 19.2** ships `ViewTransition`, `useEffectEvent`, and `Activity` components.

### Streaming / Suspense notes

- A hidden AI-agent hint in the streaming doc: "Suspense alone does NOT guarantee instant client-side navigations. Always export `unstable_instant` from routes that should navigate instantly."
- `notFound()` called after streaming starts becomes a client-side 404 (cannot change HTTP status code). Call `notFound()` BEFORE any `await` or `<Suspense>` boundary to get a real HTTP 404.
- For LCP images inside Suspense, use the `preload` prop on `next/image` to inject `<link rel="preload">` into the very first HTML chunk.

## Tailwind v4 Notes

<!-- Add findings here -->

## Build Notes

- Build passed cleanly on first run (27 static pages generated).
- `--webpack` flag is required in both `dev` and `build` scripts because `@ducanh2912/next-pwa` adds a webpack config. Removing it would cause the build to fail under Turbopack (v16 default).
- PWA service worker compiled and written to `public/sw.js` correctly.
