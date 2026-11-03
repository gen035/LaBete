import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead } from '../virtual/entry.mjs';
import { B as Block_default } from './Block-BFruawGP.mjs';
import { computed, mergeProps, unref, useSSRContext } from 'vue';
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

//#region pages/brand.vue
var _sfc_main = {
	__name: "brand",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const { data } = useAsyncData(`brand-${locale.value}`, async () => {
			try {
				const docs = await $prismic.client.getAllByType("brandpage", { lang: `${locale.value}-ca` });
				if (!docs.length) return null;
				const doc = docs[0].data;
				let seo = null;
				if (doc.seo?.id) seo = (await $prismic.client.getByID(doc.seo.id, { lang: "*" }).catch(() => null))?.data ?? null;
				const blocks = [];
				for (const block of doc.blocks || []) {
					if (!block.block?.id) continue;
					const item = await $prismic.client.getByID(block.block.id, { lang: "*" }).catch(() => null);
					if (item) blocks.push(item.data);
				}
				return {
					content: doc,
					blocks,
					seo
				};
			} catch (err) {
				console.error("[brand] Failed to fetch Prismic data:", err?.message || String(err));
				return null;
			}
		});
		const content = computed(() => data.value?.content ?? null);
		const blocks = computed(() => data.value?.blocks ?? []);
		const seo = computed(() => data.value?.seo ?? null);
		useHead(computed(() => ({
			title: seo.value?.title ? asText(seo.value.title) : "La Bête",
			meta: [{
				name: "description",
				content: seo.value?.description ? asText(seo.value.description) : ""
			}]
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Block = Block_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content brand" }, _attrs))}><section class="container">`);
			if (unref(content)?.title?.length > 0) _push(`<div class="row"><div class="col-md-12">${unref(asHTML)(unref(content).title) ?? ""}</div></div>`);
			else _push(`<!---->`);
			_push(`<div class="row pt-5"><!--[-->`);
			ssrRenderList(unref(blocks), (block, index) => {
				_push(ssrRenderComponent(_component_Block, {
					block,
					imageType: "img",
					index
				}, null, _parent));
			});
			_push(`<!--]--></div></section></section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/brand.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=brand-CsBOvtmH.mjs.map
