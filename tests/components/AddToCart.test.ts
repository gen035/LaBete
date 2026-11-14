import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { describe, expect, it, vi } from 'vitest'
import AddToCart from '~/components/AddToCart.vue'

const addCartItem = vi.fn()

vi.mock('~/stores/cart', () => ({
  useCartStore: () => ({
    getCartUpdating: false,
    getCartUpdatingId: null,
    addCartItem,
  }),
}))

const CustomButtonStub = defineComponent({
  props: {
    disabled: Boolean,
    text: String,
  },
  setup(props) {
    return () => h('button', { disabled: props.disabled, 'data-test': 'add-to-cart' }, props.text)
  },
})

async function renderButton(isNonProduction = true) {
  vi.stubGlobal('useRuntimeConfig', () => ({ public: { swellPreview: isNonProduction } }))

  const app = createSSRApp(AddToCart, {
    product: {
      id: 'published-1',
      stock_status: 'in_stock',
      preview_only: false,
    },
  })
  app.config.globalProperties.$t = (key: string) => key
  app.component('CustomButton', CustomButtonStub)
  return renderToString(app)
}

describe('AddToCart availability', () => {
  it('renders a disabled button outside production', async () => {
    const html = await renderButton()

    expect(html).toContain('data-test="add-to-cart"')
    expect(html).toContain('disabled')
  })

  it('renders an enabled button in production', async () => {
    const html = await renderButton(false)

    expect(html).toContain('data-test="add-to-cart"')
    expect(html).not.toContain('disabled')
  })
})
