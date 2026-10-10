import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, g as useSeoMeta } from '../virtual/entry.mjs';
import { computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';
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

//#region pages/cookie-policy.vue
var _sfc_main = {
	__name: "cookie-policy",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const { data: content } = useAsyncData("cookie-policy", async () => {
			try {
				const doc = await $prismic.client.getByUID("page", "cookie_policy", { lang: `${locale.value}-ca` });
				if (!doc) return null;
				const contentData = doc.data;
				if (contentData.seo && contentData.seo.id) {
					const seoDoc = await $prismic.client.getByID(contentData.seo.id).catch(() => null);
					contentData._seo = seoDoc ? seoDoc.data : null;
				}
				return contentData;
			} catch (err) {
				console.error("Error fetching document:", err);
				return null;
			}
		});
		useHead(computed(() => ({ title: content.value?._seo?.title ? asText(content.value._seo.title) : "La Bête" })));
		useSeoMeta(computed(() => ({ description: content.value?._seo?.description ? asText(content.value._seo.description) : "" })));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content cookie_policy" }, _attrs))}><section class="container"><div class="row"><div class="col-md-12">${(unref(content) ? unref(asHTML)(unref(content).title) : "") ?? ""}</div></div><div class="row align-items-center justify-content-center"><div class="col-md-8">${(unref(content) ? unref(asHTML)(unref(content).content) : "") ?? ""}</div></div></section></section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cookie-policy.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cookie-policy-D3piAlGp.mjs.map
