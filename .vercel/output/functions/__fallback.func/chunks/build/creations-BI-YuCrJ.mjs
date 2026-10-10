import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, M as Media_default, C as ClientOnly } from '../virtual/entry.mjs';
import { ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

//#region pages/creations.vue
var _sfc_main = {
	__name: "creations",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		ref(null);
		const { data: content } = useAsyncData("creations", async () => {
			try {
				const docs = await $prismic.client.getAllByType("creations", { lang: `${locale.value}-ca` });
				if (!docs.length) return null;
				const doc = docs[0].data;
				if (doc.seo?.id) doc._seo = (await $prismic.client.getByID(doc.seo.id, { lang: "*" }).catch(() => null))?.data ?? null;
				return doc;
			} catch (err) {
				console.error("[creations] Failed to fetch Prismic data:", err?.message || String(err));
				return null;
			}
		});
		const images = computed(() => {
			if (!content.value?.images) return [];
			return content.value.images.map((item) => ({
				title: item.image.alt || null,
				url: item.image.url
			}));
		});
		useHead(computed(() => ({
			title: content.value?._seo?.title ? asText(content.value._seo.title) : "La Bête",
			meta: [{
				name: "description",
				content: content.value?._seo?.description ? asText(content.value._seo.description) : ""
			}]
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Media = Media_default;
			const _component_ClientOnly = ClientOnly;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content creations" }, _attrs))}>`);
			if (unref(content)) {
				_push(`<section class="container"><div class="row"><div class="col-md-12">${unref(asHTML)(unref(content).title) ?? ""}</div></div><div class="row"><!--[-->`);
				ssrRenderList(unref(images), (image, imageIndex) => {
					_push(`<div class="col-2 creations-img">`);
					_push(ssrRenderComponent(_component_Media, { image }, null, _parent));
					_push(`</div>`);
				});
				_push(`<!--]--></div>`);
				_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
				_push(`</section>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/creations.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=creations-BI-YuCrJ.mjs.map
