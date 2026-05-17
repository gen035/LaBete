import swell from 'swell-js'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig()
  const i18n = (nuxtApp as any).$i18n
  const locale = i18n.locale.value || i18n.locale
  const storeId = config.public.swellStoreId as string
  const publicKey = config.public.swellPublicKey as string

  if (!storeId || !publicKey) {
    throw new Error('[swell plugin]: Both SWELL_STORE_ID and SWELL_PUBLIC_KEY must be set')
  }

  const init = async (loc: string) => {
    await swell.init(storeId, publicKey, { locale: `${loc}-CA` })
    await swell.settings.load()
  }

  await init(locale)

  nuxtApp.hook('i18n:beforeLocaleSwitch', async ({ oldLocale, newLocale }) => {
    await init(newLocale)
  })

  return { provide: { swell } }
})
