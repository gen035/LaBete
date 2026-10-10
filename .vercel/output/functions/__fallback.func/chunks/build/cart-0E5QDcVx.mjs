import { a as useNuxtApp } from '../virtual/entry.mjs';
import { defineStore } from 'pinia';

//#region stores/cart.ts
var useCartStore = defineStore("cart", {
	state: () => ({
		cart: null,
		error: null,
		isUpdating: false,
		isUpdatingId: null,
		isOpened: false,
		notification: {}
	}),
	actions: {
		setCart(cart) {
			this.cart = cart;
		},
		setCartError(error) {
			this.error = error;
		},
		setCartOpened(v) {
			this.isOpened = v;
		},
		setCartUpdating(v) {
			this.isUpdating = v;
		},
		setCartUpdatingId(id) {
			this.isUpdatingId = id;
		},
		setNotification(n) {
			this.notification = n;
		},
		async checkCartItemHasStock({ item, id }) {
			const { $swell } = useNuxtApp();
			const items = this.cart?.items;
			let cartItem;
			let product;
			const quantityToAdd = item ? item.quantity : 1;
			if (item) product = await $swell.products.get(item.productId);
			else if (id) product = await $swell.products.get(id);
			if (!product) throw new Error("Product in cart could not be found.");
			if (items) {
				let variant;
				if (item) variant = $swell.products.variation(product, item.options);
				cartItem = items.find((ci) => {
					if (id) return ci.id === id;
					if (item) return item.variant ? ci.variantId === variant?.variantId : ci.productId === variant?.id;
					return null;
				});
			}
			const stockPurchasable = cartItem ? cartItem.product.stockPurchasable : product.stockPurchasable;
			const stockTracking = cartItem ? cartItem.product.stockTracking : product.stockTracking;
			const stockLevel = cartItem?.variant?.stockLevel ?? (cartItem ? cartItem.product.stockLevel : product.stockLevel);
			const currentQuantity = cartItem?.quantity ?? 0;
			if (stockPurchasable || !stockTracking) return true;
			return currentQuantity + quantityToAdd <= stockLevel;
		},
		async addCartItem(item) {
			const { $swell } = useNuxtApp();
			if (this.isUpdating) return;
			if (this.cart?.items?.some((ci) => ci.product_id === item.product_id)) {
				this.setNotification({
					show: true,
					type: "danger",
					dismissible: true,
					text: "cart.already"
				});
				return;
			}
			this.setCartUpdating(true);
			this.setCartUpdatingId(item?.product_id);
			try {
				if ($swell.settings.get("cart.validateStock")) {
					if (!await this.checkCartItemHasStock({ item })) {
						this.setCartUpdating(false);
						this.setCartUpdatingId(null);
						throw new Error("invalid_stock");
					}
				}
				const cart = await $swell.cart.addItem(item);
				if (cart.errors) this.setCartError(cart.errors);
				else {
					this.setCart(cart);
					this.setCartOpened(true);
				}
			} catch (err) {
				if (err.message === "invalid_stock") throw err;
				console.error("addCartItem error", err);
			}
			this.setCartUpdating(false);
		},
		async removeCartItem(item) {
			const { $swell } = useNuxtApp();
			if (this.isUpdating) return;
			this.setCartUpdating(true);
			try {
				const cart = await $swell.cart.removeItem(item.id);
				this.setCart(cart);
			} catch (err) {
				console.error(err);
			}
			this.setCartUpdating(false);
		},
		async initializeCart({ checkoutId } = {}) {
			const { $swell } = useNuxtApp();
			try {
				const cart = checkoutId ? await $swell.cart.recover(checkoutId) : await $swell.cart.get();
				this.setCart(cart);
			} catch (err) {
				console.error("initializeCart error", err);
			}
		}
	},
	getters: {
		getCart: (state) => state.cart,
		getCartOpened: (state) => state.isOpened,
		getCartProducts: (state) => state.cart?.items ?? [],
		getCartProductsCount: (state) => state.cart?.item_quantity ?? 0,
		getCartUpdating: (state) => state.isUpdating,
		getCartUpdatingId: (state) => state.isUpdatingId,
		getNotification: (state) => state.notification
	}
});

export { useCartStore as u };
//# sourceMappingURL=cart-0E5QDcVx.mjs.map
