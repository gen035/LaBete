import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, M as Media_default } from '../virtual/entry.mjs';
import { computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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

//#region pages/artist.vue
var _sfc_main = {
	__name: "artist",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const { data: content } = useAsyncData("artist", async () => {
			try {
				const docs = await $prismic.client.getAllByType("about", { lang: `${locale.value}-ca` });
				if (!docs.length) return null;
				const doc = docs[0].data;
				if (doc.seo?.id) doc._seo = (await $prismic.client.getByID(doc.seo.id, { lang: "*" }).catch(() => null))?.data ?? null;
				return doc;
			} catch (err) {
				console.error("[artist] Failed to fetch Prismic data:", err?.message || String(err));
				return null;
			}
		});
		const hasMobileImage = computed(() => content.value?.mobile_image ?? false);
		useHead(computed(() => ({
			title: content.value?._seo?.title ? asText(content.value._seo.title) : "La Bête",
			meta: [{
				name: "description",
				content: content.value?._seo?.description ? asText(content.value._seo.description) : ""
			}]
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Media = Media_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content artist" }, _attrs))}>`);
			if (unref(content)) {
				_push(`<section class="container"><div class="row"><div class="col-md-12">${unref(asHTML)(unref(content).title) ?? ""}</div><div class="col-md-12 text-center m-0">${unref(asHTML)(unref(content).subtitle) ?? ""}</div></div><div class="row"><div class="col-md-6 col-lg-4 offset-lg-1 text-center">`);
				if (unref(content).image) _push(ssrRenderComponent(_component_Media, {
					image: unref(content).image,
					class: { "d-none d-md-block": unref(hasMobileImage) }
				}, null, _parent));
				else _push(`<!---->`);
				if (unref(content).mobile_image) _push(ssrRenderComponent(_component_Media, {
					image: unref(content).mobile_image,
					class: "d-md-none"
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div><div class="col-md-6 col-lg-6">${unref(asHTML)(unref(content).content) ?? ""}</div></div></section>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/artist.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=artist-DzNuN__y.mjs.map
