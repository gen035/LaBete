import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, _ as _plugin_vue_export_helper_default, M as Media_default, f as useRouter } from '../virtual/entry.mjs';
import { computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

//#region components/BlogPost.vue
var _sfc_main$1 = {
	props: { post: {
		type: Object,
		required: true,
		default: () => ({})
	} },
	setup() {
		const { locale } = useI18n();
		return {
			locale,
			router: useRouter(),
			asHTML
		};
	},
	methods: { goTo() {
		const pathPrefix = this.locale === "en" ? "/en/blog/" : "/blogue/";
		this.router.push(`${pathPrefix}${this.post.uid}`);
	} },
	computed: {
		createExcerpt() {
			let words = "";
			if (this.post && this.post.data && Array.isArray(this.post.data.content) && this.post.data.content[0] && this.post.data.content[0].text) words = this.post.data.content[0].text.split(" ").slice(0, 20).join(" ");
			return `${words}...`;
		},
		formattedDate() {
			const dateObj = new Date(this.post.first_publication_date);
			return `${String(dateObj.getUTCDate()).padStart(2, "0")}-${String(dateObj.getUTCMonth() + 1).padStart(2, "0")}-${dateObj.getUTCFullYear()}`;
		}
	}
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Media = Media_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "blog-post-item col-md-8 offset-md-2 col-12 mb-3 mb-lg-5" }, _attrs))}><div class="row"><div class="blog-post-item-img col-lg-6 col-12">`);
	_push(ssrRenderComponent(_component_Media, {
		image: $props.post.data.image,
		placeholder: "horizontal"
	}, null, _parent));
	_push(`</div><div class="blog-post-item-body align-content-center col-lg-6 col-12 py-2 py-lg-0"><div>${$setup.asHTML($props.post.data.title) ?? ""}</div><time${ssrRenderAttr("datetime", $props.post.first_publication_date)} class="blog-post-item-date my-2 d-block">${ssrInterpolate($options.formattedDate)}</time><div><p>${ssrInterpolate($options.createExcerpt)}</p><a class="blog-post-item-link my-2 d-block"${ssrRenderAttr("title", _ctx.$t("blog.read"))}>${ssrInterpolate(_ctx.$t("blog.read"))}</a>`);
	if ($props.post.data.tags?.length > 0) {
		_push(`<ul class="blog-post-tags"><!--[-->`);
		ssrRenderList($props.post.data.tags, (tag) => {
			_push(`<li>${ssrInterpolate(tag.tag)}</li>`);
		});
		_push(`<!--]--></ul>`);
	} else _push(`<!---->`);
	_push(`</div></div></div></div>`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogPost.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var BlogPost_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "BlogPost" });
//#endregion
//#region assets/images/blog_header.jpg
var blog_header_default = __buildAssetsURL("blog_header.B0PNVZRt.jpg");
//#endregion
//#region pages/blog/index.vue
var _sfc_main = {
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale } = useI18n();
		const { data } = useAsyncData("blog-index", async () => {
			try {
				const postDocs = await $prismic.client.getAllByType("blog_post", {
					lang: `${locale.value}-ca`,
					orderings: [{ field: "document.first_publication_date" }]
				});
				const seoId = locale.value === "en" ? "Z0E07xMAACQA3yRe" : "Z0E1IBMAACIA3ySl";
				return {
					posts: postDocs,
					seo: (await $prismic.client.getByID(seoId).catch(() => null))?.data ?? null
				};
			} catch (err) {
				console.error("[blog] Failed to fetch Prismic data:", err?.message || String(err));
				return {
					posts: [],
					seo: null
				};
			}
		});
		const posts = computed(() => data.value?.posts ?? []);
		const seo = computed(() => data.value?.seo ?? null);
		useHead(computed(() => ({
			title: seo.value?.title ? asText(seo.value.title) : "La Bête",
			meta: [{
				name: "description",
				content: seo.value?.description ? asText(seo.value.description) : ""
			}]
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_BlogPost = BlogPost_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "blog" }, _attrs))}><div class="container-full"><div class="row justify-content-center mx-auto"><div class="blog-header align-items-center justify-content-center mt-3 mb-5"><img${ssrRenderAttr("src", blog_header_default)}><h1>${ssrInterpolate(_ctx.$t("blog.title"))}</h1></div></div></div><div class="container"><div class="row">`);
			if (unref(posts)?.length === 0) _push(`<div class="blog-empty"><h2 class="title-h1">${ssrInterpolate(_ctx.$t("blog.empty.title"))}</h2><p class="text-center">${ssrInterpolate(_ctx.$t("blog.empty.content"))}</p></div>`);
			else {
				_push(`<!--[-->`);
				ssrRenderList(unref(posts), (post, index) => {
					_push(ssrRenderComponent(_component_BlogPost, {
						key: index,
						post
					}, null, _parent));
				});
				_push(`<!--]-->`);
			}
			_push(`</div></div></div>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=blog-BW_aqxRA.mjs.map
