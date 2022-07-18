export const state = () => ({
  newsletter: [],
  newsletterOpened: false,
  messageOpened: false,
  message: [],
  settings: []
})

export const mutations = {
  SET_NEWSLETTER(state, isOpened) {
    state.newsletterOpened = isOpened;
  },
  SET_NEWSLETTER_MODAL(state, modal) {
    state.newsletter = modal;
  },
  SET_MESSAGE(state, isOpened) {
    state.messageOpened = isOpened;
  },
  SET_MESSAGE_MODAL(state, modal) {
    state.message = modal;
  },
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  }
}
