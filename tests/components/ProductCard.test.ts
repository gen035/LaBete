import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProductCard from '~/components/ProductCard.vue'

const AddToCartStub = defineComponent({
  name: 'AddToCart',
  setup() {
    return () => h('button', { 'data-test': 'add-to-cart' }, 'Add')
  },
})

const ClientOnlyStub = defineComponent({
  name: 'ClientOnly',
  setup(_, { slots }) {
    return () => slots.default?.()
  },
})

beforeEach(() => {
  vi.stubGlobal('useI18n', () => ({ locale: 'en' }))
  vi.stubGlobal('useRouter', () => ({ push: vi.fn() }))
})

async function renderProduct(product: Record<string, unknown>) {
  const app = createSSRApp(ProductCard, { product })
  app.config.globalProperties.$i18n = { locale: 'en' }
  app.config.globalProperties.$t = (key: string) => key
  app.component('AddToCart', AddToCartStub)
  app.component('ClientOnly', ClientOnlyStub)
  return renderToString(app)
}

describe('ProductCard preview products', () => {
  it('renders a draft without Add to Cart and uses the image fallback', async () => {
    const html = await renderProduct({
      id: 'draft-1',
      name: 'Draft product',
      active: false,
      preview_only: true,
      stock_level: 2,
    })

    expect(html).not.toContain('data-test="add-to-cart"')
    expect(html).toContain('/product_placeholder.jpg')
  })

  it('keeps Add to Cart for published products', async () => {
    const html = await renderProduct({
      id: 'published-1',
      name: 'Published product',
      active: true,
      preview_only: false,
      stock_level: 2,
    })

    expect(html).toContain('data-test="add-to-cart"')
  })
})
