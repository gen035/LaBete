# Nuxt 4 Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate LaBete from Nuxt 2/Vue 2 to Nuxt 4/Vue 3 on a fresh `migration/nuxt4` branch, with all pages rendering and `nuxt generate` producing a valid static site.

**Architecture:** Fresh Nuxt 4 scaffold over the existing source tree on a dedicated branch. Vuex replaced by Pinia. `nuxtServerInit` replaced by `plugins/02.init.server.ts`. `asyncData` replaced by `useAsyncData` + `usePrismic`. Bootstrap Vue removed; plain Bootstrap 5 HTML used instead. `master` stays untouched throughout.

**Tech Stack:** Nuxt 4, Vue 3 (Options API), Pinia, `@prismicio/nuxt`, `@nuxtjs/i18n` v9, `swell-js`, Bootstrap 5, `vue3-carousel`, `glightbox`, Vitest + `@nuxt/test-utils`

---

## Prismic API Quick Reference

Old → New conversions used throughout all tasks:

| Old (`prismic-nuxt`) | New (`@prismicio/nuxt`) |
|---|---|
| `app.$prismic.api.query(app.$prismic.predicates.at('document.type', TYPE), { lang })` | `$prismic.client.getAllByType(TYPE, { lang })` |
| `app.$prismic.api.getByID(id)` | `$prismic.client.getByID(id)` |
| `this.$prismic.asText(field)` | `import { asText } from '@prismicio/client'` then `asText(field)` |
| `store.state.i18n.locale` | `useI18n().locale.value` |

---

## Bootstrap Vue → Bootstrap 5 Quick Reference

| Old (`bootstrap-vue`) | New (Bootstrap 5 HTML) |
|---|---|
| `<b-row>` / `<b-col cols="4">` | `<div class="row">` / `<div class="col-4">` |
| `<b-card>`, `<b-card-body>`, `<b-card-text>` | `<div class="card">`, `<div class="card-body">`, `<p class="card-text">` |
| `<b-sidebar id="cart" v-model="show">` | `<div class="offcanvas offcanvas-end" id="cart">` + Bootstrap 5 JS |
| `<b-alert :variant="type" :show="show" :dismissible="true">` | `<div class="alert alert-{{ type }} alert-dismissible fade show" role="alert">` |
| `<b-form-checkbox v-model="val">` | `<input class="form-check-input" type="checkbox" v-model="val">` |
| `<b-form-checkbox-group v-model="vals">` | Wrap checkboxes in `<div class="d-flex flex-wrap gap-2">` |
| `<b-dropdown text="label">` `<b-dropdown-item>` | `<div class="dropdown">` + `<button data-bs-toggle="dropdown">` + `<ul class="dropdown-menu"><li><a class="dropdown-item">` |

---

## Phase 1 — Scaffold & Config

### Task 1: Create migration branch and scaffold

**Files:**
- Create: `app.vue`
- Create: `nuxt.config.ts`
- Delete: `nuxt.config.js` (after Task 2)

- [ ] **Step 1: Create the branch**

```bash
git checkout master
git checkout -b migration/nuxt4
```

- [ ] **Step 2: Run nuxi init with force**

```bash
npx nuxi@latest init --force .
```

When prompted to install dependencies, say **No** — you will install them manually in Task 3. When prompted about the git directory, say **Yes** to proceed. The command overwrites `package.json` and creates `app.vue`, `nuxt.config.ts`.

- [ ] **Step 3: Update app.vue**

Replace the generated `app.vue` with:

```vue
<template>
  <NuxtLoadingIndicator color="#bb9842" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 4: Verify the scaffold created expected files**

```bash
ls nuxt.config.ts app.vue
```

Expected: both files exist.

- [ ] **Step 5: Commit**

```bash
git add app.vue
git commit -m "feat: add Nuxt 4 scaffold (migration/nuxt4 branch)"
```

---

### Task 2: Migrate nuxt.config.ts

**Files:**
- Modify: `nuxt.config.ts`
- Delete: `nuxt.config.js`

- [ ] **Step 1: Replace nuxt.config.ts content**

```ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  ssr: true,

  css: ['@/assets/styles/application.scss'],

  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'apple-touch-icon-precomposed', sizes: '57x57',   href: '/apple-touch-icon-57x57.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '114x114', href: '/apple-touch-icon-114x114.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '72x72',   href: '/apple-touch-icon-72x72.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '144x144', href: '/apple-touch-icon-144x144.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '60x60',   href: '/apple-touch-icon-60x60.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '120x120', href: '/apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '76x76',   href: '/apple-touch-icon-76x76.png' },
        { rel: 'apple-touch-icon-precomposed', sizes: '152x152', href: '/apple-touch-icon-152x152.png' },
        { rel: 'icon', type: 'image/png', href: '/favicon-196x196.png', sizes: '196x196' },
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png',   sizes: '96x96' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32x32.png',   sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/favicon-16x16.png',   sizes: '16x16' },
        { rel: 'icon', type: 'image/png', href: '/favicon-128.png',     sizes: '128x128' },
        { rel: 'stylesheet', href: '/font-awesome/css/all.min.css' },
      ],
      script: [
        { src: 'https://www.googletagmanager.com/gtag/js?id=G-TBQWHYP39H', async: true },
        ...(process.env.NODE_ENV === 'production' ? [{ src: '/ga.js', async: true }] : []),
      ],
    },
  },

  modules: [
    '@prismicio/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
  ],

  plugins: [
    '~/plugins/01.swell.ts',
    '~/plugins/02.init.server.ts',
    '~/plugins/lightGallery.client.ts',
  ],

  prismic: {
    endpoint: 'labete',
  },

  i18n: {
    locales: [
      { name: 'English',  code: 'en', language: 'en-CA', file: 'en.js' },
      { name: 'Francais', code: 'fr', language: 'fr-CA', file: 'fr.js' },
    ],
    langDir: 'locales/',
    defaultLocale: 'fr',
    lazy: true,
  },

  runtimeConfig: {
    public: {
      swellPublicKey: process.env.SWELL_PUBLIC_KEY,
      swellStoreId:   process.env.SWELL_STORE_ID,
    },
  },
})
```

- [ ] **Step 2: Delete the old config**

```bash
rm nuxt.config.js
```

- [ ] **Step 3: Commit**

```bash
git add nuxt.config.ts
git rm nuxt.config.js
git commit -m "feat: migrate nuxt.config to Nuxt 4 format"
```

---

### Task 3: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Replace package.json**

```json
{
  "name": "labete",
  "version": "1.0.0",
  "description": "La Bête",
  "author": "Genevieve Perron-Migneron",
  "private": true,
  "scripts": {
    "dev":      "nuxt dev",
    "build":    "nuxt build",
    "generate": "nuxt generate",
    "preview":  "nuxt preview",
    "lint:sass": "stylelint '**/*.sass'"
  },
  "engines": {
    "node": "20.x"
  },
  "dependencies": {
    "@nuxtjs/i18n":    "^9.0.0",
    "@pinia/nuxt":     "^0.10.0",
    "@prismicio/nuxt": "^4.0.0",
    "bootstrap":       "^5.3.3",
    "glightbox":       "^3.3.0",
    "nuxt":            "^4.0.0",
    "pinia":           "^3.0.0",
    "sass":            "^1.52.3",
    "swell-js":        "^3.22.1",
    "v-lazy-image":    "^2.1.1",
    "vue3-carousel":   "^0.9.0"
  },
  "devDependencies": {
    "@nuxt/test-utils": "^3.0.0",
    "stylelint":        "^13.3.2",
    "stylelint-order":  "^4.0.0",
    "stylelint-scss":   "^3.16.1",
    "vitest":           "^3.0.0"
  }
}
```

- [ ] **Step 2: Install**

```bash
npm install
```

- [ ] **Step 3: Verify Nuxt is installed**

```bash
npx nuxt --version
```

Expected: prints `4.x.x`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install Nuxt 4 dependencies"
```

---

## Phase 2 — Testing Setup & Plugins

### Task 4: Set up Vitest

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
      },
    },
  },
})
```

- [ ] **Step 2: Add test script to package.json**

Open `package.json` and add `"test": "vitest"` to the `scripts` section.

- [ ] **Step 3: Verify Vitest runs (no tests yet is OK)**

```bash
npm test -- --run
```

Expected: `No test files found` or `0 passed` — not an error.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "feat: add Vitest test setup"
```

---

### Task 5: Migrate swell plugin

**Files:**
- Create: `plugins/01.swell.ts`
- Delete: `plugins/swell.js`

- [ ] **Step 1: Create plugins/01.swell.ts**

```ts
import swell from 'swell-js'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config  = useRuntimeConfig()
  const { locale } = nuxtApp.$i18n as { locale: Ref<string> }
  const storeId  = config.public.swellStoreId  as string
  const publicKey = config.public.swellPublicKey as string

  if (!storeId || !publicKey) {
    throw new Error('[swell plugin]: Both SWELL_STORE_ID and SWELL_PUBLIC_KEY must be set')
  }

  const init = async (loc: string) => {
    await swell.init(storeId, publicKey, { locale: `${loc}-CA` })
    await swell.settings.load()
  }

  await init(locale.value)

  nuxtApp.hook('i18n:localeSwitched', async ({ newLocale }) => {
    await init(newLocale)
  })

  return { provide: { swell } }
})
```

- [ ] **Step 2: Delete old plugin**

```bash
git rm plugins/swell.js
```

- [ ] **Step 3: Delete axios plugin (no longer needed)**

```bash
git rm plugins/axios.js
```

- [ ] **Step 4: Commit**

```bash
git add plugins/01.swell.ts
git commit -m "feat: migrate swell plugin to Nuxt 4 format, remove axios plugin"
```

---

### Task 6: Migrate lightGallery plugin

The old `plugins/lightGallery.client.js` used `vue-light-gallery` (Vue 2 only). Replace it with `glightbox`, which has no Vue dependency.

**Files:**
- Create: `plugins/lightGallery.client.ts`
- Delete: `plugins/lightGallery.client.js`

- [ ] **Step 1: Create plugins/lightGallery.client.ts**

```ts
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.min.css'

export default defineNuxtPlugin(() => {
  return { provide: { glightbox: GLightbox } }
})
```

- [ ] **Step 2: Delete old plugin**

```bash
git rm plugins/lightGallery.client.js
```

- [ ] **Step 3: Commit**

```bash
git add plugins/lightGallery.client.ts
git commit -m "feat: replace vue-light-gallery with glightbox plugin"
```

---

## Phase 3 — Store (Vuex → Pinia)

### Task 7: Create Pinia main store

**Files:**
- Create: `stores/main.ts`
- Create: `tests/stores/main.test.ts`
- Delete: `store/index.js` (at end of Phase 3)

- [ ] **Step 1: Create tests/stores/main.test.ts**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMainStore } from '~/stores/main'

describe('useMainStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('setCategories updates state', () => {
    const store = useMainStore()
    const cats = [{ slug: 'wine', name: 'Wine' }]
    store.setCategories(cats)
    expect(store.categories).toEqual(cats)
  })

  it('setSettings updates state', () => {
    const store = useMainStore()
    store.setSettings({ siteName: 'La Bête' })
    expect(store.settings).toEqual({ siteName: 'La Bête' })
  })

  it('setNewsletterOpened toggles newsletter.isOpened', () => {
    const store = useMainStore()
    store.setNewsletterOpened(true)
    expect(store.newsletter.isOpened).toBe(true)
  })

  it('getCategory filters by slug', () => {
    const store = useMainStore()
    store.setCategories([{ slug: 'wine' }, { slug: 'beer' }])
    expect(store.getCategory('wine')).toEqual([{ slug: 'wine' }])
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- --run tests/stores/main.test.ts
```

Expected: FAIL with `Cannot find module '~/stores/main'`

- [ ] **Step 3: Create stores/main.ts**

```ts
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({
    attributes:                   [] as any[],
    categories:                   [] as any[],
    cookieModalOpened:            true,
    cookiePreferencesModalOpened: false,
    error:                        null as any,
    newsletter: {
      data:     null as any,
      isOpened: false,
    },
    messageOpened: false,
    message:       [] as any[],
    settings:      null as any,
  }),

  actions: {
    setAttributes(attributes: any[])  { this.attributes = attributes },
    setCategories(categories: any[])  { this.categories = categories },
    setCookieModal(v: boolean)        { this.cookieModalOpened = v },
    setCookiePreferencesModal(v: boolean) { this.cookiePreferencesModalOpened = v },
    setError(error: any)              { this.error = error },
    setMessageOpened(v: boolean)      { this.messageOpened = v },
    setMessage(modal: any)            { this.message = modal },
    setNewsletterOpened(v: boolean)   { this.newsletter.isOpened = v },
    setNewsletterData(modal: any)     { this.newsletter.data = modal },
    setSettings(settings: any)        { this.settings = settings },
  },

  getters: {
    getCategory: (state) => (slug: string) =>
      state.categories.filter((c: any) => c.slug === slug),
  },
})
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- --run tests/stores/main.test.ts
```

Expected: 4 tests pass

- [ ] **Step 5: Commit**

```bash
git add stores/main.ts tests/stores/main.test.ts
git commit -m "feat: add Pinia main store (replaces Vuex store/index.js)"
```

---

### Task 8: Create Pinia cart store

**Files:**
- Create: `stores/cart.ts`
- Create: `tests/stores/cart.test.ts`

- [ ] **Step 1: Create tests/stores/cart.test.ts**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCartStore } from '~/stores/cart'

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initial state has no cart', () => {
    const store = useCartStore()
    expect(store.cart).toBeNull()
  })

  it('setCart updates cart state', () => {
    const store = useCartStore()
    const fakeCart = { items: [], item_quantity: 0 }
    store.setCart(fakeCart)
    expect(store.cart).toEqual(fakeCart)
  })

  it('setCartOpened controls drawer visibility', () => {
    const store = useCartStore()
    store.setCartOpened(true)
    expect(store.isOpened).toBe(true)
  })

  it('getCartProductsCount returns 0 when cart is null', () => {
    const store = useCartStore()
    expect(store.getCartProductsCount).toBe(0)
  })

  it('getCartProductsCount reads item_quantity from cart', () => {
    const store = useCartStore()
    store.setCart({ items: [], item_quantity: 3 })
    expect(store.getCartProductsCount).toBe(3)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- --run tests/stores/cart.test.ts
```

Expected: FAIL with `Cannot find module '~/stores/cart'`

- [ ] **Step 3: Create stores/cart.ts**

Actions that call the Swell API use `useNuxtApp().$swell` instead of `this.$swell`.

```ts
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart:         null  as any,
    error:        null  as any,
    isUpdating:   false,
    isUpdatingId: null  as string | null,
    isOpened:     false,
    notification: {}    as any,
  }),

  actions: {
    setCart(cart: any)              { this.cart = cart },
    setCartError(error: any)        { this.error = error },
    setCartOpened(v: boolean)       { this.isOpened = v },
    setCartUpdating(v: boolean)     { this.isUpdating = v },
    setCartUpdatingId(id: any)      { this.isUpdatingId = id },
    setNotification(n: any)         { this.notification = n },

    async checkCartItemHasStock({ item, id }: { item?: any; id?: string }) {
      const { $swell } = useNuxtApp()
      const items = this.cart?.items
      let cartItem: any
      let product: any
      const quantityToAdd = item ? item.quantity : 1

      if (item)     product = await $swell.products.get(item.productId)
      else if (id)  product = await $swell.products.get(id)

      if (!product) throw new Error('Product in cart could not be found.')

      if (items) {
        let variant: any
        if (item) variant = $swell.products.variation(product, item.options)
        cartItem = items.find((ci: any) => {
          if (id)   return ci.id === id
          if (item) return item.variant ? ci.variantId === variant?.variantId : ci.productId === variant?.id
          return null
        })
      }

      const stockPurchasable = cartItem ? cartItem.product.stockPurchasable : product.stockPurchasable
      const stockTracking    = cartItem ? cartItem.product.stockTracking    : product.stockTracking
      const stockLevel       = cartItem?.variant?.stockLevel ?? (cartItem ? cartItem.product.stockLevel : product.stockLevel)
      const currentQuantity  = cartItem?.quantity ?? 0

      if (stockPurchasable || !stockTracking) return true
      return currentQuantity + quantityToAdd <= stockLevel
    },

    async addCartItem(item: any) {
      const { $swell } = useNuxtApp()
      if (this.isUpdating) return

      if (this.cart?.items?.some((ci: any) => ci.product_id === item.product_id)) {
        this.setNotification({ show: true, type: 'danger', dismissible: true, text: 'cart.already' })
        return
      }

      this.setCartUpdating(true)
      this.setCartUpdatingId(item?.product_id)

      try {
        const validateStock = $swell.settings.get('cart.validateStock')
        if (validateStock) {
          const hasStock = await this.checkCartItemHasStock({ item })
          if (!hasStock) {
            this.setCartUpdating(false)
            this.setCartUpdatingId(null)
            throw new Error('invalid_stock')
          }
        }

        const cart = await $swell.cart.addItem(item)
        if (cart.errors) {
          this.setCartError(cart.errors)
        } else {
          this.setCart(cart)
          this.setCartOpened(true)
        }
      } catch (err: any) {
        if (err.message === 'invalid_stock') throw err
        console.error('addCartItem error', err)
      }

      this.setCartUpdating(false)
    },

    async removeCartItem(item: any) {
      const { $swell } = useNuxtApp()
      if (this.isUpdating) return
      this.setCartUpdating(true)
      try {
        const cart = await $swell.cart.removeItem(item.id)
        this.setCart(cart)
      } catch (err) {
        console.error(err)
      }
      this.setCartUpdating(false)
    },

    async initializeCart({ checkoutId }: { checkoutId?: string } = {}) {
      const { $swell } = useNuxtApp()
      try {
        const cart = checkoutId
          ? await $swell.cart.recover(checkoutId)
          : await $swell.cart.get()
        this.setCart(cart)
      } catch (err) {
        console.error('initializeCart error', err)
      }
    },
  },

  getters: {
    getCart:              (state) => state.cart,
    getCartOpened:        (state) => state.isOpened,
    getCartProducts:      (state) => state.cart?.items ?? [],
    getCartProductsCount: (state) => state.cart?.item_quantity ?? 0,
    getCartUpdating:      (state) => state.isUpdating,
    getCartUpdatingId:    (state) => state.isUpdatingId,
    getNotification:      (state) => state.notification,
  },
})
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- --run tests/stores/cart.test.ts
```

Expected: 5 tests pass

- [ ] **Step 5: Commit**

```bash
git add stores/cart.ts tests/stores/cart.test.ts
git commit -m "feat: add Pinia cart store (replaces Vuex store/cart.js)"
```

---

### Task 9: Create Pinia product store

**Files:**
- Create: `stores/product.ts`
- Create: `tests/stores/product.test.ts`

- [ ] **Step 1: Create tests/stores/product.test.ts**

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '~/stores/product'

describe('useProductStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initial recommended is null', () => {
    const store = useProductStore()
    expect(store.recommended).toBeNull()
  })

  it('setRecommended updates state', () => {
    const store = useProductStore()
    const products = [{ id: '1' }, { id: '2' }]
    store.setRecommended(products)
    expect(store.recommended).toEqual(products)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- --run tests/stores/product.test.ts
```

Expected: FAIL with `Cannot find module '~/stores/product'`

- [ ] **Step 3: Create stores/product.ts**

```ts
import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    recommended: null as any[] | null,
    error:       null as any,
  }),

  actions: {
    setRecommended(products: any[] | null) { this.recommended = products },

    async fetchProductsBySlugs(products: any[]) {
      const { $swell } = useNuxtApp()
      if (!Array.isArray(products) || products.length === 0) {
        this.setRecommended(null)
        return
      }

      try {
        const ids = products.map(({ product_id }: any) => product_id).filter(Boolean)
        const fetched = await Promise.all(
          ids.map(async (id: string) => {
            try {
              return await $swell.products.get({ where: { id } })
            } catch {
              return null
            }
          })
        )

        const valid = fetched
          .filter((p: any) => p?.results?.length > 0)
          .map((p: any) => p.results[0])
          .filter((p: any) => p.stock_level > 0)
          .slice(0, 3)

        this.setRecommended(valid)
      } catch (err) {
        console.error('fetchProductsBySlugs error', err)
        this.setRecommended(null)
      }
    },
  },

  getters: {
    getProductRecommended: (state) => state.recommended,
  },
})
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- --run tests/stores/product.test.ts
```

Expected: 2 tests pass

- [ ] **Step 5: Delete old Vuex store files**

```bash
git rm store/index.js store/cart.js store/product.js
```

- [ ] **Step 6: Commit**

```bash
git add stores/product.ts tests/stores/product.test.ts
git commit -m "feat: add Pinia product store, remove old Vuex store"
```

---

### Task 10: Create server init plugin (replaces nuxtServerInit)

**Files:**
- Create: `plugins/02.init.server.ts`

- [ ] **Step 1: Create plugins/02.init.server.ts**

```ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const { $prismic, $swell, $i18n } = nuxtApp as any
  const mainStore = useMainStore()
  const locale = ($i18n as any).locale.value as string

  try {
    const categoriesRes = await $swell.categories.list()
    mainStore.setCategories(categoriesRes?.results ?? [])

    const settings = await $prismic.client.getAllByType('settings')
    if (settings.length > 0) mainStore.setSettings(settings[0].data)

    const newsletters = await $prismic.client.getAllByType('newslettermodal', { lang: `${locale}-ca` })
    if (newsletters.length > 0) mainStore.setNewsletterData(newsletters[0].data)

    const messages = await $prismic.client.getAllByType('message_modal', { lang: `${locale}-ca` })
    if (messages.length > 0) mainStore.setMessage(messages[0].data)
  } catch (error) {
    mainStore.setError(error)
    console.error('[init.server]', error)
  }
})
```

- [ ] **Step 2: Commit**

```bash
git add plugins/02.init.server.ts
git commit -m "feat: add server init plugin (replaces nuxtServerInit)"
```

---

## Phase 4 — Layouts

### Task 11: Migrate default layout and sub-components

The Notification, Header, Footer, and MobileNav components are auto-imported in Nuxt 4 — no explicit import needed in the layout.

**Files:**
- Modify: `layouts/default.vue`
- Modify: `layouts/Notification.vue`
- Modify: `layouts/Header.vue`
- Modify: `layouts/Footer.vue`
- Modify: `layouts/MobileNav.vue`

- [ ] **Step 1: Migrate layouts/Notification.vue**

Replace `<b-alert>` with a Bootstrap 5 alert. Find all usages of the store in the component and update from `this.$store.commit(...)` / `this.$store.getters[...]` to Pinia:

```js
// Before (Vuex)
computed: {
  show()   { return this.$store.state.messageOpened },
  type()   { return this.$store.state.message.type },
},
methods: {
  clear()  { this.$store.commit('SET_MESSAGE', false) }
}

// After (Pinia)
setup() {
  const store = useMainStore()
  return { store }
},
computed: {
  show()   { return this.store.messageOpened },
  type()   { return this.store.message.type },
},
methods: {
  clear()  { this.store.setMessageOpened(false) }
}
```

Replace the `<b-alert>` template:
```html
<!-- Before -->
<b-alert :variant="type" :show="show" :dismissible="dismissible" fade @dismissed="clear">

<!-- After -->
<div v-if="show" :class="`alert alert-${type} alert-dismissible fade show`" role="alert">
  <slot />
  <button v-if="dismissible" type="button" class="btn-close" @click="clear" aria-label="Close"></button>
</div>
```

- [ ] **Step 2: Migrate Header.vue, Footer.vue, MobileNav.vue**

For each file:
1. Replace `this.$store.state.X` → `useMainStore().X` (via `setup()` or `const store = useMainStore()` at the top of `setup`)
2. Replace `this.$store.commit('SET_X', val)` → `useMainStore().setX(val)`
3. Replace `this.$store.getters['cart/getCartProductsCount']` → `useCartStore().getCartProductsCount`
4. Replace `this.$t('key')` → works as-is in Options API (Vue 3 still injects `$t`)

- [ ] **Step 3: Migrate layouts/default.vue**

Remove the explicit component registrations (Nuxt 4 auto-imports). Replace Vuex-based store access with Pinia. Replace `useCookie` for any cookie reads/writes. Keep `<NuxtPage />` and `<NuxtLayout>` usage is handled by `app.vue` already.

- [ ] **Step 4: Start dev server and verify layout renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: the layout (header, footer) renders. Pages will be empty or erroring — that's fine at this stage.

- [ ] **Step 5: Commit**

```bash
git add layouts/
git commit -m "feat: migrate layouts to Nuxt 4 / Pinia"
```

---

### Task 12: Migrate modal components

**Files:**
- Modify: `components/CookieModal.vue`
- Modify: `components/CookiePreferencesModal.vue`
- Modify: `components/NewsletterModal.vue`
- Modify: `components/MessageModal.vue`

These components use `this.$cookies.set(...)` and `this.$store.*`. Apply these patterns to each:

- [ ] **Step 1: Replace cookie reads/writes in all modal components**

```js
// Before (cookie-universal-nuxt)
this.$cookies.set('labete_newsletter', true, { maxAge: 60 * 60 * 24 * 365 })
const seen = this.$cookies.get('labete_newsletter')

// After (Nuxt 4 built-in)
const labeteNewsletter = useCookie('labete_newsletter', { maxAge: 60 * 60 * 24 * 365 })
labeteNewsletter.value = true
const seen = labeteNewsletter.value
```

Note: `useCookie` must be called in `setup()` or at the top level of a composable, not inside a method. Declare it in `setup()` and expose it to the Options API component via `return { labeteNewsletter }`.

- [ ] **Step 2: Replace b-form-checkbox in CookiePreferencesModal.vue**

```html
<!-- Before -->
<b-form-checkbox checked="true" name="check-button" size="md" switch disabled/>
<b-form-checkbox v-model="analytics">Analytics</b-form-checkbox>

<!-- After -->
<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" checked disabled>
</div>
<div class="form-check">
  <input class="form-check-input" type="checkbox" v-model="analytics" id="analyticsCheck">
  <label class="form-check-label" for="analyticsCheck">Analytics</label>
</div>
```

- [ ] **Step 3: Replace Vuex store access in all modal components**

Apply the same pattern as Task 11 Step 2 — swap `this.$store.*` for `useMainStore().*`.

- [ ] **Step 4: Commit**

```bash
git add components/CookieModal.vue components/CookiePreferencesModal.vue components/NewsletterModal.vue components/MessageModal.vue
git commit -m "feat: migrate modal components to Nuxt 4"
```

---

### Task 13: Migrate error layout

**Files:**
- Modify: `layouts/error.vue`

- [ ] **Step 1: Migrate layouts/error.vue**

In Nuxt 4, the error page is `error.vue` at the root (not inside `layouts/`). Move and adapt:

```bash
cp layouts/error.vue error.vue
git rm layouts/error.vue
```

In `error.vue`, replace `this.$router.push('/')` with `clearError({ redirect: '/' })` and add the required prop:

```vue
<script>
export default {
  props: ['error'],
  methods: {
    goHome() {
      clearError({ redirect: '/' })
    }
  }
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add error.vue
git commit -m "feat: migrate error page to Nuxt 4 root error.vue"
```

---

## Phase 5 — Pages

For every page migration, apply these patterns consistently:

**asyncData → useAsyncData:**
```js
// Before
async asyncData({ app, store }) {
  const locale = store.state.i18n.locale
  const response = await app.$prismic.api.query(
    app.$prismic.predicates.at('document.type', 'home'), { lang: `${locale}-ca` }
  )
  return { content: response.results[0].data }
}

// After (inside setup() or <script setup>)
const { $prismic } = useNuxtApp()
const { locale } = useI18n()
const { data: content } = await useAsyncData('home', () =>
  $prismic.client.getFirst({ predicates: [$prismic.predicate.at('document.type', 'home')], lang: `${locale.value}-ca` })
    .then(doc => doc.data)
)
```

**head() → useHead / useSeoMeta:**
```js
// Before
head() {
  return { title: this.$prismic.asText(this.seo.title), meta: [...] }
}

// After (in setup, using asText from @prismicio/client)
import { asText } from '@prismicio/client'
useHead({ title: computed(() => asText(content.value?.title)) })
```

**i18n paths:**
```js
// Before (component option)
nuxtI18n: { paths: { fr: '/', en: '/' } }

// After
definePageMeta({ i18n: { paths: { fr: '/', en: '/' } } })
// or for Options API:
// Use definePageMeta at the top of the <script> block (outside export default)
```

**`this.$swell` in mounted:**
```js
// Before
async mounted() {
  this.products = await this.$swell.products.list({ limit: 4 })
}

// After (in setup())
const { $swell } = useNuxtApp()
const { data: products } = await useAsyncData('products', () => $swell.products.list({ limit: 4 }))
```

---

### Task 14: Migrate static pages

**Files:**
- Modify: `pages/cookie-policy.vue`
- Modify: `pages/privacy-policy.vue`
- Modify: `pages/return.vue`

These pages are mostly static (Prismic content fetch, no Swell). Apply the asyncData and head() patterns above to each. There is no `nuxtI18n` path override needed (default locale routes).

- [ ] **Step 1: Migrate pages/cookie-policy.vue**

Apply asyncData → useAsyncData and head() → useSeoMeta patterns.

- [ ] **Step 2: Migrate pages/privacy-policy.vue**

Same as above.

- [ ] **Step 3: Migrate pages/return.vue**

Same as above.

- [ ] **Step 4: Verify pages render**

```bash
npm run dev
```

Open `http://localhost:3000/politique-de-confidentialite` (or equivalent). Expected: page renders with Prismic content.

- [ ] **Step 5: Commit**

```bash
git add pages/cookie-policy.vue pages/privacy-policy.vue pages/return.vue
git commit -m "feat: migrate static pages to Nuxt 4"
```

---

### Task 15: Migrate contact, glossary, and videos pages

**Files:**
- Modify: `pages/contact.vue`
- Modify: `pages/glossary.vue`
- Modify: `pages/videos.vue`

Apply the same asyncData → useAsyncData, head() → useSeoMeta, and `nuxtI18n` → `definePageMeta` patterns.

- [ ] **Step 1: Migrate each page** applying all patterns from the Phase 5 header.

- [ ] **Step 2: Remove sass-google-fonts**

`sass-google-fonts` (a Sass-based Google Fonts importer) is incompatible with Vite. Open `assets/styles/application.scss` (or whichever file imports it) and replace the `@import 'sass-google-fonts'` line with a standard CSS `@import url(...)`:

```scss
// Before
@import url('sass-google-fonts/...');

// After — add this to assets/styles/application.scss at the top
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');
```

Check `assets/styles/application.scss` for the exact font name being imported and replicate it as a Google Fonts URL import.

- [ ] **Step 3: Verify pages render in dev server.** Check both `/fr` and `/en` locales.

- [ ] **Step 4: Commit**

```bash
git add pages/contact.vue pages/glossary.vue pages/videos.vue assets/
git commit -m "feat: migrate contact, glossary, videos pages; replace sass-google-fonts"
```

---

### Task 16: Migrate blog pages

**Files:**
- Modify: `pages/blog/_slug.vue` (or equivalent dynamic route file)

Nuxt 4 uses `[slug].vue` instead of `_slug.vue` for dynamic routes.

- [ ] **Step 1: Rename dynamic route files**

```bash
# In pages/blog/
mv pages/blog/_slug.vue pages/blog/[slug].vue
```

- [ ] **Step 2: Migrate pages/blog/index.vue and pages/blog/[slug].vue**

Apply asyncData → useAsyncData, head() → useSeoMeta patterns. The route param `this.$route.params.slug` becomes `useRoute().params.slug`.

- [ ] **Step 3: Commit**

```bash
git add pages/blog/
git commit -m "feat: migrate blog pages to Nuxt 4 (rename _slug → [slug])"
```

---

### Task 17: Migrate events, artist, brand, creations pages

**Files:**
- Modify: `pages/events.vue`
- Modify: `pages/artist.vue`
- Modify: `pages/brand.vue`
- Modify: `pages/creations.vue`

- [ ] **Step 1: Migrate each page** applying asyncData → useAsyncData, head() → useSeoMeta, and `nuxtI18n` → `definePageMeta`.

- [ ] **Step 2: Verify each page renders in the dev server on both locales.**

- [ ] **Step 3: Commit**

```bash
git add pages/events.vue pages/artist.vue pages/brand.vue pages/creations.vue
git commit -m "feat: migrate events, artist, brand, creations pages"
```

---

### Task 18: Migrate products pages

**Files:**
- Modify: `pages/products/index.vue`
- Modify: `pages/products/product/_slug.vue` → `pages/products/product/[slug].vue`
- Modify: `pages/products/_slug.vue` → `pages/products/[slug].vue`

Products pages call Swell APIs. Move Swell calls from `mounted()` to `useAsyncData()` so they run on the server during static generation.

- [ ] **Step 1: Rename dynamic route files**

```bash
find pages/products -name '_slug.vue' | while read f; do
  mv "$f" "$(dirname $f)/[slug].vue"
done
```

- [ ] **Step 2: Migrate each products page**

Key change for Swell calls:
```js
// Before (in mounted)
async mounted() {
  this.product = await this.$swell.products.get(this.$route.params.slug)
}

// After (in setup, runs server-side during generate)
const route = useRoute()
const { $swell } = useNuxtApp()
const { data: product } = await useAsyncData(`product-${route.params.slug}`, () =>
  $swell.products.get(route.params.slug as string)
)
```

- [ ] **Step 3: Migrate pages/products/constants.js**

This file likely just exports constants — no migration needed beyond verifying imports still work.

- [ ] **Step 4: Commit**

```bash
git add pages/products/
git commit -m "feat: migrate products pages to Nuxt 4"
```

---

### Task 19: Migrate home page (index.vue)

This is the most complex page — it fetches from Prismic (multiple linked documents) and Swell.

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1: Replace asyncData with useAsyncData in pages/index.vue**

The existing `asyncData` makes many sequential Prismic API calls. Convert to `useAsyncData`:

```js
// Inside setup() or using <script setup>
const { $prismic } = useNuxtApp()
const { locale } = useI18n()

const { data: pageData } = await useAsyncData('home', async () => {
  const lang = `${locale.value}-ca`

  const homeDocs = await $prismic.client.getAllByType('home', { lang })
  if (homeDocs.length === 0) throw createError({ statusCode: 404, message: 'Page not found' })
  const content = homeDocs[0].data

  const [hero_button, seo] = await Promise.all([
    $prismic.client.getByID(content.hero_button.id),
    $prismic.client.getByID(content.seo.id),
  ])

  const cards = await Promise.all(
    content.cards.map(({ card }: any) => $prismic.client.getByID(card.id).then(d => d.data))
  )

  const blocks = await Promise.all(
    content.blocks.map(({ block }: any) => $prismic.client.getByID(block.id).then(d => d.data))
  )

  const sliderDoc = await $prismic.client.getByID(content.slider.id)

  const top_blocks = await Promise.all(
    content.top_blocks.map(async ({ top_block }: any) => {
      const item = await $prismic.client.getByID(top_block.id)
      if (item.data.button?.id) {
        item.data.button = await $prismic.client.getByID(item.data.button.id)
      }
      return item.data
    })
  )

  return {
    content,
    hero_button: hero_button.data,
    seo: seo.data,
    cards,
    blocks,
    slider: sliderDoc.data,
    top_blocks,
  }
})
```

- [ ] **Step 2: Replace Swell products call**

```js
// Move from mounted() to useAsyncData
const { $swell } = useNuxtApp()
const { data: productsResults } = await useAsyncData('home-products', async () => {
  const res = await $swell.products.list({ limit: 4, sort: 'date_created desc', categories: 'featured' })
  return res?.results ?? []
})
```

- [ ] **Step 3: Replace head()**

```js
import { asText } from '@prismicio/client'

useHead(computed(() => ({
  title: pageData.value ? asText(pageData.value.seo.title) : '',
  meta: [
    { name: 'description', content: pageData.value ? asText(pageData.value.seo.description) : '' }
  ]
})))
```

- [ ] **Step 4: Add definePageMeta for i18n paths**

At the top of the `<script>` block (outside `export default`):
```js
definePageMeta({ i18n: { paths: { fr: '/', en: '/' } } })
```

- [ ] **Step 5: Verify home page renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: home page renders with hero, slider, cards.

- [ ] **Step 6: Commit**

```bash
git add pages/index.vue
git commit -m "feat: migrate home page to Nuxt 4"
```

---

## Phase 6 — Components

### Task 20: Migrate Slider.vue (vue-slick-carousel → vue3-carousel)

**Files:**
- Modify: `components/Slider.vue`

- [ ] **Step 1: Replace the template in Slider.vue**

`vue-slick-carousel` is Vue 2 only. Replace with `vue3-carousel`:

```vue
<template>
  <Carousel :items-to-show="1" :wrap-around="true">
    <Slide v-for="(slide, index) in data.slides" :key="index">
      <!-- existing slide content here -->
    </Slide>
    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<script>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

export default {
  components: { Carousel, Slide, Pagination, Navigation },
  props: ['data'],
}
</script>
```

Adapt slide content from the existing template — keep the inner HTML of each slide, just replace the carousel wrapper components.

- [ ] **Step 2: Verify slider renders in dev server at `http://localhost:3000`.**

- [ ] **Step 3: Commit**

```bash
git add components/Slider.vue
git commit -m "feat: replace vue-slick-carousel with vue3-carousel in Slider"
```

---

### Task 21: Migrate Cart.vue (b-sidebar, b-card, b-row, b-col)

**Files:**
- Modify: `components/Cart.vue`

- [ ] **Step 1: Replace b-sidebar with Bootstrap 5 Offcanvas**

Bootstrap 5 Offcanvas requires including the JS. Add to `plugins/01.swell.ts` or a separate `plugins/bootstrap.client.ts`:

```ts
// plugins/bootstrap.client.ts
export default defineNuxtPlugin(() => {
  import('bootstrap/dist/js/bootstrap.bundle.min.js')
})
```

Add `'~/plugins/bootstrap.client.ts'` to the `plugins` array in `nuxt.config.ts`.

Replace `<b-sidebar>` in Cart.vue:
```html
<!-- Before -->
<b-sidebar id="cart" v-model="isOpened" right shadow>...</b-sidebar>

<!-- After -->
<div class="offcanvas offcanvas-end" :class="{ show: isOpened }" tabindex="-1" id="cart" style="visibility: visible" v-if="isOpened">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title">{{ $t('cart.title') }}</h5>
    <button type="button" class="btn-close" @click="closeCart"></button>
  </div>
  <div class="offcanvas-body">
    <!-- existing cart body content -->
  </div>
</div>
<div class="offcanvas-backdrop fade show" v-if="isOpened" @click="closeCart"></div>
```

- [ ] **Step 2: Replace b-card, b-row, b-col with Bootstrap 5 HTML**

Using the Bootstrap Vue → Bootstrap 5 quick reference table at the top of this plan, replace each `<b-card>`, `<b-row>`, `<b-col>` etc. with the corresponding Bootstrap 5 `<div>` structure.

- [ ] **Step 3: Update store access to Pinia**

```js
// Before
computed: {
  isOpened() { return this.$store.getters['cart/getCartOpened'] }
},
methods: {
  closeCart() { this.$store.commit('cart/SET_CART_ISOPENED', false) }
}

// After
setup() {
  const cartStore = useCartStore()
  return { cartStore }
},
computed: {
  isOpened() { return this.cartStore.isOpened }
},
methods: {
  closeCart() { this.cartStore.setCartOpened(false) }
}
```

- [ ] **Step 4: Commit**

```bash
git add components/Cart.vue plugins/bootstrap.client.ts nuxt.config.ts
git commit -m "feat: migrate Cart.vue to Bootstrap 5 Offcanvas, Pinia"
```

---

### Task 22: Migrate remaining components

**Files:**
- Modify: `components/Filters.vue` (b-form-checkbox)
- Modify: `components/CategoriesDropdown.vue` (b-dropdown)
- Modify all other components in `components/`

- [ ] **Step 1: Migrate Filters.vue**

Replace `<b-form-checkbox-group>` and `<b-form-checkbox>` using the quick reference table at the top of this plan.

- [ ] **Step 2: Migrate CategoriesDropdown.vue**

Replace `<b-dropdown>` and `<b-dropdown-item>` with Bootstrap 5 dropdown HTML structure. The dropdown toggle requires the Bootstrap JS bundle loaded in Task 21 Step 1.

- [ ] **Step 3: Migrate gallery usage to glightbox**

Find whichever component previously imported `vue-light-gallery` and replace it:

```vue
<template>
  <!-- Replace <vue-light-gallery> markup with a simple grid of anchors -->
  <div class="gallery">
    <a
      v-for="(image, i) in images"
      :key="i"
      :href="image.url"
      class="glightbox"
      :data-gallery="galleryId"
    >
      <img :src="image.url" :alt="image.alt" />
    </a>
  </div>
</template>

<script>
export default {
  props: ['images', 'galleryId'],
  mounted() {
    const { $glightbox } = useNuxtApp()
    $glightbox({ selector: '.glightbox' })
  }
}
</script>
```

- [ ] **Step 4: Check v-lazy-image still works**

`v-lazy-image` v2.1+ supports Vue 3. Wherever it is used, verify it renders without errors in the dev server. No code change needed.

- [ ] **Step 5: Migrate all remaining components**

For each remaining `.vue` file in `components/`:
1. Replace `this.$store.*` with Pinia store access
2. Replace `this.$cookies.*` with `useCookie()`
3. Replace `this.$t()` — works as-is in Vue 3 Options API
4. Remove any explicit `import` of Vue 2 components that are now auto-imported
5. Check for any `v-b-*` directives — remove and replace with equivalent Bootstrap 5 `data-bs-*` attributes

Components to check: `AddToCart.vue`, `Block.vue`, `BlogPost.vue`, `Card.vue`, `Event.vue`, `GlossaryCard.vue`, `Media.vue`, `Newsletter.vue`, `NoProducts.vue`, `PassedEvents.vue`, `ProductCard.vue`, `RecommendedProducts.vue`, `Store.vue`.

- [ ] **Step 4: Run all store tests to confirm no regressions**

```bash
npm test -- --run
```

Expected: all tests pass

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat: migrate all remaining components to Nuxt 4 / Bootstrap 5"
```

---

## Phase 7 — Final Validation

### Task 23: Validate static generation

- [ ] **Step 1: Run nuxt generate**

```bash
npm run generate
```

Expected: exits successfully, `.output/public/` contains HTML files.

If errors appear, fix them one by one — typically they'll be SSR-related issues (accessing `window` on the server, missing `<client-only>` wrappers, etc.).

- [ ] **Step 2: Preview the generated site**

```bash
npm run preview
```

Open `http://localhost:3000`. Check:
- Home page renders with content from Prismic
- Products load from Swell
- Carousel works
- Cart drawer opens and closes
- Cookie modal appears on first visit
- Language switcher changes locale
- Lightbox opens on gallery images
- `nuxt generate` produces no 404 pages

- [ ] **Step 3: Run all tests one final time**

```bash
npm test -- --run
```

Expected: all tests pass

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Nuxt 4 migration — all pages generate, all tests pass"
```

- [ ] **Step 5: Open a PR from migration/nuxt4 → master**

```bash
gh pr create --title "Migrate to Nuxt 4" --body "Migrates the full LaBete site from Nuxt 2/Vue 2 to Nuxt 4/Vue 3. See docs/superpowers/specs/2026-05-15-nuxt4-upgrade-design.md for the design spec."
```
