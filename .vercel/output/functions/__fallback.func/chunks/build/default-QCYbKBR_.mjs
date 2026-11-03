import { _ as _plugin_vue_export_helper_default, f as useRouter, N as NuxtLink, M as Media_default, d as useI18n, i as useSwitchLocalePath, h as useLocalePath, e as useMainStore, u as useRoute$1, C as ClientOnly, j as useCookie } from '../virtual/entry.mjs';
import { u as useCartStore } from './cart-0E5QDcVx.mjs';
import { mergeProps, ref, unref, withCtx, createVNode, createTextVNode, toDisplayString, defineComponent, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { asHTML } from '@prismicio/client';
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

//#region components/Header.vue
var _sfc_main$10 = {
	setup() {
		const { locale } = useI18n();
		return {
			locale,
			mainStore: useMainStore(),
			cartStore: useCartStore(),
			localePath: useLocalePath(),
			switchLocalePath: useSwitchLocalePath()
		};
	},
	computed: {
		promo() {
			return this.mainStore.settings && this.mainStore.settings.promo;
		},
		nav() {
			const links = this.$tm("nav.links");
			if (!Array.isArray(links)) return [];
			return links.map((link) => ({
				name: this.$rt(link.name),
				text: this.$rt(link.text),
				path: this.$rt(link.path)
			}));
		}
	},
	methods: {
		toggleMobileNav() {
			const { body } = void 0;
			body.classList.toggle("is-nav-opened");
		},
		openModal() {
			this.mainStore.setMessageOpened(true);
		}
	}
};
function _sfc_ssrRender$9(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_NuxtLink = NuxtLink;
	const _component_Media = Media_default;
	_push(`<div${ssrRenderAttrs(_attrs)}><div class="top-bar"><div class="top-bar-shipping">${ssrInterpolate(_ctx.$t("top.shipping"))}</div><ul class="top-bar-list d-none d-md-inline-block d-lg-inline-block"><li>`);
	_push(ssrRenderComponent(_component_NuxtLink, { to: $setup.localePath("contact") }, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`<i class="fa fa-comment" aria-hidden="true"${ssrRenderAttr("aria-label", _ctx.$t("top.contact.text"))}${_scopeId}></i> ${ssrInterpolate(_ctx.$t("top.contact.text"))}`);
			else return [createVNode("i", {
				class: "fa fa-comment",
				"aria-hidden": "true",
				"aria-label": _ctx.$t("top.contact.text")
			}, null, 8, ["aria-label"]), createTextVNode(" " + toDisplayString(_ctx.$t("top.contact.text")), 1)];
		}),
		_: 1
	}, _parent));
	_push(`</li><li>`);
	_push(ssrRenderComponent(_component_NuxtLink, { to: $setup.switchLocalePath("fr") }, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`Français`);
			else return [createTextVNode("Français")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li>`);
	_push(ssrRenderComponent(_component_NuxtLink, { to: $setup.switchLocalePath("en") }, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`English`);
			else return [createTextVNode("English")];
		}),
		_: 1
	}, _parent));
	_push(`</li></ul></div><header class="header container"><div class="row align-items-center"><div class="col-6 col-md-12 col-lg-3 header-logo-wrapper"><a href="/" title="La Bete" data-track="" data-track-category="nav" data-track-action="click" data-track-label="Logo">`);
	_push(ssrRenderComponent(_component_Media, {
		classes: "header-logo",
		image: $setup.mainStore.settings && $setup.mainStore.settings.header_logo,
		lazy: false
	}, null, _parent));
	_push(`</a></div><div class="col-lg-9 col-md-12 header-nav-wrapper"><ul role="menubar" class="header-nav"><!--[-->`);
	ssrRenderList($options.nav, (link, index) => {
		_push(`<li role="menuitem">`);
		_push(ssrRenderComponent(_component_NuxtLink, {
			to: $setup.localePath(link.name),
			"active-class": "active",
			exact: ""
		}, {
			default: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) _push(`${ssrInterpolate(link.text)}`);
				else return [createTextVNode(toDisplayString(link.text), 1)];
			}),
			_: 2
		}, _parent));
		_push(`</li>`);
	});
	_push(`<!--]--></ul><span${ssrRenderAttr("aria-label", _ctx.$t("header.cart"))} style="${ssrRenderStyle({ "cursor": "pointer" })}"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i><span class="${ssrRenderClass($setup.cartStore.getCartProductsCount > 0 ? "hasProducts" : "")}"></span></span></div><div class="col-4 header-nav-mobile-trigger d-md-none"><span>Menu<i class="fa fa-chevron-down"></i></span></div><div${ssrRenderAttr("aria-label", _ctx.$t("header.cart"))} class="col-2 header-nav-mobile-cart d-md-none" style="${ssrRenderStyle({ "cursor": "pointer" })}"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i><span class="${ssrRenderClass($setup.cartStore.getCartProductsCount > 0 ? "hasProducts" : "")}"></span></div></div></header>`);
	if ($options.promo) _push(`<div class="promotion">${ssrInterpolate($options.promo)}</div>`);
	else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup$11 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
	return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
var Header_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$10, [["ssrRender", _sfc_ssrRender$9]]), { __name: "Header" });
//#endregion
//#region components/Cart.vue?vue&type=script&setup=true&lang.ts
var Cart_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Cart",
	__ssrInlineRender: true,
	setup(__props) {
		const cartStore = useCartStore();
		const { locale } = useI18n();
		useRoute$1();
		useRouter();
		computed(() => {
			return cartStore.getCartProducts.some((item) => item.product && item.product.stock_level <= 0);
		});
		return (_ctx, _push, _parent, _attrs) => {
			_push(ssrRenderComponent(ClientOnly, _attrs, {}, _parent));
		};
	}
});
//#endregion
//#region components/Cart.vue
var _sfc_setup$10 = Cart_vue_vue_type_script_setup_true_lang_default.setup;
Cart_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Cart.vue");
	return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
var Cart_default = Object.assign(Cart_vue_vue_type_script_setup_true_lang_default, { __name: "Cart" });
//#endregion
//#region components/Notification.vue
var _sfc_main$9 = {
	setup() {
		return { cartStore: useCartStore() };
	},
	methods: { clear() {
		this.cartStore.setNotification(null);
	} },
	computed: {
		show() {
			return this.cartStore.getNotification && this.cartStore.getNotification.show;
		},
		type() {
			return this.cartStore.getNotification && this.cartStore.getNotification.type || "success";
		},
		dismissible() {
			return this.cartStore.getNotification && this.cartStore.getNotification.dismissible;
		},
		text() {
			return this.cartStore.getNotification && this.cartStore.getNotification.text;
		}
	}
};
function _sfc_ssrRender$8(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "notification" }, _attrs))}>`);
	if ($options.show) {
		_push(`<div class="${ssrRenderClass(`alert alert-${$options.type} alert-dismissible fade show`)}" role="alert">${ssrInterpolate(_ctx.$t(`${$options.text}`))} `);
		if ($options.dismissible) _push(`<button type="button" class="btn-close" aria-label="Close"></button>`);
		else _push(`<!---->`);
		_push(`</div>`);
	} else _push(`<!---->`);
	_push(`</div>`);
}
var _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Notification.vue");
	return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
var Notification_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$9, [["ssrRender", _sfc_ssrRender$8]]), { __name: "Notification" });
//#endregion
//#region components/PageLoader.vue
var _sfc_main$8 = {
	__name: "PageLoader",
	__ssrInlineRender: true,
	setup(__props) {
		const isLoading = ref(false);
		let hideTimer = null;
		const router = useRouter();
		router.beforeEach(() => {
			clearTimeout(hideTimer);
			isLoading.value = true;
		});
		router.afterEach(() => {
			hideTimer = setTimeout(() => {
				isLoading.value = false;
			}, 400);
		});
		return (_ctx, _push, _parent, _attrs) => {
			if (unref(isLoading)) _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-loader" }, _attrs))}><div class="page-loader__diamond"></div></div>`);
			else _push(`<!---->`);
		};
	}
};
var _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PageLoader.vue");
	return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
//#endregion
//#region components/MobileNav.vue
var _sfc_main$7 = {
	setup() {
		return {
			localePath: useLocalePath(),
			switchLocalePath: useSwitchLocalePath()
		};
	},
	computed: { nav() {
		const links = this.$tm("nav.links");
		if (!Array.isArray(links)) return [];
		return links.map((link) => ({
			name: this.$rt(link.name),
			text: this.$rt(link.text),
			path: this.$rt(link.path)
		}));
	} },
	mounted() {
		(void 0).addEventListener("resize", this.handleResize);
	},
	beforeUnmount() {
		(void 0).removeEventListener("resize", this.handleResize);
	},
	methods: {
		toggleMobileNav() {
			const { body } = void 0;
			body.classList.toggle("is-nav-opened");
		},
		handleResize() {
			const { body } = void 0;
			if ((void 0).innerWidth > 768) body.classList.remove("is-nav-opened");
		}
	}
};
function _sfc_ssrRender$7(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_NuxtLink = NuxtLink;
	_push(`<ul${ssrRenderAttrs(mergeProps({
		role: "menu",
		class: "mobile-nav d-md-none"
	}, _attrs))}><!--[-->`);
	ssrRenderList($options.nav, (link, index) => {
		_push(`<li role="menuitem">`);
		_push(ssrRenderComponent(_component_NuxtLink, {
			onClick: $options.toggleMobileNav,
			to: $setup.localePath(link.name),
			exact: ""
		}, {
			default: withCtx((_, _push, _parent, _scopeId) => {
				if (_push) _push(`${ssrInterpolate(link.text)}`);
				else return [createTextVNode(toDisplayString(link.text), 1)];
			}),
			_: 2
		}, _parent));
		_push(`</li>`);
	});
	_push(`<!--]--><li role="menuitem">`);
	_push(ssrRenderComponent(_component_NuxtLink, {
		onClick: $options.toggleMobileNav,
		to: $setup.localePath("contact"),
		exact: ""
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(` Contact `);
			else return [createTextVNode(" Contact ")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li role="menuitem">`);
	_push(ssrRenderComponent(_component_NuxtLink, { to: $setup.switchLocalePath("fr") }, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`Français`);
			else return [createTextVNode("Français")];
		}),
		_: 1
	}, _parent));
	_push(`</li><li role="menuitem">`);
	_push(ssrRenderComponent(_component_NuxtLink, { to: $setup.switchLocalePath("en") }, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`English`);
			else return [createTextVNode("English")];
		}),
		_: 1
	}, _parent));
	_push(`</li></ul>`);
}
var _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MobileNav.vue");
	return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
var MobileNav_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$7, [["ssrRender", _sfc_ssrRender$7]]), { __name: "MobileNav" });
//#endregion
//#region components/Newsletter.vue
var _sfc_main$6 = {
	props: { isModal: {
		type: Boolean,
		required: false,
		default: false
	} },
	setup() {
		const mainStore = useMainStore();
		const { locale } = useI18n();
		return {
			mainStore,
			locale,
			labeteNewsletter: useCookie("labete_newsletter", { maxAge: 31536e3 })
		};
	},
	data() {
		return {
			disabled: true,
			email: ""
		};
	},
	methods: { closeModal() {
		this.mainStore.setNewsletterOpened(false);
		if (this.isModal) this.labeteNewsletter = true;
	} },
	watch: { email: { handler: function(newValue, oldValue) {
		const exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.disabled = !exp.test(newValue);
	} } }
};
function _sfc_ssrRender$6(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(mergeProps({ id: "newsletter" }, _attrs))}><div class="newsletter-title">${ssrInterpolate(_ctx.$t("newsletter.title"))}</div><form action="https://app.cyberimpact.com/optin" method="post" accept-charset="utf-8" target="_blank"><fieldset><legend></legend><div class="newsletter-wrapper"><label for="ci_email" class="sr-only">Email</label><input type="text" id="ci_email" name="ci_email" class="ci_email_footer"${ssrRenderAttr("placeholder", _ctx.$t("newsletter.placeholder"))} maxlength="255"${ssrRenderAttr("value", $data.email)}><button type="submit"${ssrRenderAttr("aria-label", _ctx.$t("newsletter.submit"))} value="Send" id="ci_submit" class="${ssrRenderClass({ isDisabled: $data.disabled })}"><i class="fa fa-arrow-right"></i></button></div><div style="${ssrRenderStyle({
		"display": "block",
		"visibility": "hidden",
		"height": "1px"
	})}"><input style="${ssrRenderStyle({ "display": "none" })}" type="text" id="ci_verification" name="ci_verification"><input type="hidden" id="ci_groups" name="ci_groups" value="6"><input type="hidden" id="ci_account" name="ci_account" value="910db7f6-7751-4942-41d3-c59a8ef52f8f"><input type="hidden" id="ci_language" name="ci_language"${ssrRenderAttr("value", `${$setup.locale.value}_ca`)}><input type="hidden" id="ci_sent_url" name="ci_sent_url" value=""><input type="hidden" id="ci_error_url" name="ci_error_url" value=""><input type="hidden" id="ci_confirm_url" name="ci_confirm_url" value=""></div></fieldset></form></div>`);
}
var _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Newsletter.vue");
	return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
var Newsletter_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$6, [["ssrRender", _sfc_ssrRender$6]]), { __name: "Newsletter" });
//#endregion
//#region components/NewsletterModal.vue
var _sfc_main$5 = {
	setup() {
		return {
			mainStore: useMainStore(),
			labeteNewsletter: useCookie("labete_newsletter", { maxAge: 86400 })
		};
	},
	created() {
		this.resetTimeout();
	},
	beforeUnmount() {
		clearTimeout(this.timeoutId);
	},
	methods: {
		close() {
			this.mainStore.setNewsletterOpened(false);
			this.labeteNewsletter = true;
		},
		resetTimeout() {
			clearTimeout(this.timeoutId);
			this.timeoutId = setTimeout(() => {
				if (!!!this.labeteNewsletter) this.mainStore.setNewsletterOpened(true);
				this.resetTimeout();
			}, 1e4);
		}
	}
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Newsletter = Newsletter_default;
	if ($setup.mainStore.newsletter.isOpened) {
		_push(`<div${ssrRenderAttrs(mergeProps({
			role: "dialog",
			class: "newsletterModalWrapper"
		}, _attrs))}><div class="newsletterModal"><i role="button"${ssrRenderAttr("aria-label", _ctx.$t("newsletter.close"))} class="far fa-times-circle newsletterModal-close"></i><div class="newsletterModal-img" style="${ssrRenderStyle({ "background-image": "url(" + $setup.mainStore.newsletter.data?.image?.url + ")" })}"></div><div class="newsletterModal-content"><h1>${ssrInterpolate($setup.mainStore.newsletter.data?.title)}</h1><p>${ssrInterpolate($setup.mainStore.newsletter.data?.description)}</p>`);
		_push(ssrRenderComponent(_component_Newsletter, { isModal: true }, null, _parent));
		_push(`</div></div></div>`);
	} else _push(`<!---->`);
}
var _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/NewsletterModal.vue");
	return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
var NewsletterModal_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$5, [["ssrRender", _sfc_ssrRender$5]]), { __name: "NewsletterModal" });
//#endregion
//#region components/CookieModal.vue
var _sfc_main$4 = {
	setup() {
		return {
			mainStore: useMainStore(),
			labeteCookieSeen: useCookie("labete_cookie_seen", { maxAge: 31536e3 }),
			labetePrivacyPerf: useCookie("LABETE_PRIVACY_PERF", { maxAge: 31536e3 }),
			labetePrivacyPerso: useCookie("LABETE_PRIVACY_PERSO", { maxAge: 31536e3 })
		};
	},
	methods: {
		setModalCookie() {
			this.mainStore.setCookieModal(false);
			this.labeteCookieSeen = true;
			this.forcePageReload();
		},
		accept() {
			this.labetePrivacyPerf = true;
			this.labetePrivacyPerso = true;
			this.setModalCookie();
		},
		forcePageReload() {
			(void 0).location.reload();
		},
		openSettings() {
			this.mainStore.setCookieModal(false);
			this.mainStore.setCookiePreferencesModal(true);
		}
	}
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(ssrRenderComponent(ClientOnly, _attrs, {}, _parent));
}
var _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CookieModal.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var CookieModal_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]), { __name: "CookieModal" });
//#endregion
//#region components/CookiePreferencesModal.vue
var _sfc_main$3 = {
	setup() {
		return {
			mainStore: useMainStore(),
			labeteCookieSeen: useCookie("labete_cookie_seen", { maxAge: 31536e3 }),
			labetePrivacyPerf: useCookie("LABETE_PRIVACY_PERF", { maxAge: 31536e3 }),
			labetePrivacyPerso: useCookie("LABETE_PRIVACY_PERSO", { maxAge: 31536e3 }),
			cookieGa: useCookie("_ga"),
			cookieGid: useCookie("_gid"),
			cookieGat: useCookie("_gat"),
			cookieI18n: useCookie("i18n_redirected"),
			cookieNewsletter: useCookie("labete_newsletter"),
			cookieSeen: useCookie("labete_cookie_seen")
		};
	},
	data() {
		return {
			perfEnabled: !!this.labetePrivacyPerf,
			persoEnabled: !!this.labetePrivacyPerso
		};
	},
	methods: {
		forcePageReload() {
			(void 0).location.reload();
		},
		setCookieCategory(category) {
			if (category === "LABETE_PRIVACY_PERF") {
				if (this.labetePrivacyPerf) {
					this.labetePrivacyPerf = null;
					this.deleteCookies(category);
				} else this.labetePrivacyPerf = true;
			} else if (category === "LABETE_PRIVACY_PERSO") {
				if (this.labetePrivacyPerso) {
					this.labetePrivacyPerso = null;
					this.deleteCookies(category);
				} else this.labetePrivacyPerso = true;
			}
		},
		save() {
			this.labeteCookieSeen = true;
			this.forcePageReload();
		},
		deleteCookies(category) {
			if (category === "LABETE_PRIVACY_PERF") {
				this.cookieGa = null;
				this.cookieGid = null;
				this.cookieGat = null;
			} else if (category === "LABETE_PRIVACY_PERSO") {
				this.cookieI18n = null;
				this.cookieNewsletter = null;
				this.cookieSeen = null;
			}
		}
	}
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(ssrRenderComponent(ClientOnly, _attrs, {}, _parent));
}
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CookiePreferencesModal.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var CookiePreferencesModal_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]), { __name: "CookiePreferencesModal" });
//#endregion
//#region components/MessageModal.vue
var _sfc_main$2 = {
	setup() {
		return {
			mainStore: useMainStore(),
			asHTML
		};
	},
	methods: { close() {
		this.mainStore.setMessageOpened(false);
	} }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	if ($setup.mainStore.messageOpened) {
		_push(`<div${ssrRenderAttrs(mergeProps({
			role: "dialog",
			class: "messageModalWrapper"
		}, _attrs))}><div class="messageModal"><i role="button"${ssrRenderAttr("aria-label", _ctx.$t("newsletter.close"))} class="far fa-times-circle messageModal-close"></i>`);
		if ($setup.mainStore.message.image && $setup.mainStore.message.image.url) _push(`<div class="messageModal-img" style="${ssrRenderStyle({ "background-image": "url(" + $setup.mainStore.message.image.url + ")" })}"></div>`);
		else _push(`<!---->`);
		_push(`<div class="messageModal-content">`);
		if ($setup.mainStore.message.title && $setup.mainStore.message.title.length > 0) _push(`<h1>${ssrInterpolate($setup.mainStore.message.title[0].text)}</h1>`);
		else _push(`<!---->`);
		if ($setup.mainStore.message.description && $setup.mainStore.message.description.length > 0) _push(`<p>${$setup.asHTML($setup.mainStore.message.description) ?? ""}</p>`);
		else _push(`<!---->`);
		_push(`</div></div></div>`);
	} else _push(`<!---->`);
}
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MessageModal.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var MessageModal_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]), { __name: "MessageModal" });
//#endregion
//#region components/Footer.vue
var _sfc_main$1 = {
	setup() {
		return {
			mainStore: useMainStore(),
			localePath: useLocalePath()
		};
	},
	computed: {
		facebook() {
			return this.mainStore.settings && this.mainStore.settings.facebook_link && this.mainStore.settings.facebook_link.url;
		},
		facebookMessenger() {
			return this.mainStore.settings && this.mainStore.settings.facebook_messenger_link && this.mainStore.settings.facebook_messenger_link.url;
		},
		store() {
			return this.mainStore.settings && this.mainStore.settings.store_link && this.mainStore.settings.store_link.url;
		},
		instagram() {
			return this.mainStore.settings && this.mainStore.settings.instagram_link && this.mainStore.settings.instagram_link.url;
		},
		linkedin() {
			return this.mainStore.settings && this.mainStore.settings.linkedin_link && this.mainStore.settings.linkedin_link.url;
		}
	},
	data() {
		return { date: (/* @__PURE__ */ new Date()).getFullYear() };
	},
	methods: { openPreferences() {
		this.mainStore.setCookiePreferencesModal(true);
	} }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Newsletter = Newsletter_default;
	const _component_Media = Media_default;
	const _component_NuxtLink = NuxtLink;
	_push(`<footer${ssrRenderAttrs(_attrs)}><div class="container"><div class="row"><div class="col-md-6 footer-newsletter">`);
	_push(ssrRenderComponent(_component_Newsletter, null, null, _parent));
	_push(`</div><div class="col-md-6"><ul class="footer-links">`);
	if ($options.facebook) _push(`<li><a${ssrRenderAttr("href", $options.facebook)} title="Facebook" target="_blank" data-track="" data-track-category="footer" data-track-action="click" data-track-label="Facebook"><i class="fab fa-facebook-f"></i></a></li>`);
	else _push(`<!---->`);
	if ($options.facebookMessenger) _push(`<li><a${ssrRenderAttr("href", $options.facebookMessenger)} title="Facebook Messenger" target="_blank" data-track="" data-track-category="footer" data-track-action="click" data-track-label="Facebook Messenger"><i class="fab fa-facebook-messenger"></i></a></li>`);
	else _push(`<!---->`);
	if ($options.store) _push(`<li><a${ssrRenderAttr("href", $options.store)} title="Etsy" target="_blank" data-track="" data-track-category="footer" data-track-action="click" data-track-label="Shop"><i class="fab fa-etsy"></i></a></li>`);
	else _push(`<!---->`);
	if ($options.instagram) _push(`<li><a${ssrRenderAttr("href", $options.instagram)} title="Instagram" target="_blank" data-track="" data-track-category="footer" data-track-action="click" data-track-label="Instagram"><i class="fab fa-instagram"></i></a></li>`);
	else _push(`<!---->`);
	if ($options.linkedin) _push(`<li><a${ssrRenderAttr("href", $options.linkedin)} title="LinkedIn" target="_blank" data-track="" data-track-category="footer" data-track-action="click" data-track-label="LinkedIn"><i class="fab fa-linkedin"></i></a></li>`);
	else _push(`<!---->`);
	_push(`</ul></div></div><div class="row footer-text"><div class="col-md-12"><a href="" title="La Bete" data-track="" data-track-category="footer" data-track-action="click" data-track-label="Logo">`);
	_push(ssrRenderComponent(_component_Media, {
		classes: "footer-logo",
		image: $setup.mainStore.settings && $setup.mainStore.settings.footer_logo,
		lazy: false
	}, null, _parent));
	_push(`</a><div class="footer-copyright">${ssrInterpolate($setup.mainStore.settings && $setup.mainStore.settings.footer_copyright && $setup.mainStore.settings.footer_copyright[0].text)} ${ssrInterpolate($data.date)}</div><div class="footer-policy">`);
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: $setup.localePath("privacy-policy"),
		exact: ""
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`${ssrInterpolate(_ctx.$t("footer.policy.privacy"))}`);
			else return [createTextVNode(toDisplayString(_ctx.$t("footer.policy.privacy")), 1)];
		}),
		_: 1
	}, _parent));
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: $setup.localePath("cookie-policy"),
		exact: ""
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`${ssrInterpolate(_ctx.$t("footer.policy.cookie"))}`);
			else return [createTextVNode(toDisplayString(_ctx.$t("footer.policy.cookie")), 1)];
		}),
		_: 1
	}, _parent));
	_push(ssrRenderComponent(_component_NuxtLink, {
		to: $setup.localePath("return"),
		exact: ""
	}, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(`${ssrInterpolate(_ctx.$t("footer.policy.return"))}`);
			else return [createTextVNode(toDisplayString(_ctx.$t("footer.policy.return")), 1)];
		}),
		_: 1
	}, _parent));
	_push(`<span>${ssrInterpolate(_ctx.$t("footer.cookies"))}</span></div></div></div></div></footer>`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var Footer_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]), { __name: "Footer" });
//#endregion
//#region layouts/default.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_Header = Header_default;
	const _component_Cart = Cart_default;
	const _component_Notification = Notification_default;
	const _component_PageLoader = _sfc_main$8;
	const _component_MobileNav = MobileNav_default;
	const _component_NewsletterModal = NewsletterModal_default;
	const _component_CookieModal = CookieModal_default;
	const _component_CookiePreferencesModal = CookiePreferencesModal_default;
	const _component_MessageModal = MessageModal_default;
	const _component_Footer = Footer_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: _ctx.$route.name }, _attrs))}>`);
	_push(ssrRenderComponent(_component_Header, null, null, _parent));
	_push(ssrRenderComponent(_component_Cart, null, null, _parent));
	_push(ssrRenderComponent(_component_Notification, null, null, _parent));
	_push(ssrRenderComponent(_component_PageLoader, null, null, _parent));
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(ssrRenderComponent(_component_MobileNav, null, null, _parent));
	_push(ssrRenderComponent(_component_NewsletterModal, null, null, _parent));
	_push(ssrRenderComponent(_component_CookieModal, null, null, _parent));
	_push(ssrRenderComponent(_component_CookiePreferencesModal, null, null, _parent));
	_push(ssrRenderComponent(_component_MessageModal, null, null, _parent));
	_push(ssrRenderComponent(_component_Footer, null, null, _parent));
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var default_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { default_default as default };
//# sourceMappingURL=default-QCYbKBR_.mjs.map
