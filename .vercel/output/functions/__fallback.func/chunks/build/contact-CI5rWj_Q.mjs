import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, M as Media_default } from '../virtual/entry.mjs';
import { computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderComponent } from 'vue/server-renderer';
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

//#region pages/contact.vue
var _sfc_main = {
	__name: "contact",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const { data: content } = useAsyncData("contact", async () => {
			try {
				const docs = await $prismic.client.getAllByType("contact", { lang: `${locale.value}-ca` });
				if (!docs.length) return null;
				const doc = docs[0].data;
				if (doc.seo?.id) doc._seo = (await $prismic.client.getByID(doc.seo.id, { lang: "*" }).catch(() => null))?.data ?? null;
				return doc;
			} catch (err) {
				console.error("[contact] Failed to fetch Prismic data:", err?.message || String(err));
				return null;
			}
		});
		useHead(computed(() => ({
			title: content.value?._seo?.title ? asText(content.value._seo.title) : "La Bête",
			meta: [{
				name: "description",
				content: content.value?._seo?.description ? asText(content.value._seo.description) : ""
			}]
		})));
		const formattedTitle = (item) => {
			return item && item.label && item.label.length > 0 && item.label[0].text.toLowerCase();
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Media = Media_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content" }, _attrs))}>`);
			if (unref(content)) {
				_push(`<section class="container"><div class="row"><div class="col-md-12">${unref(asHTML)(unref(content).title) ?? ""}</div></div><div class="row align-items-center justify-content-center">`);
				if (unref(content) && unref(content).contact_items) {
					_push(`<div class="col-md-4"><!--[-->`);
					ssrRenderList(unref(content).contact_items, (item, index) => {
						_push(`<div class="contact-item"><a${ssrRenderAttr("href", `${item.link && item.link.url}`)}${ssrRenderAttr("title", formattedTitle(item))} data-track="" data-track-category="contact" data-track-action="click"${ssrRenderAttr("data-track-label", formattedTitle(item))} target="_blank">`);
						if (item && item.label && item.label.length > 0) {
							_push(`<h2>${ssrInterpolate(item.label[0].text)}`);
							if (item.fa_icon && item.fa_icon.length > 0) _push(`<i class="${ssrRenderClass(item.fa_icon[0].text)}"></i>`);
							else _push(`<!---->`);
							_push(`</h2>`);
						} else _push(`<!---->`);
						if (item && item.display_text && item.display_text.length > 0) _push(`<p>${ssrInterpolate(item.display_text[0].text)}</p>`);
						else _push(`<!---->`);
						if (item && item.label && item.handle.length > 0 && item.handle[0].text) _push(`<p>${ssrInterpolate(item.handle[0].text)}</p>`);
						else _push(`<!---->`);
						_push(`</a></div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`<div class="col-md-4">`);
				_push(ssrRenderComponent(_component_Media, {
					image: unref(content).image,
					altProp: _ctx.$t("contact.alt"),
					classes: "contact-img-1"
				}, null, _parent));
				_push(ssrRenderComponent(_component_Media, {
					image: unref(content).mobile_image,
					altProp: _ctx.$t("contact.alt"),
					classes: "contact-img-2"
				}, null, _parent));
				_push(`</div></div></section>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-CI5rWj_Q.mjs.map
