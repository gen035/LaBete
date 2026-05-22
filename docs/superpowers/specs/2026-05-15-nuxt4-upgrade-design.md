# Nuxt 4 Upgrade — Design Spec

**Date:** 2026-05-15
**Project:** LaBete
**Author:** Geneviève Perron Migneron

## Overview

Migrate the LaBete site from Nuxt 2 / Vue 2 to Nuxt 4 / Vue 3. The driving motivation is staying current (Nuxt 2 is end-of-life). The approach is a fresh Nuxt 4 scaffold on a dedicated `migration/nuxt4` branch, with code ported in phases. `master` remains the live production branch throughout.

## Approach

**Fresh scaffold on a branch.** Create `migration/nuxt4` from `master`, run `nuxi init --force` to lay down the Nuxt 4 baseline (overwrites `package.json`, creates `nuxt.config.ts` and `app.vue`), then migrate existing code phase by phase. Each phase is independently testable before the next begins.

Not used: `@nuxtjs/bridge` (skipping the Nuxt 2→3 intermediate step), in-place upgrade (too many simultaneous breakages to debug).

## Dependency Changes

### Drop entirely
| Package | Reason |
|---|---|
| `@nuxtjs/axios` | Replaced by built-in `$fetch` / `useFetch` |
| `@nuxtjs/dotenv` | Nuxt 4 reads `.env` natively |
| `cookie-universal-nuxt` | Replaced by built-in `useCookie()` |
| `vue2-google-maps` | Dropped — Google Maps integration removed |
| `vue2-gmap-custom-marker` | Dropped — Google Maps integration removed |
| `sass-loader` | Vite handles Sass natively |
| `sass-google-fonts` | Replace with `@font-face` in SCSS or a `<link>` tag |
| `bootstrap-vue` | Bootstrap 5 (already a dep) works natively with Vue 3 |

### Renamed / replaced
| Current | New |
|---|---|
| `nuxt-i18n` v5 | `@nuxtjs/i18n` v9 |
| `prismic-nuxt` | `@prismicio/nuxt` |

### Added
| Package | Purpose |
|---|---|
| `@pinia/nuxt` + `pinia` | Replaces Vuex |
| `vue3-carousel` | Replaces `vue-slick-carousel` |
| `glightbox` | Replaces `vue-light-gallery` |

### Unchanged
- `bootstrap` 5.x
- `swell-js` (plain JS, no Vue dependency)
- `v-lazy-image` (has Vue 3 support)
- `sass`

## Migration Phases

### Phase 1 — Scaffold & Config
- Create `migration/nuxt4` branch
- Run `npx nuxi@latest init --force` in the repo root
- Migrate `nuxt.config.js` → `nuxt.config.ts`:
  - `mode: 'universal'` + `target: 'static'` → removed; static generation is now just `nuxt generate` (Nuxt 4 drops the `target` option). Dynamic routes that the crawler can't auto-discover go in `nitro.prerender.routes`.
  - `publicRuntimeConfig` → `runtimeConfig.public`
  - `css`, `head`, `loading` — direct equivalents exist
  - Modules section updated to new package names and config formats
- Install all new dependencies
- Goal: `nuxt dev` starts (app.vue placeholder is fine at this stage)

### Phase 2 — Plugins
- Migrate `plugins/swell.js` to Nuxt 4 plugin format
- Remove `plugins/axios.js` entirely
- Prismic and i18n plugins are handled by their respective modules

### Phase 3 — Store (Vuex → Pinia)
- Convert `store/index.js` → `stores/main.ts`
- Convert `store/cart.js` → `stores/cart.ts`
- Convert `store/product.js` → `stores/product.ts`
- Replace `nuxtServerInit` with a server-only Nuxt plugin at `plugins/init.server.ts` that fetches categories, settings, newsletter, and message data from Prismic/Swell and populates the Pinia stores on the server side

### Phase 4 — Layouts
- Port `layouts/default.vue` and `layouts/error.vue`
- Port layout sub-components: `Header.vue`, `Footer.vue`, `MobileNav.vue`, `Notification.vue`
- Port modal components: `CookieModal.vue`, `CookiePreferencesModal.vue`, `NewsletterModal.vue`, `MessageModal.vue`
- These components reference the store heavily — complete Phase 3 first

### Phase 5 — Pages
Port in order from simplest to most complex:
1. `cookie-policy.vue`, `privacy-policy.vue`, `return.vue` (mostly static)
2. `contact.vue`, `glossary.vue`, `videos.vue`
3. `blog/`, `events.vue`, `artist.vue`, `brand.vue`, `creations.vue`
4. `products/` (Swell integration)
5. `index.vue` (Prismic + Swell, most complex)

Key pattern changes per page:
- `asyncData({ app, store })` → `useAsyncData()` + `usePrismic()` composable
- `store.state.i18n.locale` → `useI18n().locale`
- `nuxtI18n` component option → `definePageMeta({ i18n: { paths: {...} } })`
- `head()` → `useHead()` / `useSeoMeta()`

### Phase 6 — Components
- Port all remaining components
- Replace `vue-slick-carousel` in `Slider.vue` with `vue3-carousel`
- Replace `vue-light-gallery` / `lightGallery.client.js` plugin with `glightbox`
- Remove any `bootstrap-vue` specific element syntax (`<b-modal>`, `<b-button>`, etc.) — replace with native Bootstrap 5 HTML + JS or `data-bs-*` attributes

## Key API Migration Patterns

### Plugin format
```js
// Nuxt 2
export default (context, inject) => { inject('swell', swell) }

// Nuxt 4
export default defineNuxtPlugin(() => ({ provide: { swell } }))
```

### Data fetching in pages
```js
// Nuxt 2
async asyncData({ app, store }) {
  const locale = store.state.i18n.locale
  const data = await app.$prismic.api.query(...)
  return { data }
}

// Nuxt 4
const { $prismic } = useNuxtApp()
const { locale } = useI18n()
const { data } = await useAsyncData('key', () =>
  $prismic.client.getAllByType('home', { lang: `${locale.value}-ca` })
)
```

### Store access
```js
// Nuxt 2
this.$store.commit('SET_CATEGORIES', categories)
this.$store.getters['cart/getCart']

// Nuxt 4
const store = useMainStore()
store.setCategories(categories)
const cartStore = useCartStore()
cartStore.cart
```

### Cookies
```js
// Nuxt 2
this.$cookies.set('labete_newsletter', true)

// Nuxt 4
const cookie = useCookie('labete_newsletter')
cookie.value = true
```

### i18n page paths
```js
// Nuxt 2 component option
nuxtI18n: { paths: { fr: '/', en: '/' } }

// Nuxt 4
definePageMeta({ i18n: { paths: { fr: '/', en: '/' } } })
```

### Unchanged
- `<client-only>` — works identically in Nuxt 4
- Options API in `.vue` files — Vue 3 fully supports it, no forced rewrite required
- SCSS in `assets/` — same structure, same import paths

## What Is Not Changing
- Static generation target (`nuxt generate`) — still supported in Nuxt 4
- The overall component structure and directory layout (`pages/`, `components/`, `layouts/`, `locales/`)
- Options API usage in existing components (Vue 3 supports it)
- `swell-js` integration logic
- SCSS asset structure

## Out of Scope
- Rewriting components from Options API to Composition API (not required)
- TypeScript adoption (config will be `.ts` but component scripts can stay `.js`)
- Any new features beyond the migration itself
