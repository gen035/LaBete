import { _ as _plugin_vue_export_helper_default, N as NuxtLink, h as useLocalePath, e as useMainStore } from '../virtual/entry.mjs';
import { mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';

//#region components/CategoriesDropdown.vue
var _sfc_main$1 = { setup() {
	return {
		mainStore: useMainStore(),
		localePath: useLocalePath()
	};
} };
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_NuxtLink = NuxtLink;
	if ($setup.mainStore.getCategories && $setup.mainStore.getCategories.length > 0) {
		_push(`<div${ssrRenderAttrs(mergeProps({
			class: "dropdown m-md-2 categories-dropdown",
			id: "category"
		}, _attrs))}><button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">${ssrInterpolate(_ctx.$t("products.categories.text"))}</button><ul class="dropdown-menu"><li>`);
		_push(ssrRenderComponent(_component_NuxtLink, {
			class: "dropdown-item",
			to: $setup.localePath("products"),
			"active-class": "active"
		}, {
			default: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) _push(`${ssrInterpolate(_ctx.$t("products.categories.all"))}`);
				else return [createTextVNode(toDisplayString(_ctx.$t("products.categories.all")), 1)];
			}),
			_: 1
		}, _parent));
		_push(`</li><!--[-->`);
		ssrRenderList($setup.mainStore.getCategories, (category, index) => {
			_push(`<!--[-->`);
			if (category.slug !== "featured") {
				_push(`<li>`);
				_push(ssrRenderComponent(_component_NuxtLink, {
					class: "dropdown-item",
					to: $setup.localePath({
						name: "products-slug",
						params: { category: category.slug }
					}),
					"active-class": "active"
				}, {
					default: withCtx((_, _push, _parent, _scopeId) => {
						if (_push) _push(`${ssrInterpolate(_ctx.$t(`products.categories.${category.slug}`))}`);
						else return [createTextVNode(toDisplayString(_ctx.$t(`products.categories.${category.slug}`)), 1)];
					}),
					_: 2
				}, _parent));
				_push(`</li>`);
			} else _push(`<!---->`);
			_push(`<!--]-->`);
		});
		_push(`<!--]--></ul></div>`);
	} else _push(`<!---->`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CategoriesDropdown.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var CategoriesDropdown_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]), { __name: "CategoriesDropdown" });
//#endregion
//#region components/NoProducts.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "noProducts col-12 text-center" }, _attrs))}><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i><h3>${ssrInterpolate(_ctx.$t("products.none"))}</h3></div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NoProducts.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var NoProducts_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "NoProducts" });

export { CategoriesDropdown_default as C, NoProducts_default as N };
//# sourceMappingURL=NoProducts-AtL-X6zB.mjs.map
