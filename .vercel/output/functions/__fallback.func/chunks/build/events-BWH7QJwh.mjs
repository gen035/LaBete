import { a as useNuxtApp, d as useI18n, b as useAsyncData, c as useHead, _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { computed, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
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

//#region components/Event.vue
var _sfc_main$2 = {
	props: {
		event: {
			type: Object,
			required: true,
			default: () => ({})
		},
		index: {
			type: Number,
			required: true,
			default: 0
		}
	},
	setup() {
		return { asHTML };
	},
	data() {
		return { today: /* @__PURE__ */ new Date() };
	},
	computed: {
		eventSlug() {
			return this.event.name[0].text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
		},
		isOdd() {
			if (this.index % 2 === 1) return "flex-row-reverse";
			return "";
		}
	}
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	_push(`<div${ssrRenderAttrs(mergeProps({
		class: ["event", $options.isOdd],
		"data-event": $options.eventSlug
	}, _attrs))}><div class="event-image" style="${ssrRenderStyle(`background-image: url('${$props.event.image.url}')`)}">`);
	if ($props.event.event_link.url) _push(`<a${ssrRenderAttr("href", $props.event.event_link.url)}${ssrRenderAttr("title", $props.event.name[0].text)}${ssrRenderAttr("alt", $props.event.name[0].text)} target="_blank"></a>`);
	else _push(`<!---->`);
	_push(`</div><div class="event-content d-flex align-items-center"><div><div class="event-name">${ssrInterpolate($props.event.name[0].text)}</div>`);
	if ($props.event.city && $props.event.city.length > 0) _push(`<div class="event-city">${ssrInterpolate($props.event.city[0].text)}</div>`);
	else _push(`<!---->`);
	if ($props.event.venue && $props.event.venue.length > 0) _push(`<div class="event-venue">${ssrInterpolate($props.event.venue[0].text)}</div>`);
	else _push(`<!---->`);
	_push(`<div class="event-desc">${$setup.asHTML($props.event.description) ?? ""}</div><div class="event-links">`);
	if ($props.event.google_maps_link.url) _push(`<div class="event-link"><a${ssrRenderAttr("href", $props.event.google_maps_link.url)}${ssrRenderAttr("title", $props.event.name[0].text)}${ssrRenderAttr("alt", $props.event.name[0].text)} target="_blank" data-track="" data-track-category="events" data-track-action="click"${ssrRenderAttr("data-track-label", `${$props.event.name[0].text}`)}><i class="fas fa-map-marker-alt"></i> ${ssrInterpolate(_ctx.$t("event.map"))}</a></div>`);
	else _push(`<!---->`);
	if ($props.event.event_link.url) _push(`<div class="event-link"><a${ssrRenderAttr("href", $props.event.event_link.url)}${ssrRenderAttr("title", `${$props.event.name[0].text} Information`)}${ssrRenderAttr("alt", `${$props.event.name[0].text} Information`)} target="_blank" data-track="" data-track-category="events" data-track-action="click"${ssrRenderAttr("data-track-label", `${$props.event.name[0].text} Information`)}><i class="fas fa-info"></i> ${ssrInterpolate(_ctx.$t("event.info"))}</a></div>`);
	else _push(`<!---->`);
	_push(`</div></div></div></div>`);
}
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Event.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Event_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]), { __name: "Event" });
//#endregion
//#region components/PassedEvents.vue
var _sfc_main$1 = {
	props: {
		year: {
			type: String,
			required: true,
			default: "0"
		},
		events: {
			type: Array,
			required: true,
			default: () => ({})
		}
	},
	methods: { toggle(e) {
		e.currentTarget.classList.toggle("open");
	} }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	if ($props.events.length > 0) {
		_push(`<li${ssrRenderAttrs(mergeProps({ class: `menu` }, _attrs))}><div role="button"${ssrRenderAttr("aria-label", `Expand - ${$props.year}`)} class="link" data-track="" data-track-category="events-previous" data-track-action="click"${ssrRenderAttr("data-track-label", `Previous ${$props.year}`)}>${ssrInterpolate($props.year)} <i class="fa fa-chevron-down"></i></div><ul class="submenu"><!--[-->`);
		ssrRenderList($props.events, (event, index) => {
			_push(`<li>${ssrInterpolate(event.name)} `);
			if (event.city) _push(`<span>(${ssrInterpolate(event.city)})</span>`);
			else _push(`<!---->`);
			_push(`</li>`);
		});
		_push(`<!--]--></ul></li>`);
	} else _push(`<!---->`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PassedEvents.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var PassedEvents_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]), { __name: "PassedEvents" });
//#endregion
//#region pages/events.vue
var _sfc_main = {
	__name: "events",
	__ssrInlineRender: true,
	setup(__props) {
		const { $prismic } = useNuxtApp();
		const { locale, tm, rt } = useI18n();
		const { data } = useAsyncData("events", async () => {
			try {
				const contentDocs = await $prismic.client.getAllByType("eventpage", { lang: `${locale.value}-ca` });
				const content = contentDocs.length > 0 ? contentDocs[0].data : null;
				const events = (await $prismic.client.getAllByType("events", {
					lang: `${locale.value}-ca`,
					orderings: [{ field: "my.events.start_date" }],
					pageSize: 100
				})).map((doc) => doc.data);
				let seo = null;
				if (content?.seo?.id) seo = (await $prismic.client.getByID(content.seo.id, { lang: "*" }).catch(() => null))?.data ?? null;
				return {
					content,
					events,
					seo
				};
			} catch (err) {
				console.error("[events] Failed to fetch Prismic data:", err?.message || String(err));
				return {
					content: null,
					events: [],
					seo: null
				};
			}
		});
		const content = computed(() => data.value?.content ?? null);
		const seo = computed(() => data.value?.seo ?? null);
		const upcomingEvents = ref([]);
		const passed = ref([]);
		watch(data, (val) => {
			if (!val) return;
			const today = (/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0);
			const allEvents = val.events || [];
			const passedList = tm("passed_events").map((item) => ({
				year: rt(item.year),
				events: Array.isArray(item.events) ? item.events.map((e) => ({ name: rt(e.name) })) : []
			}));
			allEvents.forEach((event) => {
				const endDate = new Date(event.end_date).setHours(23, 59, 59, 999);
				if (today > endDate) {
					const eventYear = new Date(event.end_date).getFullYear();
					passedList.forEach((list, index) => {
						if (parseInt(list.year) === eventYear) passedList[index].events.unshift({
							name: event.name[0].text,
							city: event.city && event.city.length > 0 && event.city[0].text
						});
					});
				}
			});
			upcomingEvents.value = allEvents.filter((event) => {
				const eventEndDate = /* @__PURE__ */ new Date(event.end_date + "T23:59:59.999");
				return today <= eventEndDate || event.show_permanently === true;
			});
			passed.value = passedList;
		}, { immediate: true });
		useHead(computed(() => ({
			title: seo.value?.title ? asText(seo.value.title) : "La Bête",
			meta: [{
				name: "description",
				content: seo.value?.description ? asText(seo.value.description) : ""
			}]
		})));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Event = Event_default;
			const _component_PassedEvents = PassedEvents_default;
			_push(`<section${ssrRenderAttrs(mergeProps({ class: "container events" }, _attrs))}>`);
			if (unref(content)) {
				_push(`<div class="row"><div class="offset-md-2 col-md-8"><h1>${ssrInterpolate(unref(content).title?.[0]?.text)}</h1><p class="col-md-12 events-content">${unref(asHTML)(unref(content).content) ?? ""}</p><h2 class="title-h1">${ssrInterpolate(unref(content).title_upcoming?.[0]?.text)}</h2>`);
				if (unref(upcomingEvents).length === 0) _push(`<div class="events-empty text-center">${ssrInterpolate(_ctx.$t("events.empty"))}</div>`);
				else _push(`<!---->`);
				if (unref(upcomingEvents).length > 0) {
					_push(`<!--[-->`);
					ssrRenderList(unref(upcomingEvents), (event, index) => {
						_push(ssrRenderComponent(_component_Event, {
							event,
							index
						}, null, _parent));
					});
					_push(`<!--]-->`);
				} else _push(`<!---->`);
				_push(`</div></div>`);
			} else _push(`<!---->`);
			if (unref(content)) {
				_push(`<div class="row"><div class="offset-md-3 col-md-6"><h2 class="title-h1">${ssrInterpolate(unref(content).title_passed?.[0]?.text)}</h2><ul class="accordion"><!--[-->`);
				ssrRenderList(unref(passed), (item, index) => {
					_push(ssrRenderComponent(_component_PassedEvents, {
						year: item.year,
						events: item.events
					}, null, _parent));
				});
				_push(`<!--]--></ul></div></div>`);
			} else _push(`<!---->`);
			_push(`</section>`);
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/events.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=events-BWH7QJwh.mjs.map
