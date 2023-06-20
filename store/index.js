export const state = () => ({
  addedItem: null,
  attributes: [],
  cart: null,
  cartError: null,
  cartIsActive: false,
  cartIsUpdating: false,
  cartIsUpdatingId: null,
  categories: [],
  newsletter: [],
  notification: {
    show: true,
    text: 'HELLO',
    type: 'success',
    dismissible: true
  },
  newsletterOpened: false,
  messageOpened: false,
  message: [],
  settings: [],
})

export const mutations = {
  SET_ATTRIBUTES(state, attributes) {
    state.attributes = attributes;
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
  SET_MESSAGE(state, isOpened) {
    state.messageOpened = isOpened;
  },
  SET_MESSAGE_MODAL(state, modal) {
    state.message = modal;
  },
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  },
  SET_ADDED_ITEM(state, item) {
    state.addedItem = item;
  },
  SET_CART(state, cart) {
    state.cart = cart;
  },
  SET_CART_UPDATING(state, cartIsUpdating) {
    state.cartIsUpdating = cartIsUpdating;
  },
  SET_CART_UPDATING_ID(state, cartIsUpdatingId) {
    state.cartIsUpdatingId = cartIsUpdatingId;
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
  }
}

export const getters = {
  getAttributes(state) {
    return state.attributes;
  },
  getCategories(state) {
    return state.categories;
  }
}

export const actions = {
  /**
   * Adds a product to the cart
   *
   * @param {Product} item Product to add
   */
  async addCartItem({ commit, dispatch, state }, item) {
    // Bail if an update is already in progress
    if (state.cartIsUpdating) return;
    // Set flag to show loading indicator
    commit('SET_CART_UPDATING', true);
    commit('SET_CART_UPDATING_ID', item && item.product_id);

    try {
      // Check if validate stock on add is active
      const validateCartStock = this.$swell.settings.get('cart.validateStock');
      console.log(item)
      if (validateCartStock) {
        try {
          const cartItemHasStock = await dispatch('checkCartItemHasStock', {
            item,
          });

          if (!cartItemHasStock) {
            commit('SET_CART_UPDATING', false);
            commit('SET_CART_UPDATING_ID', null);
            throw new Error('invalid_stock');
          }
        } catch (err) {
          throw new Error(err.message);
        }
      }

      // Make Swell API call
      const cart = await this.$swell.cart.addItem(item);
      
      if (cart.errors) {
        //dispatch('handleModelErrors', cart.errors);
        commit('SET_CART_UPDATING', false);
        commit('SET_CART_UPDATING_ID', null);
        commit('SET_CART_ERROR', cart.errors)
        return;
      }

      // Replace cart state
      commit('SET_CART', cart);
      // Set item to be displayed in the notification
      commit('SET_ADDED_ITEM', item);

      if (state.notification !== null) {
        // If notification is already visible, close it to show new notification
        commit('setState', { key: 'notification', value: null });

        window.setTimeout(() => {
          dispatch('showNotification', {
            message: `Added ${item.quantity} item(s) to cart`,
            type: 'product',
            isSticky: true,
          });
        }, 200);
      } else {
        // Trigger success confirmation
        dispatch('showNotification', {
          message: `Added ${item.quantity} item(s) to cart`,
          type: 'product',
          isSticky: true,
        });
      }
    } catch (err) {
      if (err.message === 'invalid_stock') throw new Error('invalid_stock');
      console.log('error', err)
      //dispatch('handleError', err);
    }

    // Reset flag to hide loading indicator
    commit('setState', { key: 'cartIsUpdating', value: false });
  }
}
