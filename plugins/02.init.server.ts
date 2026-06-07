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
