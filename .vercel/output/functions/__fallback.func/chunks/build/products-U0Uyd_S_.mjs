import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead } from '../virtual/entry.mjs';
import { C as CategoriesDropdown_default, N as NoProducts_default } from './NoProducts-AtL-X6zB.mjs';
import { P as ProductCard_default, C as CustomButton_default } from './CustomButton-DsiMkVeL.mjs';
import { computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { asText, asHTML } from '@prismicio/client';
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
import 'pinia';
import 'swell-js';
import 'v-lazy-image';

//#region pages/products/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic, $swell } = useNuxtApp();
		const { locale } = useI18n();
		const { data: pageData } = useAsyncData("products-index", async () => {
			try {
				const lang = `${locale.value}-ca`;
				const response = await $prismic.client.getAllByType("products", { lang });
				let content = null;
				response.forEach((result) => {
					content = result.data;
				});
				if (!content) return null;
				const seo = (content.seo?.id ? await $prismic.client.getByID(content.seo.id, { lang: "*" }).catch(() => null) : null)?.data ?? null;
				return {
					content,
					seo
				};
			} catch (err) {
				console.error("[products-index] Failed to fetch Prismic data:", err?.message || String(err));
				return null;
			}
		});
		useHead(computed(() => ({
			title: pageData.value?.seo ? asText(pageData.value.seo.title) : "La Bête",
			meta: [{
				hid: "description",
				name: "description",
				content: pageData.value?.seo ? asText(pageData.value.seo.description) : ""
			}]
		})));
		const count = ref(0);
		const products = ref(null);
		const productsResults = ref([]);
		const progress = ref(0);
		const hasFetched = ref(false);
		const setProgress = (amount, total) => {
			progress.value = amount / total * 100;
		};
		const fetchProducts = async () => {
			products.value = await $swell.products.list({
				limit: 24,
				sort: "date_created desc",
				page: products.value && products.value.page + 1 || 1
			});
			if (products.value && products.value.results && products.value.results.length > 0) {
				const newProducts = products.value.results;
				const uniqueProducts = [...productsResults.value, ...newProducts.filter((product) => !productsResults.value.some((existingProduct) => existingProduct.id === product.id))];
				productsResults.value = uniqueProducts;
			}
			count.value = products.value.count;
			setProgress(productsResults.value.length, count.value);
			hasFetched.value = true;
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_CategoriesDropdown = CategoriesDropdown_default;
			const _component_NoProducts = NoProducts_default;
			const _component_ProductCard = ProductCard_default;
			const _component_CustomButton = CustomButton_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content products" }, _attrs))}><section class="container-fluid"><div class="row"><div class="col-md-8 offset-md-2 col-xl-6 offset-xl-3">${unref(asHTML)(unref(pageData)?.content?.title) ?? ""}</div></div>`);
			if (unref(pageData)?.content?.content) _push(`<div class="row"><div class="col-md-8 offset-md-2 col-xl-6 offset-xl-3 text-center product-description">${unref(asHTML)(unref(pageData)?.content?.content) ?? ""}</div></div>`);
			else _push(`<!---->`);
			_push(`<div class="row"><div class="col-12 text-center">`);
			_push(ssrRenderComponent(_component_CategoriesDropdown, null, null, _parent));
			_push(`</div></div>`);
			if (unref(hasFetched)) {
				_push(`<!--[--><div class="row">`);
				if (unref(productsResults) && unref(productsResults).length === 0) _push(ssrRenderComponent(_component_NoProducts, null, null, _parent));
				else {
					_push(`<!--[-->`);
					ssrRenderList(unref(productsResults), (product) => {
						_push(ssrRenderComponent(_component_ProductCard, {
							product,
							key: product.id
						}, null, _parent));
					});
					_push(`<!--]-->`);
				}
				_push(`</div>`);
				if (unref(count) > 24) _push(`<div class="row"><div class="progress my-3 mx-auto"><div class="progress-bar" style="${ssrRenderStyle({ width: unref(progress) + "%" })}"></div></div><div class="progress-text text-center my-2">${ssrInterpolate(_ctx.$t("products.progress", {
					current: unref(productsResults).length,
					count: unref(count)
				}))}</div></div>`);
				else _push(`<!---->`);
				if (unref(products) && unref(products).page < unref(products).page_count) {
					_push(`<div class="row">`);
					_push(ssrRenderComponent(_component_CustomButton, {
						text: _ctx.$t("products.more"),
						onClick: fetchProducts,
						icon: "fa-plus",
						size: "large"
					}, null, _parent));
					_push(`</div>`);
				} else _push(`<!---->`);
				_push(`<!--]-->`);
			} else _push(`<!---->`);
			_push(`</section></section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=products-U0Uyd_S_.mjs.map
