import cart from './cart';
import product from './product';

export const modules = {
    cart,
    product
};

export const state = () => ({
    attributes: [],
    categories: [],
    cookieModalOpened: true,
    cookiePreferencesModalOpened: false,
    error: null,
    newsletter: {
        data: null,
        isOpened: false,
    },
    messageOpened: false,
    message: [],
    settings: null,
})

export const mutations = {
    SET_ATTRIBUTES(state, attributes) {
        state.attributes = attributes;
    },
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_COOKIE_MODAL(state, isOpened) {
        state.cookieModalOpened = isOpened;
    },
    SET_COOKIE_PREFERENCES_MODAL(state, isOpened) {
        state.cookiePreferencesModalOpened = isOpened;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_MESSAGE(state, isOpened) {
        state.messageOpened = isOpened;
    },
    SET_MESSAGE_MODAL(state, modal) {
        state.message = modal;
    },
    SET_NEWSLETTER_OPENED(state, isOpened) {
        state.newsletter.isOpened = isOpened;
    },
    SET_NEWSLETTER_MODAL_DATA(state, modal) {
        state.newsletter.data = modal;
    },
    SET_SETTINGS(state, settings) {
        state.settings = settings;
    },
}

export const getters = {
    getAttributes(state) {
        return state.attributes;
    },
    getCategories(state) {
        return state.categories;
    },
    getCategory(state, slug) {
        return state.categories.filter((category => category.slug === slug));
    },
    getNewsletter(state) {
      return state.newsletter;
    },
    getSettings(state) {
        return state.settings;
    }
}

export const actions = {
    /**
     * Check if a product is in stock to be added/modified within the cart
     * @property {Object} item - The product or cart item
     * @property {string} id - The cart item id
     * @property {number} quantityToAdd - The quantity to add to cart
     */
    async nuxtServerInit({ commit }, { app }) {
        try {
            const locale = app.store.state.i18n.locale || 'fr';

            let categories = await this.$swell.categories.list();
            categories = categories && categories.results && categories.results.length > 0 ? categories.results : [];
            commit('SET_CATEGORIES', categories);

            // Get Settings
            const settingsResponse = await app.$prismic.api.query(app.$prismic.predicates.at('document.type', 'settings'));
            settingsResponse.results.forEach(result => commit('SET_SETTINGS', result.data));

            // Get newsletter
            const newsletterModalResponse = await app.$prismic.api.query(
                app.$prismic.predicates.at('document.type', 'newslettermodal'),
                { lang: `${locale}-ca` }
            );
            newsletterModalResponse.results.forEach(result => commit('SET_NEWSLETTER_MODAL_DATA', result.data));

            // Get message
            const messageModalResponse = await app.$prismic.api.query(
                app.$prismic.predicates.at('document.type', 'message_modal'),
                { lang: `${locale}-ca` }
            );
            messageModalResponse.results.forEach(result => commit('SET_MESSAGE_MODAL', result.data));
        } catch (error) {
            commit('SET_ERROR', error);
            console.log('STORE', error)
        }
    }
}
