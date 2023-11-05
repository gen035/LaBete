export const state = () => ({
  attributes: [],
  cart: null,
  cartError: null,
  cartIsActive: false,
  cartIsUpdating: false,
  cartIsUpdatingId: null,
  cartIsOpened: false,
  categories: [],
  cookieModalOpened: true,
  newsletter: [],
  notification: {},
  newsletterOpened: false,
  messageOpened: false,
  message: [],
  products: null,
  settings: [],
})

export const mutations = {
  SET_ATTRIBUTES(state, attributes) {
    state.attributes = attributes;
  },
  SET_COOKIE_MODAL(state, isOpened) {
    state.cookieModalOpened = isOpened;
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
  SET_PRODUCTS(state, products) {
    state.products = products;
  },
  SET_SETTINGS(state, settings) {
    state.settings = settings;
  },
  SET_CART(state, cart) {
    state.cart = cart;
  },
  SET_CART_ISOPENED(state, isOpened) {
    state.cartIsOpened = isOpened;
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
  getCart(state) {
    return state.cart;
  },
  getCartProducts(state) {
    return state.cart && state.cart.items;
  },
  getCartProductsCount(state) {
    return state.cart && state.cart.items && state.cart.items.length;
  },
  getCategories(state) {
    return state.categories;
  },
  getCategory(state, slug) {
    return state.categories.filter((category => category.slug === slug));
  },
  getProducts(state) {
    if(state.products.count === 0) return
    return state.products.results;
  }
}

export const actions = {
    /**
   * Check if a product is in stock to be added/modified within the cart
   * @property {Object} item - The product or cart item
   * @property {string} id - The cart item id
   * @property {number} quantityToAdd - The quantity to add to cart
   */
  async checkCartItemHasStock({ state }, { item, id }) {
    // Get cart items
    const items = state.cart?.items;

    let cartItem;
    let stockPurchasable;
    let stockTracking;
    let stockLevel;
    let product;
    let currentQuantity = 0;

    const quantityToAdd = item ? item.quantity : 1;

    if (item) {
      product = await this.$swell.products.get(item.productId);
    } else if (id) {
      product = await this.$swell.products.get(id);
    }

    if (!product) throw new Error('Product in cart could not be found.');

    if (items) {
      let variant;
      // If a product item is provided
      if (item) variant = this.$swell.products.variation(product, item.options);
      cartItem = items.find((item) => {
        if (id) {
          return item.id === id;
        } else if (item) {
          return item.variant
            ? item.variantId === variant?.variantId
            : item.productId === variant?.id;
        }
        return null;
      });
    }

    // Get stock availability of cart item
    if (cartItem) {
      stockPurchasable = cartItem.product.stockPurchasable;
      stockTracking = cartItem.product.stockTracking;
      stockLevel = cartItem.product.stockLevel;
      // If variant, get respective stock level
      if (cartItem.variant) {
        stockLevel = cartItem.variant.stockLevel;
      }
      currentQuantity = cartItem.quantity;
    } else {
      // Get stock availability of product to be added
      stockPurchasable = product.stockPurchasable;
      stockTracking = product.stockTracking;
      stockLevel = product.stockLevel;
    }

    // If product is purchasable out of stock or doesn't track stock, allow add to cart
    if (stockPurchasable || !stockTracking) return true;
    if (currentQuantity + quantityToAdd > stockLevel) return false;
    return true;
  },
  /**
   * Adds a product to the cart
   *
   * @param {Product} item Product to add
   */
  async addCartItem({ commit, dispatch, state }, item) {
    // Bail if an update is already in progress
    if (state.cartIsUpdating) return;

    //Bail if product is already in cart
    if(state.cart && state.cart.items.some((currentItem) => currentItem.product_id === item.product_id)) {
        commit('SET_NOTIFICATION', {
          show: true,
          type: 'danger',
          dismissible: true,
          text: 'cart.already'
        });
        return;
    };
    // Set flag to show loading indicator
    commit('SET_CART_UPDATING', true);
    commit('SET_CART_UPDATING_ID', item && item.product_id);

    try {
      // Check if validate stock on add is active
      const validateCartStock = this.$swell.settings.get('cart.validateStock');
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
      commit('SET_CART_ISOPENED', true);
      // Set item to be displayed in the notification
    } catch (err) {
      if (err.message === 'invalid_stock') throw new Error('invalid_stock');
      console.log('error', err);
      //dispatch('handleError', err);
    }

    // Reset flag to hide loading indicator
    commit('SET_CART_UPDATING', false);
  },
    /**
   * Removes an item from the cart
   *
   * @param {CartItem} item - Cart item to remove
   */
  async removeCartItem({ commit, dispatch, state }, item) {
    if (state.cartIsUpdating) return;
    commit('SET_CART_UPDATING', true);

    try {
      const cart = await this.$swell.cart.removeItem(item.id);
      commit('SET_CART', cart);
      // dispatch('showNotification', { message: 'Removed from cart' })
    } catch (err) {
      console.log(err);
      //dispatch('handleError', err);
    }

    commit('SET_CART_UPDATING', false);
  },
  async initializeCart({ commit, dispatch, state }, { checkoutId }) {
    let cart = state.cart;

    try {
      if (checkoutId) {
        // Recover cart if checkoutId provided
        cart = await this.$swell.cart.recover(checkoutId);
      } else {
        // Get cart from session (returns null if nothing in cart)
        cart = await this.$swell.cart.get();
      }
      // Update cart state
      commit('SET_CART', cart);
    } catch (err) {
      console.log('error', err);
      //dispatch('handleError', err);
    }
  }
}
