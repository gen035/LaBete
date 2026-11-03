import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, _ as _plugin_vue_export_helper_default, M as Media_default } from '../virtual/entry.mjs';
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

//#region components/GlossaryCard.vue
var _sfc_main$1 = {
	setup() {
		return { asHTML };
	},
	props: { data: {
		type: Object,
		required: true,
		default: () => ({})
	} }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Media = Media_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "col-lg-4 col-sm-6 my-2" }, _attrs))}><div class="glossary-card p-3 d-flex flex-column"><figure>`);
	_push(ssrRenderComponent(_component_Media, {
		image: $props.data.image,
		placeholder: "horizontal"
	}, null, _parent));
	_push(`</figure><div class="glossary-card-body"><div>${$setup.asHTML($props.data.title) ?? ""}</div><div>${$setup.asHTML($props.data.content) ?? ""}</div></div></div></div>`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GlossaryCard.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var GlossaryCard_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "GlossaryCard" });
//#endregion
//#region pages/glossary.vue
var _sfc_main = {
	__name: "glossary",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const { data } = useAsyncData("glossary", async () => {
			try {
				const pageDoc = await $prismic.client.getByUID("page", "glossary", { lang: `${locale.value}-ca` }).catch(() => null);
				const content = pageDoc ? pageDoc.data : null;
				const glossaryCards = (await $prismic.client.getAllByType("glossarycard", { lang: `${locale.value}-ca` })).map((doc) => doc.data);
				let seo = null;
				if (content?.seo?.id) seo = (await $prismic.client.getByID(content.seo.id, { lang: "*" }).catch(() => null))?.data ?? null;
				return {
					content,
					glossaryCards,
					seo
				};
			} catch (err) {
				console.error("[glossary] Failed to fetch Prismic data:", err?.message || String(err));
				return {
					content: null,
					glossaryCards: [],
					seo: null
				};
			}
		});
		const content = computed(() => data.value?.content ?? null);
		const glossaryCards = computed(() => data.value?.glossaryCards ?? []);
		const seo = computed(() => data.value?.seo ?? null);
		useHead(computed(() => ({
			title: seo.value?.title ? asText(seo.value.title) : "La Bête",
			meta: [{
				name: "description",
				content: seo.value?.description ? asText(seo.value.description) : ""
			}]
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_GlossaryCard = GlossaryCard_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "content glossary" }, _attrs))}>`);
			if (unref(content)) {
				_push(`<section class="container"><div class="row"><div class="col-md-12">${unref(asHTML)(unref(content).title) ?? ""}</div></div><div class="row align-items-center justify-content-center"><div class="col-md-10">${unref(asHTML)(unref(content).content) ?? ""}</div></div><div class="row align-items-center justify-content-center"><div class="col-md-10"><div class="row flex-row d-flex align-items-stretch"><!--[-->`);
				ssrRenderList(unref(glossaryCards), (card, index) => {
					_push(ssrRenderComponent(_component_GlossaryCard, {
						key: index,
						data: card
					}, null, _parent));
				});
				_push(`<!--]--></div></div></div></section>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/glossary.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=glossary-DIAWoX5y.mjs.map
