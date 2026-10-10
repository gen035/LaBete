import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, g as useSeoMeta, C as ClientOnly, _ as _plugin_vue_export_helper_default, M as Media_default, e as useMainStore } from '../virtual/entry.mjs';
import { B as Block_default } from './Block-BFruawGP.mjs';
import { computed, mergeProps, unref, resolveComponent, withCtx, createVNode, openBlock, createBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import { asText } from '@prismicio/client';
import { Navigation, Pagination, Slide, Carousel } from 'vue3-carousel';
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

//#region components/Slider.vue
var _sfc_main$2 = {
	props: { data: {
		type: Object,
		required: true,
		default: () => ({})
	} },
	components: {
		Carousel,
		Slide,
		Pagination,
		Navigation
	}
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Carousel = resolveComponent("Carousel");
	const _component_Slide = resolveComponent("Slide");
	const _component_Media = Media_default;
	const _component_Pagination = resolveComponent("Pagination");
	const _component_Navigation = resolveComponent("Navigation");
	_push(ssrRenderComponent(_component_Carousel, mergeProps({
		"wrap-around": $props.data.infinite,
		autoplay: $props.data.autoplay ? $props.data.autoplay_speed : 0,
		"pause-autoplay-on-hover": $props.data.pause_on_hover,
		"items-to-show": $props.data.slides_to_show || 1,
		height: 500
	}, _attrs), {
		addons: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) {
				if ($props.data.dots) _push(ssrRenderComponent(_component_Pagination, null, null, _parent, _scopeId));
				else _push(`<!---->`);
				if ($props.data.arrows) _push(ssrRenderComponent(_component_Navigation, null, null, _parent, _scopeId));
				else _push(`<!---->`);
			} else return [$props.data.dots ? (openBlock(), createBlock(_component_Pagination, { key: 0 })) : createCommentVNode("", true), $props.data.arrows ? (openBlock(), createBlock(_component_Navigation, { key: 1 })) : createCommentVNode("", true)];
		}),
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) {
				_push(`<!--[-->`);
				ssrRenderList($props.data.slides, (item, index) => {
					_push(ssrRenderComponent(_component_Slide, { key: index }, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(ssrRenderComponent(_component_Media, {
								image: item.slide,
								altProp: item.slide.alt,
								ariaHidden: true
							}, null, _parent, _scopeId));
							else return [createVNode(_component_Media, {
								image: item.slide,
								altProp: item.slide.alt,
								ariaHidden: true
							}, null, 8, ["image", "altProp"])];
						}),
						_: 2
					}, _parent, _scopeId));
				});
				_push(`<!--]-->`);
			} else return [(openBlock(true), createBlock(Fragment, null, renderList($props.data.slides, (item, index) => {
				return openBlock(), createBlock(_component_Slide, { key: index }, {
					default: withCtx(() => [createVNode(_component_Media, {
						image: item.slide,
						altProp: item.slide.alt,
						ariaHidden: true
					}, null, 8, ["image", "altProp"])]),
					_: 2
				}, 1024);
			}), 128))];
		}),
		_: 1
	}, _parent));
}
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Slider.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Slider_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]), { __name: "Slider" });
//#endregion
//#region components/Card.vue
var _sfc_main$1 = {
	props: { card: {
		type: Object,
		required: true,
		default: () => ({})
	} },
	setup() {
		const { locale } = useI18n();
		return {
			locale,
			mainStore: useMainStore()
		};
	},
	computed: { computedHref() {
		if (!this.card.open_modal) {
			const page = (this.card?.link?.url || "#").split("/").pop();
			return `${this.locale.value === "en" ? "/" + this.locale.value : ""}/${page}`;
		}
		return "javascript:void(0);";
	} },
	methods: { goTo() {
		if (this.card.open_modal) this.mainStore.setMessageOpened(true);
	} }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Media = Media_default;
	_push(`<a${ssrRenderAttrs(mergeProps({
		href: $options.computedHref,
		title: $props.card.title[0].text
	}, _attrs))}>`);
	_push(ssrRenderComponent(_component_Media, {
		classes: "d-none d-md-block d-lg-block",
		image: $props.card.image
	}, null, _parent));
	_push(ssrRenderComponent(_component_Media, {
		classes: "d-block d-md-none d-lg-none",
		image: $props.card.image_mobile
	}, null, _parent));
	_push(`<h2>${ssrInterpolate($props.card.title[0].text)}</h2></a>`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Card.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Card_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "Card" });
//#endregion
//#region pages/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { $swell } = useNuxtApp();
		const { locale } = useI18n();
		const { data: pageData } = useAsyncData(`home-${locale.value}`, async () => {
			try {
				const lang = `${locale.value}-ca`;
				const homeDocs = await $prismic.client.getAllByType("home", { lang });
				if (homeDocs.length === 0) return null;
				const content = homeDocs[0].data;
				const [hero_button_doc, seo_doc] = await Promise.all([content.hero_button?.id ? $prismic.client.getByID(content.hero_button.id, { lang: "*" }).catch(() => null) : null, content.seo?.id ? $prismic.client.getByID(content.seo.id, { lang: "*" }).catch(() => null) : null]);
				const cards = await Promise.all((content.cards || []).map(({ card }) => card?.id ? $prismic.client.getByID(card.id, { lang: "*" }).then((d) => d?.data ?? null).catch(() => null) : null));
				const blocks = await Promise.all((content.blocks || []).map(({ block }) => block?.id ? $prismic.client.getByID(block.id, { lang: "*" }).then((d) => d?.data ?? null).catch(() => null) : null));
				const sliderDoc = content.slider?.id ? await $prismic.client.getByID(content.slider.id, { lang: "*" }).catch(() => null) : null;
				const top_blocks = await Promise.all((content.top_blocks || []).map(async ({ top_block }) => {
					if (!top_block?.id) return null;
					const item = await $prismic.client.getByID(top_block.id, { lang: "*" }).catch(() => null);
					if (!item) return null;
					if (item.data.button?.id) item.data.button = await $prismic.client.getByID(item.data.button.id, { lang: "*" }).catch(() => null);
					return item.data;
				}));
				return {
					content,
					hero_button: hero_button_doc?.data ?? null,
					seo: seo_doc?.data ?? null,
					cards: cards.filter(Boolean),
					blocks: blocks.filter(Boolean),
					slider: sliderDoc?.data ?? null,
					top_blocks: top_blocks.filter(Boolean)
				};
			} catch (err) {
				console.error("[home] Failed to fetch Prismic data:", err?.message || String(err));
				return null;
			}
		});
		const { data: productsResults } = useAsyncData("home-products", async () => {
			return (await $swell.products.list({
				limit: 4,
				sort: "date_created desc",
				categories: "featured"
			}))?.results ?? [];
		});
		useHead(computed(() => ({ title: pageData.value?.seo ? asText(pageData.value.seo.title) : "La Bête" })));
		useSeoMeta(computed(() => ({ description: pageData.value?.seo ? asText(pageData.value.seo.description) : "" })));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Slider = Slider_default;
			const _component_Block = Block_default;
			const _component_Card = Card_default;
			const _component_client_only = ClientOnly;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "home" }, _attrs))}><section class="home-slider container-fluid"><div class="container"><div class="row"><div class="col-md-8 col-sm-12">`);
			if (unref(pageData)?.slider) _push(ssrRenderComponent(_component_Slider, { data: unref(pageData).slider }, null, _parent));
			else _push(`<!---->`);
			_push(`</div><div class="col-md-4 d-none d-md-block position-relative"><div class="home-text-box"><h1 class="home-title">${ssrInterpolate(unref(pageData)?.content?.hero_title?.[0]?.text)}</h1><p class="home-subtitle">${ssrInterpolate(unref(pageData)?.content?.hero_subtitle?.[0]?.text)}</p>`);
			if (unref(pageData)?.hero_button) _push(`<a class="button-simple"${ssrRenderAttr("href", unref(pageData)?.hero_button?.url?.url)}>${ssrInterpolate(unref(pageData)?.hero_button?.text)}</a>`);
			else _push(`<!---->`);
			_push(`</div></div></div></div></section><section class="container d-md-none"><div class="row"><div class="col-12 text-center pb-4"><h1 class="home-title--mobile">${ssrInterpolate(unref(pageData)?.content?.hero_title?.[0]?.text)}</h1><p class="home-subtitle--mobile">${ssrInterpolate(unref(pageData)?.content?.hero_subtitle?.[0]?.text)}</p>`);
			if (unref(pageData)?.hero_button) _push(`<a class="d-inline-block button-simple"${ssrRenderAttr("href", unref(pageData)?.hero_button?.url?.url)}>${ssrInterpolate(unref(pageData)?.hero_button?.text)}</a>`);
			else _push(`<!---->`);
			_push(`</div></div></section><!--[-->`);
			ssrRenderList(unref(pageData)?.top_blocks, (block, index) => {
				_push(ssrRenderComponent(_component_Block, {
					block,
					index,
					size: "small",
					imageType: index === 0 ? "img" : "background"
				}, null, _parent));
			});
			_push(`<!--]-->`);
			if (unref(pageData)?.cards && unref(pageData)?.cards.length > 0) {
				_push(`<section class="py-5"><div class="container"><div class="row align-items-center justify-content-center"><!--[-->`);
				ssrRenderList(unref(pageData)?.cards, (card, index) => {
					_push(`<div class="col-6 col-md-4 home-link">`);
					_push(ssrRenderComponent(_component_Card, { card }, null, _parent));
					_push(`</div>`);
				});
				_push(`<!--]--></div></div></section>`);
			} else _push(`<!---->`);
			_push(`<!--[-->`);
			ssrRenderList(unref(pageData)?.blocks, (block, index) => {
				_push(ssrRenderComponent(_component_Block, {
					block,
					index,
					imageType: index === 0 ? "img" : "background"
				}, null, _parent));
			});
			_push(`<!--]-->`);
			_push(ssrRenderComponent(_component_client_only, null, {}, _parent));
			_push(`</div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pages-Gnpvmwgl.mjs.map
