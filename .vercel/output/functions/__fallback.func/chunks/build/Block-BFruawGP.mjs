import { _ as _plugin_vue_export_helper_default, M as Media_default } from '../virtual/entry.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
import { asHTML } from '@prismicio/client';

//#region components/Block.vue
var _sfc_main = {
	props: {
		block: {
			type: Object,
			required: true,
			default: () => ({})
		},
		size: {
			type: String,
			required: false,
			default: "standard"
		},
		imageType: {
			type: String,
			required: false,
			default: "background"
		},
		index: {
			type: Number,
			required: true,
			default: "0"
		},
		placeholder: {
			type: String,
			required: false,
			default: "horizontal"
		}
	},
	setup() {
		return { asHTML };
	},
	computed: { isOdd() {
		if (this.index % 2 === 1) return "flex-row-reverse";
		return "";
	} }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Media = Media_default;
	_push(`<section${ssrRenderAttrs(mergeProps({
		class: `block block-${$props.size} container-fluid`,
		id: `block${$props.index}`
	}, _attrs))}><div class="${ssrRenderClass(`row ${$options.isOdd}`)}"><div class="${ssrRenderClass([
		$props.block.image.url ? "col-lg-6" : "col-md-12",
		"d-flex",
		"align-items-center",
		"block-text"
	])}"><div><div>${$setup.asHTML($props.block.description) ?? ""}</div>`);
	if ($props.block.button?.data?.url) _push(`<a class="button-simple"${ssrRenderAttr("href", $props.block.button.data.url.url)}>${ssrInterpolate($props.block.button?.data?.text)}</a>`);
	else _push(`<!---->`);
	_push(`</div></div>`);
	if ($props.block.image.url && $props.imageType === "background") _push(`<div class="col-lg-6 block-img" style="${ssrRenderStyle({
		backgroundImage: `url(${$props.block.image.url})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center right"
	})}"></div>`);
	else _push(`<!---->`);
	if ($props.block.image.url && $props.imageType === "img") {
		_push(`<div class="col-lg-6 block-img d-flex align-items-center">`);
		_push(ssrRenderComponent(_component_Media, {
			image: $props.block.image,
			placeholder: $props.placeholder
		}, null, _parent));
		_push(`</div>`);
	} else _push(`<!---->`);
	_push(`</div></section>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Block.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Block_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]), { __name: "Block" });

export { Block_default as B };
//# sourceMappingURL=Block-BFruawGP.mjs.map
