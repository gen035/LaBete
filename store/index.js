import cart from './cart';
export const modules = {
    cart
};

export const state = () => ({
    attributes: [],
    categories: [],
    cookieModalOpened: true,
    cookiePreferencesModalOpened: false,
    newsletter: [],
    notification: {},
    newsletterOpened: false,
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
    SET_MESSAGE(state, isOpened) {
        state.messageOpened = isOpened;
    },
    SET_MESSAGE_MODAL(state, modal) {
        state.message = modal;
    },
    SET_NEWSLETTER(state, isOpened) {
        state.newsletterOpened = isOpened;
    },
    SET_NEWSLETTER_MODAL(state, modal) {
        state.newsletter = modal;
    },
    SET_NOTIFICATION(state, notification) {
        state.notification = notification;
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
            let categories = await this.$swell.categories.list();
            categories = categories && categories.results && categories.results.length > 0 ? categories.results : [];
            commit('SET_CATEGORIES', categories);

            // Get Settings
            const settingsResponse = await app.$prismic.api.query(app.$prismic.predicates.at('document.type', 'settings'));
            settingsResponse.results.forEach(result => commit('SET_SETTINGS', result.data));

            // Get newsletter
            const newsletterModalResponse = await app.$prismic.api.query(
                app.$prismic.predicates.at('document.type', 'newslettermodal'),
                { lang: `${app.store.state.i18n.locale}-ca` }
            );
            newsletterModalResponse.results.forEach(result => commit('SET_NEWSLETTER_MODAL', result.data));

            // Get message
            const messageModalResponse = await app.$prismic.api.query(
                app.$prismic.predicates.at('document.type', 'message_modal'),
                { lang: `${app.store.state.i18n.locale}-ca` }
            );
            messageModalResponse.results.forEach(result => commit('SET_MESSAGE_MODAL', result.data));
        } catch (error) {
            console.log(error)
        }
    }
}
