import { a as useNuxtApp, d as useI18n, u as useRoute$1, b as useAsyncData, c as useHead, M as Media_default } from '../virtual/entry.mjs';
import { computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
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

//#region pages/blog/[slug].vue
var _sfc_main = {
	__name: "[slug]",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const route = useRoute$1();
		const { data: content } = useAsyncData(`blog-post-${route.params.slug}`, async () => {
			return await $prismic.client.getByUID("blog_post", route.params.slug, { lang: `${locale.value}-ca` }).catch(() => null) || null;
		});
		const excerpt = computed(() => {
			if (!content.value?.data?.content?.[0]?.text) return "";
			return content.value.data.content[0].text.split(" ").slice(0, 20).join(" ");
		});
		const formattedDate = computed(() => {
			if (!content.value?.first_publication_date) return "";
			const dateObj = new Date(content.value.first_publication_date);
			return `${String(dateObj.getUTCDate()).padStart(2, "0")}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${dateObj.getUTCFullYear()}`;
		});
		useHead(computed(() => ({
			title: content.value?.data?.title ? `La Bête | ${asText(content.value.data.title)}` : "La Bête",
			meta: [{
				name: "description",
				content: excerpt.value
			}]
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Media = Media_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-post container" }, _attrs))}><div class="row"><div class="col-md-8 col-12 offset-md-2"><div>${unref(asHTML)(unref(content).data.title) ?? ""}</div>`);
			_push(ssrRenderComponent(_component_Media, {
				image: unref(content).data.image,
				placeholder: "horizontal"
			}, null, _parent));
			_push(`<div class="d-flex my-3"><time${ssrRenderAttr("datetime", unref(content).first_publication_date)}>${ssrInterpolate(unref(formattedDate))}</time>`);
			if (unref(content).data.tags?.length > 0) {
				_push(`<ul class="blog-post-tags"><!--[-->`);
				ssrRenderList(unref(content).data.tags, (tag) => {
					_push(`<li>${ssrInterpolate(tag.tag)}</li>`);
				});
				_push(`<!--]--></ul>`);
			} else _push(`<!---->`);
			_push(`</div><div class="blog-post-body">${unref(asHTML)(unref(content).data.content) ?? ""}</div></div></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/[slug].vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-Cf1VmGKW.mjs.map
