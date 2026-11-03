import { u as useRoute$1, a as useNuxtApp, b as useAsyncData, c as useHead, _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useCartStore } from './cart-0E5QDcVx.mjs';
import { P as ProductCard_default, C as CustomButton_default } from './CustomButton-DsiMkVeL.mjs';
import { computed, mergeProps, unref, createSlots, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, useSSRContext } from 'vue';
import { defineStore } from 'pinia';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import VLazyImage from 'v-lazy-image';
import { Carousel, Slide, Pagination } from 'vue3-carousel';
import 'nostics';
import 'nostics/formatters/ansi';
import '../nitro/nitro.mjs';
import 'unhead/server';
import 'unhead/legacy';
import 'unhead/plugins';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'unhead/utils';
import '@prismicio/client';
import 'swell-js';

//#region assets/images/quebec_fr.png
var quebec_fr_default = __buildAssetsURL("quebec_fr.CRmOiERu.png");
//#endregion
//#region assets/images/quebec_en.png
var quebec_en_default = __buildAssetsURL("quebec_en.BiI9Q6OW.png");
//#endregion
//#region components/AddToCart.vue
var _sfc_main$1 = {
	props: { product: {
		type: Object,
		required: true,
		default: () => ({})
	} },
	setup() {
		return { cartStore: useCartStore() };
	},
	methods: { async addToCart() {
		await this.cartStore.addCartItem({
			product_id: this.product.id,
			quantity: 1
		});
	} }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(ssrRenderComponent(CustomButton_default, mergeProps({
		"aria-label": _ctx.$t("cart.addToCart"),
		onClick: $options.addToCart,
		text: $setup.cartStore.getCartUpdating && $setup.cartStore.getCartUpdatingId === $props.product.id ? _ctx.$t("cart.addToCartPending") : _ctx.$t("cart.addToCart"),
		disabled: $props.product.stock_status !== "in_stock",
		icon: "fa-shopping-cart"
	}, _attrs), null, _parent));
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AddToCart.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AddToCart_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "AddToCart" });
//#endregion
//#region stores/product.ts
var useProductStore = defineStore("product", {
	state: () => ({
		recommended: null,
		error: null
	}),
	actions: {
		setRecommended(products) {
			this.recommended = products;
		},
		async fetchProductsBySlugs(products) {
			const { $swell } = useNuxtApp();
			if (!Array.isArray(products) || products.length === 0) {
				this.setRecommended(null);
				return;
			}
			try {
				const ids = products.map(({ product_id }) => product_id).filter(Boolean);
				const valid = (await Promise.all(ids.map(async (id) => {
					try {
						return await $swell.products.get({ where: { id } });
					} catch {
						return null;
					}
				}))).filter((p) => p?.results?.length > 0).map((p) => p.results[0]).filter((p) => p.stock_level > 0).slice(0, 3);
				this.setRecommended(valid);
			} catch (err) {
				console.error("fetchProductsBySlugs error", err);
				this.setRecommended(null);
			}
		}
	},
	getters: { getProductRecommended: (state) => state.recommended }
});
//#endregion
//#region pages/products/product/[slug].vue
var _sfc_main = {
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute$1();
		const { $swell } = useNuxtApp();
		const productStore = useProductStore();
		const { data: product } = useAsyncData(`product-${route.params.slug}`, async () => {
			try {
				const p = await $swell.products.get(route.params.slug, { expand: ["cross_sells", "up_sells"] });
				if (p) {
					const upSells = p.up_sells && p.up_sells.length > 0 ? p.up_sells : null;
					await productStore.fetchProductsBySlugs(upSells);
				}
				return p || null;
			} catch (err) {
				console.error("[product] Failed to fetch product:", err?.message || String(err));
				return null;
			}
		});
		useHead(computed(() => ({
			title: product.value ? `La Bête | ${product.value.meta_title || product.value.name}` : "La Bête",
			meta: [{
				hid: "description",
				name: "description",
				content: product.value ? `${product.value.meta_description || product.value.description}` : ""
			}]
		})));
		const getProductRecommended = computed(() => productStore.getProductRecommended);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_AddToCart = AddToCart_default;
			const _component_ProductCard = ProductCard_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content product" }, _attrs))}><section class="container-fluid"><div class="row"><div class="col-md-6 col-lg-5 col-xl-4 col-xxl-3 offset-lg-1 offset-xl-2 offset-xxl-3 product-slider">`);
			if (unref(product) && unref(product).images && unref(product).images.length > 0) _push(ssrRenderComponent(unref(Carousel), {
				"wrap-around": true,
				autoplay: unref(product).images.length > 1 ? 2e3 : 0,
				"pause-autoplay-on-hover": true,
				"items-to-show": 1
			}, createSlots({
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<!--[-->`);
						ssrRenderList(unref(product).images, (image, index) => {
							_push(ssrRenderComponent(unref(Slide), { key: index }, {
								default: withCtx((_, _push, _parent, _scopeId) => {
									if (_push) _push(ssrRenderComponent(unref(VLazyImage), {
										src: image.file.url,
										alt: `${unref(product).name} - ${index}`,
										"src-placeholder": "/product_placeholder.jpg"
									}, null, _parent, _scopeId));
									else return [createVNode(unref(VLazyImage), {
										src: image.file.url,
										alt: `${unref(product).name} - ${index}`,
										"src-placeholder": "/product_placeholder.jpg"
									}, null, 8, ["src", "alt"])];
								}),
								_: 2
							}, _parent, _scopeId));
						});
						_push(`<!--]-->`);
					} else return [(openBlock(true), createBlock(Fragment, null, renderList(unref(product).images, (image, index) => {
						return openBlock(), createBlock(unref(Slide), { key: index }, {
							default: withCtx(() => [createVNode(unref(VLazyImage), {
								src: image.file.url,
								alt: `${unref(product).name} - ${index}`,
								"src-placeholder": "/product_placeholder.jpg"
							}, null, 8, ["src", "alt"])]),
							_: 2
						}, 1024);
					}), 128))];
				}),
				_: 2
			}, [unref(product).images.length > 1 ? {
				name: "addons",
				fn: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(ssrRenderComponent(unref(Pagination), null, null, _parent, _scopeId));
					else return [createVNode(unref(Pagination))];
				}),
				key: "0"
			} : void 0]), _parent));
			else _push(`<!---->`);
			if (_ctx.$i18n.locale === "fr") _push(`<img${ssrRenderAttr("src", quebec_fr_default)} class="product-card-quebec">`);
			else _push(`<!---->`);
			if (_ctx.$i18n.locale === "en") _push(`<img${ssrRenderAttr("src", quebec_en_default)} class="product-card-quebec">`);
			else _push(`<!---->`);
			_push(`</div><div class="col-md-6 col-lg-5 col-xl-4 col-xxl-3 product-detail">`);
			if (unref(product) && unref(product).stock_level <= 0) _push(`<div class="mb-2 product-price product-price--sold"><span>${ssrInterpolate(_ctx.$t("product.sold"))}</span></div>`);
			else _push(`<!---->`);
			_push(`<h1 class="product-title">${ssrInterpolate(unref(product)?.name)}</h1><div class="product-desc">${unref(product)?.description ?? ""}</div>`);
			if (unref(product) && !unref(product).sale && unref(product).stock_level > 0) _push(`<div class="product-price">${ssrInterpolate(unref(product).price)}\$</div>`);
			else _push(`<!---->`);
			if (unref(product) && unref(product).sale && unref(product).stock_level > 0) _push(`<div class="product-price product-price--sale"><span>${ssrInterpolate(unref(product).price)}\$</span><s>${ssrInterpolate(unref(product).orig_price)}\$</s></div>`);
			else _push(`<!---->`);
			if (unref(product) && unref(product).stock_level > 0) _push(ssrRenderComponent(_component_AddToCart, { product: unref(product) }, null, _parent));
			else _push(`<!---->`);
			_push(`</div></div>`);
			if (unref(getProductRecommended) && unref(getProductRecommended).length > 0) {
				_push(`<div class="row"><div class="col-md-12"><h1>${ssrInterpolate(_ctx.$t("product.recommended"))}</h1></div><div class="row d-flex justify-content-center"><!--[-->`);
				ssrRenderList(unref(getProductRecommended), (upsell, index) => {
					_push(ssrRenderComponent(_component_ProductCard, {
						product: upsell,
						key: index
					}, null, _parent));
				});
				_push(`<!--]--></div></div>`);
			} else _push(`<!---->`);
			_push(`</section></section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/product/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-BdTHIcfY.mjs.map
