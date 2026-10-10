import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead } from '../virtual/entry.mjs';
import { computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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

//#region pages/videos.vue
var _sfc_main = {
	__name: "videos",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const { data: content } = useAsyncData("videos", async () => {
			try {
				const docs = await $prismic.client.getAllByType("videos_page", { lang: `${locale.value}-ca` });
				if (!docs.length) return null;
				const doc = docs[0].data;
				if (doc.seo?.id) doc._seo = (await $prismic.client.getByID(doc.seo.id, { lang: "*" }).catch(() => null))?.data ?? null;
				return doc;
			} catch (err) {
				console.error("[videos] Failed to fetch Prismic data:", err?.message || String(err));
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
		const responsiveEmbed = (html) => {
			return (html || "").replace(/width="[^"]*"/i, "width=\"100%\"").replace(/height="[^"]*"/i, "height=\"100%\"");
		};
		const formatDate = (dateStr) => {
			try {
				return new Date(dateStr).toLocaleDateString("fr-CA", {
					year: "numeric",
					month: "long",
					day: "numeric"
				});
			} catch (e) {
				return dateStr;
			}
		};
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content videos" }, _attrs))}>`);
			if (unref(content)) {
				_push(`<section class="container"><div class="row"><div class="col-md-12">${unref(asHTML)(unref(content).title) ?? ""}</div><div class="col-md-8 offset-md-2 text-center mb-5">${unref(asHTML)(unref(content).content) ?? ""}</div></div><div class="row"><!--[-->`);
				ssrRenderList(unref(content).videos, (video, index) => {
					_push(`<div class="col-md-6 offset-md-3 mb-5 video"><h2>${ssrInterpolate(unref(asText)(video.video_title))}</h2>`);
					if (video.date) _push(`<time>${ssrInterpolate(formatDate(video.date))}</time>`);
					else _push(`<!---->`);
					if (video.video_link && video.video_link.html) _push(`<div class="video-wrapper"><div class="video-embed">${responsiveEmbed(video.video_link.html) ?? ""}</div></div>`);
					else _push(`<!---->`);
					_push(`</div>`);
				});
				_push(`<!--]--></div></section>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/videos.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=videos-DFkA1KEz.mjs.map
