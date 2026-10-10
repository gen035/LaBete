import { _ as _plugin_vue_export_helper_default, C as ClientOnly, d as useI18n, f as useRouter } from '../virtual/entry.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import VLazyImage from 'v-lazy-image';

//#region components/ProductCard.vue
var _sfc_main$1 = {
	props: { product: {
		type: Object,
		required: true,
		default: () => ({})
	} },
	setup() {
		const { locale } = useI18n();
		return {
			locale,
			router: useRouter()
		};
	},
	data() {
		return { in_stock: this.product.stock_level > 0 };
	},
	methods: { goTo() {
		const pathPrefix = this.locale === "en" ? "/en/products/product/" : "/produits/produit/";
		this.router.push(`${pathPrefix}${this.product.slug}`);
	} },
	components: { VLazyImage }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(ssrRenderComponent(ClientOnly, _attrs, {}, _parent));
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductCard.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var ProductCard_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]), { __name: "ProductCard" });
//#endregion
//#region components/CustomButton.vue
var _sfc_main = {
	props: {
		aria: {
			type: String,
			required: false
		},
		text: {
			type: String,
			required: false
		},
		url: {
			type: String,
			required: false
		},
		target: {
			type: String,
			required: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		icon: {
			type: String,
			required: true,
			default: "fa-shopping-cart"
		},
		size: {
			type: String,
			required: false,
			default: ""
		}
	},
	methods: { click() {
		if (!this.url) return;
		(void 0).open(this.url, this.target);
	} }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<button${ssrRenderAttrs(mergeProps({
		"arial-label": $props.aria,
		class: [
			"button",
			{ "button--disabled": this.disabled },
			`button--${$props.size}`
		]
	}, _attrs))}><p class="button-text">${ssrInterpolate(this.text)}</p><div class="button-icon-container"><p class="${ssrRenderClass(["button-icon fas", this.icon])}"></p></div></button>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomButton.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var CustomButton_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "CustomButton" });

export { CustomButton_default as C, ProductCard_default as P };
//# sourceMappingURL=CustomButton-DsiMkVeL.mjs.map
