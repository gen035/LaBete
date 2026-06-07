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
    setAttributes(attributes: any[])      { this.attributes = attributes },
    setCategories(categories: any[])      { this.categories = categories },
    setCookieModal(v: boolean)            { this.cookieModalOpened = v },
    setCookiePreferencesModal(v: boolean) { this.cookiePreferencesModalOpened = v },
    setError(error: any)                  { this.error = error },
    setMessageOpened(v: boolean)          { this.messageOpened = v },
    setMessage(modal: any)                { this.message = modal },
    setNewsletterOpened(v: boolean)       { this.newsletter.isOpened = v },
    setNewsletterData(modal: any)         { this.newsletter.data = modal },
    setSettings(settings: any)            { this.settings = settings },
  },

  getters: {
    getCategory: (state) => (slug: string) =>
      state.categories.filter((c: any) => c.slug === slug),
  },
})
