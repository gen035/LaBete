import { u as useRoute$1, a as useNuxtApp, d as useI18n, e as useMainStore, b as useAsyncData, c as useHead } from '../virtual/entry.mjs';
import { C as CategoriesDropdown_default, N as NoProducts_default } from './NoProducts-AtL-X6zB.mjs';
import { P as ProductCard_default, C as CustomButton_default } from './CustomButton-DsiMkVeL.mjs';
import { computed, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { asText } from '@prismicio/client';
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

//#region pages/products/[slug].vue
var _sfc_main = {
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute$1();
		const { $prismic, $swell } = useNuxtApp();
		const { locale } = useI18n();
		const mainStore = useMainStore();
		const { data: pageData } = useAsyncData(`products-category-${route.params.slug}`, async () => {
			try {
				const lang = `${locale.value}-ca`;
				const response = await $prismic.client.getAllByType("products", { lang });
				let content = null;
				response.forEach((result) => {
					content = result.data;
				});
				if (!content) return null;
				const seo = (content.seo?.id ? await $prismic.client.getByID(content.seo.id).catch(() => null) : null)?.data ?? null;
				return {
					content,
					seo
				};
			} catch (err) {
				console.error("[products-category] Failed to fetch Prismic data:", err?.message || String(err));
				return null;
			}
		});
		useHead(computed(() => {
			const categorySlug = route.params.slug;
			return {
				title: pageData.value?.seo ? `${asText(pageData.value.seo.title)} - ${categorySlug}` : "La Bête",
				meta: [{
					hid: "description",
					name: "description",
					content: pageData.value?.seo ? asText(pageData.value.seo.description) : ""
				}]
			};
		}));
		const count = ref(0);
		const products = ref(null);
		const productsResults = ref([]);
		const progress = ref(0);
		const hasFetched = ref(false);
		const categoryTitle = computed(() => {
			const category = (mainStore.categories || []).find((c) => c.slug === route.params.slug);
			return category ? category.name : "";
		});
		const categoryDesc = computed(() => {
			const category = (mainStore.categories || []).find((c) => c.slug === route.params.slug);
			return category ? category.description : "";
		});
		const setProgress = (amount, total) => {
			progress.value = amount / total * 100;
		};
		const fetchProducts = async () => {
			products.value = await $swell.products.list({
				limit: 24,
				sort: "date_created desc",
				categories: route.params.slug,
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
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content products" }, _attrs))}><section class="container-fluid"><div class="row"><div class="col-md-12"><h2 class="title-h2">${ssrInterpolate(unref(categoryTitle))}</h2></div></div>`);
			if (unref(categoryDesc)) _push(`<div class="row"><div class="col-md-8 offset-md-2 text-center product-description">${unref(categoryDesc) ?? ""}</div></div>`);
			else _push(`<!---->`);
			_push(`<div class="row"><div class="col-12 text-center">`);
			_push(ssrRenderComponent(_component_CategoriesDropdown, null, null, _parent));
			_push(`</div></div>`);
			if (unref(hasFetched)) {
				_push(`<!--[--><div class="row">`);
				if (unref(productsResults) && unref(productsResults).length === 0) _push(ssrRenderComponent(_component_NoProducts, null, null, _parent));
				else {
					_push(`<!--[-->`);
					ssrRenderList(unref(productsResults), (product, index) => {
						_push(ssrRenderComponent(_component_ProductCard, {
							product,
							key: index
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
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-Dd9cYiho.mjs.map
