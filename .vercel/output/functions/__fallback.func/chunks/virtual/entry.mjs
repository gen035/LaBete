import { defineProdDiagnostics } from 'nostics';
import { ansiFormatter } from 'nostics/formatters/ansi';
import { createApp, provide, onErrorCaptured, onServerPrefetch, unref, createVNode, resolveDynamicComponent, shallowReactive, reactive, effectScope, hasInjectionContext, getCurrentInstance, inject, mergeProps, getCurrentScope, toRef, shallowRef, isReadonly, defineComponent, createElementBlock, cloneVNode, h, toRaw, onScopeDispose, defineAsyncComponent, computed, ref, useSSRContext, isRef, isShallow, isReactive, Fragment, watch, isVNode, createCommentVNode, withCtx, resolveComponent, customRef, shallowReadonly, Suspense, nextTick, watchEffect, toValue, queuePostFlushCb, Text } from 'vue';
import { f as createError, $ as $fetch$1, B as baseURL, t as joinURL, C as getRequestURL, D as klona, E as defu, F as withQuery, G as sanitizeStatusCode, H as parseURL, I as decodePath, J as getRequestHeader, K as getCookie, L as hasProtocol, M as isEqual, O as withBase, P as splitCookiesString, Q as getResponseHeader, R as setCookie, S as deleteCookie, T as createDefu, U as parsePath, V as parseQuery, W as withTrailingSlash, X as withoutTrailingSlash, Y as isScriptProtocol, Z as isEqual$1 } from '../nitro/nitro.mjs';
import { FlatMetaPlugin } from 'unhead/plugins';
import { walkResolver, hasOwn } from 'unhead/utils';
import { defineStore, setActivePinia, createPinia, shouldHydrate } from 'pinia';
import { createMemoryHistory, createRouter, START_LOCATION, useRoute, RouterView } from 'vue-router';
import { getToolbarSrc, cookie, isFilled, Client, createClient } from '@prismicio/client';
import swell from 'swell-js';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode, ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import VLazyImage from 'v-lazy-image';

function flatHooks(configHooks, hooks = {}, parentName) {
	for (const key in configHooks) {
		const subHook = configHooks[key];
		const name = parentName ? `${parentName}:${key}` : key;
		if (typeof subHook === "object" && subHook !== null) flatHooks(subHook, hooks, name);
		else if (typeof subHook === "function") hooks[name] = subHook;
	}
	return hooks;
}
const createTask = /* @__PURE__ */ (() => {
	if (console.createTask) return console.createTask;
	const defaultTask = { run: (fn) => fn() };
	return () => defaultTask;
})();
function callHooks(hooks, args, startIndex, task) {
	for (let i = startIndex; i < hooks.length; i += 1) try {
		const result = task ? task.run(() => hooks[i](...args)) : hooks[i](...args);
		if (result && typeof result.then === "function") return Promise.resolve(result).then(() => callHooks(hooks, args, i + 1, task));
	} catch (error) {
		return Promise.reject(error);
	}
}
function serialTaskCaller(hooks, args, name) {
	if (hooks.length > 0) return callHooks(hooks, args, 0, createTask(name));
}
function parallelTaskCaller(hooks, args, name) {
	if (hooks.length > 0) {
		const task = createTask(name);
		return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
	}
}
function callEachWith(callbacks, arg0) {
	for (const callback of [...callbacks]) callback(arg0);
}
var Hookable = class {
	_hooks;
	_before;
	_after;
	_deprecatedHooks;
	_deprecatedMessages;
	constructor() {
		this._hooks = {};
		this._before = void 0;
		this._after = void 0;
		this._deprecatedMessages = void 0;
		this._deprecatedHooks = {};
		this.hook = this.hook.bind(this);
		this.callHook = this.callHook.bind(this);
		this.callHookWith = this.callHookWith.bind(this);
	}
	hook(name, function_, options = {}) {
		if (!name || typeof function_ !== "function") return () => {};
		const originalName = name;
		let dep;
		while (this._deprecatedHooks[name]) {
			dep = this._deprecatedHooks[name];
			name = dep.to;
		}
		if (dep && !options.allowDeprecated) {
			let message = dep.message;
			if (!message) message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
			if (!this._deprecatedMessages) this._deprecatedMessages = /* @__PURE__ */ new Set();
			if (!this._deprecatedMessages.has(message)) {
				console.warn(message);
				this._deprecatedMessages.add(message);
			}
		}
		if (!function_.name) try {
			Object.defineProperty(function_, "name", {
				get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
				configurable: true
			});
		} catch {}
		this._hooks[name] = this._hooks[name] || [];
		this._hooks[name].push(function_);
		return () => {
			if (function_) {
				this.removeHook(name, function_);
				function_ = void 0;
			}
		};
	}
	hookOnce(name, function_) {
		let _unreg;
		let _function = (...arguments_) => {
			if (typeof _unreg === "function") _unreg();
			_unreg = void 0;
			_function = void 0;
			return function_(...arguments_);
		};
		_unreg = this.hook(name, _function);
		return _unreg;
	}
	removeHook(name, function_) {
		const hooks = this._hooks[name];
		if (hooks) {
			const index = hooks.indexOf(function_);
			if (index !== -1) hooks.splice(index, 1);
			if (hooks.length === 0) this._hooks[name] = void 0;
		}
	}
	clearHook(name) {
		this._hooks[name] = void 0;
	}
	deprecateHook(name, deprecated) {
		this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
		const _hooks = this._hooks[name] || [];
		this._hooks[name] = void 0;
		for (const hook of _hooks) this.hook(name, hook);
	}
	deprecateHooks(deprecatedHooks) {
		for (const name in deprecatedHooks) this.deprecateHook(name, deprecatedHooks[name]);
	}
	addHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
		return () => {
			for (const unreg of removeFns) unreg();
			removeFns.length = 0;
		};
	}
	removeHooks(configHooks) {
		const hooks = flatHooks(configHooks);
		for (const key in hooks) this.removeHook(key, hooks[key]);
	}
	removeAllHooks() {
		this._hooks = {};
	}
	callHook(name, ...args) {
		return this.callHookWith(serialTaskCaller, name, args);
	}
	callHookParallel(name, ...args) {
		return this.callHookWith(parallelTaskCaller, name, args);
	}
	callHookWith(caller, name, args) {
		const event = this._before || this._after ? {
			name,
			args,
			context: {}
		} : void 0;
		if (this._before) callEachWith(this._before, event);
		const result = caller(this._hooks[name] ? [...this._hooks[name]] : [], args, name);
		if (result instanceof Promise) return result.finally(() => {
			if (this._after && event) callEachWith(this._after, event);
		});
		if (this._after && event) callEachWith(this._after, event);
		return result;
	}
	beforeEach(function_) {
		this._before = this._before || [];
		this._before.push(function_);
		return () => {
			if (this._before !== void 0) {
				const index = this._before.indexOf(function_);
				if (index !== -1) this._before.splice(index, 1);
			}
		};
	}
	afterEach(function_) {
		this._after = this._after || [];
		this._after.push(function_);
		return () => {
			if (this._after !== void 0) {
				const index = this._after.indexOf(function_);
				if (index !== -1) this._after.splice(index, 1);
			}
		};
	}
};
function createHooks() {
	return new Hookable();
}

const COOKIE_MAX_AGE_LIMIT = 3456e4;
function endIndex(str, min, len) {
	const index = str.indexOf(";", min);
	return index === -1 ? len : index;
}
function eqIndex(str, min, max) {
	const index = str.indexOf("=", min);
	return index < max ? index : -1;
}
function valueSlice(str, min, max) {
	if (min === max) return "";
	let start = min;
	let end = max;
	do {
		const code = str.charCodeAt(start);
		if (code !== 32 && code !== 9) break;
	} while (++start < end);
	while (end > start) {
		const code = str.charCodeAt(end - 1);
		if (code !== 32 && code !== 9) break;
		end--;
	}
	return str.slice(start, end);
}
const NullObject = /* @__PURE__ */ (() => {
	const C = function() {};
	C.prototype = Object.create(null);
	return C;
})();
function parse(str, options) {
	const obj = new NullObject();
	const len = str.length;
	if (len < 2) return obj;
	const dec = options?.decode || decode;
	const allowMultiple = options?.allowMultiple || false;
	let index = 0;
	do {
		const eqIdx = eqIndex(str, index, len);
		if (eqIdx === -1) break;
		const endIdx = endIndex(str, index, len);
		if (eqIdx > endIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = valueSlice(str, index, eqIdx);
		if (options?.filter && !options.filter(key)) {
			index = endIdx + 1;
			continue;
		}
		const val = dec(valueSlice(str, eqIdx + 1, endIdx));
		if (allowMultiple) {
			const existing = obj[key];
			if (existing === void 0) obj[key] = val;
			else if (Array.isArray(existing)) existing.push(val);
			else obj[key] = [existing, val];
		} else if (obj[key] === void 0) obj[key] = val;
		index = endIdx + 1;
	} while (index < len);
	return obj;
}
function decode(str) {
	if (!str.includes("%")) return str;
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}
const maxAgeRegExp = /^-?\d+$/;
const _nullProto = /* @__PURE__ */ Object.getPrototypeOf({});
function parseSetCookie(str, options) {
	const len = str.length;
	let _endIdx = len;
	let eqIdx = -1;
	for (let i = 0; i < len; i++) {
		const c = str.charCodeAt(i);
		if (c === 59) {
			_endIdx = i;
			break;
		}
		if (c === 61 && eqIdx === -1) eqIdx = i;
	}
	if (eqIdx >= _endIdx) eqIdx = -1;
	const name = eqIdx === -1 ? "" : _trim(str, 0, eqIdx);
	if (name && name in _nullProto) return void 0;
	let value = eqIdx === -1 ? _trim(str, 0, _endIdx) : _trim(str, eqIdx + 1, _endIdx);
	if (!name && !value) return void 0;
	if (name.length + value.length > 4096) return void 0;
	if (options?.decode !== false) value = _decode(value, options?.decode);
	const setCookie = {
		name,
		value
	};
	let index = _endIdx + 1;
	while (index < len) {
		let endIdx = len;
		let attrEqIdx = -1;
		for (let i = index; i < len; i++) {
			const c = str.charCodeAt(i);
			if (c === 59) {
				endIdx = i;
				break;
			}
			if (c === 61 && attrEqIdx === -1) attrEqIdx = i;
		}
		if (attrEqIdx >= endIdx) attrEqIdx = -1;
		const attr = attrEqIdx === -1 ? _trim(str, index, endIdx) : _trim(str, index, attrEqIdx);
		const val = attrEqIdx === -1 ? void 0 : _trim(str, attrEqIdx + 1, endIdx);
		if (val === void 0 || val.length <= 1024) switch (attr.toLowerCase()) {
			case "httponly":
				setCookie.httpOnly = true;
				break;
			case "secure":
				setCookie.secure = true;
				break;
			case "partitioned":
				setCookie.partitioned = true;
				break;
			case "domain":
				if (val) setCookie.domain = (val.charCodeAt(0) === 46 ? val.slice(1) : val).toLowerCase();
				break;
			case "path":
				setCookie.path = val;
				break;
			case "max-age":
				if (val && maxAgeRegExp.test(val)) setCookie.maxAge = Math.min(Number(val), COOKIE_MAX_AGE_LIMIT);
				break;
			case "expires": {
				if (!val) break;
				const date = new Date(val);
				if (Number.isFinite(date.valueOf())) {
					const maxDate = new Date(Date.now() + COOKIE_MAX_AGE_LIMIT * 1e3);
					setCookie.expires = date > maxDate ? maxDate : date;
				}
				break;
			}
			case "priority": {
				if (!val) break;
				const priority = val.toLowerCase();
				if (priority === "low" || priority === "medium" || priority === "high") setCookie.priority = priority;
				break;
			}
			case "samesite": {
				if (!val) break;
				const sameSite = val.toLowerCase();
				if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") setCookie.sameSite = sameSite;
				else setCookie.sameSite = "lax";
				break;
			}
			default: {
				const attrLower = attr.toLowerCase();
				if (attrLower && !(attrLower in _nullProto)) setCookie[attrLower] = val;
			}
		}
		index = endIdx + 1;
	}
	return setCookie;
}
function _trim(str, start, end) {
	if (start === end) return "";
	let s = start;
	let e = end;
	while (s < e && (str.charCodeAt(s) === 32 || str.charCodeAt(s) === 9)) s++;
	while (e > s && (str.charCodeAt(e - 1) === 32 || str.charCodeAt(e - 1) === 9)) e--;
	return str.slice(s, e);
}
function _decode(value, decode) {
	if (!decode && !value.includes("%")) return value;
	try {
		return (decode || decodeURIComponent)(value);
	} catch {
		return value;
	}
}

//#region node_modules/nuxt/dist/app/diagnostics/_shared.js
/**
* Shared configuration for the runtime (E<N>xxx) diagnostics catalogs.
*
* Catalogs are split by domain and imported directly where used (no barrel),
* so the browser bundle only pulls in the codes a module references. Pair the
* pure-call annotations on each `defineDiagnostics()` with dev-guarded,
* statement-level report calls so report-only diagnostics strip from production.
*
* Codes are stable, fully-qualified `NUXT_E<NNNN>` identifiers. Codes with a
* dedicated docs page resolve a `see:` URL via {@link docsBase}; the rest opt
* out with `docs: false`.
*/
function docsBase(code) {
	return `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
}
var ansi = (open, close) => (s) => `\x1B[${open}m${s}\x1B[${close}m`;
var colors = {
	red: ansi(31, 39),
	yellow: ansi(33, 39),
	cyan: ansi(36, 39),
	gray: ansi(90, 39),
	bold: ansi(1, 22),
	dim: ansi(2, 22)
};
ansiFormatter(colors);
var prodReporter = (diagnostic) => {
	console.error(`[${diagnostic.name}]`);
};
var prodReporters = [prodReporter];
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/core.js
/**
* E1xxx
* Core / Nuxt-instance / lifecycle runtime diagnostics.
*/
var appDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/unctx/dist/index.mjs
function _getAsyncLocalStorage() {
	return globalThis.AsyncLocalStorage || globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncLocalStorage;
}
var _WeakRef = globalThis.WeakRef || class StrongRef {
	#value;
	constructor(value) {
		this.#value = value;
	}
	deref() {
		return this.#value;
	}
};
function createContext(opts = {}) {
	let currentInstance;
	let isSingleton = false;
	const checkConflict = (instance) => {
		if (currentInstance && currentInstance !== instance) throw new Error("Context conflict");
	};
	let als;
	if (opts.asyncContext) {
		const _AsyncLocalStorage = opts.AsyncLocalStorage || _getAsyncLocalStorage();
		if (_AsyncLocalStorage) als = new _AsyncLocalStorage();
		else console.warn("[unctx] `AsyncLocalStorage` is not provided.");
	}
	const _wrapInstance = (instance) => als && instance !== null && typeof instance === "object" ? { __unctx_weak: new _WeakRef(instance) } : instance;
	const _unwrapInstance = (store) => store && store.__unctx_weak ? store.__unctx_weak.deref() : store;
	const _getCurrentInstance = () => {
		if (als) {
			const store = als.getStore();
			if (store !== void 0) return _unwrapInstance(store);
		}
		return currentInstance;
	};
	return {
		use: () => {
			const _instance = _getCurrentInstance();
			if (_instance === void 0) throw new Error("Context is not available");
			return _instance;
		},
		tryUse: () => {
			return _getCurrentInstance() ?? null;
		},
		set: (instance, replace) => {
			if (!replace) checkConflict(instance);
			currentInstance = instance;
			isSingleton = true;
		},
		unset: () => {
			currentInstance = void 0;
			isSingleton = false;
		},
		call: (instance, callback) => {
			checkConflict(instance);
			currentInstance = instance;
			try {
				return als ? als.run(_wrapInstance(instance), callback) : callback();
			} finally {
				if (!isSingleton) currentInstance = void 0;
			}
		},
		async callAsync(instance, callback) {
			currentInstance = instance;
			const onRestore = () => {
				currentInstance = instance;
			};
			const onLeave = () => currentInstance === instance ? onRestore : void 0;
			asyncHandlers.add(onLeave);
			try {
				const r = als ? als.run(_wrapInstance(instance), callback) : callback();
				if (!isSingleton) currentInstance = void 0;
				return await r;
			} finally {
				asyncHandlers.delete(onLeave);
			}
		}
	};
}
function createNamespace(defaultOpts = {}) {
	const contexts = {};
	return { get(key, opts = {}) {
		if (!contexts[key]) contexts[key] = createContext({
			...defaultOpts,
			...opts
		});
		return contexts[key];
	} };
}
var _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
var globalKey = "__unctx__";
var defaultNamespace = _globalThis$1[globalKey] || (_globalThis$1[globalKey] = createNamespace());
var getContext$1 = (key, opts = {}) => defaultNamespace.get(key, opts);
var asyncHandlersKey = "__unctx_async_handlers__";
var asyncHandlers = _globalThis$1[asyncHandlersKey] || (_globalThis$1[asyncHandlersKey] = /* @__PURE__ */ new Set());
function executeAsync(function_) {
	const restores = [];
	for (const leaveHandler of asyncHandlers) {
		const restore = leaveHandler();
		if (restore) restores.push(restore);
	}
	const restore = () => {
		for (const restore of restores) restore();
	};
	let awaitable = function_();
	if (awaitable && typeof awaitable === "object" && "catch" in awaitable) awaitable = awaitable.catch((error) => {
		restore();
		throw error;
	});
	return [awaitable, restore];
}
//#endregion
//#region node_modules/nuxt/dist/app/internal/context.js
globalThis.__nuxt_app_ctx__ ||= {};
function getContext(key, opts) {
	return getContext$1(key, opts);
}
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fnuxt.config.mjs
var nuxtLinkDefaults = {
	"componentName": "NuxtLink"};
var asyncDataDefaults = { "deep": false };
//#endregion
//#region node_modules/nuxt/dist/app/nuxt.js
function getNuxtAppCtx(id = "nuxt-app") {
	return getContext(id, { asyncContext: false });
}
var NuxtPluginIndicator = "__nuxt_plugin";
/** @since 3.0.0 */
function createNuxtApp(options) {
	let hydratingCount = 0;
	const nuxtApp = {
		_id: options.id || "nuxt-app",
		_scope: effectScope(),
		provide: void 0,
		versions: {
			get nuxt() {
				return "4.6.1";
			},
			get vue() {
				return nuxtApp.vueApp.version;
			}
		},
		payload: shallowReactive({
			...options.ssrContext?.payload || {},
			data: shallowReactive({}),
			state: reactive({}),
			once: /* @__PURE__ */ new Set(),
			_errors: shallowReactive({})
		}),
		static: { data: {} },
		runWithContext(fn) {
			if (nuxtApp._scope.active && !getCurrentScope()) return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
			return callWithNuxt(nuxtApp, fn);
		},
		isHydrating: false,
		deferHydration() {
			if (!nuxtApp.isHydrating) return () => {};
			hydratingCount++;
			let called = false;
			return () => {
				if (called) return;
				called = true;
				hydratingCount--;
				if (hydratingCount === 0) {
					nuxtApp.isHydrating = false;
					return nuxtApp.callHook("app:suspense:resolve");
				}
			};
		},
		_asyncDataPromises: {},
		_asyncData: shallowReactive({}),
		_state: shallowReactive({}),
		_payloadRevivers: {},
		...options
	};
	nuxtApp.payload.serverRendered = true;
	if (nuxtApp.ssrContext) {
		nuxtApp.payload.path = nuxtApp.ssrContext.url;
		nuxtApp.ssrContext.nuxt = nuxtApp;
		nuxtApp.ssrContext.payload = nuxtApp.payload;
		nuxtApp.ssrContext.config = {
			public: nuxtApp.ssrContext.runtimeConfig.public,
			app: nuxtApp.ssrContext.runtimeConfig.app
		};
	}
	nuxtApp.hooks = createHooks();
	nuxtApp.hook = nuxtApp.hooks.hook;
	{
		const runHooks = async (hooks, args) => {
			for (const hook of hooks) await nuxtApp.runWithContext(() => hook(...args));
		};
		const contextCaller = runHooks;
		nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, args);
	}
	nuxtApp.callHook = nuxtApp.hooks.callHook;
	nuxtApp.provide = (name, value) => {
		const $name = "$" + name;
		defineGetter(nuxtApp, $name, value);
		defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
	};
	defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
	defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
	const runtimeConfig = options.ssrContext.runtimeConfig;
	nuxtApp.provide("config", runtimeConfig);
	return nuxtApp;
}
/** @since 3.12.0 */
function registerPluginHooks(nuxtApp, plugin) {
	if (plugin.hooks) nuxtApp.hooks.addHooks(plugin.hooks);
}
/** @since 3.0.0 */
async function applyPlugin(nuxtApp, plugin) {
	if (typeof plugin === "function") {
		const run = () => nuxtApp.runWithContext(() => plugin(nuxtApp));
		const { provide } = await run() || {};
		if (provide && typeof provide === "object") for (const key in provide) nuxtApp.provide(key, provide[key]);
	}
}
/** @since 3.0.0 */
async function applyPlugins(nuxtApp, plugins) {
	return applyPluginsWithDependencies(nuxtApp, plugins);
}
async function applyPluginsWithDependencies(nuxtApp, plugins) {
	const resolvedPlugins = /* @__PURE__ */ new Set();
	const unresolvedPlugins = [];
	const parallels = [];
	let error;
	let promiseDepth = 0;
	async function executePlugin(plugin) {
		const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
		if (unresolvedPluginsForThisPlugin.length > 0) unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
		else {
			const promise = applyPlugin(nuxtApp, plugin).then(async () => {
				if (plugin._name) {
					resolvedPlugins.add(plugin._name);
					await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
						if (dependsOn.has(plugin._name)) {
							dependsOn.delete(plugin._name);
							if (dependsOn.size === 0) {
								promiseDepth++;
								await executePlugin(unexecutedPlugin);
							}
						}
					}));
				}
			}).catch((e) => {
				if (!plugin.parallel && !nuxtApp.payload.error) throw e;
				error ||= e;
			});
			if (plugin.parallel) parallels.push(promise);
			else await promise;
		}
	}
	for (const plugin of plugins) registerPluginHooks(nuxtApp, plugin);
	for (const plugin of plugins) await executePlugin(plugin);
	await Promise.all(parallels);
	if (promiseDepth) for (let i = 0; i < promiseDepth; i++) await Promise.all(parallels);
	if (error) throw nuxtApp.payload.error || error;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtPlugin(plugin) {
	if (typeof plugin === "function") return plugin;
	const _name = plugin._name || plugin.name;
	delete plugin.name;
	return Object.assign(plugin.setup || (() => {}), plugin, {
		[NuxtPluginIndicator]: true,
		_name
	});
}

var definePayloadPlugin = defineNuxtPlugin;
/**
* Ensures that the setup function passed in has access to the Nuxt instance via `useNuxtApp`.
* @param nuxt A Nuxt instance
* @param setup The function to call
* @since 3.0.0
*/
function callWithNuxt(nuxt, setup, args) {
	const fn = () => setup();
	const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
	return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
}
function tryUseNuxtApp(id) {
	let nuxtAppInstance;
	if (hasInjectionContext()) nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
	nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
	return nuxtAppInstance || null;
}
function useNuxtApp(id) {
	const nuxtAppInstance = tryUseNuxtApp(id);
	if (!nuxtAppInstance) throw appDiagnostics.NUXT_E1001();
	return nuxtAppInstance;
}
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function useRuntimeConfig(_event) {
	return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
	Object.defineProperty(obj, key, { get: () => val });
}
//#endregion
//#region node_modules/nuxt/dist/app/error.js
var NUXT_ERROR_SIGNATURE = "__nuxt_error";
/** @since 3.0.0 */
var isNuxtError = (error) => !!error && typeof error === "object" && "__nuxt_error" in error;
/** @since 3.0.0 */
var createError$1 = (error) => {
	if (isNuxtError(error)) return error;
	if (typeof error !== "string" && error?.statusText) error.message ??= error.statusText;
	const nuxtError = createError(error ?? {});
	Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
		value: true,
		configurable: false,
		writable: false
	});
	Object.defineProperty(nuxtError, "status", {
		get: () => nuxtError.statusCode,
		configurable: true
	});
	Object.defineProperty(nuxtError, "statusText", {
		get: () => nuxtError.statusMessage,
		configurable: true
	});
	return nuxtError;
};
//#endregion
//#region node_modules/nuxt/dist/app/utils.js
var PROBE_BASE_A = "https://a.invalid/probe/";
var PROBE_BASE_B = "https://b.invalid/probe/";
function parseAnchorURL(value, base = PROBE_BASE_A) {
	try {
		return new URL(value, base);
	} catch {
		return null;
	}
}
/** Whether a URL string is a path rooted at the current origin, so carries no protocol. */
function isRootedPath(value) {
	return value[0] === "/" && value[1] !== "/" && value[1] !== "\\";
}
/** Whether a URL string carries its own protocol or authority. */
function isAbsoluteHref(value) {
	if (!value || isRootedPath(value)) return false;
	const resolved = parseAnchorURL(value);
	return !!resolved && resolved.href === parseAnchorURL(value, PROBE_BASE_B)?.href;
}
/** The script-capable protocol a URL string would navigate to, or `null` when it is safe. */
function getScriptProtocol(value) {
	if (!value || isRootedPath(value)) return null;
	let resolved = parseAnchorURL(value.replace(/[\u0000-\u001F\u007F\s]+/g, ""));
	while (resolved?.protocol === "view-source:") resolved = parseAnchorURL(resolved.pathname);
	if (!resolved) return "";
	return isScriptProtocol(resolved.protocol) ? resolved.protocol : null;
}
/** Returns the value unchanged when safe to use as an anchor `href`, or `null`. */
function sanitizeAnchorHref(value) {
	return getScriptProtocol(value) === null ? value : null;
}
//#endregion
//#region node_modules/nuxt/dist/app/components/injections.js
var LayoutMetaSymbol = Symbol("layout-meta");
var LayoutSymbol = Symbol("layout");
var PageRouteSymbol = Symbol("route");
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/navigation.js
/**
* E2xxx
* Navigation / routing / middleware runtime diagnostics.
*/
var navigationDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/router.js
/** @since 3.0.0 */
var useRouter = (() => {
	return useNuxtApp()?.$router;
});
/**
* Whether the current effect scope is (a descendant of) the component instance's scope.
* A detached scope (e.g. `createSharedComposable`) outlives the component, so the
* per-page route injected there would freeze after navigation (#18903).
*/
function getParentScope(scope) {
	const internal = scope;
	return internal.parent ?? internal.subs?.sub;
}
function isScopeWithinInstance(instance) {
	const instanceScope = instance.scope;
	let scope = getCurrentScope();
	while (scope) {
		if (scope === instanceScope) return true;
		scope = getParentScope(scope);
	}
	return false;
}
/** @since 3.0.0 */
var useRoute$1 = (() => {
	if (hasInjectionContext()) {
		const instance = getCurrentInstance();
		if (!instance || isScopeWithinInstance(instance)) return inject(PageRouteSymbol, useNuxtApp()._route);
	}
	return useNuxtApp()._route;
});
/** @since 3.0.0 */
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtRouteMiddleware(middleware) {
	return middleware;
}
/** @since 3.0.0 */
var isProcessingMiddleware = () => {
	try {
		if (useNuxtApp()._processingMiddleware) return true;
	} catch {
		return false;
	}
	return false;
};
var HTML_ATTR_UNSAFE_RE = /[&"'<>]/g;
var HTML_ATTR_ENCODE_MAP = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#x27;",
	"<": "&lt;",
	">": "&gt;"
};
function encodeForHtmlAttr(value) {
	return value.replace(HTML_ATTR_UNSAFE_RE, (c) => HTML_ATTR_ENCODE_MAP[c]);
}
/**
* A helper that aids in programmatic navigation within your Nuxt application.
*
* Can be called on the server and on the client, within pages, route middleware, plugins, and more.
* @param {RouteLocationRaw | undefined | null} [to] - The route to navigate to. Accepts a route object, string path, `undefined`, or `null`. Defaults to '/'.
* @param {NavigateToOptions} [options] - Optional customization for controlling the behavior of the navigation.
* @returns {Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw} The navigation result, which varies depending on context and options.
* @see https://nuxt.com/docs/4.x/api/utils/navigate-to
* @since 3.0.0
*/
var navigateTo = (to, options) => {
	to ||= "/";
	const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
	const isExternalHost = isAbsoluteHref(toPath);
	const isExternal = options?.external || isExternalHost;
	if (isExternal) {
		if (!options?.external) throw navigationDiagnostics.NUXT_E2001({ toPath });
		const protocol = getScriptProtocol(toPath);
		if (protocol !== null) throw navigationDiagnostics.NUXT_E2002({
			toPath,
			protocol
		});
	}
	const inMiddleware = isProcessingMiddleware();
	const router = useRouter();
	const nuxtApp = useNuxtApp();
	if (nuxtApp.ssrContext) {
		const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
		const location = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
		const redirect = async function(response) {
			await nuxtApp.callHook("app:redirected");
			const encodedHeader = encodeURL(location, isExternalHost);
			const encodedLoc = encodeForHtmlAttr(encodedHeader);
			nuxtApp.ssrContext["~renderResponse"] = {
				statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
				body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
				headers: { location: encodedHeader }
			};
			return response;
		};
		if (!isExternal && inMiddleware) {
			let expectedPath = fullPath;
			if (typeof to === "string" && toPath.includes("?")) {
				const target = router.resolve(to);
				expectedPath = router.resolve({
					path: target.path,
					query: target.query,
					hash: target.hash
				}).fullPath || "/";
			}
			router.afterEach((final) => final.fullPath === expectedPath ? redirect(false) : void 0);
			return to;
		}
		return redirect(!inMiddleware ? void 0 : false);
	}
	if (isExternal) {
		nuxtApp._scope.stop();
		if (options?.replace) (void 0).replace(toPath);
		else (void 0).href = toPath;
		if (inMiddleware) {
			if (!nuxtApp.isHydrating) return false;
			return new Promise(() => {});
		}
		return Promise.resolve();
	}
	const encodedTo = typeof to === "string" ? encodeRoutePath(to) : to;
	return options?.replace ? router.replace(encodedTo) : router.push(encodedTo);
};
/**
* @internal
*/
function resolveRouteObject(to) {
	return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
/**
* @internal
*/
function encodeURL(location, isExternalHost = false) {
	const url = new URL(location, "http://localhost");
	if (!isExternalHost) return url.pathname.replace(/^\/{2,}/, "/") + url.search + url.hash;
	if (location.startsWith("//")) return url.toString().replace(url.protocol, "");
	return url.toString();
}
/**
* Encode the pathname of a route location string. Ensures decoded paths like
* `/café` are percent-encoded to match vue-router's encoded route records.
* Already-encoded paths are not double-encoded.
* @internal
*/
function encodeRoutePath(url) {
	const parsed = parseURL(url);
	return encodeVueRouterPath(decodePath(parsed.pathname)) + parsed.search + parsed.hash;
}
var ENC_PIPE_RE = /%7C/g;
var ENC_BRACKET_OPEN_RE = /%5B/g;
var ENC_BRACKET_CLOSE_RE = /%5D/g;
var ENC_ENC_SLASH_RE = /%252F/gi;
var HASH_RE = /#/g;
var QUESTION_MARK_RE = /\?/g;
/**
* Apply vue-router's own path encoding, which leaves sub-delimiters like `&`
* and `+` literal. This must stay in sync with `encodeVueRouterPath` in
* `unrouting`, which encodes the route records we need to match against.
*/
function encodeVueRouterPath(value) {
	return encodeURI(value).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]").replace(HASH_RE, "%23").replace(QUESTION_MARK_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F");
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/error.js
/** @since 3.0.0 */
var useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
/** @since 3.0.0 */
var showError = (error) => {
	const nuxtError = createError$1(error);
	try {
		const error = /* @__PURE__ */ useError();
		error.value ||= nuxtError;
	} catch {
		throw nuxtError;
	}
	return nuxtError;
};
/**
* Show the error page unless the current client is a crawler, in which case the
* bot receives the already server-rendered HTML instead (#32137, #35338).
*
* @internal
*/
var _showErrorUnlessCrawler = async (nuxtApp, error) => {
	await nuxtApp.runWithContext(() => showError(error));
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Ffetch.mjs
if (!globalThis.$fetch) globalThis.$fetch = $fetch$1.create({ baseURL: baseURL() });
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fglobal-polyfills.mjs
if (!("global" in globalThis)) globalThis.global = globalThis;
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/head.js
/**
* E6xxx
* Head / unhead runtime diagnostics.
*/
var unheadDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/@unhead/vue/dist/shared/vue.DKb5ZKVl.mjs
var headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function injectHead$1() {
	if (hasInjectionContext()) {
		const instance = inject(headSymbol);
		if (instance) return instance;
	}
	throw new Error("useHead() was called without provide context, ensure you call it through the setup() function.");
}
//#endregion
//#region node_modules/@unhead/vue/dist/shared/vue.D2XR8FqS.mjs
var VueResolver = /* @__PURE__ */ Object.assign((_, value) => isRef(value) ? toValue(value) : value, { _static: true });
//#endregion
//#region node_modules/@unhead/vue/dist/shared/vue.BHyNcdic.mjs
function useHead$1(input, options = {}) {
	const head = options.head || /* @__PURE__ */ injectHead$1();
	return head.ssr ? head.push(input || {}, options) : clientUseHead(head, input, options);
}
function clientUseHead(head, input, options = {}) {
	const scope = getCurrentScope();
	if (scope && !scope.active) return {
		patch() {},
		dispose() {},
		_i: -1
	};
	const deactivated = ref(false);
	if (options.onRendered && scope) {
		const _onRendered = options.onRendered;
		options = {
			...options,
			onRendered: (ctx) => scope.run(() => _onRendered(ctx))
		};
	}
	let entry;
	watchEffect(() => {
		const i = deactivated.value ? {} : walkResolver(input, VueResolver);
		if (entry) entry.patch(i);
		else entry = head.push(i, options);
	});
	if (getCurrentInstance()) ;
	return entry;
}
function normalizeSeoMetaInput(input) {
	if (input._flatMeta) return input;
	const meta = {};
	for (const key in input) {
		if (!hasOwn(input, key) || key === "title" || key === "titleTemplate") continue;
		meta[key] = input[key];
	}
	return {
		title: input.title,
		titleTemplate: input.titleTemplate,
		_flatMeta: meta
	};
}
function useSeoMeta$1(input = {}, options = {}) {
	(options.head || /* @__PURE__ */ injectHead$1()).use(FlatMetaPlugin);
	const entry = useHead$1(normalizeSeoMetaInput(input), options);
	const corePatch = entry.patch;
	if (!entry.__patched) {
		entry.patch = (input2) => corePatch(normalizeSeoMetaInput(input2));
		entry.__patched = true;
	}
	return entry;
}
//#endregion
//#region node_modules/nuxt/dist/head/runtime/composables.js
/**
* Injects the head client from the Nuxt context or Vue inject.
*/
function injectHead(nuxtApp) {
	const nuxt = nuxtApp || useNuxtApp();
	return nuxt.ssrContext?.head || nuxt.runWithContext(() => {
		if (hasInjectionContext()) {
			const head = inject("usehead");
			if (!head) throw unheadDiagnostics.NUXT_E6001();
			return head;
		}
	});
}
function useHead(input, options = {}) {
	return useHead$1(input, {
		head: options.head || injectHead(options.nuxt),
		...options
	});
}
function useSeoMeta(input, options = {}) {
	return useSeoMeta$1(input, {
		head: options.head || injectHead(options.nuxt),
		...options
	});
}
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/state.js
/**
* E7xxx
* Payload / state / cookie runtime diagnostics.
*/
var stateDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/manifest.js
/**
* E5xxx
* App manifest / route-rules runtime diagnostics.
*/
var manifestDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froute-rules.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default = () => ({});
//#endregion
//#region node_modules/nuxt/dist/app/composables/manifest.js
function routeRulesMatcher$1(path) {
	return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default();
}
function getRouteRules(arg) {
	const path = typeof arg === "string" ? arg : arg.path;
	try {
		return routeRulesMatcher$1(path);
	} catch (e) {
		manifestDiagnostics.NUXT_E5003({
			path,
			cause: e
		});
		return {};
	}
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/payload.js
/**
* This is an experimental function for configuring passing rich data from server -> client.
* @since 3.4.0
*/
function definePayloadReducer(name, reduce) {
	useNuxtApp().ssrContext["~payloadReducers"][name] = reduce;
}
//#endregion
//#region node_modules/@pinia/nuxt/dist/runtime/payload-plugin.js
var payloadPlugin = definePayloadPlugin(() => {
	definePayloadReducer("skipHydrate", (data) => !shouldHydrate(data) && 1);
});
//#endregion
//#region node_modules/nuxt/dist/head/runtime/island-head.js
/**
* No-op `head.push` until the returned `unfreeze` runs. Plugin/transformer
* augmentations on the same head are unaffected.
*/
function freezeHead(head) {
	const realPush = head.push;
	head.push = () => ({
		dispose: () => {},
		patch: () => {},
		_i: 0
	});
	return () => {
		head.push = realPush;
	};
}
//#endregion
//#region node_modules/nuxt/dist/head/runtime/plugins/unhead.server.js
var plugin$3 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:head",
	enforce: "pre",
	setup(nuxtApp) {
		const head = nuxtApp.ssrContext.head;
		if (nuxtApp.ssrContext.islandContext) {
			const unfreeze = freezeHead(head);
			nuxtApp.hooks.hookOnce("app:created", unfreeze);
		}
		nuxtApp.vueApp.use(head);
	}
});
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/utils.js
var ROUTE_KEY_PARENTHESES_RE$1 = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE$1 = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE$1 = /:\w+/g;
var interpolatePath = (route, match) => {
	return match.path.replace(ROUTE_KEY_PARENTHESES_RE$1, "$1").replace(ROUTE_KEY_SYMBOLS_RE$1, "$1").replace(ROUTE_KEY_NORMAL_RE$1, (r) => route.params[r.slice(1)]?.toString() || "");
};
var generateRouteKey$1 = (routeProps, override) => {
	const matchedRoute = routeProps.route.matched.find((m) => m.components?.default === routeProps.Component.type);
	const source = matchedRoute?.meta.key ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
	return typeof source === "function" ? source(routeProps.route) : source;
};
/** @since 3.9.0 */
function toArray$2(value) {
	return Array.isArray(value) ? value : [value];
}
//#endregion
//#region node_modules/nuxt/dist/app/components/utils.js
/**
* Internal utility
* @private
*/
var _wrapInTransition = (props, children) => {
	return { default: () => children.default?.() };
};
var ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
var ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
var ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
	const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
	return typeof source === "function" ? source(route) : source;
}
/**
* Utility used within router guards
* return true if the route has been changed with a page change during navigation
*/
function isChangingPage(to, from) {
	if (to === from || from === START_LOCATION) return false;
	if (generateRouteKey(to) !== generateRouteKey(from)) return true;
	if (to.matched.every((comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default)) return false;
	return true;
}
var VALID_TAG_RE = /^[a-z][a-z0-9-]*$/i;
/** Return `tag` if it is a safe HTML tag name, otherwise `fallback`. */
function sanitizeTag(tag, fallback) {
	return tag && VALID_TAG_RE.test(tag) ? tag : fallback;
}
function toArray$1(value) {
	return Array.isArray(value) ? value : [value];
}
/**
* Internal utility
* @private
*/
function _mergeTransitionProps(routeProps) {
	const _props = [];
	for (const prop of routeProps) {
		if (!prop) continue;
		_props.push({
			...prop,
			onAfterLeave: prop.onAfterLeave ? toArray$1(prop.onAfterLeave) : void 0,
			onBeforeLeave: prop.onBeforeLeave ? toArray$1(prop.onBeforeLeave) : void 0
		});
	}
	return defu(..._props);
}
function _startTransition(nuxtApp) {
	nuxtApp["~transitionPromise"] ||= new Promise((resolve) => {
		nuxtApp["~transitionFinish"] = resolve;
	});
}
function _finishTransition(nuxtApp) {
	nuxtApp["~transitionFinish"]?.();
	delete nuxtApp["~transitionFinish"];
	delete nuxtApp["~transitionPromise"];
}
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/router.options.js
var router_options_default = { scrollBehavior(to, from, savedPosition) {
	const nuxtApp = useNuxtApp();
	const router = useRouter();
	const hashScrollBehaviour = router.options?.scrollBehaviorType ?? "auto";
	if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
		if (from.hash && !to.hash) return savedPosition ?? {
			left: 0,
			top: 0
		};
		if (to.hash) return {
			el: to.hash,
			top: _getHashElementScrollMarginTop(to.hash),
			behavior: hashScrollBehaviour
		};
		return false;
	}
	if ((typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop) === false) return false;
	if (from === START_LOCATION) return _calculatePosition(to, from, savedPosition, hashScrollBehaviour);
	return new Promise((resolve) => {
		const doScroll = () => {
			requestAnimationFrame(() => {
				if (router.currentRoute.value.fullPath !== to.fullPath) {
					resolve(false);
					return;
				}
				resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
			});
		};
		nuxtApp.hooks.hookOnce("page:loading:end", () => {
			const transitionPromise = nuxtApp["~transitionPromise"];
			if (transitionPromise) transitionPromise.then(doScroll);
			else doScroll();
		});
	});
} };
function _getHashElementScrollMarginTop(selector) {
	try {
		const elem = (void 0).querySelector(selector);
		if (elem) return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
	} catch {}
	return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
	if (savedPosition) return savedPosition;
	if (to.hash) return {
		el: to.hash,
		top: _getHashElementScrollMarginTop(to.hash),
		behavior: isChangingPage(to, from) ? defaultHashScrollBehaviour : "instant"
	};
	return {
		left: 0,
		top: 0
	};
}
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default = {
	hashMode: false,
	scrollBehaviorType: "auto",
	sensitive: false,
	...router_options_default
};
Object.assign(Object.create(null), {});
var pageIslandRoutes = Object.assign(Object.create(null), {});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fmiddleware.mjs
var globalMiddleware = [/* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
	let __temp, __restore;
	if (!to.meta?.validate) return;
	const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
	if (result === true) return;
	return createError$1({
		fatal: false,
		status: result && (result.status || result.statusCode) || 404,
		statusText: result && (result.statusText || result.statusMessage) || `Page Not Found: ${to.fullPath}`,
		data: { path: to.fullPath }
	});
}), /* @__PURE__ */ defineNuxtRouteMiddleware((to) => {})];
var namedMiddleware = {
	attributes: () => import('../build/attributes-J47Fug5h.mjs'),
	i18n: () => import('../build/i18n-D7uOyl6u.mjs')
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Froutes.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default = [
	{
		name: "products-product-slug___en",
		path: "/en/products/product/:slug()",
		component: () => import('../build/_slug_-BdTHIcfY.mjs')
	},
	{
		name: "products-product-slug___fr",
		path: "/produits/produit/:slug()",
		component: () => import('../build/_slug_-BdTHIcfY.mjs')
	},
	{
		name: "blog-slug___en",
		path: "/en/blog/:slug()",
		component: () => import('../build/_slug_-Cf1VmGKW.mjs')
	},
	{
		name: "blog-slug___fr",
		path: "/blogue/:slug()",
		component: () => import('../build/_slug_-Cf1VmGKW.mjs')
	},
	{
		name: "products-slug___en",
		path: "/en/products/:category()",
		component: () => import('../build/_slug_-Dd9cYiho.mjs')
	},
	{
		name: "products-slug___fr",
		path: "/produits/:category()",
		component: () => import('../build/_slug_-Dd9cYiho.mjs')
	},
	{
		name: "artist___en",
		path: "/en/artist",
		component: () => import('../build/artist-DzNuN__y.mjs')
	},
	{
		name: "artist___fr",
		path: "/artiste",
		component: () => import('../build/artist-DzNuN__y.mjs')
	},
	{
		name: "blog___en",
		path: "/en/blog",
		component: () => import('../build/blog-BW_aqxRA.mjs')
	},
	{
		name: "blog___fr",
		path: "/blogue",
		component: () => import('../build/blog-BW_aqxRA.mjs')
	},
	{
		name: "brand___en",
		path: "/en/brand",
		component: () => import('../build/brand-CsBOvtmH.mjs')
	},
	{
		name: "brand___fr",
		path: "/marque",
		component: () => import('../build/brand-CsBOvtmH.mjs')
	},
	{
		name: "contact___en",
		path: "/en/contact",
		component: () => import('../build/contact-CI5rWj_Q.mjs')
	},
	{
		name: "contact___fr",
		path: "/contact",
		component: () => import('../build/contact-CI5rWj_Q.mjs')
	},
	{
		name: "cookie-policy___en",
		path: "/en/cookie-policy",
		component: () => import('../build/cookie-policy-D3piAlGp.mjs')
	},
	{
		name: "cookie-policy___fr",
		path: "/politique-cookie",
		component: () => import('../build/cookie-policy-D3piAlGp.mjs')
	},
	{
		name: "creations___en",
		path: "/en/our-creations",
		component: () => import('../build/creations-BI-YuCrJ.mjs')
	},
	{
		name: "creations___fr",
		path: "/nos-creations",
		component: () => import('../build/creations-BI-YuCrJ.mjs')
	},
	{
		name: "events___en",
		path: "/en/events",
		component: () => import('../build/events-BWH7QJwh.mjs')
	},
	{
		name: "events___fr",
		path: "/evenements",
		component: () => import('../build/events-BWH7QJwh.mjs')
	},
	{
		name: "glossary___en",
		path: "/en/glossary",
		component: () => import('../build/glossary-DIAWoX5y.mjs')
	},
	{
		name: "glossary___fr",
		path: "/glossaire",
		component: () => import('../build/glossary-DIAWoX5y.mjs')
	},
	{
		name: "privacy-policy___en",
		path: "/en/privacy-policy",
		component: () => import('../build/privacy-policy-DY5Ivdzf.mjs')
	},
	{
		name: "privacy-policy___fr",
		path: "/politique-confidentialite",
		component: () => import('../build/privacy-policy-DY5Ivdzf.mjs')
	},
	{
		name: "products___en",
		path: "/en/products",
		component: () => import('../build/products-U0Uyd_S_.mjs')
	},
	{
		name: "products___fr",
		path: "/produits",
		component: () => import('../build/products-U0Uyd_S_.mjs')
	},
	{
		name: "return___en",
		path: "/en/return-policy",
		component: () => import('../build/return-CHxgQJHS.mjs')
	},
	{
		name: "return___fr",
		path: "/politique-retour",
		component: () => import('../build/return-CHxgQJHS.mjs')
	},
	{
		name: "videos___en",
		path: "/en/videos",
		component: () => import('../build/videos-DFkA1KEz.mjs')
	},
	{
		name: "videos___fr",
		path: "/videos",
		component: () => import('../build/videos-DFkA1KEz.mjs')
	},
	{
		name: "index___en",
		path: "/en",
		component: () => import('../build/pages-Gnpvmwgl.mjs')
	},
	{
		name: "index___fr",
		path: "/",
		component: () => import('../build/pages-Gnpvmwgl.mjs')
	}
];
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/plugins/router.js
var plugin$2 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:router",
	enforce: "pre",
	async setup(nuxtApp) {
		let __temp, __restore;
		let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
		const history = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.history?.(routerBase) ?? createMemoryHistory(routerBase);
		const routes = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes ? ([__temp, __restore] = executeAsync(() => virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.routes(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default)), __temp = await __temp, __restore(), __temp) ?? virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default : virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froutes_default;
		let startPosition;
		const router = createRouter({
			...virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default,
			scrollBehavior: (to, from, savedPosition) => {
				if (from === START_LOCATION) {
					startPosition = savedPosition;
					return;
				}
				if (virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior) {
					router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
					if ("scrollRestoration" in (void 0).history) {
						const unsub = router.beforeEach(() => {
							unsub();
							(void 0).history.scrollRestoration = "manual";
						});
					}
					return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
				}
			},
			history,
			routes
		});
		nuxtApp.vueApp.use(router);
		const previousRoute = shallowRef(router.currentRoute.value);
		router.afterEach((_to, from) => {
			previousRoute.value = from;
		});
		Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", { get: () => previousRoute.value });
		const initialURL = nuxtApp.ssrContext.url;
		const _route = shallowRef(router.currentRoute.value);
		const syncCurrentRoute = () => {
			_route.value = router.currentRoute.value;
		};
		router.afterEach((to, from) => {
			const lastTo = to.matched.at(-1)?.components?.default;
			const lastFrom = from.matched.at(-1)?.components?.default;
			if (lastTo === lastFrom) {
				if (generateRouteKey$1({
					route: to,
					Component: { type: lastTo }
				}) === generateRouteKey$1({
					route: from,
					Component: { type: lastFrom }
				})) syncCurrentRoute();
				return;
			}
			if (to.matched.length < from.matched.length && to.matched.every((m, i) => m.components?.default === from.matched[i]?.components?.default)) syncCurrentRoute();
		});
		const route = { sync: syncCurrentRoute };
		for (const key in _route.value) Object.defineProperty(route, key, {
			get: () => _route.value[key],
			enumerable: true
		});
		nuxtApp._route = shallowReactive(route);
		nuxtApp._middleware ||= {
			global: [],
			named: {}
		};
		const error = /* @__PURE__ */ useError();
		const isServerPage = nuxtApp.ssrContext?.islandContext?.name?.startsWith("page_");
		if (!nuxtApp.ssrContext?.islandContext || isServerPage) router.afterEach(async (to, _from, failure) => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			if (failure) await nuxtApp.callHook("page:loading:end");
			if (failure?.type === 4) return;
			if (to.redirectedFrom && to.fullPath !== initialURL) await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
		});
		router.onError(async () => {
			delete nuxtApp._processingMiddleware;
			delete nuxtApp._middlewareTo;
			await nuxtApp.callHook("page:loading:end");
		});
		try {
			[__temp, __restore] = executeAsync(() => router.push(initialURL)), __temp = await __temp, __restore();
			[__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
		} catch (error) {
			[__temp, __restore] = executeAsync(() => _showErrorUnlessCrawler(nuxtApp, error)), await __temp, __restore();
		}
		const resolvedInitialRoute = router.currentRoute.value;
		syncCurrentRoute();
		if (nuxtApp.ssrContext?.islandContext && !isServerPage) return { provide: { router } };
		const initialLayout = nuxtApp.payload.state._layout;
		router.beforeEach(async (to, from) => {
			await nuxtApp.callHook("page:loading:start");
			to.meta = reactive(to.meta);
			if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) to.meta.layout = initialLayout;
			nuxtApp._processingMiddleware = true;
			nuxtApp._middlewareTo = to;
			if (!nuxtApp.ssrContext?.islandContext || isServerPage) {
				const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
				for (const component of to.matched) {
					const componentMiddleware = component.meta.middleware;
					if (!componentMiddleware) continue;
					for (const entry of toArray$2(componentMiddleware)) middlewareEntries.add(entry);
				}
				const routeRules = getRouteRules({ path: to.path });
				if (routeRules.appMiddleware) for (const key in routeRules.appMiddleware) if (routeRules.appMiddleware[key]) middlewareEntries.add(key);
				else middlewareEntries.delete(key);
				for (const entry of middlewareEntries) {
					const middleware = typeof entry === "string" ? nuxtApp._middleware.named[entry] || await namedMiddleware[entry]?.().then((r) => r.default || r) : entry;
					if (!middleware) throw navigationDiagnostics.NUXT_E2004({
						entry: String(entry),
						validMiddleware: void 0
					});
					try {
						const run = () => nuxtApp.runWithContext(() => middleware(to, from));
						const result = await run();
						if (result === false || result instanceof Error) {
							const error = result || createError$1({
								status: 404,
								statusText: `Page Not Found: ${initialURL}`
							});
							await nuxtApp.runWithContext(() => showError(error));
							return false;
						}
						if (result === true) continue;
						if (result === false) return result;
						if (result) {
							if (isNuxtError(result) && result.fatal) await nuxtApp.runWithContext(() => showError(result));
							return result;
						}
					} catch (err) {
						const error = createError$1(err);
						if (error.fatal) await nuxtApp.runWithContext(() => showError(error));
						return error;
					}
				}
			}
		});
		if (isServerPage) router.beforeResolve((to) => {
			const expected = pageIslandRoutes[nuxtApp.ssrContext.islandContext.name];
			const actual = to.matched.find((m) => (m.components?.default)?.__nuxt_island)?.components?.default;
			if (!expected || expected !== actual?.__nuxt_island) {
				nuxtApp.ssrContext["~renderResponse"] = {
					statusCode: 400,
					statusMessage: "Invalid island request path"
				};
				return false;
			}
		});
		router.afterEach((to) => {
			if (to.matched.length === 0 && !error.value) return nuxtApp.runWithContext(() => showError(createError$1({
				status: 404,
				fatal: false,
				statusText: `Page not found: ${to.fullPath}`,
				data: { path: to.fullPath }
			})));
		});
		nuxtApp.hooks.hookOnce("app:created", async () => {
			try {
				if ("name" in resolvedInitialRoute) resolvedInitialRoute.name = void 0;
				await router.replace({
					...resolvedInitialRoute,
					force: true
				});
				router.options.scrollBehavior = virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Frouter_options_default.scrollBehavior;
			} catch (error) {
				await _showErrorUnlessCrawler(nuxtApp, error);
			}
		});
		return { provide: { router } };
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/plugins/revive-payload.server.js
var reducers = [
	["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
	["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
	["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
	["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
	["Ref", (data) => isRef(data) && data.value],
	["Reactive", (data) => isReactive(data) && toRaw(data)]
];
var plugin$1 = /* @__PURE__ */ defineNuxtPlugin({
	name: "nuxt:revive-payload:server",
	setup() {
		for (const [reducer, fn] of reducers) definePayloadReducer(reducer, fn);
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/utils/debounce-tick.js
/**
* Debounce an async function so that repeated calls within the same tick are
* collapsed into a single call (plus a trailing call if arguments arrived
* while the debounced call was still pending).
*
* Adapted from https://github.com/unjs/perfect-debounce with the timeout
* replaced by Vue's post-flush callback queue.
*/
function debounceTick(fn, options = {}) {
	let leadingValue;
	let active = false;
	let resolveList = [];
	let currentPromise;
	let trailingArgs;
	const applyFn = (_this, args) => {
		const promise = _applyPromised(fn, _this, args);
		currentPromise = promise;
		promise.finally(() => {
			currentPromise = void 0;
			if (trailingArgs && !active) {
				const args = trailingArgs;
				trailingArgs = void 0;
				applyFn(_this, args);
			}
		});
		return promise;
	};
	return function(...args) {
		trailingArgs = args;
		if (currentPromise) return currentPromise;
		return new Promise((resolve) => {
			const shouldCallNow = options.leading && !active;
			if (!active) {
				active = true;
				queuePostFlushCb(() => {
					active = false;
					const flushArgs = trailingArgs ?? args;
					trailingArgs = void 0;
					const promise = options.leading ? leadingValue : applyFn(this, flushArgs);
					for (const _resolve of resolveList) _resolve(promise);
					resolveList = [];
				});
			}
			if (shouldCallNow) {
				leadingValue = applyFn(this, args);
				resolve(leadingValue);
			} else resolveList.push(resolve);
		});
	};
}
async function _applyPromised(fn, _this, args) {
	return await fn.apply(_this, args);
}
defineComponent({
	name: "ServerPlaceholder",
	render() {
		return createElementBlock("div");
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/components/client-only.js
var clientOnlySymbol = Symbol.for("nuxt:client-only");
var ClientOnly = defineComponent({
	name: "ClientOnly",
	inheritAttrs: false,
	props: [
		"fallback",
		"placeholder",
		"placeholderTag",
		"fallbackTag"
	],
	setup(props, { slots, attrs }) {
		const mounted = shallowRef(false);
		const vm = getCurrentInstance();
		if (vm) vm._nuxtClientOnly = true;
		provide(clientOnlySymbol, true);
		return () => {
			if (mounted.value) {
				const vnodes = slots.default?.();
				if (vnodes && vnodes.length === 1 && true) return [cloneVNode(vnodes[0], attrs)];
				return vnodes;
			}
			const slot = slots.fallback || slots.placeholder;
			if (slot) return h(slot);
			const fallbackStr = props.fallback || props.placeholder || "";
			const fallbackTag = sanitizeTag(props.fallbackTag || props.placeholderTag, "span");
			return createElementBlock(fallbackTag, attrs, fallbackStr);
		};
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/diagnostics/data.js
/**
* E3xxx
* Data fetching (useFetch / useAsyncData) runtime diagnostics.
*/
var dataDiagnostics = /* #__PURE__ */ defineProdDiagnostics({
	docsBase,
	reporters: prodReporters
});
//#endregion
//#region node_modules/nuxt/dist/app/composables/asyncData.js
/** @internal */
function _createUseAsyncData(options = {}) {
	{
		function useAsyncData(...args) {
			const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
			if (_isAutoKeyNeeded(args[0], args[1])) args.unshift(autoKey);
			let [_key, _handler, opts = {}] = args;
			const key = isRef(_key) || typeof _key === "function" ? computed(() => toValue(_key)) : { value: _key };
			if (!key.value || typeof key.value !== "string") throw dataDiagnostics.NUXT_E3008();
			if (typeof _handler !== "function") throw dataDiagnostics.NUXT_E3009();
			const shouldFactoryOptionsOverride = typeof options === "function";
			const nuxtApp = useNuxtApp();
			const factoryOptions = shouldFactoryOptionsOverride ? options(opts) : options;
			if (!shouldFactoryOptionsOverride) for (const key in factoryOptions) {
				if (factoryOptions[key] === void 0) continue;
				if (opts[key] !== void 0) continue;
				opts[key] = factoryOptions[key];
			}
			opts.server ??= true;
			opts.default ??= getDefault;
			opts.getCachedData ??= getDefaultCachedData;
			opts.lazy ??= false;
			opts.immediate ??= true;
			opts.deep ??= asyncDataDefaults.deep;
			opts.dedupe ??= "cancel";
			opts.enabled ??= true;
			if (shouldFactoryOptionsOverride) for (const key in factoryOptions) {
				if (factoryOptions[key] === void 0) continue;
				opts[key] = factoryOptions[key];
			}
			nuxtApp._asyncData[key.value];
			function createInitialFetch() {
				const initialFetchOptions = {
					cause: "initial",
					dedupe: opts.dedupe
				};
				const existing = nuxtApp._asyncData[key.value];
				if (!existing?._init) {
					initialFetchOptions.cachedData = opts.getCachedData(key.value, nuxtApp, { cause: "initial" });
					nuxtApp._asyncData[key.value] = buildAsyncData(nuxtApp, key.value, _handler, opts, initialFetchOptions.cachedData);
					nuxtApp._asyncData[key.value]._initialCachedData = initialFetchOptions.cachedData;
				} else if (nuxtApp._asyncDataPromises[key.value]) initialFetchOptions.cachedData = existing._initialCachedData;
				return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
			}
			const initialFetch = createInitialFetch();
			const asyncData = nuxtApp._asyncData[key.value];
			asyncData._deps++;
			const fetchOnServer = opts.server !== false && nuxtApp.payload.serverRendered;
			const isWithinVaporComponent = () => {
				return false;
			};
			if (fetchOnServer && opts.immediate) {
				const promise = initialFetch();
				if (getCurrentInstance() || isWithinVaporComponent()) onServerPrefetch(() => promise);
				else nuxtApp.hook("app:created", async () => {
					await promise;
				});
			}
			const asyncReturn = {
				data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data, !opts.deep),
				pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
				status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
				error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
				refresh: (...args) => {
					if (!nuxtApp._asyncData[key.value]?._init) return createInitialFetch()();
					return nuxtApp._asyncData[key.value].execute(...args);
				},
				execute: (...args) => asyncReturn.refresh(...args),
				clear: () => {
					const entry = nuxtApp._asyncData[key.value];
					if (entry?._abortController) try {
						entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
					} finally {
						entry._abortController = void 0;
					}
					clearNuxtDataByKey(nuxtApp, key.value);
				}
			};
			const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
			Object.assign(asyncDataPromise, asyncReturn);
			Object.defineProperties(asyncDataPromise, {
				then: {
					enumerable: true,
					value: asyncDataPromise.then.bind(asyncDataPromise)
				},
				catch: {
					enumerable: true,
					value: asyncDataPromise.catch.bind(asyncDataPromise)
				},
				finally: {
					enumerable: true,
					value: asyncDataPromise.finally.bind(asyncDataPromise)
				}
			});
			return asyncDataPromise;
		}
		return useAsyncData;
	}
}
var useAsyncData = _createUseAsyncData();
function writableComputedRef(getter, shallow = false) {
	const forwardedRef = computed({
		get() {
			return getter()?.value;
		},
		set(value) {
			const ref = getter();
			if (ref) ref.value = value;
		}
	});
	if (shallow) forwardedRef.__v_isShallow = true;
	return forwardedRef;
}
/** @internal */
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
	if (typeof keyOrFetcher === "string") return false;
	if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) return false;
	if (typeof keyOrFetcher === "function" && typeof fetcher === "function") return false;
	return true;
}
/** @since 3.0.0 */
async function refreshNuxtData(keys) {
	return Promise.resolve();
}
function clearNuxtDataByKey(nuxtApp, key) {
	delete nuxtApp.payload.data[key];
	delete nuxtApp.payload._errors[key];
	if (nuxtApp._asyncData[key]) {
		nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
		nuxtApp._asyncData[key].error.value = void 0;
		nuxtApp._asyncData[key].status.value = "idle";
		nuxtApp._asyncData[key]._initialCachedData = void 0;
	}
	delete nuxtApp._asyncDataPromises[key];
}
function pick(obj, keys) {
	const newObj = {};
	for (const key of keys) newObj[key] = obj[key];
	return newObj;
}
function buildAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
	nuxtApp.payload._errors[key] ??= void 0;
	const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
	const handler = _handler ;
	const _ref = options.deep ? ref : shallowRef;
	const hasCachedData = initialCachedData !== void 0;
	const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
		if (!keys || keys.includes(key)) await asyncData.execute({ cause: "refresh:hook" });
	});
	const asyncData = {
		data: _ref(hasCachedData ? initialCachedData : options.default()),
		pending: computed(() => asyncData.status.value === "pending"),
		error: toRef(nuxtApp.payload._errors, key),
		status: shallowRef("idle"),
		execute: (...args) => {
			const [_opts, newValue = void 0] = args;
			const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
			if (nuxtApp._asyncDataPromises[key]) {
				if ((opts.dedupe ?? options.dedupe) === "defer") return nuxtApp._asyncDataPromises[key];
			}
			{
				const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
				if (cachedData !== void 0) {
					if (options.serialize !== false) nuxtApp.payload.data[key] = cachedData;
					asyncData.data.value = cachedData;
					asyncData.error.value = void 0;
					asyncData.status.value = "success";
					return Promise.resolve(cachedData);
				}
			}
			if (toValue(options.enabled) === false) return Promise.resolve(asyncData.data.value);
			if (asyncData._abortController) asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
			asyncData._abortController = new AbortController();
			asyncData.status.value = "pending";
			const cleanupController = new AbortController();
			const promise = new Promise((resolve, reject) => {
				try {
					const timeout = opts.timeout ?? options.timeout;
					const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
					if (mergedSignal.aborted) {
						const reason = mergedSignal.reason;
						reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
						return;
					}
					mergedSignal.addEventListener("abort", () => {
						const reason = mergedSignal.reason;
						reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
					}, {
						once: true,
						signal: cleanupController.signal
					});
					const ctx = { signal: mergedSignal };
					let run = () => Promise.resolve(handler(nuxtApp, ctx));
					if (options.middleware?.length) for (let i = options.middleware.length - 1; i >= 0; i--) {
						const middleware = options.middleware[i];
						const next = run;
						run = () => Promise.resolve(middleware(next, ctx));
					}
					return run().then(resolve, reject);
				} catch (err) {
					reject(err);
				}
			}).then(async (_result) => {
				if (nuxtApp._asyncDataPromises[key] !== promise) return;
				let result = _result;
				if (options.transform) result = await options.transform(_result);
				if (options.pick) result = pick(result, options.pick);
				if (options.serialize !== false) nuxtApp.payload.data[key] = result;
				asyncData.data.value = result;
				asyncData.error.value = void 0;
				asyncData.status.value = "success";
			}).catch((error) => {
				if (nuxtApp._asyncDataPromises[key] !== promise) return nuxtApp._asyncDataPromises[key];
				if (asyncData._abortController?.signal.aborted) return nuxtApp._asyncDataPromises[key];
				if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
					asyncData.status.value = "idle";
					return nuxtApp._asyncDataPromises[key];
				}
				asyncData.error.value = createError$1(error);
				asyncData.data.value = unref(options.default());
				asyncData.status.value = "error";
			}).finally(() => {
				cleanupController.abort();
				if (nuxtApp._asyncDataPromises[key] === promise) delete nuxtApp._asyncDataPromises[key];
			});
			nuxtApp._asyncDataPromises[key] = promise;
			return nuxtApp._asyncDataPromises[key];
		},
		_execute: debounceTick((...args) => asyncData.execute(...args)),
		_default: options.default,
		_deps: 0,
		_init: true,
		_hash: void 0,
		_off: () => {
			unsubRefreshAsyncData();
			if (nuxtApp._asyncData[key] !== asyncData) return;
			if (nuxtApp._asyncData[key]?._init) nuxtApp._asyncData[key]._init = false;
			if (nuxtApp._asyncDataPromises[key]) {
				asyncData._abortController?.abort(new DOMException("AsyncData request cancelled by unmount", "AbortError"));
				delete nuxtApp._asyncDataPromises[key];
				if (asyncData.status.value === "pending") asyncData.status.value = "idle";
			}
			if (!hasCustomGetCachedData) nextTick(() => {
				if (!nuxtApp._asyncData[key]?._init) {
					clearNuxtDataByKey(nuxtApp, key);
					asyncData.execute = () => Promise.resolve();
				}
			});
		}
	};
	return asyncData;
}
var getDefault = () => void 0;
var getDefaultCachedData = (key, nuxtApp, ctx) => {
	if (nuxtApp.isHydrating) return nuxtApp.payload.data[key];
	if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") return nuxtApp.static.data[key];
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
	const list = signals.filter((s) => !!s);
	if (typeof timeout === "number" && timeout >= 0) {
		const timeoutSignal = AbortSignal.timeout?.(timeout);
		if (timeoutSignal) list.push(timeoutSignal);
	}
	if (AbortSignal.any) return AbortSignal.any(list);
	const controller = new AbortController();
	for (const sig of list) if (sig.aborted) {
		const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
		try {
			controller.abort(reason);
		} catch {
			controller.abort();
		}
		return controller.signal;
	}
	const onAbort = () => {
		const reason = list.find((s) => s.aborted)?.reason ?? new DOMException("Aborted", "AbortError");
		try {
			controller.abort(reason);
		} catch {
			controller.abort();
		}
	};
	for (const sig of list) sig.addEventListener?.("abort", onAbort, {
		once: true,
		signal: cleanupSignal
	});
	return controller.signal;
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/state.js
var useStateKeyPrefix = "$s";
function useState(...args) {
	const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
	if (typeof args[0] !== "string") args.unshift(autoKey);
	const [_key, init] = args;
	if (!_key || typeof _key !== "string") throw stateDiagnostics.NUXT_E7009({ key: _key });
	if (init !== void 0 && typeof init !== "function") throw stateDiagnostics.NUXT_E7007({ type: typeof init });
	const key = useStateKeyPrefix + _key;
	const nuxtApp = useNuxtApp();
	const state = toRef(nuxtApp.payload.state, key);
	if (init) nuxtApp._state[key] ??= { _default: init };
	if (state.value === void 0 && init) {
		const initialValue = init();
		if (isRef(initialValue)) {
			nuxtApp.payload.state[key] = initialValue;
			return state;
		}
		state.value = initialValue;
	}
	return state;
}
/** @since 3.0.0 */
function useRequestEvent(nuxtApp) {
	nuxtApp ||= useNuxtApp();
	return nuxtApp.ssrContext?.event;
}
/** @since 3.8.0 */
function prerenderRoutes(path) {
	return;
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/cookie.js
function parseCookieValue(value) {
	if (value === "undefined") return;
	try {
		const parsed = JSON.parse(value);
		if (typeof parsed === "number" && String(parsed) !== value) return value;
		return parsed;
	} catch {
		return value;
	}
}
function resolveExpires(expires) {
	return typeof expires === "function" ? expires() : expires;
}
var CookieDefaults = {
	path: "/",
	watch: true,
	decode: (val) => val ? parseCookieValue(decodeURIComponent(val)) : val,
	encode: (val) => {
		if (typeof val !== "string" || val === "undefined") return encodeURIComponent(JSON.stringify(val));
		try {
			if (typeof JSON.parse(val) !== "string") return encodeURIComponent(JSON.stringify(val));
		} catch {}
		return encodeURIComponent(val);
	},
	refresh: false
};
function useCookie(name, _opts) {
	const opts = {
		...CookieDefaults,
		..._opts
	};
	opts.filter ??= (key) => key === name;
	const nuxtApp = useNuxtApp();
	const jar = readServerCookieJar(nuxtApp);
	const rawValue = opts.filter(name) ? jar[name] : void 0;
	const cookies = { [name]: rawValue === void 0 ? void 0 : opts.decode(rawValue) };
	let delay;
	if (opts.maxAge !== void 0) delay = opts.maxAge * 1e3;
	else if (opts.expires) {
		const expires = resolveExpires(opts.expires);
		if (expires) delay = expires.getTime() - Date.now();
	}
	const hasExpired = delay !== void 0 && delay <= 0;
	const cookie = cookieServerRef(name, klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.()), opts, nuxtApp);
	if (!opts.readonly && rawValue === void 0) {
		const initialValue = cookie.value;
		if (initialValue !== void 0 && initialValue !== null) updateServerCookieJar(nuxtApp, name, opts.encode(initialValue));
	}
	{
		const writeFinalCookieValue = () => {
			const valueIsSame = isEqual(cookie.value, cookies[name]);
			if (opts.readonly || valueIsSame && !opts.refresh) return;
			nuxtApp._cookiesChanged ||= {};
			if (valueIsSame && opts.refresh && !nuxtApp._cookiesChanged[name]) return;
			nuxtApp._cookies ||= {};
			if (name in nuxtApp._cookies) {
				if (isEqual(cookie.value, nuxtApp._cookies[name])) return;
			}
			nuxtApp._cookies[name] = cookie.value;
			const encoded = cookie.value === null || cookie.value === void 0 ? void 0 : opts.encode(cookie.value);
			writeServerCookie(useRequestEvent(nuxtApp), name, encoded, opts);
		};
		const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
		nuxtApp.hooks.hookOnce("app:error", () => {
			unhook();
			return writeFinalCookieValue();
		});
	}
	return cookie;
}
/**
* Cookie jar for the current request, seeded from the incoming `cookie` header.
*
* @see https://github.com/nuxt/nuxt/issues/22631
*/
function readServerCookieJar(nuxtApp) {
	const event = useRequestEvent(nuxtApp);
	const jar = nuxtApp._cookieJar ??= parse(getRequestHeader(event, "cookie") || "", { decode: identity });
	const setCookies = readResponseSetCookies(event);
	for (let i = nuxtApp._appliedSetCookies || 0; i < setCookies.length; i++) {
		const cookie = parseSetCookie(setCookies[i], { decode: false });
		if (!cookie) continue;
		if (cookie.maxAge !== void 0 && cookie.maxAge <= 0 || cookie.expires && cookie.expires.getTime() <= Date.now()) delete jar[cookie.name];
		else jar[cookie.name] = cookie.value;
	}
	nuxtApp._appliedSetCookies = setCookies.length;
	return jar;
}
function updateServerCookieJar(nuxtApp, name, value) {
	const jar = readServerCookieJar(nuxtApp);
	if (value === void 0) delete jar[name];
	else jar[name] = value;
}
function readResponseSetCookies(event) {
	return splitCookiesString(getResponseHeader(event, "set-cookie") ?? []);
}
var identity = (val) => val;
function toSerializeOptions(opts) {
	const { encode: _encode, decode: _decode, expires, ...rest } = opts;
	return {
		...rest,
		expires: resolveExpires(expires),
		encode: identity
	};
}
function writeServerCookie(event, name, value, opts = {}) {
	if (event) {
		const serializeOpts = toSerializeOptions(opts);
		if (value !== void 0) return setCookie(event, name, value, serializeOpts);
		if (getCookie(event, name) !== void 0 || responseSetsCookie(event, name)) return deleteCookie(event, name, serializeOpts);
	}
}
function responseSetsCookie(event, name) {
	for (const raw of readResponseSetCookies(event)) if (parseSetCookie(raw, { decode: false })?.name === name) return true;
	return false;
}
/**
* Custom ref that tracks explicit cookie writes on the server.
*
* This is required for the `refresh` option to ensure the cookie is
* re-written on SSR even when the value remains unchanged.
*/
function cookieServerRef(name, value, opts, nuxtApp) {
	const internalRef = ref(value);
	return customRef((track, trigger) => {
		return {
			get() {
				track();
				return internalRef.value;
			},
			set(newValue) {
				nuxtApp._cookiesChanged ||= {};
				nuxtApp._cookiesChanged[name] = true;
				if (!opts.readonly) updateServerCookieJar(nuxtApp, name, newValue === null || newValue === void 0 ? void 0 : opts.encode(newValue));
				internalRef.value = newValue;
				trigger();
			}
		};
	});
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/url.js
/** @since 3.5.0 */
function useRequestURL(opts) {
	return getRequestURL(useRequestEvent(), opts);
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/layout.js
function routeRulesMatcher(path) {
	return virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Froute_rules_default();
}
function resolveLayoutName(route, name) {
	return unref(name) ?? route?.meta.layout ?? routeRulesMatcher(route?.path ?? "/").appLayout ?? "default";
}
//#endregion
//#region node_modules/nuxt/dist/app/composables/loading-indicator.js
function createLoadingIndicator(opts = {}) {
	const { duration = 2e3, throttle = 200, hideDelay = 500, resetDelay = 400 } = opts;
	opts.estimatedProgress;
	const nuxtApp = useNuxtApp();
	const progress = shallowRef(0);
	const isLoading = shallowRef(false);
	const error = shallowRef(false);
	const start = (opts = {}) => {
		error.value = false;
		set(0, opts);
	};
	function set(at = 0, opts = {}) {
		if (nuxtApp.isHydrating) return;
		if (at >= 100) return finish({ force: opts.force });
		progress.value = at < 0 ? 0 : at;
		opts.force;
		isLoading.value = true;
	}
	function finish(opts = {}) {
		progress.value = 100;
		if (opts.error) error.value = true;
		if (opts.force) {
			progress.value = 0;
			isLoading.value = false;
		}
	}
	function clear() {}
	let _cleanup = () => {};
	return {
		_cleanup,
		progress: shallowReadonly(progress),
		isLoading: shallowReadonly(isLoading),
		error: shallowReadonly(error),
		start,
		set,
		finish,
		clear
	};
}
/**
* composable to handle the loading state of the page
* @since 3.9.0
*/
function useLoadingIndicator(opts = {}) {
	const nuxtApp = useNuxtApp();
	return nuxtApp._loadingIndicator ||= createLoadingIndicator(opts);
}
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-link.js
var firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
/* @__NO_SIDE_EFFECTS__ */
function defineNuxtLink(options) {
	const componentName = options.componentName || "NuxtLink";
	function isHashLinkWithoutHashMode(link) {
		return typeof link === "string" && link.startsWith("#");
	}
	function resolveTrailingSlashBehavior(to, resolve, trailingSlash) {
		const effectiveTrailingSlash = trailingSlash ?? options.trailingSlash;
		if (!to || effectiveTrailingSlash !== "append" && effectiveTrailingSlash !== "remove") return to;
		if (typeof to === "string") return applyTrailingSlashBehavior(to, effectiveTrailingSlash);
		const path = "path" in to && to.path !== void 0 ? to.path : resolve(to).path;
		return {
			...to,
			name: void 0,
			path: applyTrailingSlashBehavior(path, effectiveTrailingSlash)
		};
	}
	/**
	* The link state `<NuxtLink>` renders with. Kept separate from `useNuxtLink` so the component
	* does not resolve the `<RouterLink>` link state backing `route`/`isActive`/`isExactActive`,
	* which it never reads.
	*/
	function useLinkTarget(props) {
		const router = useRouter();
		const config = /* @__PURE__ */ useRuntimeConfig();
		const rootedHref = router.options?.history?.createHref ?? ((path) => joinURL(config.app.baseURL, path));
		const hasTarget = computed(() => !!unref(props.target) && unref(props.target) !== "_self");
		const isAbsoluteUrl = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			return typeof path === "string" && isAbsoluteHref(path);
		});
		const isExternal = computed(() => {
			if (unref(props.external)) return true;
			const path = unref(props.to) || unref(props.href) || "";
			if (typeof path === "object") return false;
			return path === "" || isAbsoluteUrl.value;
		});
		const to = computed(() => {
			const path = unref(props.to) || unref(props.href) || "";
			if (isExternal.value) return path;
			return resolveTrailingSlashBehavior(path, router.resolve, unref(props.trailingSlash));
		});
		const href = computed(() => {
			const effectiveTrailingSlash = unref(props.trailingSlash) ?? options.trailingSlash;
			if (!to.value || isAbsoluteUrl.value || isHashLinkWithoutHashMode(to.value)) {
				const raw = to.value;
				return typeof raw === "string" ? sanitizeAnchorHref(raw) : raw;
			}
			if (isExternal.value) {
				const path = typeof to.value === "object" && "path" in to.value ? resolveRouteObject(to.value) : to.value;
				const href = typeof path === "object" ? router.resolve(path).href : path;
				const safe = typeof href === "string" ? sanitizeAnchorHref(href) : href;
				return safe === null ? null : applyTrailingSlashBehavior(safe, effectiveTrailingSlash);
			}
			if (typeof to.value === "object") return router.resolve(to.value)?.href ?? null;
			return applyTrailingSlashBehavior(isRootedPath(to.value) ? rootedHref(to.value) : router.resolve(to.value).href, effectiveTrailingSlash);
		});
		return {
			to,
			hasTarget,
			isAbsoluteUrl,
			isExternal,
			href,
			async navigate(_e) {
				if (href.value === null) return;
				await navigateTo(href.value, {
					replace: unref(props.replace),
					external: isExternal.value || hasTarget.value
				});
			}
		};
	}
	function useNuxtLink(props) {
		const router = useRouter();
		const target = useLinkTarget(props);
		const builtinRouterLink = resolveComponent("RouterLink");
		const useBuiltinLink = builtinRouterLink && typeof builtinRouterLink !== "string" ? builtinRouterLink.useLink : void 0;
		const link = target.isExternal.value ? void 0 : useBuiltinLink?.({
			...props,
			to: target.to,
			viewTransition: unref(props.viewTransition)
		});
		return {
			...target,
			isActive: link?.isActive ?? computed(() => target.to.value === router.currentRoute.value.path),
			isExactActive: link?.isExactActive ?? computed(() => target.to.value === router.currentRoute.value.path),
			route: link?.route ?? computed(() => router.resolve(target.to.value))
		};
	}
	/**
	* Render an internal link as a plain anchor, matching the markup `<RouterLink>` produces
	* for the same location.
	*/
	function renderStaticInternalLink(props, slots, router, rawTo) {
		const route = router.resolve(resolveTrailingSlashBehavior(rawTo, router.resolve, props.trailingSlash));
		const currentRoute = router.currentRoute.value;
		const index = activeRecordIndex(route, currentRoute);
		const isActive = index > -1 && includesParams(currentRoute.params, route.params);
		const isExactActive = index > -1 && index === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.params);
		let dataInternal;
		const routerOptions = router.options;
		const href = sanitizeAnchorHref(route.href);
		return h("a", {
			"aria-current": isExactActive ? props.ariaCurrentValue ?? "page" : null,
			href,
			"class": {
				[getLinkClass(props.activeClass || options.activeClass, routerOptions.linkActiveClass, "router-link-active")]: isActive,
				[getLinkClass(props.exactActiveClass || options.exactActiveClass, routerOptions.linkExactActiveClass, "router-link-exact-active")]: isExactActive
			},
			"rel": props.rel || void 0,
			"data-internal": dataInternal
		}, slots.default?.({
			route,
			href,
			isActive,
			isExactActive,
			navigate: () => navigateTo(route.href, { replace: props.replace })
		}));
	}
	return defineComponent({
		name: componentName,
		props: {
			to: {
				type: [String, Object],
				required: false
			},
			href: {
				type: [String, Object],
				required: false
			},
			target: {
				type: String,
				required: false
			},
			rel: {
				type: String,
				required: false
			},
			noRel: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			prefetchOn: {
				type: [String, Object],
				required: false
			},
			noPrefetch: {
				type: Boolean,
				default: void 0,
				required: false
			},
			activeClass: {
				type: String,
				required: false
			},
			exactActiveClass: {
				type: String,
				required: false
			},
			prefetchedClass: {
				type: String,
				required: false
			},
			replace: {
				type: Boolean,
				default: void 0,
				required: false
			},
			ariaCurrentValue: {
				type: String,
				required: false
			},
			external: {
				type: Boolean,
				default: void 0,
				required: false
			},
			custom: {
				type: Boolean,
				default: void 0,
				required: false
			},
			trailingSlash: {
				type: String,
				required: false
			}
		},
		useLink: useNuxtLink,
		setup(props, { slots }) {
			const router = useRouter();
			if (!props.custom) {
				const rawTo = props.to || props.href || "";
				if (!(props.external || typeof rawTo === "string" && (rawTo === "" || isAbsoluteHref(rawTo))) && !isHashLinkWithoutHashMode(rawTo) && (!props.target || props.target === "_self")) return () => renderStaticInternalLink(props, slots, router, rawTo);
			}
			const routerLinkComponent = resolveComponent("RouterLink");
			const { to, href, navigate, isExternal, hasTarget, isAbsoluteUrl } = useLinkTarget(props);
			const prefetched = shallowRef(false);
			const el = void 0;
			const elRef = void 0;
			function shouldPrefetch(mode) {
				return false;
			}
			async function prefetch(nuxtApp = useNuxtApp()) {}
			return () => {
				const target = props.target || null;
				const rel = firstNonUndefined(props.noRel ? "" : props.rel, options.externalRelAttribute, isAbsoluteUrl.value || hasTarget.value ? "noopener noreferrer" : "") || null;
				const getCustomSlotProps = (routerLinkSlotProps) => ({
					navigate,
					get route() {
						if (!href.value) return;
						const url = new URL(href.value, "http://localhost");
						return {
							path: url.pathname,
							fullPath: url.pathname,
							get query() {
								return parseQuery(url.search);
							},
							hash: url.hash,
							params: {},
							name: void 0,
							matched: [],
							redirectedFrom: void 0,
							meta: {},
							href: href.value
						};
					},
					rel,
					target,
					isExternal: isExternal.value || hasTarget.value,
					isActive: false,
					isExactActive: false,
					...routerLinkSlotProps,
					href: typeof routerLinkSlotProps?.href === "string" ? sanitizeAnchorHref(routerLinkSlotProps.href) : href.value,
					prefetch,
					prefetched: prefetched.value,
					shouldPrefetch
				});
				if (!isExternal.value && !hasTarget.value && !isHashLinkWithoutHashMode(to.value)) {
					const routerLinkProps = {
						ref: elRef,
						to: to.value,
						activeClass: props.activeClass || options.activeClass,
						exactActiveClass: props.exactActiveClass || options.exactActiveClass,
						replace: props.replace,
						ariaCurrentValue: props.ariaCurrentValue,
						custom: props.custom
					};
					if (!props.custom) routerLinkProps.rel = props.rel || void 0;
					return h(routerLinkComponent, routerLinkProps, props.custom && slots.default ? { default: (slotProps) => slots.default(getCustomSlotProps(slotProps)) } : slots.default);
				}
				if (props.custom) {
					if (!slots.default) return null;
					return slots.default(getCustomSlotProps());
				}
				return h("a", {
					ref: el,
					href: href.value || null,
					rel,
					target,
					onClick: async (event) => {
						if (isExternal.value || hasTarget.value) return;
						event.preventDefault();
						try {
							const encodedHref = encodeRoutePath(href.value ?? "");
							return await (props.replace ? router.replace(encodedHref) : router.push(encodedHref));
						} finally {}
					}
				}, slots.default?.());
			};
		}
	});
}
var NuxtLink = /* @__PURE__ */ defineNuxtLink(nuxtLinkDefaults);
function isSameRouteRecord(a, b) {
	return (a.aliasOf || a) === (b.aliasOf || b);
}
function getOriginalPath(record) {
	return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
function isEquivalentArray(a, b) {
	return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function isSameParamValue(a, b) {
	return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : (a && a.valueOf()) === (b && b.valueOf());
}
function isSameRouteLocationParams(a, b) {
	if (Object.keys(a).length !== Object.keys(b).length) return false;
	for (const key in a) if (!isSameParamValue(a[key], b[key])) return false;
	return true;
}
function includesParams(outer, inner) {
	for (const key in inner) {
		const innerValue = inner[key];
		const outerValue = outer[key];
		if (typeof innerValue === "string") {
			if (innerValue !== outerValue) return false;
		} else if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value.valueOf() !== outerValue[i].valueOf())) return false;
	}
	return true;
}
function activeRecordIndex(route, currentRoute) {
	const { matched } = route;
	const { length } = matched;
	const routeMatched = matched[length - 1];
	const currentMatched = currentRoute.matched;
	if (!routeMatched || !currentMatched.length) return -1;
	const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
	if (index > -1) return index;
	const parentRecordPath = getOriginalPath(matched[length - 2]);
	return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
}
/** Resolve an active-link class, falling back from the per-link value to the router-wide one. */
function getLinkClass(propClass, globalClass, defaultClass) {
	return propClass ?? globalClass ?? defaultClass;
}
function applyTrailingSlashBehavior(to, trailingSlash) {
	if (trailingSlash !== "append" && trailingSlash !== "remove") return to;
	const normalizeFn = trailingSlash === "append" ? withTrailingSlash : withoutTrailingSlash;
	if (hasProtocol(to) && !to.startsWith("http")) return to;
	return normalizeFn(to, true);
}
//#endregion
//#region node_modules/@pinia/nuxt/dist/runtime/plugin.vue3.js
var plugin = /* @__PURE__ */ defineNuxtPlugin({
	name: "pinia",
	setup(nuxtApp) {
		const pinia = createPinia();
		nuxtApp.vueApp.use(pinia);
		setActivePinia(pinia);
		if (nuxtApp.payload && nuxtApp.payload.pinia) pinia.state.value = nuxtApp.payload.pinia;
		return { provide: { pinia } };
	},
	hooks: { "app:rendered"() {
		const nuxtApp = useNuxtApp();
		nuxtApp.payload.pinia = toRaw(nuxtApp.$pinia).state.value;
		setActivePinia(void 0);
	} }
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fcomponents.plugin.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default = /* @__PURE__ */ defineNuxtPlugin({ name: "nuxt:global-components" });
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fi18n-options.mjs
var localeCodes = ["en", "fr"];
var localeLoaders = {
	en: [{
		key: "locale_en_46js_5659d75f",
		load: () => Promise.resolve({}),
		cache: true
	}],
	fr: [{
		key: "locale_fr_46js_7ab74178",
		load: () => Promise.resolve({}),
		cache: true
	}]
};
var vueI18nConfigs = [];
var normalizedLocales = [{
	name: "English",
	code: "en",
	language: "en-CA",
	domains: [],
	defaultForDomains: []
}, {
	name: "Francais",
	code: "fr",
	language: "fr-CA",
	domains: [],
	defaultForDomains: []
}];
//#endregion
//#region node_modules/@intlify/shared/dist/shared.mjs
/*!
* shared v11.4.13
* (c) 2026 kazuya kawaguchi
* Released under the MIT License.
*/
var makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
var generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({
	l: locale,
	k: key,
	s: source
});
var friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
var isNumber = (val) => typeof val === "number" && isFinite(val);
var isDate = (val) => toTypeString(val) === "[object Date]";
var isRegExp = (val) => toTypeString(val) === "[object RegExp]";
var isEmptyObject = (val) => isPlainObject$1(val) && Object.keys(val).length === 0;
var assign = Object.assign;
var _create = Object.create;
var create = (obj = null) => _create(obj);
var _globalThis;
var getGlobalThis = () => {
	return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : create());
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn$1(obj, key) {
	return hasOwnProperty.call(obj, key);
}
/**
* Useful Utilities By Evan you
* Modified by kazuya kawaguchi
* MIT License
* https://github.com/vuejs/vue-next/blob/master/packages/shared/src/index.ts
* https://github.com/vuejs/vue-next/blob/master/packages/shared/src/codeframe.ts
*/
var isArray = Array.isArray;
var isFunction = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isBoolean = (val) => typeof val === "boolean";
var isObject = (val) => val !== null && typeof val === "object";
var isPromise = (val) => {
	return isObject(val) && isFunction(val.then) && isFunction(val.catch);
};
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
var toDisplayString$1 = (val) => {
	return val == null ? "" : isArray(val) || isPlainObject$1(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join(items, separator = "") {
	return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
}
function warn(msg, err) {
	if (typeof console !== "undefined") {
		console.warn(`[intlify] ` + msg);
		/* istanbul ignore if */
		if (err) console.warn(err.stack);
	}
}
function escapeHtml(rawText) {
	return rawText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/\//g, "&#x2F;").replace(/=/g, "&#x3D;");
}
function escapeAttributeValue(value) {
	return value.replace(/&(?![a-z0-9#]{2,6};)/gi, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
var javascriptSchemePattern = /^javascript:/i;
var urlAttributePattern = /^(?:href|src|action|formaction)$/i;
var numericCharacterReferencePattern = /&#(?:x([0-9a-f]+)|(\d+));?/gi;
var namedWhitespaceCharacterReferencePattern = /&(?:Tab|NewLine);/g;
var colonCharacterReferencePattern = /&colon;?/gi;
var controlOrWhitespacePattern = /[\u0000-\u0020\u007f-\u009f]/g;
var eventHandlerPattern = /(?:^|[\s"'<>/])on\w+\s*=\s*["']?[^"'>]+["']?/i;
var eventHandlerAttributePattern = /(^|[\s"'<>/])on(\w+\s*=)/gi;
var unquotedUrlAttributePattern = /(^|[\s"'<>/])((?:href|src|action|formaction)\s*=\s*)([^\s"'=<>`]+)/gi;
function decodeNumericCharacterReference(match, hex, decimal) {
	const digits = hex || decimal;
	if (!digits) return match;
	const codePoint = Number.parseInt(digits, hex ? 16 : 10);
	return codePoint <= 127 ? String.fromCharCode(codePoint) : match;
}
function hasJavascriptScheme(value) {
	const normalized = value.replace(numericCharacterReferencePattern, decodeNumericCharacterReference).replace(namedWhitespaceCharacterReferencePattern, "").replace(colonCharacterReferencePattern, ":").replace(controlOrWhitespacePattern, "");
	return javascriptSchemePattern.test(normalized);
}
function sanitizeStyleValue(value) {
	const urlPattern = /url\s*\(/gi;
	let sanitized = "";
	let cursor = 0;
	let match;
	while ((match = urlPattern.exec(value)) !== null) {
		const urlStart = match.index;
		const openParenIndex = urlPattern.lastIndex - 1;
		let index = openParenIndex + 1;
		let depth = 1;
		let quote = null;
		for (; index < value.length; index++) {
			const char = value[index];
			if (quote) {
				if (char === quote) quote = null;
				continue;
			}
			if (char === "\"" || char === "'") quote = char;
			else if (char === "(") depth++;
			else if (char === ")") {
				depth--;
				if (depth === 0) break;
			}
		}
		if (depth !== 0) break;
		const rawUrlValue = value.slice(openParenIndex + 1, index).trim();
		const unquotedUrlValue = rawUrlValue.startsWith("\"") && rawUrlValue.endsWith("\"") || rawUrlValue.startsWith("'") && rawUrlValue.endsWith("'") ? rawUrlValue.slice(1, -1).trim() : rawUrlValue;
		sanitized += value.slice(cursor, urlStart);
		sanitized += hasJavascriptScheme(unquotedUrlValue) ? "url(about:blank)" : value.slice(urlStart, index + 1);
		cursor = index + 1;
	}
	return sanitized + value.slice(cursor);
}
function sanitizeAttributeValue(attrName, value) {
	if (urlAttributePattern.test(attrName) && hasJavascriptScheme(value)) return "about:blank";
	return escapeAttributeValue(attrName.toLowerCase() === "style" ? sanitizeStyleValue(value) : value);
}
function sanitizeTranslatedHtml(html) {
	html = html.replace(/([\w:-]+)\s*=\s*"([^"]*)"/g, (_, attrName, attrValue) => `${attrName}="${sanitizeAttributeValue(attrName, attrValue)}"`);
	html = html.replace(/([\w:-]+)\s*=\s*'([^']*)'/g, (_, attrName, attrValue) => `${attrName}='${sanitizeAttributeValue(attrName, attrValue)}'`);
	if (eventHandlerPattern.test(html)) html = html.replace(eventHandlerAttributePattern, "$1&#111;n$2");
	html = html.replace(unquotedUrlAttributePattern, (match, boundary, prefix, attrValue) => hasJavascriptScheme(attrValue) ? `${boundary}${prefix}about:blank` : match);
	return html;
}
var isNotObjectOrIsArray = (val) => !isObject(val) || isArray(val);
function deepCopy(src, des) {
	if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) throw new Error("Invalid value");
	const stack = [{
		src,
		des
	}];
	while (stack.length) {
		const { src, des } = stack.pop();
		Object.keys(src).forEach((key) => {
			if (key === "__proto__") return;
			const value = src[key];
			if (isArray(value)) {
				const copied = [];
				copied.length = value.length;
				des[key] = copied;
				stack.push({
					src: value,
					des: copied
				});
			} else if (isObject(value)) {
				if (!isObject(des[key]) || isArray(des[key])) des[key] = create();
				stack.push({
					src: value,
					des: des[key]
				});
			} else des[key] = value;
		});
	}
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/shared/messages.js
var cacheMessages = /* @__PURE__ */ new Map();
function cloneDeep(value) {
	if (value == null || typeof value !== "object") return value;
	if (Array.isArray(value)) return value.map(cloneDeep);
	const out = create(null);
	for (const key of Object.keys(value)) out[key] = cloneDeep(value[key]);
	return out;
}
var isTree = (value) => value != null && typeof value === "object" && !Array.isArray(value);
function fillMissing(over, base) {
	return isTree(over) && isTree(base) ? fillTree(over, base) : over;
}
function fillTree(over, base) {
	let out = over;
	for (const key of Object.keys(base)) {
		const has = Object.hasOwn(over, key);
		const current = over[key];
		const filled = !has ? base[key] : isTree(current) && isTree(base[key]) ? fillTree(current, base[key]) : current;
		if (has && filled === current) continue;
		if (out === over) out = assign(create(null), over);
		out[key] = filled;
	}
	return out;
}
var merger = createDefu((obj, key, value) => {
	if (key === "messages" || key === "datetimeFormats" || key === "numberFormats") {
		obj[key] ??= create(null);
		deepCopy(value, obj[key]);
		return true;
	}
});
async function loadVueI18nOptions(vueI18nConfigs) {
	const nuxtApp = useNuxtApp();
	let vueI18nOptions = { messages: create(null) };
	for (const configFile of vueI18nConfigs) {
		const resolver = await configFile().then((x) => isModule(x) ? x.default : x);
		const resolved = isFunction(resolver) ? await nuxtApp.runWithContext(() => resolver()) : resolver;
		vueI18nOptions = merger(create(null), resolved, vueI18nOptions);
	}
	vueI18nOptions.fallbackLocale ??= false;
	return vueI18nOptions;
}
var isModule = (val) => toTypeString(val) === "[object Module]";
async function getLocaleMessages$1(locale, loader) {
	const nuxtApp = useNuxtApp();
	try {
		const getter = await nuxtApp.runWithContext(loader.load).then((x) => isModule(x) ? x.default : x);
		return isFunction(getter) ? await nuxtApp.runWithContext(() => getter(locale)) : getter;
	} catch (e) {
		throw new Error(`Failed loading locale (${locale}): ` + e.message, { cause: e });
	}
}
async function getLocaleMessagesMergedCached(locale, loaders = []) {
	const nuxtApp = useNuxtApp();
	const messages = await Promise.all(loaders.map(async (loader) => {
		const cached = getCachedMessages(loader);
		const messages2 = cached || await nuxtApp.runWithContext(() => getLocaleMessages$1(locale, loader));
		if (!cached && loader.cache !== false) cacheMessages.set(loader.key, {
			ttl: Date.now() + 864e5,
			value: messages2
		});
		return messages2;
	}));
	const merged = {};
	for (const message of messages) deepCopy(message, merged);
	return merged;
}
function getCachedMessages(loader) {
	if (loader.cache === false) return;
	const cache = cacheMessages.get(loader.key);
	if (cache == null) return;
	return cache.ttl > Date.now() ? cache.value : void 0;
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/shared/delivery.js
function createPrerenderablePredicate(config) {
	return (locale) => !config.dynamic.includes(locale) && !config.undeliverable.includes(locale);
}
function createRuntimeLoaderPredicate(config) {
	return (locale) => config.undeliverable.includes(locale) || config.dynamic.includes(locale) && (config.ssg);
}
//#endregion
//#region node_modules/@intlify/utils/dist/shared/utils.9f8159f5.mjs
function parseAcceptLanguage(value) {
	return value.split(",").map((tag) => tag.split(";")[0]).filter((tag) => !(tag === "*" || tag === ""));
}
function createPathIndexLanguageParser(index = 0) {
	return (path) => {
		const parts = (typeof path === "string" ? path : path.pathname).split("?")[0].split("/");
		if (parts[0] === "") parts.shift();
		return parts.length > index ? parts[index] || "" : "";
	};
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/kit/routing.js
var separator = "___";
var defaultRouteNameSuffix = "___default";
function normalizeRouteName(routeName) {
	if (typeof routeName === "string") return routeName;
	if (routeName != null) return routeName.toString();
	return "";
}
function getRouteBaseName(route) {
	return normalizeRouteName(typeof route === "object" ? route?.name : route).split(separator)[0];
}
function getLocalizedRouteName(routeName, locale, isDefault) {
	return !isDefault ? routeName + separator + locale : routeName + separator + locale + defaultRouteNameSuffix;
}
var createTrailingSlashFormatter = (trailingSlash) => trailingSlash ? withTrailingSlash : withoutTrailingSlash;
function prefixable(currentLocale, defaultLocale, options) {
	return options.routing && (currentLocale !== defaultLocale || options.strategy === "prefix");
}
var pathLanguageParser = createPathIndexLanguageParser(0);
var getLocaleFromRoutePath = (path) => pathLanguageParser(path);
var getLocaleFromRouteName = (name) => name.split(separator).at(1) ?? "";
function normalizeInput(input) {
	return typeof input !== "object" ? String(input) : String(input?.name || input?.path || "");
}
function getLocaleFromRoute(route) {
	const input = normalizeInput(route);
	if (input[0] === "/") return getLocaleFromRoutePath(input);
	const fromName = getLocaleFromRouteName(input);
	if (fromName) return fromName;
	if (typeof route === "object" && route?.path) return getLocaleFromRoutePath(String(route.path));
	return "";
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/routing/utils.js
function createLocaleRouteNameGetter(hasRoute, config) {
	if (!config.routing && !config.domains) return (routeName) => normalizeRouteName(routeName);
	return (name, locale) => {
		const normalized = normalizeRouteName(name);
		const suffixed = getLocalizedRouteName(normalized, locale, true);
		return hasRoute(suffixed) ? suffixed : getLocalizedRouteName(normalized, locale, false);
	};
}
function createLocalizedRouteByPathResolver(router, config) {
	if (!config.routing) return (route) => route;
	if (config.strategy === "prefix") return (route, locale) => {
		const targetPath = "/" + locale + (route.path === "/" ? "" : route.path);
		const _route = router.options.routes.find((r) => r.path === targetPath);
		if (_route != null) return router.resolve(assign({}, route, _route, { path: targetPath }));
		return route;
	};
	return (route) => router.resolve(route);
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/shared/domain.js
var normalizeDomain = (domain = "") => domain.replace(/^https?:\/\//i, "").toLowerCase();
function isLocaleOnHost(locale, host) {
	return !!locale?.domains.some((x) => normalizeDomain(x) === host);
}
function resolveLocaleReach(locales, host, locale) {
	const target = locales.find((l) => l.code === locale);
	if (!target?.domains.length || isLocaleOnHost(target, host)) return "here";
	return locales.some((l) => isLocaleOnHost(l, host)) ? "other-domain" : "off-host";
}
function isLocaleServedOnHost(locales, host, locale) {
	return resolveLocaleReach(locales, host, locale) !== "other-domain";
}
var canonicalDomain = (target) => target?.defaultForDomains[0] || target?.domain || target?.domains[0];
function relocateHostForLocale(host, locale, locales) {
	if (isLocaleServedOnHost(locales, host, locale)) return;
	return canonicalDomain(locales.find((l) => l.code === locale));
}
function matchDomainLocale(locales, host, pathLocale) {
	const matches = locales.filter((locale) => isLocaleOnHost(locale, host));
	return (matches.find((l) => l.code === pathLocale) || matches.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host)) || matches[0])?.code;
}
function cookieSpansDomains(locales, cookieDomain) {
	const scope = cookieDomain.replace(/^\./, "").replace(/:\d+$/, "").toLowerCase();
	return locales.every((l) => l.domains.concat(l.domain || []).every((domain) => {
		const host = normalizeDomain(domain).replace(/:\d+$/, "");
		return host === scope || host.endsWith("." + scope);
	}));
}
var withProtocol = (domain, url) => hasProtocol(domain, { strict: true }) ? domain : url.protocol + "//" + domain;
function domainFromLocale(domainLocales, url, locale, locales = normalizedLocales) {
	const lang = locales.find((x) => x.code === locale);
	const domain = domainLocales?.[locale]?.domain || lang?.domain || lang?.domains.find((v) => normalizeDomain(v) === url.host) || relocateHostForLocale(url.host, locale, locales);
	if (!domain) return;
	return withProtocol(domain, url);
}
function withRuntimeDomain(locale, domainLocales) {
	if (typeof locale === "string") return locale;
	const properties = locale;
	const domain = domainLocales[properties.code]?.domain;
	if (!domain || domain === properties.domain) return locale;
	return {
		...properties,
		domain,
		domains: [domain],
		defaultForDomains: properties.defaultForDomains.length ? [domain] : []
	};
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/shared/locales.js
function getDefaultLocaleForDomain(host, locales = normalizedLocales) {
	return locales.find((l) => l.defaultForDomains.some((domain) => normalizeDomain(domain) === host))?.code;
}
function resolveDefaultLocale(host, defaultLocale, locales = normalizedLocales) {
	const resolved = getDefaultLocaleForDomain(host, locales) || defaultLocale;
	if (resolved) return resolved;
	return (locales.some((l) => l.domains.length) ? locales[0]?.code : "") || "";
}
var isSupportedLocale = (locale) => localeCodes.includes(locale || "");
var resolveSupportedLocale = (locale) => isSupportedLocale(locale) ? locale : void 0;
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/routing/context.js
var isRouteLocationPathRaw = (val) => !!val.path && !val.name;
function createRoutingContext(options) {
	const { router, defaultLocale, strictSeo, compactRoutes } = options;
	const config = {
		strategy: options.strategy,
		routing: options.routing,
		domains: options.domains
	};
	const formatTrailingSlash = createTrailingSlashFormatter(options.trailingSlash);
	const getLocalizedRouteName = createLocaleRouteNameGetter((name) => router.hasRoute(name), config);
	function resolveLocalizedRouteByName(route, locale) {
		route.name = getRouteBaseName(route.name || router.currentRoute.value);
		const localizedName = getLocalizedRouteName(route.name, locale);
		if (router.hasRoute(localizedName)) {
			route.name = localizedName;
			if (compactRoutes && route.params) delete route.params.locale;
		} else if (compactRoutes && isSupportedLocale(locale) && getCompactRouteNames().has(route.name)) {
			route.params = {
				...route.params || {},
				locale
			};
			return route;
		}
		route.name = localizedName;
		return route;
	}
	const routeByPathResolver = createLocalizedRouteByPathResolver(router, config);
	let compactRouteRecords;
	function getCompactRouteNames() {
		if (compactRouteRecords) return compactRouteRecords;
		compactRouteRecords = /* @__PURE__ */ new Set();
		if (compactRoutes) {
			for (const r of router.getRoutes()) if (r.name != null && /^\/:locale\(/.test(r.path)) compactRouteRecords.add(String(r.name));
		}
		return compactRouteRecords;
	}
	function resolveLocalizedRouteByPath(input, locale) {
		const route = routeByPathResolver(input, locale);
		const baseName = getRouteBaseName(route);
		if (baseName) {
			const localizedName = getLocalizedRouteName(baseName, locale);
			if (router.hasRoute(localizedName)) {
				route.name = localizedName;
				const named = route;
				if (compactRoutes && named.params) delete named.params.locale;
				return route;
			}
			if (compactRoutes && getCompactRouteNames().has(baseName)) {
				const compacted = route;
				compacted.name = baseName;
				compacted.params = {
					...compacted.params || {},
					locale
				};
				return compacted;
			}
			route.name = localizedName;
			return route;
		}
		if (prefixable(locale, defaultLocale, config)) route.path = "/" + locale + route.path;
		route.path = formatTrailingSlash(route.path, true);
		return route;
	}
	const getRouteLocalizedParams = () => router.currentRoute.value.meta["nuxtI18nInternal"] ?? {};
	const missesLocalizedParams = (locale, params = getRouteLocalizedParams()) => strictSeo && !!locale && Object.keys(params).length > 0 && !params[locale];
	const stripsDefaultPrefix = config.strategy === "prefix_except_default" || config.strategy === "prefix_and_default";
	const unprefixesLocale = (domain, locale, locales) => !!domain && resolveDefaultLocale(normalizeDomain(domain), options.configuredDefaultLocale, locales) === locale;
	const toDomainUrl = (getBase) => (path, locale, target, locales) => {
		const base = getBase(locale);
		if (!base) return path;
		if (stripsDefaultPrefix && unprefixesLocale(canonicalDomain(target), locale, locales) && getLocaleFromRoutePath(path) === locale) path = path.slice(locale.length + 1) || "/";
		return joinURL(base, path);
	};
	const toServingUrl = toDomainUrl(options.getBaseUrl);
	const toCanonicalUrl = toDomainUrl(options.getCanonicalBaseUrl);
	return {
		router,
		getLocale: options.getLocale,
		getLocales: options.getLocales,
		getBaseUrl: options.getBaseUrl,
		getRouteBaseName,
		getRouteLocalizedParams,
		getLocalizedDynamicParams: (locale) => {
			const payload = options.getLocalePathPayload?.();
			if (payload) return payload[locale] || {};
			return getRouteLocalizedParams()?.[locale];
		},
		afterSwitchLocalePath: (path, locale) => {
			if (missesLocalizedParams(locale)) return "";
			if (!config.domains) return path;
			const host = options.getHost() ?? "";
			const locales = options.getLocales();
			const target = locales.find((l) => l.code === locale);
			if (isLocaleOnHost(target, host)) return path;
			if (!path) return path;
			return toServingUrl(path, locale, target, locales);
		},
		getAlternatePath: (path, locale) => {
			if (locale !== options.getLocale() && missesLocalizedParams(locale)) return "";
			if (!config.domains || !path) return path;
			const locales = options.getLocales();
			return toCanonicalUrl(path, locale, locales.find((l) => l.code === locale), locales);
		},
		resolveLocalizedRouteObject: (route, locale) => {
			return isRouteLocationPathRaw(route) ? resolveLocalizedRouteByPath(route, locale) : resolveLocalizedRouteByName(route, locale);
		}
	};
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/composable-context.js
function useComposableContext(nuxtApp) {
	const context = nuxtApp?._nuxtI18n?.composableCtx;
	if (!context) throw new Error("i18n context is not initialized. Ensure the i18n plugin is installed and the composable is used within a Vue component or setup function.");
	return context;
}
function createComposableContext(ctx, nuxtApp = useNuxtApp()) {
	const localePathPayload = getLocalePathPayload(nuxtApp);
	return {
		...createRoutingContext({
			router: useRouter(),
			defaultLocale: ctx.getDefaultLocale(),
			configuredDefaultLocale: ctx.config.defaultLocale || "",
			getLocale: ctx.getLocale,
			getLocales: ctx.getLocales,
			getBaseUrl: ctx.getBaseUrl,
			getCanonicalBaseUrl: ctx.getCanonicalBaseUrl,
			getHost: () => useRequestURL({ xForwardedHost: true }).host,
			getLocalePathPayload: () => false,
			strategy: "prefix_except_default",
			routing: true,
			domains: false,
			trailingSlash: false,
			strictSeo: false,
			compactRoutes: false
		}),
		strictSeo: false,
		_head: void 0,
		get head() {
			this._head ??= useHead({});
			return this._head;
		},
		metaState: {
			htmlAttrs: {},
			meta: [],
			link: []
		},
		seoSettings: {
			dir: false,
			lang: false,
			seo: typeof ctx.config.experimental.strictSeo === "object" && ctx.config.experimental.strictSeo || false
		},
		localePathPayload,
		routingOptions: {
			defaultLocale: ctx.config.defaultLocale || "",
			domains: false,
			strictCanonicals: ctx.config.experimental.alternateLinkCanonicalQueries ?? true,
			hreflangLinks: true
		}
	};
}
function getLocalePathPayload(nuxtApp = useNuxtApp()) {
	return JSON.parse("{}");
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/compatibility.js
function getI18nTarget(i18n) {
	return i18n != null && "global" in i18n && "mode" in i18n ? i18n.global : i18n;
}
function getComposer$2(i18n) {
	const target = getI18nTarget(i18n);
	return "__composer" in target ? target.__composer : target;
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/shared/utils.js
function useRuntimeI18n(nuxtApp, event) {
	if (!nuxtApp) return (/* @__PURE__ */ useRuntimeConfig()).public.i18n;
	return nuxtApp.$config.public.i18n;
}
function useI18nDetection(nuxtApp) {
	const detectBrowserLanguage = useRuntimeI18n(nuxtApp).detectBrowserLanguage;
	const detect = detectBrowserLanguage || {};
	return {
		...detect,
		enabled: !!detectBrowserLanguage,
		cookieKey: detect.cookieKey || "i18n_redirected"
	};
}
function resolveRootRedirect(config) {
	if (!config) return;
	return {
		path: "/" + (isString(config) ? config : config.path).replace(/^\//, ""),
		code: !isString(config) && config.statusCode || 302
	};
}
var HTML_ESCAPES = {
	"&": "&amp;",
	"\"": "&quot;",
	"'": "&#39;",
	"<": "&lt;",
	">": "&gt;"
};
function escapeHtmlAttr(value) {
	return value.replace(/["'&<>]/g, (c) => HTML_ESCAPES[c]);
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/context.js
var useLocaleConfigs = () => useState("i18n:cached-locale-configs", () => void 0);
var useResolvedLocale = () => useState("i18n:resolved-locale", () => "");
function withConfiguredProtocol(url, baseUrl) {
	const protocol = !isFunction(baseUrl) && parseURL(baseUrl).protocol;
	return protocol ? {
		host: url.host,
		protocol
	} : url;
}
function createBaseUrlGetter(opts) {
	const { baseUrl, appBase, getDomainFromLocale } = opts;
	const base = isFunction(baseUrl) ? baseUrl : () => baseUrl || "";
	return (locale) => joinURL(locale && getDomainFromLocale(locale) || base(), appBase);
}
function useI18nCookie({ cookieCrossOrigin, cookieDomain, cookieSecure, cookieKey }) {
	const date = /* @__PURE__ */ new Date();
	return useCookie(cookieKey || "i18n_redirected", {
		path: "/",
		readonly: false,
		expires: new Date(date.setDate(date.getDate() + 365)),
		sameSite: cookieCrossOrigin ? "none" : "lax",
		domain: cookieDomain || void 0,
		secure: cookieCrossOrigin || cookieSecure
	});
}
var isPrerenderable = createPrerenderablePredicate({
	dynamic: [],
	undeliverable: []
});
function createMessageInstaller(i18n) {
	const byRef = /* @__PURE__ */ new Map();
	const merge = i18n.mergeLocaleMessage.bind(i18n);
	const set = i18n.setLocaleMessage.bind(i18n);
	i18n.mergeLocaleMessage = ((locale, message) => {
		if (byRef.delete(locale)) set(locale, cloneDeep(i18n.getLocaleMessage(locale)));
		merge(locale, message);
	});
	i18n.setLocaleMessage = ((locale, message) => {
		byRef.delete(locale);
		set(locale, message);
	});
	return (locale, message) => {
		if (byRef.get(locale) === message) return;
		if (byRef.has(locale)) {
			i18n.mergeLocaleMessage(locale, message);
			return;
		}
		set(locale, fillMissing(message, i18n.getLocaleMessage(locale)));
		byRef.set(locale, message);
	};
}
function createNuxtI18nContext(nuxt, vueI18n, defaultLocale, flatJson = false) {
	const i18n = getI18nTarget(vueI18n);
	const installMessages = createMessageInstaller(getComposer$2(vueI18n));
	const runtimeI18n = useRuntimeI18n(nuxt);
	const detectConfig = useI18nDetection(nuxt);
	const serverLocaleConfigs = useLocaleConfigs();
	const localeCookie = useI18nCookie(detectConfig);
	const loadMap = /* @__PURE__ */ new Set();
	const getLocaleConfig = (locale) => serverLocaleConfigs.value[locale];
	let url;
	const requestUrl = () => url ??= withConfiguredProtocol(useRequestURL({ xForwardedHost: true }), runtimeI18n.baseUrl);
	const getDomainFromLocale = (locale) => domainFromLocale(runtimeI18n.domainLocales, requestUrl(), locale);
	const getBaseUrl = createBaseUrlGetter({
		baseUrl: isFunction(runtimeI18n.baseUrl) ? () => runtimeI18n.baseUrl(nuxt) : runtimeI18n.baseUrl,
		appBase: nuxt.$config.app.baseURL,
		getDomainFromLocale
	});
	const getCanonicalBaseUrl = getBaseUrl;
	const resolvedLocale = useResolvedLocale();
	if (nuxt.ssrContext?.event?.context?.nuxtI18n?.detectLocale) resolvedLocale.value = nuxt.ssrContext.event.context.nuxtI18n.detectLocale;
	const buildUsesRuntimeLoaders = createRuntimeLoaderPredicate({
		ssg: false,
		dynamic: [],
		undeliverable: []
	});
	const cdnPrefix = (locale) => "";
	const loadMessagesFromLoaders = async (locale) => {
		if (locale in localeLoaders === false) return;
		const loaded = await nuxt.runWithContext(() => getLocaleMessagesMergedCached(locale, localeLoaders[locale]));
		const msg = flatJson ? cloneDeep(loaded) : loaded;
		i18n.mergeLocaleMessage(locale, msg);
	};
	const loadMessagesFromServer = async (locale) => {
		if (locale in localeLoaders === false) return;
		const deliverable = (messages2) => Object.keys(messages2).filter((k) => !ctx.usesRuntimeLoaders(k));
		const serverCtx = nuxt.ssrContext?.event?.context?.nuxtI18n;
		if (serverCtx?.loadMessages && installMessages) {
			const messages2 = await serverCtx.loadMessages(locale);
			for (const k of deliverable(messages2)) installMessages(k, messages2[k]);
			return;
		}
		const headers = getLocaleConfig(locale)?.cacheable ? {} : { "Cache-Control": "no-cache" };
		const url2 = joinURL(cdnPrefix(), "/_i18n", {
			"en": "536362c7",
			"fr": "536362c7"
		}[locale], locale, "messages.json");
		const messages = await $fetch(url2, { headers });
		for (const k of deliverable(messages)) i18n.mergeLocaleMessage(k, messages[k]);
	};
	const ctx = {
		vueI18n,
		initial: true,
		preloaded: false,
		config: runtimeI18n,
		rootRedirect: resolveRootRedirect(runtimeI18n.rootRedirect),
		redirectStatusCode: runtimeI18n.redirectStatusCode ?? 302,
		usesRuntimeLoaders: (locale) => buildUsesRuntimeLoaders(locale),
		getDefaultLocale: () => defaultLocale,
		getLocale: () => unref(i18n.locale),
		setLocale: async (locale) => {
			const oldLocale = ctx.getLocale();
			if (locale === oldLocale || !isSupportedLocale(locale)) return;
			if (isRef(i18n.locale)) i18n.locale.value = locale;
			else i18n.locale = locale;
			await nuxt.callHook("i18n:localeSwitched", {
				newLocale: locale,
				oldLocale
			});
			resolvedLocale.value = locale;
		},
		setLocaleSuspend: async (locale) => {
			if (!isSupportedLocale(locale)) return;
			ctx.vueI18n.__pendingLocale = locale;
			ctx.vueI18n.__pendingLocalePromise = new Promise((resolve) => {
				ctx.vueI18n.__resolvePendingLocalePromise = async () => {
					ctx.setCookieLocale(locale);
					await ctx.setLocale(locale);
					ctx.vueI18n.__pendingLocale = void 0;
					resolve();
				};
			});
			await ctx.vueI18n.__resolvePendingLocalePromise?.();
		},
		getLocales: () => unref(i18n.locales).map((x) => isString(x) ? {
			code: x,
			domains: [],
			defaultForDomains: []
		} : x),
		setCookieLocale: (locale) => {
			if (detectConfig.useCookie && isSupportedLocale(locale)) localeCookie.value = locale;
		},
		getBaseUrl,
		getCanonicalBaseUrl,
		loadMessages: async (locale) => {
			if (nuxt.isHydrating && loadMap.has(locale)) return;
			try {
				const fallbacks = getLocaleConfig(locale)?.fallbacks ?? [];
				const chain = fallbacks.includes(locale) ? fallbacks : [...fallbacks, locale];
				if (!chain.some((x) => ctx.usesRuntimeLoaders(x))) return await loadMessagesFromServer(locale);
				for (const k of chain) try {
					await (ctx.usesRuntimeLoaders(k) ? loadMessagesFromLoaders(k) : loadMessagesFromServer(k));
				} catch (e) {
					console.warn(`Failed to load messages for locale "${k}"`, e);
				}
			} catch (e) {
				console.warn(`Failed to load messages for locale "${locale}"`, e);
			} finally {
				loadMap.add(locale);
			}
		},
		composableCtx: void 0
	};
	ctx.composableCtx = createComposableContext(ctx, nuxt);
	return ctx;
}
function useNuxtI18nContext(nuxt) {
	if (nuxt._nuxtI18n == null) throw new Error("Nuxt I18n context has not been set up yet.");
	return nuxt._nuxtI18n;
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/routing/routing.js
function localePath(ctx, route, locale = ctx.getLocale()) {
	if (isString(route) && hasProtocol(route, { acceptRelative: true })) return route;
	try {
		return resolveRoute(ctx, route, locale).fullPath;
	} catch {
		return "";
	}
}
function localeRoute(ctx, route, locale = ctx.getLocale()) {
	try {
		return resolveRoute(ctx, route, locale);
	} catch {
		return;
	}
}
function normalizeRawLocation(route) {
	if (!isString(route)) return assign({}, route);
	if (route[0] === "/") {
		const { pathname: path, search, hash } = parsePath(route);
		return {
			path,
			query: parseQuery(search),
			hash
		};
	}
	return { name: route };
}
function resolveRoute(ctx, route, locale) {
	const normalized = normalizeRawLocation(route);
	const localized = ctx.resolveLocalizedRouteObject(normalized, locale);
	if (localized.name) localized.path = void 0;
	const resolved = ctx.router.resolve(localized);
	if (resolved.name) return resolved;
	return ctx.router.resolve(route);
}
function switchLocalePath(ctx, locale, route = ctx.router.currentRoute.value) {
	const name = ctx.getRouteBaseName(route);
	if (!name) return "";
	const path = localePath(ctx, {
		name,
		params: assign({}, route.params, ctx.getLocalizedDynamicParams(locale)),
		fullPath: route.fullPath,
		query: route.query,
		hash: route.hash,
		meta: route.meta
	}, locale);
	return ctx.afterSwitchLocalePath(path, locale);
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/routing/navigation.js
function createNavigationResolver(config) {
	const { strategy, compactRoutes } = config;
	function isUnlocalizedRoute(to) {
		if (strategy === "no_prefix" || to.name == null) return false;
		const name = String(to.name);
		if (getRouteBaseName(name) !== name) return false;
		if (compactRoutes && to.matched.some((r) => r.meta.__i18nCompact)) return false;
		return !config.getLocaleCodes().some((code) => config.hasRoute(getLocalizedRouteName(name, code, false)));
	}
	return function resolveNavigation(to, locale, pendingLocale = false) {
		const reach = config.localeReach?.(locale);
		if (reach === "off-host") return;
		if (reach === "other-domain") {
			if (isUnlocalizedRoute(to) || pendingLocale) return;
			const destination2 = config.switchLocalePath(locale, to);
			if (!destination2 || !hasProtocol(destination2, { strict: true })) return;
			return {
				path: destination2,
				code: config.redirectStatusCode,
				external: true
			};
		}
		if (to.path === "/" && config.rootRedirect) return {
			path: config.localePath(config.rootRedirect.path, locale),
			code: config.rootRedirect.code
		};
		if (isUnlocalizedRoute(to)) return;
		if (pendingLocale) return;
		if (config.routeLocale(to) === locale) return;
		const destination = config.switchLocalePath(locale, to) || config.localePath(to.fullPath, locale);
		if (isEqual$1(destination, to.fullPath)) return;
		return {
			path: destination,
			code: config.redirectStatusCode
		};
	};
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/kit/browser.js
function matchBrowserLocale(locales, browserLocales) {
	const matchedLocales = [];
	for (const [index, browserCode] of browserLocales.entries()) {
		const matchedLocale = locales.find((l) => l.language?.toLowerCase() === browserCode.toLowerCase());
		if (matchedLocale) {
			matchedLocales.push({
				code: matchedLocale.code,
				score: 1 - index / browserLocales.length
			});
			break;
		}
	}
	for (const [index, browserCode] of browserLocales.entries()) {
		const languageCode = browserCode.split("-")[0].toLowerCase();
		const matchedLocale = locales.find((l) => l.language?.split("-")[0].toLowerCase() === languageCode);
		if (matchedLocale) {
			matchedLocales.push({
				code: matchedLocale.code,
				score: .999 - index / browserLocales.length
			});
			break;
		}
	}
	return matchedLocales;
}
function compareBrowserLocale(a, b) {
	if (a.score === b.score) return b.code.length - a.code.length;
	return b.score - a.score;
}
function findBrowserLocale(locales, browserLocales) {
	return matchBrowserLocale(locales.map((l) => ({
		code: l.code,
		language: l.language || l.code
	})), browserLocales).sort(compareBrowserLocale).at(0)?.code ?? "";
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/shared/detection.js
var getCookieLocale = (event, cookieName) => getCookie(event, cookieName) || void 0;
var getRouteLocale = (event, route) => getLocaleFromRoute(route);
var getHeaderLocale = (event) => findBrowserLocale(normalizedLocales, parseAcceptLanguage(getRequestHeader(event, "accept-language") || ""));
var getRequestHost = (event) => getRequestURL(event, { xForwardedHost: true }).host;
var getRefererHost = (event) => {
	const referer = getRequestHeader(event, "referer");
	try {
		return referer && new URL(referer).host || void 0;
	} catch {
		return;
	}
};
var getDomainLocales = (domainLocales) => normalizedLocales.map((l) => withRuntimeDomain(l, domainLocales));
var useDetectors = (event, config, nuxtApp) => {
	if (!event) throw new Error("H3Event is required for server-side locale detection");
	const runtimeI18n = useRuntimeI18n(nuxtApp);
	let host;
	let locales;
	const getHost = () => host ??= getRequestHost(event);
	const getLocales = () => locales ??= getDomainLocales(runtimeI18n.domainLocales);
	return {
		cookie: () => getCookieLocale(event, config.cookieKey),
		header: () => getHeaderLocale(event),
		navigator: () => void 0,
		host: (path) => matchDomainLocale(getLocales(), getHost(), getLocaleFromRoutePath(path)),
		route: (path) => getRouteLocale(event, path),
		/** Passes the locale through when the current host serves it, `undefined` otherwise */
		onHost: (locale) => !locale || isLocaleServedOnHost(getLocales(), getHost(), locale) ? locale : void 0,
		/** Whether the visitor arrived from one of the configured domains */
		fromOwnDomain: () => {
			const referer = getRefererHost(event);
			return !!referer && getLocales().some((l) => isLocaleOnHost(l, referer));
		},
		/** Whether a cookie scoped to the configured `cookieDomain` is readable on every domain */
		cookieSpans: () => !!config.cookieDomain && cookieSpansDomains(getLocales(), config.cookieDomain)
	};
};
function createLocaleDetector(config) {
	const { detection} = config;
	const isSupported = config.isSupportedLocale ?? isSupportedLocale;
	function skipDetect(path, pathLocale) {
		if (detection.redirectOn === "root" && path !== "/") return true;
		if (detection.redirectOn === "no prefix" && !detection.alwaysRedirect && isSupported(pathLocale)) return true;
		return false;
	}
	return function detectLocale(detectors, route, initial) {
		const path = isString(route) ? parsePath(route).pathname : route.path;
		const pass = (locale) => locale;
		const onHost = pass;
		function* detect() {
			const detecting = initial && detection.enabled && !skipDetect(path, detectors.route(path));
			if (detecting) {
				const cookie = onHost;
				const browser = onHost;
				yield cookie(detectors.cookie());
				yield browser(detectors.header());
				yield browser(detectors.navigator());
			}
			yield detectors.route(route);
			if (detecting) yield onHost(detection.fallbackLocale);
		}
		for (const detected of detect()) if (detected && isSupported(detected)) return detected;
		return "";
	};
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/utils.js
async function loadAndSetLocale(nuxtApp, locale) {
	const ctx = useNuxtI18nContext(nuxtApp);
	const oldLocale = ctx.getLocale();
	if (locale === oldLocale && !ctx.initial && (!ctx.vueI18n.__pendingLocale || ctx.vueI18n.__pendingLocale === locale)) return locale;
	const data = {
		oldLocale,
		newLocale: locale,
		initialSetup: ctx.initial,
		context: nuxtApp
	};
	let override = await nuxtApp.callHook("i18n:beforeLocaleSwitch", data);
	override ??= data.newLocale;
	if (isSupportedLocale(override)) locale = override;
	await ctx.loadMessages(locale);
	await ctx.setLocaleSuspend(locale);
	return locale;
}
function detectLocale(nuxtApp, route) {
	const detectConfig = useI18nDetection(nuxtApp);
	const detectors = useDetectors(useRequestEvent(nuxtApp), detectConfig, nuxtApp);
	const ctx = useNuxtI18nContext(nuxtApp);
	return createLocaleDetector({
		detection: detectConfig})(detectors, route, ctx.initial) || ctx.getLocale() || ctx.getDefaultLocale() || "";
}
function navigate(nuxtApp, to, locale) {
	const ctx = useNuxtI18nContext(nuxtApp);
	const _ctx = useComposableContext(nuxtApp);
	const detectors = useDetectors(useRequestEvent(), useI18nDetection(nuxtApp), nuxtApp);
	const resolved = createNavigationResolver({
		localeReach: void 0,
		rootRedirect: ctx.rootRedirect,
		redirectStatusCode: ctx.redirectStatusCode,
		localePath: (path, locale2) => localePath(_ctx, path, locale2),
		switchLocalePath: (locale2, route) => switchLocalePath(_ctx, locale2, route),
		routeLocale: (route) => detectors.route(route),
		hasRoute: (name) => _ctx.router.hasRoute(name),
		getLocaleCodes: () => _ctx.getLocales().map((locale2) => locale2.code),
		strategy: "prefix_except_default",
		compactRoutes: false
	})(to, locale, !!ctx.vueI18n.__pendingLocale && !!useNuxtApp()._processingMiddleware);
	if (resolved) return navigateTo(resolved.path, {
		redirectCode: resolved.code,
		external: resolved.external
	});
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/plugins/route-locale-detect.js
var route_locale_detect_default = /* @__PURE__ */ defineNuxtPlugin({
	name: "i18n:plugin:route-locale-detect",
	dependsOn: ["i18n:plugin"],
	async setup(_nuxt) {
		let __temp, __restore;
		const nuxt = useNuxtApp(_nuxt._id);
		const ctx = useNuxtI18nContext(nuxt);
		const resolvedLocale = useResolvedLocale();
		[__temp, __restore] = executeAsync(() => nuxt.runWithContext(() => loadAndSetLocale(nuxt, ctx.initial && resolvedLocale.value || detectLocale(nuxt, nuxt.$router.currentRoute.value)))), await __temp, __restore();
	}
});
//#endregion
//#region node_modules/@intlify/message-compiler/dist/message-compiler.mjs
/*!
* message-compiler v11.4.13
* (c) 2026 kazuya kawaguchi
* Released under the MIT License.
*/
function createPosition(line, column, offset) {
	return {
		line,
		column,
		offset
	};
}
function createLocation(start, end, source) {
	const loc = {
		start,
		end
	};
	return loc;
}
var CompileErrorCodes = {
	EXPECTED_TOKEN: 1,
	INVALID_TOKEN_IN_PLACEHOLDER: 2,
	UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
	UNKNOWN_ESCAPE_SEQUENCE: 4,
	INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
	UNBALANCED_CLOSING_BRACE: 6,
	UNTERMINATED_CLOSING_BRACE: 7,
	EMPTY_PLACEHOLDER: 8,
	NOT_ALLOW_NEST_PLACEHOLDER: 9,
	INVALID_LINKED_FORMAT: 10,
	MUST_HAVE_MESSAGES_IN_PLURAL: 11,
	UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
	UNEXPECTED_EMPTY_LINKED_KEY: 13,
	UNEXPECTED_LEXICAL_ANALYSIS: 14};
function createCompileError(code, loc, options = {}) {
	const { domain, messages, args } = options;
	const error = new SyntaxError(String(code));
	error.code = code;
	if (loc) error.location = loc;
	error.domain = domain;
	return error;
}
/** @internal */
function defaultOnError(error) {
	throw error;
}
var CHAR_SP = " ";
var CHAR_CR = "\r";
var CHAR_LF = "\n";
var CHAR_LS = String.fromCharCode(8232);
var CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
	const _buf = str;
	let _index = 0;
	let _line = 1;
	let _column = 1;
	let _peekOffset = 0;
	const isCRLF = (index) => _buf[index] === CHAR_CR && _buf[index + 1] === CHAR_LF;
	const isLF = (index) => _buf[index] === CHAR_LF;
	const isPS = (index) => _buf[index] === CHAR_PS;
	const isLS = (index) => _buf[index] === CHAR_LS;
	const isLineEnd = (index) => isCRLF(index) || isLF(index) || isPS(index) || isLS(index);
	const index = () => _index;
	const line = () => _line;
	const column = () => _column;
	const peekOffset = () => _peekOffset;
	const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
	const currentChar = () => charAt(_index);
	const currentPeek = () => charAt(_index + _peekOffset);
	function next() {
		_peekOffset = 0;
		if (isLineEnd(_index)) {
			_line++;
			_column = 0;
		}
		if (isCRLF(_index)) _index++;
		_index++;
		_column++;
		return _buf[_index];
	}
	function peek() {
		if (isCRLF(_index + _peekOffset)) _peekOffset++;
		_peekOffset++;
		return _buf[_index + _peekOffset];
	}
	function reset() {
		_index = 0;
		_line = 1;
		_column = 1;
		_peekOffset = 0;
	}
	function resetPeek(offset = 0) {
		_peekOffset = offset;
	}
	function skipToPeek() {
		const target = _index + _peekOffset;
		while (target !== _index) next();
		_peekOffset = 0;
	}
	return {
		index,
		line,
		column,
		peekOffset,
		charAt,
		currentChar,
		currentPeek,
		next,
		peek,
		reset,
		resetPeek,
		skipToPeek
	};
}
var EOF = void 0;
var DOT = ".";
var LITERAL_DELIMITER = "'";
var ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
	const location = options.location !== false;
	const _scnr = createScanner(source);
	const currentOffset = () => _scnr.index();
	const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
	const _initLoc = currentPosition();
	const _initOffset = currentOffset();
	const _context = {
		currentType: 13,
		offset: _initOffset,
		startLoc: _initLoc,
		endLoc: _initLoc,
		lastType: 13,
		lastOffset: _initOffset,
		lastStartLoc: _initLoc,
		lastEndLoc: _initLoc,
		braceNest: 0,
		inLinked: false,
		text: ""
	};
	const context = () => _context;
	const { onError } = options;
	function emitError(code, pos, offset, ...args) {
		const ctx = context();
		pos.column += offset;
		pos.offset += offset;
		if (onError) {
			const err = createCompileError(code, location ? createLocation(ctx.startLoc, pos) : null, {
				domain: ERROR_DOMAIN$3,
				args
			});
			onError(err);
		}
	}
	function getToken(context, type, value) {
		context.endLoc = currentPosition();
		context.currentType = type;
		const token = { type };
		if (location) token.loc = createLocation(context.startLoc, context.endLoc);
		if (value != null) token.value = value;
		return token;
	}
	const getEndToken = (context) => getToken(context, 13);
	function eat(scnr, ch) {
		if (scnr.currentChar() === ch) {
			scnr.next();
			return ch;
		} else {
			emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
			return "";
		}
	}
	function peekSpaces(scnr) {
		let buf = "";
		while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
			buf += scnr.currentPeek();
			scnr.peek();
		}
		return buf;
	}
	function skipSpaces(scnr) {
		const buf = peekSpaces(scnr);
		scnr.skipToPeek();
		return buf;
	}
	function isIdentifierStart(ch) {
		if (ch === EOF) return false;
		const cc = ch.charCodeAt(0);
		return cc >= 97 && cc <= 122 || cc >= 65 && cc <= 90 || cc === 95;
	}
	function isNumberStart(ch) {
		if (ch === EOF) return false;
		const cc = ch.charCodeAt(0);
		return cc >= 48 && cc <= 57;
	}
	function isNamedIdentifierStart(scnr, context) {
		const { currentType } = context;
		if (currentType !== 2) return false;
		peekSpaces(scnr);
		const ret = isIdentifierStart(scnr.currentPeek());
		scnr.resetPeek();
		return ret;
	}
	function isListIdentifierStart(scnr, context) {
		const { currentType } = context;
		if (currentType !== 2) return false;
		peekSpaces(scnr);
		const ret = isNumberStart(scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek());
		scnr.resetPeek();
		return ret;
	}
	function isLiteralStart(scnr, context) {
		const { currentType } = context;
		if (currentType !== 2) return false;
		peekSpaces(scnr);
		const ret = scnr.currentPeek() === LITERAL_DELIMITER;
		scnr.resetPeek();
		return ret;
	}
	function isLinkedDotStart(scnr, context) {
		const { currentType } = context;
		if (currentType !== 7) return false;
		peekSpaces(scnr);
		const ret = scnr.currentPeek() === ".";
		scnr.resetPeek();
		return ret;
	}
	function isLinkedModifierStart(scnr, context) {
		const { currentType } = context;
		if (currentType !== 8) return false;
		peekSpaces(scnr);
		const ret = isIdentifierStart(scnr.currentPeek());
		scnr.resetPeek();
		return ret;
	}
	function isLinkedDelimiterStart(scnr, context) {
		const { currentType } = context;
		if (!(currentType === 7 || currentType === 11)) return false;
		peekSpaces(scnr);
		const ret = scnr.currentPeek() === ":";
		scnr.resetPeek();
		return ret;
	}
	function isLinkedReferStart(scnr, context) {
		const { currentType } = context;
		if (currentType !== 9) return false;
		const fn = () => {
			const ch = scnr.currentPeek();
			if (ch === "{") return isIdentifierStart(scnr.peek());
			else if (ch === "@" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) return false;
			else if (ch === CHAR_LF) {
				scnr.peek();
				return fn();
			} else return isTextStart(scnr, false);
		};
		const ret = fn();
		scnr.resetPeek();
		return ret;
	}
	function isPluralStart(scnr) {
		peekSpaces(scnr);
		const ret = scnr.currentPeek() === "|";
		scnr.resetPeek();
		return ret;
	}
	function isTextStart(scnr, reset = true) {
		const fn = (hasSpace = false, prev = "") => {
			const ch = scnr.currentPeek();
			if (ch === "{") return hasSpace;
			else if (ch === "@" || !ch) return hasSpace;
			else if (ch === "|") return !(prev === CHAR_SP || prev === CHAR_LF);
			else if (ch === CHAR_SP) {
				scnr.peek();
				return fn(true, CHAR_SP);
			} else if (ch === CHAR_LF) {
				scnr.peek();
				return fn(true, CHAR_LF);
			} else return true;
		};
		const ret = fn();
		reset && scnr.resetPeek();
		return ret;
	}
	function takeChar(scnr, fn) {
		const ch = scnr.currentChar();
		if (ch === EOF) return;
		if (fn(ch)) {
			scnr.next();
			return ch;
		}
		return null;
	}
	function isIdentifier(ch) {
		const cc = ch.charCodeAt(0);
		return cc >= 97 && cc <= 122 || cc >= 65 && cc <= 90 || cc >= 48 && cc <= 57 || cc === 95 || cc === 36;
	}
	function takeIdentifierChar(scnr) {
		return takeChar(scnr, isIdentifier);
	}
	function isNamedIdentifier(ch) {
		const cc = ch.charCodeAt(0);
		return cc >= 97 && cc <= 122 || cc >= 65 && cc <= 90 || cc >= 48 && cc <= 57 || cc === 95 || cc === 36 || cc === 45;
	}
	function takeNamedIdentifierChar(scnr) {
		return takeChar(scnr, isNamedIdentifier);
	}
	function isDigit(ch) {
		const cc = ch.charCodeAt(0);
		return cc >= 48 && cc <= 57;
	}
	function takeDigit(scnr) {
		return takeChar(scnr, isDigit);
	}
	function isHexDigit(ch) {
		const cc = ch.charCodeAt(0);
		return cc >= 48 && cc <= 57 || cc >= 65 && cc <= 70 || cc >= 97 && cc <= 102;
	}
	function takeHexDigit(scnr) {
		return takeChar(scnr, isHexDigit);
	}
	function getDigits(scnr) {
		let ch = "";
		let num = "";
		while (ch = takeDigit(scnr)) num += ch;
		return num;
	}
	function readText(scnr) {
		let buf = "";
		while (true) {
			const ch = scnr.currentChar();
			if (ch === "\\") {
				const nextCh = scnr.peek();
				if (nextCh === "{" || nextCh === "}" || nextCh === "@" || nextCh === "|" || nextCh === "\\") {
					buf += ch + nextCh;
					scnr.next();
					scnr.next();
				} else {
					scnr.resetPeek();
					buf += ch;
					scnr.next();
				}
			} else if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) break;
			else if (ch === CHAR_SP || ch === CHAR_LF) {
				if (isTextStart(scnr)) {
					buf += ch;
					scnr.next();
				} else if (isPluralStart(scnr)) break;
				else {
					buf += ch;
					scnr.next();
				}
			} else {
				buf += ch;
				scnr.next();
			}
		}
		return buf;
	}
	function readNamedIdentifier(scnr) {
		skipSpaces(scnr);
		let ch = "";
		let name = "";
		while (ch = takeNamedIdentifierChar(scnr)) name += ch;
		const currentChar = scnr.currentChar();
		if (currentChar && currentChar !== "}" && currentChar !== EOF && currentChar !== CHAR_SP && currentChar !== CHAR_LF && currentChar !== "　") {
			const invalidPart = readInvalidIdentifier(scnr);
			emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, name + invalidPart);
			return name + invalidPart;
		}
		if (scnr.currentChar() === EOF) emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
		return name;
	}
	function readListIdentifier(scnr) {
		skipSpaces(scnr);
		let value = "";
		if (scnr.currentChar() === "-") {
			scnr.next();
			value += `-${getDigits(scnr)}`;
		} else value += getDigits(scnr);
		if (scnr.currentChar() === EOF) emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
		return value;
	}
	function isLiteral(ch) {
		return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
	}
	function readLiteral(scnr) {
		skipSpaces(scnr);
		eat(scnr, `\'`);
		let ch = "";
		let literal = "";
		while (ch = takeChar(scnr, isLiteral)) if (ch === "\\") literal += readEscapeSequence(scnr);
		else literal += ch;
		const current = scnr.currentChar();
		if (current === CHAR_LF || current === EOF) {
			emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
			if (current === CHAR_LF) {
				scnr.next();
				eat(scnr, `\'`);
			}
			return literal;
		}
		eat(scnr, `\'`);
		return literal;
	}
	function readEscapeSequence(scnr) {
		const ch = scnr.currentChar();
		switch (ch) {
			case "\\":
			case `\'`:
				scnr.next();
				return `\\${ch}`;
			case "u": return readUnicodeEscapeSequence(scnr, ch, 4);
			case "U": return readUnicodeEscapeSequence(scnr, ch, 6);
			default:
				emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
				return "";
		}
	}
	function readUnicodeEscapeSequence(scnr, unicode, digits) {
		eat(scnr, unicode);
		let sequence = "";
		for (let i = 0; i < digits; i++) {
			const ch = takeHexDigit(scnr);
			if (!ch) {
				emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
				break;
			}
			sequence += ch;
		}
		return `\\${unicode}${sequence}`;
	}
	function isInvalidIdentifier(ch) {
		return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
	}
	function readInvalidIdentifier(scnr) {
		skipSpaces(scnr);
		let ch = "";
		let identifiers = "";
		while (ch = takeChar(scnr, isInvalidIdentifier)) identifiers += ch;
		return identifiers;
	}
	function readLinkedModifier(scnr) {
		let ch = "";
		let name = "";
		while (ch = takeIdentifierChar(scnr)) name += ch;
		return name;
	}
	function readLinkedRefer(scnr) {
		const fn = (buf) => {
			const ch = scnr.currentChar();
			if (ch === "{" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) return buf;
			else if (ch === CHAR_SP) return buf;
			else if (ch === CHAR_LF || ch === DOT) {
				buf += ch;
				scnr.next();
				return fn(buf);
			} else {
				buf += ch;
				scnr.next();
				return fn(buf);
			}
		};
		return fn("");
	}
	function readPlural(scnr) {
		skipSpaces(scnr);
		const plural = eat(scnr, "|");
		skipSpaces(scnr);
		return plural;
	}
	function readTokenInPlaceholder(scnr, context) {
		let token = null;
		switch (scnr.currentChar()) {
			case "{":
				if (context.braceNest >= 1) emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
				scnr.next();
				token = getToken(context, 2, "{");
				skipSpaces(scnr);
				context.braceNest++;
				return token;
			case "}":
				if (context.braceNest > 0 && context.currentType === 2) emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
				scnr.next();
				token = getToken(context, 3, "}");
				context.braceNest--;
				context.braceNest > 0 && skipSpaces(scnr);
				if (context.inLinked && context.braceNest === 0) context.inLinked = false;
				return token;
			case "@":
				if (context.braceNest > 0) emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
				token = readTokenInLinked(scnr, context) || getEndToken(context);
				context.braceNest = 0;
				return token;
			default: {
				let validNamedIdentifier = true;
				let validListIdentifier = true;
				let validLiteral = true;
				if (isPluralStart(scnr)) {
					if (context.braceNest > 0) emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
					token = getToken(context, 1, readPlural(scnr));
					context.braceNest = 0;
					context.inLinked = false;
					return token;
				}
				if (context.braceNest > 0 && (context.currentType === 4 || context.currentType === 5 || context.currentType === 6)) {
					emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
					context.braceNest = 0;
					return readToken(scnr, context);
				}
				if (validNamedIdentifier = isNamedIdentifierStart(scnr, context)) {
					token = getToken(context, 4, readNamedIdentifier(scnr));
					skipSpaces(scnr);
					return token;
				}
				if (validListIdentifier = isListIdentifierStart(scnr, context)) {
					token = getToken(context, 5, readListIdentifier(scnr));
					skipSpaces(scnr);
					return token;
				}
				if (validLiteral = isLiteralStart(scnr, context)) {
					token = getToken(context, 6, readLiteral(scnr));
					skipSpaces(scnr);
					return token;
				}
				if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
					token = getToken(context, 12, readInvalidIdentifier(scnr));
					emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
					skipSpaces(scnr);
					return token;
				}
				break;
			}
		}
		return token;
	}
	function readTokenInLinked(scnr, context) {
		const { currentType } = context;
		let token = null;
		const ch = scnr.currentChar();
		if ((currentType === 7 || currentType === 8 || currentType === 11 || currentType === 9) && (ch === CHAR_LF || ch === CHAR_SP)) emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
		switch (ch) {
			case "@":
				scnr.next();
				token = getToken(context, 7, "@");
				context.inLinked = true;
				return token;
			case ".":
				skipSpaces(scnr);
				scnr.next();
				return getToken(context, 8, ".");
			case ":":
				skipSpaces(scnr);
				scnr.next();
				return getToken(context, 9, ":");
			default:
				if (isPluralStart(scnr)) {
					token = getToken(context, 1, readPlural(scnr));
					context.braceNest = 0;
					context.inLinked = false;
					return token;
				}
				if (isLinkedDotStart(scnr, context) || isLinkedDelimiterStart(scnr, context)) {
					skipSpaces(scnr);
					return readTokenInLinked(scnr, context);
				}
				if (isLinkedModifierStart(scnr, context)) {
					skipSpaces(scnr);
					return getToken(context, 11, readLinkedModifier(scnr));
				}
				if (isLinkedReferStart(scnr, context)) {
					skipSpaces(scnr);
					if (ch === "{") return readTokenInPlaceholder(scnr, context) || token;
					else return getToken(context, 10, readLinkedRefer(scnr));
				}
				if (currentType === 7) emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
				context.braceNest = 0;
				context.inLinked = false;
				return readToken(scnr, context);
		}
	}
	function readToken(scnr, context) {
		let token = { type: 13 };
		if (context.braceNest > 0) return readTokenInPlaceholder(scnr, context) || getEndToken(context);
		if (context.inLinked) return readTokenInLinked(scnr, context) || getEndToken(context);
		switch (scnr.currentChar()) {
			case "{": return readTokenInPlaceholder(scnr, context) || getEndToken(context);
			case "}":
				emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
				scnr.next();
				return getToken(context, 3, "}");
			case "@": return readTokenInLinked(scnr, context) || getEndToken(context);
			default:
				if (isPluralStart(scnr)) {
					token = getToken(context, 1, readPlural(scnr));
					context.braceNest = 0;
					context.inLinked = false;
					return token;
				}
				if (isTextStart(scnr)) return getToken(context, 0, readText(scnr));
		}
		return token;
	}
	function nextToken() {
		const { currentType, offset, startLoc, endLoc } = _context;
		_context.lastType = currentType;
		_context.lastOffset = offset;
		_context.lastStartLoc = startLoc;
		_context.lastEndLoc = endLoc;
		_context.offset = currentOffset();
		_context.startLoc = currentPosition();
		if (_scnr.currentChar() === EOF) return getToken(_context, 13);
		return readToken(_scnr, _context);
	}
	return {
		nextToken,
		currentOffset,
		currentPosition,
		context
	};
}
var ERROR_DOMAIN$2 = "parser";
var KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
var TEXT_ESCAPES = /\\([\\@{}|])/g;
function fromTextEscapeSequence(_match, char) {
	return char;
}
function fromEscapeSequence(match, codePoint4, codePoint6) {
	switch (match) {
		case `\\\\`: return `\\`;
		case `\\\'`: return `\'`;
		default: {
			const codePoint = parseInt(codePoint4 || codePoint6, 16);
			if (codePoint <= 55295 || codePoint >= 57344) return String.fromCodePoint(codePoint);
			return "�";
		}
	}
}
function createParser(options = {}) {
	const location = options.location !== false;
	const { onError } = options;
	function emitError(tokenzer, code, start, offset, ...args) {
		const end = tokenzer.currentPosition();
		end.offset += offset;
		end.column += offset;
		if (onError) {
			const err = createCompileError(code, location ? createLocation(start, end) : null, {
				domain: ERROR_DOMAIN$2,
				args
			});
			onError(err);
		}
	}
	function startNode(type, offset, loc) {
		const node = { type };
		if (location) {
			node.start = offset;
			node.end = offset;
			node.loc = {
				start: loc,
				end: loc
			};
		}
		return node;
	}
	function endNode(node, offset, pos, type) {
		if (location) {
			node.end = offset;
			if (node.loc) node.loc.end = pos;
		}
	}
	function parseText(tokenizer, value) {
		const context = tokenizer.context();
		const node = startNode(3, context.offset, context.startLoc);
		node.value = value.replace(TEXT_ESCAPES, fromTextEscapeSequence);
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return node;
	}
	function parseList(tokenizer, index) {
		const { lastOffset: offset, lastStartLoc: loc } = tokenizer.context();
		const node = startNode(5, offset, loc);
		node.index = parseInt(index, 10);
		tokenizer.nextToken();
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return node;
	}
	function parseNamed(tokenizer, key) {
		const { lastOffset: offset, lastStartLoc: loc } = tokenizer.context();
		const node = startNode(4, offset, loc);
		node.key = key;
		tokenizer.nextToken();
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return node;
	}
	function parseLiteral(tokenizer, value) {
		const { lastOffset: offset, lastStartLoc: loc } = tokenizer.context();
		const node = startNode(9, offset, loc);
		node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
		tokenizer.nextToken();
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return node;
	}
	function parseLinkedModifier(tokenizer) {
		const token = tokenizer.nextToken();
		const context = tokenizer.context();
		const { lastOffset: offset, lastStartLoc: loc } = context;
		const node = startNode(8, offset, loc);
		if (token.type !== 11) {
			emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
			node.value = "";
			endNode(node, offset, loc);
			return {
				nextConsumeToken: token,
				node
			};
		}
		if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
		node.value = token.value || "";
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return { node };
	}
	function parseLinkedKey(tokenizer, value) {
		const context = tokenizer.context();
		const node = startNode(7, context.offset, context.startLoc);
		node.value = value;
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return node;
	}
	function parseLinked(tokenizer) {
		const context = tokenizer.context();
		const linkedNode = startNode(6, context.offset, context.startLoc);
		let token = tokenizer.nextToken();
		if (token.type === 8) {
			const parsed = parseLinkedModifier(tokenizer);
			linkedNode.modifier = parsed.node;
			token = parsed.nextConsumeToken || tokenizer.nextToken();
		}
		if (token.type !== 9) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
		token = tokenizer.nextToken();
		if (token.type === 2) token = tokenizer.nextToken();
		switch (token.type) {
			case 10:
				if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
				linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
				break;
			case 4:
				if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
				linkedNode.key = parseNamed(tokenizer, token.value || "");
				break;
			case 5:
				if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
				linkedNode.key = parseList(tokenizer, token.value || "");
				break;
			case 6:
				if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
				linkedNode.key = parseLiteral(tokenizer, token.value || "");
				break;
			default: {
				emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
				const nextContext = tokenizer.context();
				const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
				emptyLinkedKeyNode.value = "";
				endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
				linkedNode.key = emptyLinkedKeyNode;
				endNode(linkedNode, nextContext.offset, nextContext.startLoc);
				return {
					nextConsumeToken: token,
					node: linkedNode
				};
			}
		}
		endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
		return { node: linkedNode };
	}
	function parseMessage(tokenizer) {
		const context = tokenizer.context();
		const node = startNode(2, context.currentType === 1 ? tokenizer.currentOffset() : context.offset, context.currentType === 1 ? context.endLoc : context.startLoc);
		node.items = [];
		let nextToken = null;
		do {
			const token = nextToken || tokenizer.nextToken();
			nextToken = null;
			switch (token.type) {
				case 0:
					if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
					node.items.push(parseText(tokenizer, token.value || ""));
					break;
				case 5:
					if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
					node.items.push(parseList(tokenizer, token.value || ""));
					break;
				case 4:
					if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
					node.items.push(parseNamed(tokenizer, token.value || ""));
					break;
				case 6:
					if (token.value == null) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
					node.items.push(parseLiteral(tokenizer, token.value || ""));
					break;
				case 7: {
					const parsed = parseLinked(tokenizer);
					node.items.push(parsed.node);
					nextToken = parsed.nextConsumeToken || null;
					break;
				}
			}
		} while (context.currentType !== 13 && context.currentType !== 1);
		endNode(node, context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset(), context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition());
		return node;
	}
	function parsePlural(tokenizer, offset, loc, msgNode) {
		const context = tokenizer.context();
		let hasEmptyMessage = msgNode.items.length === 0;
		const node = startNode(1, offset, loc);
		node.cases = [];
		node.cases.push(msgNode);
		do {
			const msg = parseMessage(tokenizer);
			if (!hasEmptyMessage) hasEmptyMessage = msg.items.length === 0;
			node.cases.push(msg);
		} while (context.currentType !== 13);
		if (hasEmptyMessage) emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return node;
	}
	function parseResource(tokenizer) {
		const context = tokenizer.context();
		const { offset, startLoc } = context;
		const msgNode = parseMessage(tokenizer);
		if (context.currentType === 13) return msgNode;
		else return parsePlural(tokenizer, offset, startLoc, msgNode);
	}
	function parse(source) {
		const tokenizer = createTokenizer(source, assign({}, options));
		const context = tokenizer.context();
		const node = startNode(0, context.offset, context.startLoc);
		if (location && node.loc) node.loc.source = source;
		node.body = parseResource(tokenizer);
		if (options.onCacheKey) node.cacheKey = options.onCacheKey(source);
		if (context.currentType !== 13) emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
		endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
		return node;
	}
	return { parse };
}
function getTokenCaption(token) {
	if (token.type === 13) return "EOF";
	const name = (token.value || "").replace(/\r?\n/gu, "\\n");
	return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
	const _context = {
		ast,
		helpers: /* @__PURE__ */ new Set()
	};
	const context = () => _context;
	const helper = (name) => {
		_context.helpers.add(name);
		return name;
	};
	return {
		context,
		helper
	};
}
function traverseNodes(nodes, transformer) {
	for (let i = 0; i < nodes.length; i++) traverseNode(nodes[i], transformer);
}
function traverseNode(node, transformer) {
	switch (node.type) {
		case 1:
			traverseNodes(node.cases, transformer);
			transformer.helper("plural");
			break;
		case 2:
			traverseNodes(node.items, transformer);
			break;
		case 6:
			traverseNode(node.key, transformer);
			transformer.helper("linked");
			transformer.helper("type");
			break;
		case 5:
			transformer.helper("interpolate");
			transformer.helper("list");
			break;
		case 4:
			transformer.helper("interpolate");
			transformer.helper("named");
	}
}
function transform(ast, options = {}) {
	const transformer = createTransformer(ast);
	transformer.helper("normalize");
	ast.body && traverseNode(ast.body, transformer);
	const context = transformer.context();
	ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
	const body = ast.body;
	if (body.type === 2) optimizeMessageNode(body);
	else body.cases.forEach((c) => optimizeMessageNode(c));
	return ast;
}
function optimizeMessageNode(message) {
	if (message.items.length === 1) {
		const item = message.items[0];
		if (item.type === 3 || item.type === 9) {
			message.static = item.value;
			delete item.value;
		}
	} else {
		const values = [];
		for (let i = 0; i < message.items.length; i++) {
			const item = message.items[i];
			if (!(item.type === 3 || item.type === 9)) break;
			if (item.value == null) break;
			values.push(item.value);
		}
		if (values.length === message.items.length) {
			message.static = join(values);
			for (let i = 0; i < message.items.length; i++) {
				const item = message.items[i];
				if (item.type === 3 || item.type === 9) delete item.value;
			}
		}
	}
}
function minify(node) {
	node.t = node.type;
	switch (node.type) {
		case 0: {
			const resource = node;
			minify(resource.body);
			resource.b = resource.body;
			delete resource.body;
			break;
		}
		case 1: {
			const plural = node;
			const cases = plural.cases;
			for (let i = 0; i < cases.length; i++) minify(cases[i]);
			plural.c = cases;
			delete plural.cases;
			break;
		}
		case 2: {
			const message = node;
			const items = message.items;
			for (let i = 0; i < items.length; i++) minify(items[i]);
			message.i = items;
			delete message.items;
			if (message.static) {
				message.s = message.static;
				delete message.static;
			}
			break;
		}
		case 3:
		case 9:
		case 8:
		case 7: {
			const valueNode = node;
			if (valueNode.value) {
				valueNode.v = valueNode.value;
				delete valueNode.value;
			}
			break;
		}
		case 6: {
			const linked = node;
			minify(linked.key);
			linked.k = linked.key;
			delete linked.key;
			if (linked.modifier) {
				minify(linked.modifier);
				linked.m = linked.modifier;
				delete linked.modifier;
			}
			break;
		}
		case 5: {
			const list = node;
			list.i = list.index;
			delete list.index;
			break;
		}
		case 4: {
			const named = node;
			named.k = named.key;
			delete named.key;
			break;
		}
	}
	delete node.type;
}
function createCodeGenerator(ast, options) {
	const { filename, breakLineCode, needIndent: _needIndent } = options;
	const location = options.location !== false;
	const _context = {
		filename,
		code: "",
		column: 1,
		line: 1,
		offset: 0,
		map: void 0,
		breakLineCode,
		needIndent: _needIndent,
		indentLevel: 0
	};
	if (location && ast.loc) _context.source = ast.loc.source;
	const context = () => _context;
	function push(code, node) {
		_context.code += code;
	}
	function _newline(n, withBreakLine = true) {
		const _breakLineCode = withBreakLine ? breakLineCode : "";
		push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
	}
	function indent(withNewLine = true) {
		const level = ++_context.indentLevel;
		withNewLine && _newline(level);
	}
	function deindent(withNewLine = true) {
		const level = --_context.indentLevel;
		withNewLine && _newline(level);
	}
	function newline() {
		_newline(_context.indentLevel);
	}
	const helper = (key) => `_${key}`;
	const needIndent = () => _context.needIndent;
	return {
		context,
		push,
		indent,
		deindent,
		newline,
		helper,
		needIndent
	};
}
function generateLinkedNode(generator, node) {
	const { helper } = generator;
	generator.push(`${helper("linked")}(`);
	generateNode(generator, node.key);
	if (node.modifier) {
		generator.push(`, `);
		generateNode(generator, node.modifier);
		generator.push(`, _type`);
	} else generator.push(`, undefined, _type`);
	generator.push(`)`);
}
function generateMessageNode(generator, node) {
	const { helper, needIndent } = generator;
	generator.push(`${helper("normalize")}([`);
	generator.indent(needIndent());
	const length = node.items.length;
	for (let i = 0; i < length; i++) {
		generateNode(generator, node.items[i]);
		if (i === length - 1) break;
		generator.push(", ");
	}
	generator.deindent(needIndent());
	generator.push("])");
}
function generatePluralNode(generator, node) {
	const { helper, needIndent } = generator;
	if (node.cases.length > 1) {
		generator.push(`${helper("plural")}([`);
		generator.indent(needIndent());
		const length = node.cases.length;
		for (let i = 0; i < length; i++) {
			generateNode(generator, node.cases[i]);
			if (i === length - 1) break;
			generator.push(", ");
		}
		generator.deindent(needIndent());
		generator.push(`])`);
	}
}
function generateResource(generator, node) {
	if (node.body) generateNode(generator, node.body);
	else generator.push("null");
}
function generateNode(generator, node) {
	const { helper } = generator;
	switch (node.type) {
		case 0:
			generateResource(generator, node);
			break;
		case 1:
			generatePluralNode(generator, node);
			break;
		case 2:
			generateMessageNode(generator, node);
			break;
		case 6:
			generateLinkedNode(generator, node);
			break;
		case 8:
			generator.push(JSON.stringify(node.value), node);
			break;
		case 7:
			generator.push(JSON.stringify(node.value), node);
			break;
		case 5:
			generator.push(`${helper("interpolate")}(${helper("list")}(${node.index}))`, node);
			break;
		case 4:
			generator.push(`${helper("interpolate")}(${helper("named")}(${JSON.stringify(node.key)}))`, node);
			break;
		case 9:
			generator.push(JSON.stringify(node.value), node);
			break;
		case 3: generator.push(JSON.stringify(node.value), node);
	}
}
var generate = (ast, options = {}) => {
	const mode = isString(options.mode) ? options.mode : "normal";
	const filename = isString(options.filename) ? options.filename : "message.intl";
	options.sourceMap;
	const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
	const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
	const helpers = ast.helpers || [];
	const generator = createCodeGenerator(ast, {
		filename,
		breakLineCode,
		needIndent
	});
	generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
	generator.indent(needIndent);
	if (helpers.length > 0) {
		generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
		generator.newline();
	}
	generator.push(`return `);
	generateNode(generator, ast);
	generator.deindent(needIndent);
	generator.push(`}`);
	delete ast.helpers;
	const { code, map } = generator.context();
	return {
		ast,
		code,
		map: map ? map.toJSON() : void 0
	};
};
function baseCompile$1(source, options = {}) {
	const assignedOptions = assign({}, options);
	const jit = !!assignedOptions.jit;
	const enalbeMinify = !!assignedOptions.minify;
	const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
	const ast = createParser(assignedOptions).parse(source);
	if (!jit) {
		transform(ast, assignedOptions);
		return generate(ast, assignedOptions);
	} else {
		enambeOptimize && optimize(ast);
		enalbeMinify && minify(ast);
		return {
			ast,
			code: ""
		};
	}
}
//#endregion
//#region node_modules/@intlify/core-base/dist/core-base.mjs
/*!
* core-base v11.4.13
* (c) 2026 kazuya kawaguchi
* Released under the MIT License.
*/
function isMessageAST(val) {
	return isObject(val) && resolveType(val) === 0 && (hasOwn$1(val, "b") || hasOwn$1(val, "body"));
}
var PROPS_BODY = ["b", "body"];
function resolveBody(node) {
	return resolveProps(node, PROPS_BODY);
}
var PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
	return resolveProps(node, PROPS_CASES, []);
}
var PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
	return resolveProps(node, PROPS_STATIC);
}
var PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
	return resolveProps(node, PROPS_ITEMS, []);
}
var PROPS_TYPE = ["t", "type"];
function resolveType(node) {
	return resolveProps(node, PROPS_TYPE);
}
var PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type) {
	const resolved = resolveProps(node, PROPS_VALUE);
	if (resolved != null) return resolved;
	else throw createUnhandleNodeError(type);
}
var PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
	return resolveProps(node, PROPS_MODIFIER);
}
var PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
	const resolved = resolveProps(node, PROPS_KEY);
	if (resolved) return resolved;
	else throw createUnhandleNodeError(6);
}
function resolveProps(node, props, defaultValue) {
	for (let i = 0; i < props.length; i++) {
		const prop = props[i];
		if (hasOwn$1(node, prop) && node[prop] != null) return node[prop];
	}
	return defaultValue;
}
var AST_NODE_PROPS_KEYS = [
	...PROPS_BODY,
	...PROPS_CASES,
	...PROPS_STATIC,
	...PROPS_ITEMS,
	...PROPS_KEY,
	...PROPS_MODIFIER,
	...PROPS_VALUE,
	...PROPS_TYPE
];
function createUnhandleNodeError(type) {
	return /* @__PURE__ */ new Error(`unhandled node type: ${type}`);
}
function format(ast) {
	const msg = (ctx) => formatParts(ctx, ast);
	return msg;
}
function formatParts(ctx, ast) {
	const body = resolveBody(ast);
	if (body == null) throw createUnhandleNodeError(0);
	if (resolveType(body) === 1) {
		const cases = resolveCases(body);
		return ctx.plural(cases.reduce((messages, c) => [...messages, formatMessageParts(ctx, c)], []));
	} else return formatMessageParts(ctx, body);
}
function formatMessageParts(ctx, node) {
	const static_ = resolveStatic(node);
	if (static_ != null) return ctx.type === "text" ? static_ : ctx.normalize([static_]);
	else {
		const messages = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
		return ctx.normalize(messages);
	}
}
function formatMessagePart(ctx, node) {
	const type = resolveType(node);
	switch (type) {
		case 3: return resolveValue$1(node, type);
		case 9: return resolveValue$1(node, type);
		case 4: {
			const named = node;
			if (hasOwn$1(named, "k") && named.k) return ctx.interpolate(ctx.named(named.k));
			if (hasOwn$1(named, "key") && named.key) return ctx.interpolate(ctx.named(named.key));
			throw createUnhandleNodeError(type);
		}
		case 5: {
			const list = node;
			if (hasOwn$1(list, "i") && isNumber(list.i)) return ctx.interpolate(ctx.list(list.i));
			if (hasOwn$1(list, "index") && isNumber(list.index)) return ctx.interpolate(ctx.list(list.index));
			throw createUnhandleNodeError(type);
		}
		case 6: {
			const linked = node;
			const modifier = resolveLinkedModifier(linked);
			const key = resolveLinkedKey(linked);
			return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
		}
		case 7: return resolveValue$1(node, type);
		case 8: return resolveValue$1(node, type);
		default: throw new Error(`unhandled node on format message part: ${type}`);
	}
}
var defaultOnCacheKey = (message) => message;
var compileCache = create();
function baseCompile(message, options = {}) {
	let detectError = false;
	const onError = options.onError || defaultOnError;
	options.onError = (err) => {
		detectError = true;
		onError(err);
	};
	return {
		...baseCompile$1(message, options),
		detectError
	};
}
/* #__NO_SIDE_EFFECTS__ */
function compile(message, context) {
	if (isString(message)) {
		isBoolean(context.warnHtmlMessage) && context.warnHtmlMessage;
		const cacheKey = (context.onCacheKey || defaultOnCacheKey)(message);
		const cached = compileCache[cacheKey];
		if (cached) return cached;
		const { ast, detectError } = baseCompile(message, {
			...context,
			location: false,
			jit: true
		});
		const msg = format(ast);
		return !detectError ? compileCache[cacheKey] = msg : msg;
	} else {
		const cacheKey = message.cacheKey;
		if (cacheKey) {
			const cached = compileCache[cacheKey];
			if (cached) return cached;
			return compileCache[cacheKey] = format(message);
		} else return format(message);
	}
}
var CoreErrorCodes = {
	INVALID_ARGUMENT: 17,
	INVALID_DATE_ARGUMENT: 18,
	INVALID_ISO_DATE_ARGUMENT: 19,
	NOT_SUPPORT_LOCALE_PROMISE_VALUE: 21,
	NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: 22,
	NOT_SUPPORT_LOCALE_TYPE: 23
};
function createCoreError(code) {
	return createCompileError(code, null, void 0);
}
/** @internal */
function getLocale(context, options) {
	return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
var _resolveLocale;
/** @internal */
function resolveLocale(locale) {
	if (isString(locale)) return locale;
	else if (isFunction(locale)) {
		if (locale.resolvedOnce && _resolveLocale != null) return _resolveLocale;
		else if (locale.constructor.name === "Function") {
			const resolve = locale();
			if (isPromise(resolve)) throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
			return _resolveLocale = resolve;
		} else throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
	} else throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
}
/**
* Fallback with simple implemenation
*
* @remarks
* A fallback locale function implemented with a simple fallback algorithm.
*
* Basically, the chain consists of `start` plus the specified fallback: for a string or array `fallbackLocale`, the value as specified in the props is used; for a map `fallbackLocale`, the map's **keys** are used and the `default` key is skipped since it is not a locale name.
*
* @param ctx - A {@link CoreContext | context}
* @param fallback - A {@link FallbackLocale | fallback locale}
* @param start - A starting {@link Locale | locale}
*
* @returns Fallback locales
*
* @VueI18nGeneral
*/
function fallbackWithSimple(ctx, fallback, start) {
	return [.../* @__PURE__ */ new Set([start, ...isArray(fallback) ? fallback : isObject(fallback) ? Object.keys(fallback).filter((locale) => locale !== "default") : isString(fallback) ? [fallback] : [start]])];
}
/**
* Fallback with locale chain
*
* @remarks
* A fallback locale function implemented with a fallback chain algorithm. It's used in VueI18n as default.
*
* Chains are cached per fallback identity. If you mutate an object or array fallback in place,
* pass a new object or array instead so that the chain is recomputed.
*
* @param ctx - A {@link CoreContext | context}
* @param fallback - A {@link FallbackLocale | fallback locale}
* @param start - A starting {@link Locale | locale}
*
* @returns Fallback locales
*
* @VueI18nSee [Fallbacking](../guide/essentials/fallback)
*
* @VueI18nGeneral
*/
function fallbackWithLocaleChain(ctx, fallback, start) {
	const startLocale = isString(start) ? start : DEFAULT_LOCALE;
	const context = ctx;
	let chains;
	if (isObject(fallback)) {
		if (!context.__localeChainObjectCache) context.__localeChainObjectCache = /* @__PURE__ */ new WeakMap();
		chains = context.__localeChainObjectCache.get(fallback);
		if (!chains) {
			chains = /* @__PURE__ */ new Map();
			context.__localeChainObjectCache.set(fallback, chains);
		}
	} else {
		if (!context.__localeChainCache) context.__localeChainCache = /* @__PURE__ */ new Map();
		chains = context.__localeChainCache.get(fallback);
		if (!chains) {
			chains = /* @__PURE__ */ new Map();
			context.__localeChainCache.set(fallback, chains);
		}
	}
	const cached = chains.get(startLocale);
	if (cached) return cached;
	const chain = [];
	let block = [start];
	while (isArray(block)) block = appendBlockToChain(chain, block, fallback);
	const defaults = isArray(fallback) || !isPlainObject$1(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
	block = isString(defaults) ? [defaults] : defaults;
	if (isArray(block)) appendBlockToChain(chain, block, false);
	chains.set(startLocale, chain);
	return chain;
}
function appendBlockToChain(chain, block, blocks) {
	let follow = true;
	for (let i = 0; i < block.length && isBoolean(follow); i++) {
		const locale = block[i];
		if (isString(locale)) follow = appendLocaleToChain(chain, block[i], blocks);
	}
	return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
	let follow;
	const tokens = locale.split("-");
	do {
		follow = appendItemToChain(chain, tokens.join("-"), blocks);
		tokens.splice(-1, 1);
	} while (tokens.length && follow === true);
	return follow;
}
function appendItemToChain(chain, target, blocks) {
	let follow = false;
	if (!chain.includes(target)) {
		follow = true;
		if (target) {
			follow = target[target.length - 1] !== "!";
			const locale = target.replace(/!/g, "");
			chain.push(locale);
			if ((isArray(blocks) || isPlainObject$1(blocks)) && blocks[locale]) follow = blocks[locale];
		}
	}
	return follow;
}
var pathStateMachine = [];
pathStateMachine[0] = {
	["w"]: [0],
	["i"]: [3, 0],
	["["]: [4],
	["o"]: [7]
};
pathStateMachine[1] = {
	["w"]: [1],
	["."]: [2],
	["["]: [4],
	["o"]: [7]
};
pathStateMachine[2] = {
	["w"]: [2],
	["i"]: [3, 0],
	["0"]: [3, 0]
};
pathStateMachine[3] = {
	["i"]: [3, 0],
	["0"]: [3, 0],
	["w"]: [1, 1],
	["."]: [2, 1],
	["["]: [4, 1],
	["o"]: [7, 1]
};
pathStateMachine[4] = {
	["'"]: [5, 0],
	["\""]: [6, 0],
	["["]: [4, 2],
	["]"]: [1, 3],
	["o"]: 8,
	["l"]: [4, 0]
};
pathStateMachine[5] = {
	["'"]: [4, 0],
	["o"]: 8,
	["l"]: [5, 0]
};
pathStateMachine[6] = {
	["\""]: [4, 0],
	["o"]: 8,
	["l"]: [6, 0]
};
/**
* Check if an expression is a literal value.
*/
var literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
	return literalValueRE.test(exp);
}
/**
* Strip quotes from a string
*/
function stripQuotes(str) {
	const a = str.charCodeAt(0);
	return a === str.charCodeAt(str.length - 1) && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
/**
* Determine the type of a character in a keypath.
*/
function getPathCharType(ch) {
	if (ch === void 0 || ch === null) return "o";
	switch (ch.charCodeAt(0)) {
		case 91:
		case 93:
		case 46:
		case 34:
		case 39: return ch;
		case 95:
		case 36:
		case 45: return "i";
		case 9:
		case 10:
		case 13:
		case 160:
		case 65279:
		case 8232:
		case 8233: return "w";
	}
	return "i";
}
/**
* Format a subPath, return its plain form if it is
* a literal string or number. Otherwise prepend the
* dynamic indicator (*).
*/
function formatSubPath(path) {
	const trimmed = path.trim();
	if (path.charAt(0) === "0" && isNaN(parseInt(path))) return false;
	return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
/**
* Parse a string path into an array of segments
*/
function parse$1(path) {
	const keys = [];
	let index = -1;
	let mode = 0;
	let subPathDepth = 0;
	let c;
	let key;
	let newChar;
	let type;
	let transition;
	let action;
	let typeMap;
	const actions = [];
	actions[0] = () => {
		if (key === void 0) key = newChar;
		else key += newChar;
	};
	actions[1] = () => {
		if (key !== void 0) {
			keys.push(key);
			key = void 0;
		}
	};
	actions[2] = () => {
		actions[0]();
		subPathDepth++;
	};
	actions[3] = () => {
		if (subPathDepth > 0) {
			subPathDepth--;
			mode = 4;
			actions[0]();
		} else {
			subPathDepth = 0;
			if (key === void 0) return false;
			key = formatSubPath(key);
			if (key === false) return false;
			else actions[1]();
		}
	};
	function maybeUnescapeQuote() {
		const nextChar = path[index + 1];
		if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === "\"") {
			index++;
			newChar = "\\" + nextChar;
			actions[0]();
			return true;
		}
	}
	while (mode !== null) {
		index++;
		c = path[index];
		if (c === "\\" && maybeUnescapeQuote()) continue;
		type = getPathCharType(c);
		typeMap = pathStateMachine[mode];
		transition = typeMap[type] || typeMap["l"] || 8;
		if (transition === 8) return;
		mode = transition[0];
		if (transition[1] !== void 0) {
			action = actions[transition[1]];
			if (action) {
				newChar = c;
				if (action() === false) return;
			}
		}
		if (mode === 7) return keys;
	}
}
var cache = /* @__PURE__ */ new Map();
/**
* key-value message resolver
*
* @remarks
* Resolves messages with the key-value structure. Note that messages with a hierarchical structure such as objects cannot be resolved
*
* @param obj - A target object to be resolved with path
* @param path - A {@link Path | path} to resolve the value of message
*
* @returns A resolved {@link PathValue | path value}
*
* @VueI18nGeneral
*/
function resolveWithKeyValue(obj, path) {
	return isObject(obj) ? obj[path] : null;
}
/**
* message resolver
*
* @remarks
* Resolves messages. messages with a hierarchical structure such as objects can be resolved. This resolver is used in VueI18n as default.
*
* @param obj - A target object to be resolved with path
* @param path - A {@link Path | path} to resolve the value of message
*
* @returns A resolved {@link PathValue | path value}
*
* @VueI18nGeneral
*/
function resolveValue(obj, path) {
	if (!isObject(obj)) return null;
	let hit = cache.get(path);
	if (!hit) {
		hit = parse$1(path);
		if (hit) cache.set(path, hit);
	}
	if (!hit) return null;
	const len = hit.length;
	let last = obj;
	let i = 0;
	while (i < len) {
		const key = hit[i];
		/**
		* NOTE:
		* if `key` is intlify message format AST node key and `last` is intlify message format AST, skip it.
		* because the AST node is not a key-value structure.
		*/
		if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) return null;
		if (!isObject(last)) return null;
		if (!hasOwn$1(last, key)) return null;
		const val = last[key];
		if (val === void 0) return null;
		if (isFunction(last)) return null;
		last = val;
		i++;
	}
	return last;
}
/**
* Intlify core-base version
* @internal
*/
var VERSION$1 = "11.4.13";
var DEFAULT_LOCALE = "en-US";
var capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
	return {
		upper: (val, type) => {
			return type === "text" && isString(val) ? val.toUpperCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
		},
		lower: (val, type) => {
			return type === "text" && isString(val) ? val.toLowerCase() : type === "vnode" && isObject(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
		},
		capitalize: (val, type) => {
			return type === "text" && isString(val) ? capitalize(val) : type === "vnode" && isObject(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
		}
	};
}
var _compiler;
function registerMessageCompiler(compiler) {
	_compiler = compiler;
}
var _resolver;
/**
* Register the message resolver
*
* @param resolver - A {@link MessageResolver} function
*
* @VueI18nGeneral
*/
function registerMessageResolver(resolver) {
	_resolver = resolver;
}
var _fallbacker;
/**
* Register the locale fallbacker
*
* @param fallbacker - A {@link LocaleFallbacker} function
*
* @VueI18nGeneral
*/
function registerLocaleFallbacker(fallbacker) {
	_fallbacker = fallbacker;
}
var _fallbackContext = null;
var setFallbackContext = (context) => {
	_fallbackContext = context;
};
var getFallbackContext = () => _fallbackContext;
var _cid = 0;
function createCoreContext(options = {}) {
	const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
	const version = isString(options.version) ? options.version : VERSION$1;
	const locale = isString(options.locale) || isFunction(options.locale) ? options.locale : DEFAULT_LOCALE;
	const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale;
	const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject$1(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
	const messages = isPlainObject$1(options.messages) ? options.messages : createResources(_locale);
	const datetimeFormats = isPlainObject$1(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
	const numberFormats = isPlainObject$1(options.numberFormats) ? options.numberFormats : createResources(_locale);
	const modifiers = assign(create(), options.modifiers, getDefaultLinkedModifiers());
	const pluralRules = options.pluralRules || create();
	const missing = isFunction(options.missing) ? options.missing : null;
	const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
	const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
	const fallbackFormat = !!options.fallbackFormat;
	const unresolving = !!options.unresolving;
	const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
	const processor = isPlainObject$1(options.processor) ? options.processor : null;
	const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
	const escapeParameter = !!options.escapeParameter;
	const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
	const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
	const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
	const fallbackContext = isObject(options.fallbackContext) ? options.fallbackContext : void 0;
	const internalOptions = options;
	const __datetimeFormatters = isObject(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
	const __numberFormatters = isObject(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
	const __meta = isObject(internalOptions.__meta) ? internalOptions.__meta : {};
	_cid++;
	const context = {
		version,
		cid: _cid,
		locale,
		fallbackLocale,
		messages,
		modifiers,
		pluralRules,
		missing,
		missingWarn,
		fallbackWarn,
		fallbackFormat,
		unresolving,
		postTranslation,
		processor,
		warnHtmlMessage,
		escapeParameter,
		messageCompiler,
		messageResolver,
		localeFallbacker,
		fallbackContext,
		onWarn,
		__meta
	};
	context.datetimeFormats = datetimeFormats;
	context.numberFormats = numberFormats;
	context.__datetimeFormatters = __datetimeFormatters;
	context.__numberFormatters = __numberFormatters;
	return context;
}
var createResources = (locale) => ({ [locale]: create() });
/** @internal */
function handleMissing(context, key, locale, missingWarn, type) {
	const { missing, onWarn } = context;
	if (missing !== null) {
		const ret = missing(context, locale, key, type);
		return isString(ret) ? ret : key;
	} else return key;
}
function invalidateLocaleChainCache(ctx, fallback) {
	const context = ctx;
	if (isObject(fallback)) context.__localeChainObjectCache?.delete(fallback);
	else context.__localeChainCache?.delete(fallback);
}
/** @internal */
function updateFallbackLocale(ctx, locale, fallback) {
	invalidateLocaleChainCache(ctx, fallback);
	if (ctx.fallbackContext) invalidateLocaleChainCache(ctx.fallbackContext, fallback);
	ctx.localeFallbacker(ctx, fallback, locale);
}
/** @internal */
function isAlmostSameLocale(locale, compareLocale) {
	if (locale === compareLocale) return false;
	return locale.split("-")[0] === compareLocale.split("-")[0];
}
/** @internal */
function isImplicitFallback(targetLocale, locales) {
	const index = locales.indexOf(targetLocale);
	if (index === -1) return false;
	for (let i = index + 1; i < locales.length; i++) if (isAlmostSameLocale(targetLocale, locales[i])) return true;
	return false;
}
function resolveFormatLocale(context, key, locale, formats, missingWarn, fallbackWarn, type) {
	const { fallbackLocale, localeFallbacker, onWarn } = context;
	const locales = localeFallbacker(context, fallbackLocale, locale);
	for (let i = 0; i < locales.length; i++) {
		const targetLocale = locales[i];
		const format = (formats[targetLocale] || {})[key];
		if (isPlainObject$1(format) && isString(targetLocale)) return targetLocale;
		handleMissing(context, key, targetLocale, missingWarn, type);
	}
	return null;
}
function getFormatterCacheKey(locale, key, overrides) {
	let id = `${locale}__${key}`;
	if (isPlainObject$1(overrides) && !isEmptyObject(overrides)) id = `${id}__${JSON.stringify(overrides)}`;
	return id;
}
function clearFormatCache(formatters, locale, format) {
	for (const key in format) {
		const prefix = `${locale}__${key}`;
		for (const id of formatters.keys()) if (id === prefix || id.startsWith(`${prefix}__`)) formatters.delete(id);
	}
}
function parseFormatArgs(args, options, initialOverrides, optionsKeys) {
	const [, arg2, arg3, arg4] = args;
	let overrides = initialOverrides;
	if (isString(arg2)) options.key = arg2;
	else if (isPlainObject$1(arg2)) Object.keys(arg2).forEach((key) => {
		if (optionsKeys.includes(key)) overrides[key] = arg2[key];
		else options[key] = arg2[key];
	});
	if (isString(arg3)) options.locale = arg3;
	else if (isPlainObject$1(arg3)) overrides = arg3;
	if (isPlainObject$1(arg4)) overrides = arg4;
	return overrides;
}
function datetime(context, ...args) {
	const { datetimeFormats, unresolving, onWarn } = context;
	const { __datetimeFormatters } = context;
	if (!isString(args[0]) && !isDate(args[0]) && !isNumber(args[0])) return "";
	const [key, value, options, overrides] = parseDateTimeArgs(...args);
	const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
	const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
	const part = !!options.part;
	const locale = getLocale(context, options);
	if (!isString(key) || key === "") {
		const formatter = new Intl.DateTimeFormat(locale.replace(/!/g, ""), overrides);
		return !part ? formatter.format(value) : formatter.formatToParts(value);
	}
	const targetLocale = resolveFormatLocale(context, key, locale, datetimeFormats, missingWarn, fallbackWarn, "datetime format");
	if (!isString(targetLocale)) return unresolving ? -1 : key;
	const format = datetimeFormats[targetLocale][key];
	const id = getFormatterCacheKey(targetLocale, key, overrides);
	let formatter = __datetimeFormatters.get(id);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format, overrides));
		__datetimeFormatters.set(id, formatter);
	}
	return !part ? formatter.format(value) : formatter.formatToParts(value);
}
/** @internal */
var DATETIME_FORMAT_OPTIONS_KEYS = [
	"localeMatcher",
	"weekday",
	"era",
	"year",
	"month",
	"day",
	"hour",
	"minute",
	"second",
	"timeZoneName",
	"formatMatcher",
	"hour12",
	"timeZone",
	"dateStyle",
	"timeStyle",
	"calendar",
	"dayPeriod",
	"numberingSystem",
	"hourCycle",
	"fractionalSecondDigits"
];
/** @internal */
function parseDateTimeArgs(...args) {
	const [arg1] = args;
	const options = create();
	const initialOverrides = create();
	let value;
	if (isString(arg1)) {
		const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
		if (!matches) throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
		const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
		value = new Date(dateTime);
		try {
			value.toISOString();
		} catch {
			throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
		}
	} else if (isDate(arg1)) {
		if (isNaN(arg1.getTime())) throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
		value = arg1;
	} else if (isNumber(arg1)) value = arg1;
	else throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
	const overrides = parseFormatArgs(args, options, initialOverrides, DATETIME_FORMAT_OPTIONS_KEYS);
	return [
		options.key || "",
		value,
		options,
		overrides
	];
}
/** @internal */
function clearDateTimeFormat(ctx, locale, format) {
	clearFormatCache(ctx.__datetimeFormatters, locale, format);
}
function number(context, ...args) {
	const { numberFormats, unresolving, onWarn } = context;
	const { __numberFormatters } = context;
	if (!isNumber(args[0])) return "";
	const [key, value, options, overrides] = parseNumberArgs(...args);
	const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
	const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
	const part = !!options.part;
	const locale = getLocale(context, options);
	if (!isString(key) || key === "") {
		const formatter = new Intl.NumberFormat(locale.replace(/!/g, ""), overrides);
		return !part ? formatter.format(value) : formatter.formatToParts(value);
	}
	const targetLocale = resolveFormatLocale(context, key, locale, numberFormats, missingWarn, fallbackWarn, "number format");
	if (!isString(targetLocale)) return unresolving ? -1 : key;
	const format = numberFormats[targetLocale][key];
	const id = getFormatterCacheKey(targetLocale, key, overrides);
	let formatter = __numberFormatters.get(id);
	if (!formatter) {
		formatter = new Intl.NumberFormat(targetLocale, assign({}, format, overrides));
		__numberFormatters.set(id, formatter);
	}
	return !part ? formatter.format(value) : formatter.formatToParts(value);
}
/** @internal */
var NUMBER_FORMAT_OPTIONS_KEYS = [
	"localeMatcher",
	"style",
	"currency",
	"currencyDisplay",
	"currencySign",
	"useGrouping",
	"minimumIntegerDigits",
	"minimumFractionDigits",
	"maximumFractionDigits",
	"minimumSignificantDigits",
	"maximumSignificantDigits",
	"compactDisplay",
	"notation",
	"signDisplay",
	"unit",
	"unitDisplay",
	"roundingMode",
	"roundingPriority",
	"roundingIncrement",
	"trailingZeroDisplay"
];
/** @internal */
function parseNumberArgs(...args) {
	const [arg1] = args;
	const options = create();
	const initialOverrides = create();
	if (!isNumber(arg1)) throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
	const value = arg1;
	const overrides = parseFormatArgs(args, options, initialOverrides, NUMBER_FORMAT_OPTIONS_KEYS);
	return [
		options.key || "",
		value,
		options,
		overrides
	];
}
/** @internal */
function clearNumberFormat(ctx, locale, format) {
	clearFormatCache(ctx.__numberFormatters, locale, format);
}
var DEFAULT_MODIFIER = (str) => str;
var DEFAULT_MESSAGE = (ctx) => "";
var DEFAULT_MESSAGE_DATA_TYPE = "text";
var DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join(values);
var DEFAULT_INTERPOLATE = toDisplayString$1;
function pluralDefault(choice, choicesLength) {
	choice = Math.abs(choice);
	if (choicesLength === 2) return choice === 1 ? 0 : 1;
	return Math.min(choice, 2);
}
function getPluralIndex(options) {
	const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
	return isNumber(options.named?.count) ? options.named.count : isNumber(options.named?.n) ? options.named.n : index;
}
function createMessageContext(options = {}) {
	const locale = options.locale;
	const pluralIndex = getPluralIndex(options);
	const pluralRule = isString(locale) && isFunction(options.pluralRules?.[locale]) ? options.pluralRules[locale] : pluralDefault;
	const orgPluralRule = pluralRule === pluralDefault ? void 0 : pluralDefault;
	const plural = (messages) => messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
	const _list = options.list || [];
	const list = (index) => _list[index];
	const _named = options.named || create();
	if (isNumber(options.pluralIndex)) {
		_named.count ||= options.pluralIndex;
		_named.n ||= options.pluralIndex;
	}
	const named = (key) => _named[key];
	function message(key, useLinked) {
		const msg = isFunction(options.messages) ? options.messages(key, !!useLinked) : isObject(options.messages) ? options.messages[key] : false;
		return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
	}
	const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
	const normalize = isFunction(options.processor?.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
	const interpolate = isFunction(options.processor?.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
	const type = isString(options.processor?.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
	const linked = (key, ...args) => {
		const [arg1, arg2] = args;
		let type = "text";
		let modifier = "";
		if (args.length === 1) {
			if (isObject(arg1)) {
				modifier = arg1.modifier || modifier;
				type = arg1.type || type;
			} else if (isString(arg1)) modifier = arg1 || modifier;
		} else if (args.length === 2) {
			if (isString(arg1)) modifier = arg1 || modifier;
			if (isString(arg2)) type = arg2 || type;
		}
		const ret = message(key, true)(ctx);
		const resolved = ret === "" || ret === void 0 ? key : ret;
		const msg = type === "vnode" && isArray(resolved) && modifier ? resolved[0] : resolved;
		return modifier ? _modifier(modifier)(msg, type) : msg;
	};
	const ctx = {
		["list"]: list,
		["named"]: named,
		["plural"]: plural,
		["linked"]: linked,
		["message"]: message,
		["type"]: type,
		["interpolate"]: interpolate,
		["normalize"]: normalize,
		["values"]: assign(create(), _list, _named)
	};
	return ctx;
}
var NOOP_MESSAGE_FUNCTION = () => "";
var isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
	const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
	const [key, options] = parseTranslateArgs(...args);
	const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
	const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
	const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
	const resolvedMessage = !!options.resolvedMessage;
	const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : null;
	const enableDefaultMsg = fallbackFormat || defaultMsgOrKey != null && (isString(defaultMsgOrKey) || isFunction(defaultMsgOrKey));
	const locale = getLocale(context, options);
	escapeParameter && escapeParams(options);
	let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
		key,
		locale,
		messages[locale] || create()
	];
	let format = formatScope;
	let cacheBaseKey = key;
	if (!resolvedMessage && !(isString(format) || isMessageAST(format) || isMessageFunction(format))) {
		if (enableDefaultMsg) {
			format = defaultMsgOrKey;
			cacheBaseKey = format;
		}
	}
	if (!resolvedMessage && (!(isString(format) || isMessageAST(format) || isMessageFunction(format)) || !isString(targetLocale))) return unresolving ? -1 : key;
	let occurred = false;
	const onError = () => {
		occurred = true;
	};
	const msg = !isMessageFunction(format) ? compileMessageFormat(context, key, targetLocale, format, cacheBaseKey, onError) : format;
	if (occurred) return format;
	const messaged = evaluateMessage(context, msg, createMessageContext(getMessageContextOptions(context, targetLocale, message, options)));
	let ret = postTranslation ? postTranslation(messaged, key) : messaged;
	if (escapeParameter && isString(ret)) ret = sanitizeTranslatedHtml(ret);
	return ret;
}
function escapeParams(options) {
	if (isArray(options.list)) options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
	else if (isObject(options.named)) Object.keys(options.named).forEach((key) => {
		if (isString(options.named[key])) options.named[key] = escapeHtml(options.named[key]);
	});
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
	const { messages, onWarn, messageResolver: resolveValue, localeFallbacker } = context;
	const locales = localeFallbacker(context, fallbackLocale, locale);
	let message = create();
	let targetLocale;
	let format = null;
	const type = "translate";
	for (let i = 0; i < locales.length; i++) {
		targetLocale = locales[i];
		message = messages[targetLocale] || create();
		if ((format = resolveValue(message, key)) === null) format = message[key];
		if (isString(format) || isMessageAST(format) || isMessageFunction(format)) break;
		if (!isImplicitFallback(targetLocale, locales)) {
			const missingRet = handleMissing(context, key, targetLocale, missingWarn, type);
			if (missingRet !== key) format = missingRet;
		}
	}
	return [
		format,
		targetLocale,
		message
	];
}
function compileMessageFormat(context, key, targetLocale, format, cacheBaseKey, onError) {
	const { messageCompiler, warnHtmlMessage } = context;
	if (isMessageFunction(format)) {
		const msg = format;
		msg.locale = msg.locale || targetLocale;
		msg.key = msg.key || key;
		return msg;
	}
	if (messageCompiler == null) {
		const msg = (() => format);
		msg.locale = targetLocale;
		msg.key = key;
		return msg;
	}
	const msg = messageCompiler(format, getCompileContext(context, targetLocale, cacheBaseKey, format, warnHtmlMessage, onError));
	msg.locale = targetLocale;
	msg.key = key;
	msg.source = format;
	return msg;
}
function evaluateMessage(context, msg, msgCtx) {
	return msg(msgCtx);
}
/** @internal */
function parseTranslateArgs(...args) {
	const [arg1, arg2, arg3] = args;
	const options = create();
	if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
	const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
	if (isNumber(arg2)) options.plural = arg2;
	else if (isString(arg2)) options.default = arg2;
	else if (isPlainObject$1(arg2) && !isEmptyObject(arg2)) options.named = arg2;
	else if (isArray(arg2)) options.list = arg2;
	if (isNumber(arg3)) options.plural = arg3;
	else if (isString(arg3)) options.default = arg3;
	else if (isPlainObject$1(arg3)) assign(options, arg3);
	return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
	return {
		locale,
		key,
		warnHtmlMessage,
		onError: (err) => {
			onError && onError(err);
			throw err;
		},
		onCacheKey: (source) => generateFormatCacheKey(locale, key, source)
	};
}
function getMessageContextOptions(context, locale, message, options) {
	const { modifiers, pluralRules, messageResolver: resolveValue, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
	const resolveMessage = (key, useLinked) => {
		let val = resolveValue(message, key);
		if (val == null && (fallbackContext || useLinked)) {
			const [format, , message] = resolveMessageFormat(fallbackContext || context, key, locale, fallbackLocale, fallbackWarn, missingWarn);
			val = format ?? resolveValue(message, key);
		}
		if (isString(val) || isMessageAST(val)) {
			let occurred = false;
			const onError = () => {
				occurred = true;
			};
			const msg = compileMessageFormat(context, key, locale, val, key, onError);
			return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
		} else if (isMessageFunction(val)) return val;
		else return NOOP_MESSAGE_FUNCTION;
	};
	const ctxOptions = {
		locale,
		modifiers,
		pluralRules,
		messages: resolveMessage
	};
	if (context.processor) ctxOptions.processor = context.processor;
	if (options.list) ctxOptions.list = options.list;
	if (options.named) ctxOptions.named = options.named;
	if (isNumber(options.plural)) ctxOptions.pluralIndex = options.plural;
	return ctxOptions;
}
//#endregion
//#region node_modules/vue-i18n/dist/vue-i18n.mjs
/*!
* vue-i18n v11.4.13
* (c) 2026 kazuya kawaguchi
* Released under the MIT License.
*/
/**
* Vue I18n Version
*
* @remarks
* Semver format. Same format as the package.json `version` field.
*
* @VueI18nGeneral
*/
var VERSION = "11.4.13";
var I18nErrorCodes = {
	UNEXPECTED_RETURN_TYPE: 24,
	INVALID_ARGUMENT: 25,
	MUST_BE_CALL_SETUP_TOP: 26,
	NOT_INSTALLED: 27,
	REQUIRED_VALUE: 28,
	INVALID_VALUE: 29,
	NOT_INSTALLED_WITH_PROVIDE: 31,
	UNEXPECTED_ERROR: 32,
	NOT_AVAILABLE_COMPOSITION_IN_LEGACY: 34
};
function createI18nError(code, ...args) {
	return createCompileError(code, null, void 0);
}
var TranslateVNodeSymbol = /* #__PURE__*/ makeSymbol("__translateVNode");
var DatetimePartsSymbol = /* #__PURE__*/ makeSymbol("__datetimeParts");
var NumberPartsSymbol = /* #__PURE__*/ makeSymbol("__numberParts");
var SetPluralRulesSymbol = makeSymbol("__setPluralRules");
var InejctWithOptionSymbol = /* #__PURE__*/ makeSymbol("__injectWithOption");
var DisposeSymbol = /* #__PURE__*/ makeSymbol("__dispose");
var mirroredCurrentInstance = null;
{
	const setters = getGlobalThis().__VUE_INSTANCE_SETTERS__;
	if (isArray(setters)) setters.push((instance) => {
		mirroredCurrentInstance = instance;
	});
}
/**
* Transform flat json in obj to normal json in obj
*/
function handleFlatJson(obj) {
	if (!isObject(obj)) return obj;
	if (isMessageAST(obj)) return obj;
	for (const key in obj) {
		if (!hasOwn$1(obj, key)) continue;
		if (!key.includes(".")) {
			if (isObject(obj[key])) handleFlatJson(obj[key]);
		} else {
			const subKeys = key.split(".");
			const lastIndex = subKeys.length - 1;
			let currentObj = obj;
			let hasStringValue = false;
			for (let i = 0; i < lastIndex; i++) {
				if (subKeys[i] === "__proto__") throw new Error(`unsafe key: ${subKeys[i]}`);
				if (!(subKeys[i] in currentObj)) currentObj[subKeys[i]] = create();
				if (!isObject(currentObj[subKeys[i]])) {
					hasStringValue = true;
					break;
				}
				currentObj = currentObj[subKeys[i]];
			}
			if (!hasStringValue) {
				if (!isMessageAST(currentObj)) {
					currentObj[subKeys[lastIndex]] = obj[key];
					delete obj[key];
				} else if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) delete obj[key];
			}
			if (!isMessageAST(currentObj)) {
				const target = currentObj[subKeys[lastIndex]];
				if (isObject(target)) handleFlatJson(target);
			}
		}
	}
	return obj;
}
function getLocaleMessages(locale, options) {
	const { messages, __i18n, messageResolver, flatJson } = options;
	const ret = isPlainObject$1(messages) ? messages : isArray(__i18n) ? create() : { [locale]: create() };
	if (isArray(__i18n)) __i18n.forEach((custom) => {
		if ("locale" in custom && "resource" in custom) {
			const { locale, resource } = custom;
			if (locale) {
				ret[locale] = ret[locale] || create();
				deepCopy(resource, ret[locale]);
			} else deepCopy(resource, ret);
		} else isString(custom) && deepCopy(JSON.parse(custom), ret);
	});
	if (messageResolver == null && flatJson) {
		for (const key in ret) if (hasOwn$1(ret, key)) handleFlatJson(ret[key]);
	}
	return ret;
}
function getComponentOptions(instance) {
	return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
	let messages = isObject(options.messages) ? options.messages : create();
	if ("__i18nGlobal" in componentOptions) messages = getLocaleMessages(gl.locale.value, {
		messages,
		__i18n: componentOptions.__i18nGlobal
	});
	const locales = Object.keys(messages);
	if (locales.length) locales.forEach((locale) => {
		gl.mergeLocaleMessage(locale, messages[locale]);
	});
	if (isObject(options.datetimeFormats)) {
		const locales = Object.keys(options.datetimeFormats);
		if (locales.length) locales.forEach((locale) => {
			gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
		});
	}
	if (isObject(options.numberFormats)) {
		const locales = Object.keys(options.numberFormats);
		if (locales.length) locales.forEach((locale) => {
			gl.mergeNumberFormat(locale, options.numberFormats[locale]);
		});
	}
}
function createTextNode(key) {
	return createVNode(Text, null, key, 0);
}
function getCurrentInstance$1() {
	return mirroredCurrentInstance ?? getCurrentInstance();
}
var NOOP_RETURN_ARRAY = () => [];
var NOOP_RETURN_FALSE = () => false;
var composerID = 0;
function defineCoreMissingHandler(missing) {
	return ((ctx, locale, key, type) => {
		return missing(locale, key, getCurrentInstance$1() || void 0, type);
	});
}
/**
* Create composer interface factory
*
* @internal
*/
function createComposer(options = {}) {
	const { __root, __injectWithOption } = options;
	const _isGlobal = __root === void 0;
	const flatJson = options.flatJson;
	const _ref = shallowRef;
	let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
	const _locale = _ref(__root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : DEFAULT_LOCALE);
	const _fallbackLocale = _ref(__root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject$1(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value);
	const _messages = _ref(getLocaleMessages(_locale.value, options));
	const _datetimeFormats = _ref(isPlainObject$1(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
	const _numberFormats = _ref(isPlainObject$1(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
	let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
	let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
	let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
	let _fallbackFormat = !!options.fallbackFormat;
	let _missing = isFunction(options.missing) ? options.missing : null;
	let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
	let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
	let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
	let _escapeParameter = !!options.escapeParameter;
	const _modifiers = __root ? __root.modifiers : isPlainObject$1(options.modifiers) ? options.modifiers : {};
	let _pluralRules = options.pluralRules || __root && __root.pluralRules;
	let _context;
	const getCoreContext = () => {
		_isGlobal && setFallbackContext(null);
		const ctxOptions = {
			version: VERSION,
			locale: _locale.value,
			fallbackLocale: _fallbackLocale.value,
			messages: _messages.value,
			modifiers: _modifiers,
			pluralRules: _pluralRules,
			missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
			missingWarn: _missingWarn,
			fallbackWarn: _fallbackWarn,
			fallbackFormat: _fallbackFormat,
			unresolving: true,
			postTranslation: _postTranslation === null ? void 0 : _postTranslation,
			warnHtmlMessage: _warnHtmlMessage,
			escapeParameter: _escapeParameter,
			messageResolver: options.messageResolver,
			messageCompiler: options.messageCompiler,
			__meta: { framework: "vue" }
		};
		ctxOptions.datetimeFormats = _datetimeFormats.value;
		ctxOptions.numberFormats = _numberFormats.value;
		ctxOptions.__datetimeFormatters = isPlainObject$1(_context) ? _context.__datetimeFormatters : void 0;
		ctxOptions.__numberFormatters = isPlainObject$1(_context) ? _context.__numberFormatters : void 0;
		const ctx = createCoreContext(ctxOptions);
		_isGlobal && setFallbackContext(ctx);
		return ctx;
	};
	_context = getCoreContext();
	updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
	function trackReactivityValues() {
		return [
			_locale.value,
			_fallbackLocale.value,
			_messages.value,
			_datetimeFormats.value,
			_numberFormats.value
		];
	}
	const locale = computed({
		get: () => _locale.value,
		set: (val) => {
			_context.locale = val;
			_locale.value = val;
		}
	});
	function updateFallbackLocaleWithRoot(fallback) {
		if (!_isGlobal) _context.fallbackContext = __root ? getFallbackContext() : void 0;
		try {
			updateFallbackLocale(_context, _locale.value, fallback);
		} finally {
			if (!_isGlobal) _context.fallbackContext = void 0;
		}
	}
	const fallbackLocale = computed({
		get: () => _fallbackLocale.value,
		set: (val) => {
			_fallbackLocale.value = val;
			_context.fallbackLocale = _fallbackLocale.value;
			updateFallbackLocaleWithRoot(_fallbackLocale.value);
		}
	});
	const messages = computed(() => _messages.value);
	const datetimeFormats = /* #__PURE__*/ computed(() => _datetimeFormats.value);
	const numberFormats = /* #__PURE__*/ computed(() => _numberFormats.value);
	function getPostTranslationHandler() {
		return isFunction(_postTranslation) ? _postTranslation : null;
	}
	function setPostTranslationHandler(handler) {
		_postTranslation = handler;
		_context.postTranslation = handler;
	}
	function getMissingHandler() {
		return _missing;
	}
	function setMissingHandler(handler) {
		if (handler !== null) _runtimeMissing = defineCoreMissingHandler(handler);
		_missing = handler;
		_context.missing = _runtimeMissing;
	}
	const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
		trackReactivityValues();
		let ret;
		try {
			if (!_isGlobal) _context.fallbackContext = __root ? getFallbackContext() : void 0;
			ret = fn(_context);
		} finally {
			if (!_isGlobal) _context.fallbackContext = void 0;
		}
		if (warnType !== "translate exists" && isNumber(ret) && ret === -1 || warnType === "translate exists" && !ret) {
			const [key, arg2] = argumentParser();
			return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
		} else if (successCondition(ret)) return ret;
		else
 /* istanbul ignore next */
		throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
	};
	function t(...args) {
		return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString(val));
	}
	function rt(...args) {
		const [arg1, arg2, arg3] = args;
		if (arg3 && !isObject(arg3)) throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
		return t(...[
			arg1,
			arg2,
			assign({ resolvedMessage: true }, arg3 || {})
		]);
	}
	function d(...args) {
		return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => "", (val) => isString(val) || isArray(val));
	}
	function n(...args) {
		return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => "", (val) => isString(val) || isArray(val));
	}
	function normalize(values) {
		return values.map((val) => isString(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
	}
	const interpolate = (val) => val;
	const processor = {
		normalize,
		interpolate,
		type: "vnode"
	};
	function translateVNode(...args) {
		return wrapWithDeps((context) => {
			let ret;
			const _context = context;
			try {
				_context.processor = processor;
				ret = Reflect.apply(translate, null, [_context, ...args]);
			} finally {
				_context.processor = null;
			}
			return ret;
		}, () => parseTranslateArgs(...args), "translate", (root) => root[TranslateVNodeSymbol](...args), (key) => [createTextNode(key)], (val) => isArray(val));
	}
	function numberParts(...args) {
		return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => root[NumberPartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
	}
	function datetimeParts(...args) {
		return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => root[DatetimePartsSymbol](...args), NOOP_RETURN_ARRAY, (val) => isString(val) || isArray(val));
	}
	function setPluralRules(rules) {
		_pluralRules = rules;
		_context.pluralRules = _pluralRules;
	}
	function te(key, locale) {
		return wrapWithDeps(() => {
			if (!key) return false;
			const targetLocale = isString(locale) ? locale : _locale.value;
			const locales = isString(locale) ? [targetLocale] : fallbackWithLocaleChain(_context, _fallbackLocale.value, targetLocale);
			for (let i = 0; i < locales.length; i++) {
				const message = getLocaleMessage(locales[i]);
				let resolved = _context.messageResolver(message, key);
				if (resolved === null) resolved = message[key];
				if (isMessageAST(resolved) || isMessageFunction(resolved) || isString(resolved)) return true;
			}
			return false;
		}, () => [key], "translate exists", (root) => {
			return Reflect.apply(root.te, root, [key, locale]);
		}, NOOP_RETURN_FALSE, (val) => isBoolean(val));
	}
	function resolveMessages(key) {
		let messages = null;
		const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
		for (let i = 0; i < locales.length; i++) {
			const targetLocaleMessages = _messages.value[locales[i]] || {};
			const messageValue = _context.messageResolver(targetLocaleMessages, key);
			if (messageValue != null) {
				messages = messageValue;
				break;
			}
		}
		return messages;
	}
	function tm(key) {
		const messages = resolveMessages(key);
		return messages != null ? messages : __root ? __root.tm(key) || {} : {};
	}
	function getLocaleMessage(locale) {
		return _messages.value[locale] || {};
	}
	function setLocaleMessage(locale, message) {
		if (flatJson) {
			const _message = { [locale]: message };
			for (const key in _message) if (hasOwn$1(_message, key)) handleFlatJson(_message[key]);
			message = _message[locale];
		}
		_messages.value[locale] = message;
		_context.messages = _messages.value;
	}
	function mergeLocaleMessage(locale, message) {
		_messages.value[locale] = _messages.value[locale] || {};
		const _message = { [locale]: message };
		if (flatJson) {
			for (const key in _message) if (hasOwn$1(_message, key)) handleFlatJson(_message[key]);
		}
		message = _message[locale];
		deepCopy(message, _messages.value[locale]);
		_context.messages = _messages.value;
	}
	function getDateTimeFormat(locale) {
		return _datetimeFormats.value[locale] || {};
	}
	function setDateTimeFormat(locale, format) {
		_datetimeFormats.value[locale] = format;
		_context.datetimeFormats = _datetimeFormats.value;
		clearDateTimeFormat(_context, locale, format);
	}
	function mergeDateTimeFormat(locale, format) {
		_datetimeFormats.value[locale] = assign(_datetimeFormats.value[locale] || {}, format);
		_context.datetimeFormats = _datetimeFormats.value;
		clearDateTimeFormat(_context, locale, format);
	}
	function getNumberFormat(locale) {
		return _numberFormats.value[locale] || {};
	}
	function setNumberFormat(locale, format) {
		_numberFormats.value[locale] = format;
		_context.numberFormats = _numberFormats.value;
		clearNumberFormat(_context, locale, format);
	}
	function mergeNumberFormat(locale, format) {
		_numberFormats.value[locale] = assign(_numberFormats.value[locale] || {}, format);
		_context.numberFormats = _numberFormats.value;
		clearNumberFormat(_context, locale, format);
	}
	composerID++;
	watch(_fallbackLocale, () => updateFallbackLocaleWithRoot(_fallbackLocale.value), {
		deep: true,
		flush: "sync"
	});
	const composer = {
		id: composerID,
		locale,
		fallbackLocale,
		get inheritLocale() {
			return _inheritLocale;
		},
		set inheritLocale(val) {
			_inheritLocale = val;
			if (val && __root) {
				locale.value = __root.locale.value;
				fallbackLocale.value = __root.fallbackLocale.value;
			}
		},
		get availableLocales() {
			return Object.keys(_messages.value).sort();
		},
		messages,
		get modifiers() {
			return _modifiers;
		},
		get pluralRules() {
			return _pluralRules || {};
		},
		get isGlobal() {
			return _isGlobal;
		},
		get missingWarn() {
			return _missingWarn;
		},
		set missingWarn(val) {
			_missingWarn = val;
			_context.missingWarn = _missingWarn;
		},
		get fallbackWarn() {
			return _fallbackWarn;
		},
		set fallbackWarn(val) {
			_fallbackWarn = val;
			_context.fallbackWarn = _fallbackWarn;
		},
		get fallbackRoot() {
			return _fallbackRoot;
		},
		set fallbackRoot(val) {
			_fallbackRoot = val;
		},
		get fallbackFormat() {
			return _fallbackFormat;
		},
		set fallbackFormat(val) {
			_fallbackFormat = val;
			_context.fallbackFormat = _fallbackFormat;
		},
		get warnHtmlMessage() {
			return _warnHtmlMessage;
		},
		set warnHtmlMessage(val) {
			_warnHtmlMessage = val;
			_context.warnHtmlMessage = val;
		},
		get escapeParameter() {
			return _escapeParameter;
		},
		set escapeParameter(val) {
			_escapeParameter = val;
			_context.escapeParameter = val;
		},
		t,
		getLocaleMessage,
		setLocaleMessage,
		mergeLocaleMessage,
		getPostTranslationHandler,
		setPostTranslationHandler,
		getMissingHandler,
		setMissingHandler,
		[SetPluralRulesSymbol]: setPluralRules
	};
	composer.datetimeFormats = datetimeFormats;
	composer.numberFormats = numberFormats;
	composer.rt = rt;
	composer.te = te;
	composer.tm = tm;
	composer.d = d;
	composer.n = n;
	composer.getDateTimeFormat = getDateTimeFormat;
	composer.setDateTimeFormat = setDateTimeFormat;
	composer.mergeDateTimeFormat = mergeDateTimeFormat;
	composer.getNumberFormat = getNumberFormat;
	composer.setNumberFormat = setNumberFormat;
	composer.mergeNumberFormat = mergeNumberFormat;
	composer[InejctWithOptionSymbol] = __injectWithOption;
	composer[TranslateVNodeSymbol] = translateVNode;
	composer[DatetimePartsSymbol] = datetimeParts;
	composer[NumberPartsSymbol] = numberParts;
	return composer;
}
var baseFormatProps = {
	tag: { type: [String, Object] },
	locale: { type: String },
	scope: {
		type: String,
		validator: (val) => val === "parent" || val === "global",
		default: "parent"
	},
	i18n: { type: Object }
};
function getInterpolateArg({ slots }, keys) {
	if (keys.length === 1 && keys[0] === "default") return (slots.default ? slots.default() : []).reduce((slot, current) => {
		return [...slot, ...current.type === Fragment ? current.children : [current]];
	}, []);
	else return keys.reduce((arg, key) => {
		const slot = slots[key];
		if (slot) arg[key] = slot();
		return arg;
	}, create());
}
function getFragmentableTag() {
	return Fragment;
}
/**
* export the public type for h/tsx inference
* also to avoid inline import() in generated d.ts files
*/
/**
* Translation Component
*
* @remarks
* See the following items for property about details
*
* @VueI18nSee [TranslationProps](component#translationprops)
* @VueI18nSee [BaseFormatProps](component#baseformatprops)
* @VueI18nSee [Component Interpolation](../guide/advanced/component)
*
* @example
* ```html
* <div id="app">
*   <!-- ... -->
*   <i18n keypath="term" tag="label" for="tos">
*     <a :href="url" target="_blank">{{ $t('tos') }}</a>
*   </i18n>
*   <!-- ... -->
* </div>
* ```
* ```js
* import { createApp } from 'vue'
* import { createI18n } from 'vue-i18n'
*
* const messages = {
*   en: {
*     tos: 'Term of Service',
*     term: 'I accept xxx {0}.'
*   },
*   ja: {
*     tos: '利用規約',
*     term: '私は xxx の{0}に同意します。'
*   }
* }
*
* const i18n = createI18n({
*   locale: 'en',
*   messages
* })
*
* const app = createApp({
*   data: {
*     url: '/term'
*   }
* }).use(i18n).mount('#app')
* ```
*
* @VueI18nComponent
*/
var Translation = /* @__PURE__ */ defineComponent({
	name: "i18n-t",
	props: assign({
		keypath: {
			type: String,
			required: true
		},
		plural: {
			type: [Number, String],
			validator: (val) => isNumber(val) || !isNaN(val)
		}
	}, baseFormatProps),
	setup(props, context) {
		const { slots, attrs } = context;
		const i18n = props.i18n || useI18n({
			useScope: props.scope,
			__useComponent: true
		});
		return () => {
			const renderChildren = () => {
				const keys = Object.keys(slots).filter((key) => key[0] !== "_");
				const options = create();
				if (props.locale) options.locale = props.locale;
				if (props.plural !== void 0) options.plural = isString(props.plural) ? +props.plural : props.plural;
				const arg = getInterpolateArg(context, keys);
				return i18n[TranslateVNodeSymbol](props.keypath, arg, options);
			};
			const assignedAttrs = assign(create(), attrs);
			const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
			return isObject(tag) ? h(tag, assignedAttrs, { default: renderChildren }) : h(tag, assignedAttrs, renderChildren());
		};
	}
});
function isVNode$1(target) {
	return isArray(target) && !isString(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
	const { slots, attrs } = context;
	return () => {
		const renderChildren = () => {
			const options = { part: true };
			let overrides = create();
			if (props.locale) options.locale = props.locale;
			if (isString(props.format)) options.key = props.format;
			else if (isObject(props.format)) {
				if (isString(props.format.key)) options.key = props.format.key;
				overrides = Object.keys(props.format).reduce((options, prop) => {
					return slotKeys.includes(prop) ? assign(create(), options, { [prop]: props.format[prop] }) : options;
				}, create());
			}
			const parts = partFormatter(...[
				props.value,
				options,
				overrides
			]);
			let children = [options.key];
			if (isArray(parts)) children = parts.map((part, index) => {
				const slot = slots[part.type];
				const node = slot ? slot({
					[part.type]: part.value,
					index,
					parts
				}) : [part.value];
				if (isVNode$1(node)) node[0].key = `${part.type}-${index}`;
				return node;
			});
			else if (isString(parts)) children = [parts];
			return children;
		};
		const assignedAttrs = assign(create(), attrs);
		const tag = isString(props.tag) || isObject(props.tag) ? props.tag : getFragmentableTag();
		return isObject(tag) ? h(tag, assignedAttrs, { default: renderChildren }) : h(tag, assignedAttrs, renderChildren());
	};
}
/**
* export the public type for h/tsx inference
* also to avoid inline import() in generated d.ts files
*/
/**
* Number Format Component
*
* @remarks
* See the following items for property about details
*
* @VueI18nSee [FormattableProps](component#formattableprops)
* @VueI18nSee [BaseFormatProps](component#baseformatprops)
* @VueI18nSee [Custom Formatting](../guide/essentials/number#custom-formatting)
*
* @VueI18nDanger
* Not supported IE, due to no support `Intl.NumberFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)
*
* If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-numberformat)
*
* @VueI18nComponent
*/
var NumberFormat = /* @__PURE__ */ defineComponent({
	name: "i18n-n",
	props: assign({
		value: {
			type: Number,
			required: true
		},
		format: { type: [String, Object] }
	}, baseFormatProps),
	setup(props, context) {
		const i18n = props.i18n || useI18n({
			useScope: props.scope,
			__useComponent: true
		});
		return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => i18n[NumberPartsSymbol](...args));
	}
});
function getComposer$1(i18n, instance) {
	const i18nInternal = i18n;
	if (i18n.mode === "composition") return i18nInternal.__getInstance(instance) || i18n.global;
	else {
		const vueI18n = i18nInternal.__getInstance(instance);
		return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
	}
}
/**
* @deprecated will be removed at vue-i18n v12
*/
function vTDirective(i18n) {
	const _process = (binding) => {
		const { instance, value } = binding;
		/* istanbul ignore if */
		if (!instance || !instance.$) throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
		const composer = getComposer$1(i18n, instance.$);
		const parsedValue = parseValue(value);
		return [Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]), composer];
	};
	const register = (el, binding) => {
		const [textContent, composer] = _process(binding);
		el.__composer = composer;
		el.textContent = textContent;
	};
	const unregister = (el) => {
		if (el.__composer) {
			el.__composer = void 0;
			delete el.__composer;
		}
	};
	const update = (el, { value }) => {
		if (el.__composer) {
			const composer = el.__composer;
			const parsedValue = parseValue(value);
			el.textContent = Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]);
		}
	};
	const getSSRProps = (binding) => {
		const [textContent] = _process(binding);
		return { textContent };
	};
	return {
		created: register,
		unmounted: unregister,
		beforeUpdate: update,
		getSSRProps
	};
}
function parseValue(value) {
	if (isString(value)) return { path: value };
	else if (isPlainObject$1(value)) {
		if (!("path" in value)) throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
		return value;
	} else throw createI18nError(I18nErrorCodes.INVALID_VALUE);
}
function makeParams(value) {
	const { path, locale, args, choice, plural } = value;
	const options = {};
	const named = args || {};
	if (isString(locale)) options.locale = locale;
	if (isNumber(choice)) options.plural = choice;
	if (isNumber(plural)) options.plural = plural;
	return [
		path,
		named,
		options
	];
}
function apply(app, i18n, ...options) {
	const pluginOptions = isPlainObject$1(options[0]) ? options[0] : {};
	if (isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true) {
		[Translation.name, "I18nT"].forEach((name) => app.component(name, Translation));
		[NumberFormat.name, "I18nN"].forEach((name) => app.component(name, NumberFormat));
		[DatetimeFormat.name, "I18nD"].forEach((name) => app.component(name, DatetimeFormat));
	}
	app.directive("t", vTDirective(i18n));
}
/**
* Injection key for {@link useI18n}
*
* @remarks
* The global injection key for I18n instances with `useI18n`. this injection key is used in Web Components.
* Specify the i18n instance created by {@link createI18n} together with `provide` function.
*
* @VueI18nGeneral
*/
var I18nInjectionKey = /* #__PURE__*/ makeSymbol("global-vue-i18n");
function createI18n(options = {}) {
	const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
	const __instances = /* @__PURE__ */ new Map();
	const [globalScope, __global] = createGlobal(options);
	const symbol = /* #__PURE__*/ makeSymbol("");
	function __getInstance(component) {
		return __instances.get(component) || null;
	}
	function __setInstance(component, instance) {
		__instances.set(component, instance);
	}
	function __deleteInstance(component) {
		__instances.delete(component);
	}
	const i18n = {
		get mode() {
			return "composition";
		},
		async install(app, ...options) {
			app.__VUE_I18N_SYMBOL__ = symbol;
			app.provide(app.__VUE_I18N_SYMBOL__, i18n);
			if (isPlainObject$1(options[0])) {
				const opts = options[0];
				i18n.__composerExtend = opts.__composerExtend;
				i18n.__vueI18nExtend = opts.__vueI18nExtend;
			}
			let globalReleaseHandler = null;
			if (__globalInjection) globalReleaseHandler = injectGlobalFields(app, i18n.global);
			apply(app, i18n, ...options);
			const unmountApp = app.unmount;
			app.unmount = () => {
				globalReleaseHandler && globalReleaseHandler();
				i18n.dispose();
				unmountApp();
			};
		},
		get global() {
			return __global;
		},
		dispose() {
			globalScope.stop();
		},
		__instances,
		__getInstance,
		__setInstance,
		__deleteInstance
	};
	return i18n;
}
function useI18n(options = {}) {
	const instance = getCurrentInstance$1();
	if (instance == null) throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
	if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
	const i18n = getI18nInstance(instance);
	const gl = getGlobalComposer(i18n);
	const componentOptions = getComponentOptions(instance);
	const scope = getScope(options, componentOptions);
	if (scope === "global") {
		adjustI18nResources(gl, options, componentOptions);
		return gl;
	}
	if (scope === "parent") {
		let composer = getComposer(i18n, instance, options.__useComponent);
		if (composer == null) composer = gl;
		return composer;
	}
	if (scope === "isolated") {
		if (i18n.mode !== "composition") throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
		const i18nInternalIso = i18n;
		const composerOptions = assign({}, options);
		composerOptions.__root = getComposer(i18n, instance) || gl;
		const composer = createComposer(composerOptions);
		if (i18nInternalIso.__composerExtend) composer[DisposeSymbol] = i18nInternalIso.__composerExtend(composer);
		if (getCurrentScope()) onScopeDispose(() => {
			const dispose = composer[DisposeSymbol];
			if (dispose) {
				dispose();
				delete composer[DisposeSymbol];
			}
		});
		return composer;
	}
	const i18nInternal = i18n;
	let composer = i18nInternal.__getInstance(instance);
	if (composer == null) {
		const composerOptions = assign({}, options);
		if ("__i18n" in componentOptions) composerOptions.__i18n = componentOptions.__i18n;
		if (gl) composerOptions.__root = gl;
		composer = createComposer(composerOptions);
		if (i18nInternal.__composerExtend) composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
		i18nInternal.__setInstance(instance, composer);
	}
	return composer;
}
function createGlobal(options, legacyMode) {
	const scope = effectScope();
	const obj = scope.run(() => createComposer(options));
	if (obj == null) throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
	return [scope, obj];
}
function getI18nInstance(instance) {
	const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
	/* istanbul ignore if */
	if (!i18n) throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
	return i18n;
}
function getScope(options, componentOptions) {
	return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
	return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer(i18n, target, useComponent = false) {
	let composer = null;
	const root = target.root;
	let current = getParentComponentInstance(target, useComponent);
	while (current != null) {
		const i18nInternal = i18n;
		if (i18n.mode === "composition") composer = i18nInternal.__getInstance(current);
		if (composer != null) break;
		if (root === current) break;
		current = current.parent;
	}
	return composer;
}
function getParentComponentInstance(target, useComponent = false) {
	if (target == null) return null;
	return !useComponent ? target.parent : target.vnode.ctx || target.parent;
}
var globalExportProps = [
	"locale",
	"fallbackLocale",
	"availableLocales"
];
var globalExportMethods = [
	"t",
	"rt",
	"d",
	"n",
	"tm",
	"te"
];
function injectGlobalFields(app, composer) {
	const i18n = Object.create(null);
	globalExportProps.forEach((prop) => {
		const desc = Object.getOwnPropertyDescriptor(composer, prop);
		if (!desc) throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
		const wrap = isRef(desc.value) ? {
			get() {
				return desc.value.value;
			},
			set(val) {
				desc.value.value = val;
			}
		} : { get() {
			return desc.get && desc.get();
		} };
		Object.defineProperty(i18n, prop, wrap);
	});
	app.config.globalProperties.$i18n = i18n;
	globalExportMethods.forEach((method) => {
		const desc = Object.getOwnPropertyDescriptor(composer, method);
		if (!desc || !desc.value) throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
		Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
	});
	const dispose = () => {
		delete app.config.globalProperties.$i18n;
		globalExportMethods.forEach((method) => {
			delete app.config.globalProperties[`$${method}`];
		});
	};
	return dispose;
}
/**
* Datetime Format Component
*
* @remarks
* See the following items for property about details
*
* @VueI18nSee [FormattableProps](component#formattableprops)
* @VueI18nSee [BaseFormatProps](component#baseformatprops)
* @VueI18nSee [Custom Formatting](../guide/essentials/datetime#custom-formatting)
*
* @VueI18nDanger
* Not supported IE, due to no support `Intl.DateTimeFormat#formatToParts` in [IE](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts)
*
* If you want to use it, you need to use [polyfill](https://github.com/formatjs/formatjs/tree/main/packages/intl-datetimeformat)
*
* @VueI18nComponent
*/
var DatetimeFormat = /* @__PURE__ */ defineComponent({
	name: "i18n-d",
	props: assign({
		value: {
			type: [Number, Date],
			required: true
		},
		format: { type: [String, Object] }
	}, baseFormatProps),
	setup(props, context) {
		const i18n = props.i18n || useI18n({
			useScope: props.scope,
			__useComponent: true
		});
		return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => i18n[DatetimePartsSymbol](...args));
	}
});
registerMessageCompiler(compile);
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/routing/i18n.js
function extendI18n(i18n, { extendComposer, extendComposerInstance }) {
	const scope = effectScope();
	const installI18n = i18n.install.bind(i18n);
	i18n.install = (app, ...options) => {
		const pluginOptions = assign({}, options[0]);
		pluginOptions.__composerExtend = (c) => {
			extendComposerInstance(c, getComposer$2(i18n));
			return () => {};
		};
		if (i18n.mode === "legacy") pluginOptions.__vueI18nExtend = (vueI18n) => {
			extendComposerInstance(vueI18n, getComposer$2(vueI18n));
			return () => {};
		};
		Reflect.apply(installI18n, i18n, [app, pluginOptions]);
		const globalComposer = getComposer$2(i18n);
		scope.run(() => {
			extendComposer(globalComposer);
			if (i18n.mode === "legacy" && "__composer" in i18n.global) extendComposerInstance(i18n.global, getComposer$2(i18n.global));
		});
		if (i18n.mode === "composition" && app.config.globalProperties.$i18n != null) extendComposerInstance(app.config.globalProperties.$i18n, globalComposer);
		if (app.unmount) {
			const unmountApp = app.unmount.bind(app);
			app.unmount = () => {
				scope.stop();
				unmountApp();
			};
		}
	};
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/kit/head.js
function localeHead$1(options, currentLanguage = options.getCurrentLanguage(), currentDirection = options.getCurrentDirection()) {
	const metaObject = {
		htmlAttrs: {},
		link: [],
		meta: []
	};
	if (options.dir) metaObject.htmlAttrs.dir = currentDirection;
	if (options.lang && currentLanguage) metaObject.htmlAttrs.lang = currentLanguage;
	if (options.seo) {
		const routeWithoutQuery = options.strictCanonicals ? options.getRouteWithoutQuery() : void 0;
		const alternateLinks = getHreflangLinks(options, routeWithoutQuery);
		const canonical = getCanonicalUrl(options, routeWithoutQuery);
		metaObject.link = metaObject.link.concat(alternateLinks, getCanonicalLink(options, canonical));
		metaObject.meta = metaObject.meta.concat(getOgUrl(options, canonical), getCurrentOgLocale(options), getAlternateOgLocales(options, getAlternateOgLanguages(options, alternateLinks)));
	}
	return metaObject;
}
function createLocaleMap(locales) {
	const localeMap = /* @__PURE__ */ new Map();
	for (const locale of locales) {
		if (!locale.language) {
			console.warn("Locale `language` ISO code is required to generate alternate link");
			continue;
		}
		const [language, region] = locale.language.split("-");
		if (language && region && (locale.isCatchallLocale || !localeMap.has(language))) localeMap.set(language, locale);
		localeMap.set(locale.language, locale);
	}
	return localeMap;
}
function getHreflangLinks(options, routeWithoutQuery = options.strictCanonicals ? options.getRouteWithoutQuery() : void 0) {
	if (!options.hreflangLinks) return [];
	const links = [];
	const localeMap = createLocaleMap(options.locales);
	const hrefs = /* @__PURE__ */ new Map();
	for (const [language, locale] of localeMap.entries()) {
		const href = hrefs.get(locale.code) ?? resolveAlternateHref(locale.code, options, routeWithoutQuery);
		if (!href) continue;
		hrefs.set(locale.code, href);
		const link = options.strictSeo ? {
			rel: "alternate",
			href,
			hreflang: language
		} : {
			[options.key]: `i18n-alt-${language}`,
			rel: "alternate",
			href,
			hreflang: language
		};
		links.push(link);
		if (options.defaultLocale && options.defaultLocale === locale.code && links[0].hreflang !== "x-default") links.unshift(options.strictSeo ? {
			rel: "alternate",
			href,
			hreflang: "x-default"
		} : {
			[options.key]: "i18n-xd",
			rel: "alternate",
			href,
			hreflang: "x-default"
		});
	}
	return links;
}
function resolveAlternateHref(locale, options, routeWithoutQuery = options.strictCanonicals ? options.getRouteWithoutQuery() : void 0) {
	const localePath = options.getLocalizedRoute(locale, routeWithoutQuery);
	if (!localePath) return;
	return withQuery(withBase(localePath, options.baseUrl), options.strictCanonicals ? getCanonicalQueryParams(options) : {});
}
function getCanonicalUrl(options, routeWithoutQuery = options.strictCanonicals ? options.getRouteWithoutQuery() : void 0) {
	const localePath = options.getLocalizedRoute(options.currentLocale, routeWithoutQuery);
	if (!localePath) return "";
	return withQuery(withBase(localePath, options.baseUrl), getCanonicalQueryParams(options));
}
function getCanonicalLink(options, href = getCanonicalUrl(options)) {
	if (!href) return [];
	return [options.strictSeo ? {
		rel: "canonical",
		href
	} : {
		[options.key]: "i18n-can",
		rel: "canonical",
		href
	}];
}
function getCanonicalQueryParams(options, route = options.getCurrentRoute()) {
	if (!options.canonicalQueries.length) return {};
	const currentRouteQuery = options.getLocaleRoute(Object.assign({}, route, {
		path: void 0,
		name: options.getRouteBaseName(route)
	}))?.query ?? {};
	const params = {};
	for (const param of options.canonicalQueries.filter((x) => x in currentRouteQuery)) {
		params[param] ??= [];
		for (const val of toArray(currentRouteQuery[param])) params[param].push(val || "");
	}
	return params;
}
function getOgUrl(options, href = getCanonicalUrl(options)) {
	if (!href) return [];
	return [options.strictSeo ? {
		property: "og:url",
		content: href
	} : {
		[options.key]: "i18n-og-url",
		property: "og:url",
		content: href
	}];
}
function getCurrentOgLocale(options, currentLanguage = options.getCurrentLanguage()) {
	if (!currentLanguage) return [];
	return [options.strictSeo ? {
		property: "og:locale",
		content: formatOgLanguage(currentLanguage)
	} : {
		[options.key]: "i18n-og",
		property: "og:locale",
		content: formatOgLanguage(currentLanguage)
	}];
}
function getAlternateOgLanguages(options, alternateLinks) {
	const languages = options.locales.map((x) => x.language || x.code);
	if (!options.strictSeo) return languages;
	const available = new Set(alternateLinks.map((x) => x.hreflang));
	return languages.filter((x) => available.has(x));
}
function getAlternateOgLocales(options, languages, currentLanguage = options.getCurrentLanguage()) {
	return languages.filter((locale) => locale && locale !== currentLanguage).map((locale) => options.strictSeo ? {
		property: "og:locale:alternate",
		content: formatOgLanguage(locale)
	} : {
		[options.key]: `i18n-og-alt-${locale}`,
		property: "og:locale:alternate",
		content: formatOgLanguage(locale)
	});
}
function formatOgLanguage(val = "") {
	return val.replace(/-/g, "_");
}
function toArray(value) {
	return Array.isArray(value) ? value : [value];
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/routing/head.js
function createHeadContext(ctx, config, locale = ctx.getLocale(), locales = ctx.getLocales(), baseUrl = ctx.routingOptions.domains ? ctx.getBaseUrl(locale) : ctx.getBaseUrl()) {
	const currentLocale = locales.find((l) => l.code === locale) || { };
	const canonicalQueries = [...new Set(typeof config.seo === "object" && config.seo?.canonicalQueries || [])];
	const alternateCtx = {
		...ctx,
		afterSwitchLocalePath: ctx.getAlternatePath
	};
	if (!baseUrl && !ctx.routingOptions.domains) {
		if (ctx.strictSeo) throw new Error("I18n `baseUrl` is required to generate valid SEO tag links.");
		console.warn("I18n `baseUrl` is required to generate valid SEO tag links.");
	}
	return {
		...config,
		key: ctx.strictSeo ? "key" : "id",
		strictSeo: ctx.strictSeo,
		locales,
		currentLocale: locale,
		baseUrl,
		canonicalQueries,
		hreflangLinks: ctx.routingOptions.hreflangLinks,
		defaultLocale: ctx.routingOptions.defaultLocale,
		strictCanonicals: ctx.strictSeo || ctx.routingOptions.strictCanonicals,
		getRouteBaseName: ctx.getRouteBaseName,
		getCurrentRoute: () => ctx.router.currentRoute.value,
		getCurrentLanguage: () => currentLocale.language,
		getCurrentDirection: () => currentLocale.dir || "ltr",
		getLocaleRoute: (route) => localeRoute(ctx, route),
		getLocalizedRoute: (locale2, route) => switchLocalePath(alternateCtx, locale2, route),
		getRouteWithoutQuery: () => {
			try {
				return assign({}, ctx.router.resolve({ query: {} }), { meta: ctx.router.currentRoute.value.meta });
			} catch {
				return;
			}
		}
	};
}
function localeHead(ctx, { dir = true, lang = true, seo = true }) {
	return localeHead$1(createHeadContext(ctx, {
		dir,
		lang,
		seo
	}));
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/composables/index.js
function useRouteBaseName(nuxtApp = useNuxtApp()) {
	const common = useComposableContext(nuxtApp);
	return (route) => {
		if (route == null) return;
		return common.getRouteBaseName(route) || void 0;
	};
}
function useLocalePath(nuxtApp = useNuxtApp()) {
	const common = useComposableContext(nuxtApp);
	return (route, locale) => localePath(common, route, locale);
}
function useLocaleRoute(nuxtApp = useNuxtApp()) {
	const common = useComposableContext(nuxtApp);
	return (route, locale) => localeRoute(common, route, locale);
}
function useSwitchLocalePath(nuxtApp = useNuxtApp()) {
	const common = useComposableContext(nuxtApp);
	return (locale) => switchLocalePath(common, locale);
}
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/shared/vue-i18n.js
var setupVueI18nOptions = async (defaultLocale) => {
	const options = await loadVueI18nOptions(vueI18nConfigs);
	options.locale = defaultLocale || options.locale || "en-US";
	options.defaultLocale = defaultLocale;
	options.fallbackLocale ??= false;
	options.messages ??= {};
	for (const locale of localeCodes) options.messages[locale] ??= {};
	return options;
};
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/plugins/i18n.js
var i18n_default = /* @__PURE__ */ defineNuxtPlugin({
	name: "i18n:plugin",
	parallel: false,
	async setup(_nuxt) {
		let __temp, __restore;
		Object.defineProperty(_nuxt.versions, "nuxtI18n", { get: () => "10.6.0" });
		const nuxt = useNuxtApp(_nuxt._id);
		const runtimeI18n = useRuntimeI18n(nuxt);
		const preloadedOptions = nuxt.ssrContext?.event?.context?.nuxtI18n?.vueI18nOptions;
		const _defaultLocale = resolveDefaultLocale(useRequestURL({ xForwardedHost: true }).host, runtimeI18n.defaultLocale);
		const optionsI18n = preloadedOptions || ([__temp, __restore] = executeAsync(() => setupVueI18nOptions(_defaultLocale)), __temp = await __temp, __restore(), __temp);
		const localeConfigs = useLocaleConfigs();
		localeConfigs.value = useRequestEvent().context.nuxtI18n?.localeConfigs || {};
		prerenderRoutes(localeCodes.filter(isPrerenderable).map((locale) => `/_i18n/${{
			"en": "536362c7",
			"fr": "536362c7"
		}[locale]}/${locale}/messages.json`));
		const i18n = createI18n(optionsI18n);
		const detectors = useDetectors(useRequestEvent(nuxt), useI18nDetection(nuxt), nuxt);
		const ctx = createNuxtI18nContext(nuxt, i18n, optionsI18n.defaultLocale, !!optionsI18n.flatJson);
		nuxt._nuxtI18n = ctx;
		extendI18n(i18n, {
			extendComposer(composer) {
				composer.locales = computed(() => runtimeI18n.locales.map((locale) => withRuntimeDomain(locale, runtimeI18n.domainLocales)));
				composer.localeCodes = computed(() => localeCodes);
				const _baseUrl = ref(ctx.getBaseUrl());
				composer.baseUrl = computed(() => _baseUrl.value);
				composer.strategy = "prefix_except_default";
				composer.localeProperties = computed(() => withRuntimeDomain(normalizedLocales.find((l) => l.code === composer.locale.value) || {
					code: composer.locale.value,
					domains: [],
					defaultForDomains: []
				}, runtimeI18n.domainLocales));
				composer.setLocale = async (locale) => {
					await loadAndSetLocale(nuxt, locale);
					await nuxt.runWithContext(() => navigate(nuxt, nuxt.$router.currentRoute.value, locale));
				};
				composer.loadLocaleMessages = ctx.loadMessages;
				composer.differentDomains = false;
				composer.defaultLocale = optionsI18n.defaultLocale;
				composer.getBrowserLocale = () => resolveSupportedLocale(detectors.header());
				composer.getLocaleCookie = () => resolveSupportedLocale(detectors.cookie());
				composer.setLocaleCookie = ctx.setCookieLocale;
				composer.finalizePendingLocaleChange = async () => {
					if (!i18n.__pendingLocale) return;
					await i18n.__resolvePendingLocalePromise?.();
				};
				composer.waitForPendingLocaleChange = async () => {
					await i18n?.__pendingLocalePromise;
				};
			},
			extendComposerInstance(instance, c) {
				const props = [
					["locales", () => c.locales],
					["localeCodes", () => c.localeCodes],
					["baseUrl", () => c.baseUrl],
					["strategy", () => "prefix_except_default"],
					["localeProperties", () => c.localeProperties],
					["setLocale", () => (locale) => Reflect.apply(c.setLocale, c, [locale])],
					["loadLocaleMessages", () => (locale) => Reflect.apply(c.loadLocaleMessages, c, [locale])],
					["differentDomains", () => false],
					["defaultLocale", () => c.defaultLocale],
					["getBrowserLocale", () => () => Reflect.apply(c.getBrowserLocale, c, [])],
					["getLocaleCookie", () => () => Reflect.apply(c.getLocaleCookie, c, [])],
					["setLocaleCookie", () => (locale) => Reflect.apply(c.setLocaleCookie, c, [locale])],
					["finalizePendingLocaleChange", () => () => Reflect.apply(c.finalizePendingLocaleChange, c, [])],
					["waitForPendingLocaleChange", () => () => Reflect.apply(c.waitForPendingLocaleChange, c, [])]
				];
				for (const [key, get] of props) Object.defineProperty(instance, key, { get });
			}
		});
		nuxt.vueApp.use(i18n);
		Object.defineProperty(nuxt, "$i18n", { get: () => getI18nTarget(i18n) });
		nuxt.provide("localeHead", (options) => localeHead(nuxt._nuxtI18n.composableCtx, options));
		nuxt.provide("localePath", useLocalePath(nuxt));
		nuxt.provide("localeRoute", useLocaleRoute(nuxt));
		nuxt.provide("routeBaseName", useRouteBaseName(nuxt));
		nuxt.provide("getRouteBaseName", useRouteBaseName(nuxt));
		nuxt.provide("switchLocalePath", useSwitchLocalePath(nuxt));
	}
});
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/plugins/switch-locale-path-ssr.js
var identifier = "nuxt-i18n-slp";
var switchLocalePathLinkWrapperExpr = new RegExp([
	`<!--${identifier}-\\[(\\w+)\\]-->`,
	`.+?`,
	`<!--/${identifier}-->`
].join(""), "g");
var switch_locale_path_ssr_default = /* @__PURE__ */ defineNuxtPlugin({
	name: "i18n:plugin:switch-locale-path-ssr",
	dependsOn: ["i18n:plugin"],
	setup(_nuxt) {
		const nuxt = useNuxtApp(_nuxt._id);
		const switchLocalePath = useSwitchLocalePath(nuxt);
		nuxt.hook("app:rendered", (ctx) => {
			if (ctx.renderResult?.html == null) return;
			ctx.renderResult.html = ctx.renderResult.html.replaceAll(switchLocalePathLinkWrapperExpr, (match, p1) => {
				const resolved = escapeHtmlAttr(switchLocalePath(p1 ?? ""));
				return match.replace(/href="([^"]+)"/, () => `href="${resolved || "#"}" `);
			});
		});
	}
});
//#endregion
//#region node_modules/@nuxtjs/i18n/dist/runtime/plugins/preload.js
var preload_default = /* @__PURE__ */ defineNuxtPlugin({
	name: "i18n:plugin:preload",
	dependsOn: ["i18n:plugin"],
	async setup(_nuxt) {}
});
//#endregion
//#region node_modules/@prismicio/vue/dist/createPrismic.js
var prismicKey = Symbol.for("@prismicio/vue/plugin");
/** Creates a Prismic Vue plugin instance that can be used by a Vue app. */
var createPrismic = (config) => {
	return {
		...config,
		components: config.components || {},
		isFilled,
		install(app) {
			app.provide(prismicKey, this);
			app.config.globalProperties.$prismic = this;
		}
	};
};
//#endregion
//#region node_modules/@nuxtjs/prismic/dist/runtime/plugin.js
var plugin_default = /* @__PURE__ */ defineNuxtPlugin({
	name: "prismic:setup",
	parallel: true,
	async setup(nuxtApp) {
		let __temp, __restore;
		const options = (/* @__PURE__ */ useRuntimeConfig()).public.prismic;
		const client = ([__temp, __restore] = executeAsync(() => resolveClient()), __temp = await __temp, __restore(), __temp);
		handlePreview();
		addToolbar();
		async function resolveClient() {
			if (void 0 instanceof Client) return void 0;
			else return createClient(options.environment || options.endpoint || "endpoint-not-provided", options.clientConfig);
		}
		function handlePreview() {
			if (options.preview) {
				const previewCookie = useCookie("io.prismic.preview").value;
				{
					const req = useRequestEvent()?.node.req;
					if (req) client.enableAutoPreviewsFromReq(req);
				}
				if (previewCookie) try {
					const session = typeof previewCookie === "string" ? JSON.parse(decodeURIComponent(previewCookie)) : previewCookie;
					if (Object.keys(session).some((key) => key in session && typeof session[key] === "object" && session[key] !== null && "preview" in session[key] && session[key].preview)) useRouter().afterEach(() => {
						refreshNuxtData();
					});
				} catch (error) {
					console.warn("Failed to parse Prismic preview cookie", error);
				}
			}
		}
		function addToolbar() {
			if (options.toolbar) useHead({ script: [{
				key: "prismic-preview",
				src: getToolbarSrc(client.repositoryName),
				async: true,
				defer: true,
				crossorigin: "anonymous"
			}] });
			else useCookie(cookie.preview).value = null;
		}
		const prismicPlugin = createPrismic({
			client,
			linkResolver: void 0,
			components: {
				linkInternalComponent: NuxtLink,
				linkExternalComponent: NuxtLink,
				richTextComponents: void 0
			}
		});
		nuxtApp.vueApp.use(prismicPlugin);
		return { provide: { prismic: prismicPlugin } };
	}
});
//#endregion
//#region plugins/01.swell.ts
var _01_swell_default = /* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
	let __temp, __restore;
	const config = /* @__PURE__ */ useRuntimeConfig();
	const i18n = nuxtApp.$i18n;
	const locale = i18n.locale.value || i18n.locale;
	const storeId = config.public.swellStoreId;
	const publicKey = config.public.swellPublicKey;
	if (!storeId || !publicKey) throw new Error("[swell plugin]: Both SWELL_STORE_ID and SWELL_PUBLIC_KEY must be set");
	const init = async (loc) => {
		await swell.init(storeId, publicKey, { locale: `${loc}-CA` });
		await swell.settings.load();
	};
	[__temp, __restore] = executeAsync(() => init(locale)), await __temp, __restore();
	nuxtApp.hook("i18n:beforeLocaleSwitch", async ({ oldLocale, newLocale }) => {
		await init(newLocale);
	});
	return { provide: { swell } };
});
//#endregion
//#region stores/main.ts
var useMainStore = defineStore("main", {
	state: () => ({
		attributes: [],
		categories: [],
		cookieModalOpened: true,
		cookiePreferencesModalOpened: false,
		error: null,
		newsletter: {
			data: null,
			isOpened: false
		},
		messageOpened: false,
		message: [],
		settings: null
	}),
	actions: {
		setAttributes(attributes) {
			this.attributes = attributes;
		},
		setCategories(categories) {
			this.categories = categories;
		},
		setCookieModal(v) {
			this.cookieModalOpened = v;
		},
		setCookiePreferencesModal(v) {
			this.cookiePreferencesModalOpened = v;
		},
		setError(error) {
			this.error = error;
		},
		setMessageOpened(v) {
			this.messageOpened = v;
		},
		setMessage(modal) {
			this.message = modal;
		},
		setNewsletterOpened(v) {
			this.newsletter.isOpened = v;
		},
		setNewsletterData(modal) {
			this.newsletter.data = modal;
		},
		setSettings(settings) {
			this.settings = settings;
		}
	},
	getters: { getCategory: (state) => (slug) => state.categories.filter((c) => c.slug === slug) }
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fplugins.server.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default = [
	payloadPlugin,
	plugin$3,
	plugin$2,
	plugin$1,
	plugin,
	virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fcomponents_plugin_default,
	route_locale_detect_default,
	i18n_default,
	switch_locale_path_ssr_default,
	preload_default,
	plugin_default,
	_01_swell_default,
	/* @__PURE__ */ defineNuxtPlugin(async (nuxtApp) => {
		let __temp, __restore;
		const { $prismic, $swell, $i18n } = nuxtApp;
		const mainStore = useMainStore();
		const locale = $i18n.locale.value;
		try {
			const categoriesRes = ([__temp, __restore] = executeAsync(() => $swell.categories.list()), __temp = await __temp, __restore(), __temp);
			mainStore.setCategories(categoriesRes?.results ?? []);
			const settings = ([__temp, __restore] = executeAsync(() => $prismic.client.getAllByType("settings")), __temp = await __temp, __restore(), __temp);
			if (settings.length > 0) mainStore.setSettings(settings[0].data);
			const newsletters = ([__temp, __restore] = executeAsync(() => $prismic.client.getAllByType("newslettermodal", { lang: `${locale}-ca` })), __temp = await __temp, __restore(), __temp);
			if (newsletters.length > 0) mainStore.setNewsletterData(newsletters[0].data);
			const messages = ([__temp, __restore] = executeAsync(() => $prismic.client.getAllByType("message_modal", { lang: `${locale}-ca` })), __temp = await __temp, __restore(), __temp);
			if (messages.length > 0) mainStore.setMessage(messages[0].data);
		} catch (error) {
			mainStore.setError(error);
			console.error("[init.server]", error);
		}
	}),
	/* @__PURE__ */ defineNuxtPlugin({
		name: "i18n:plugin:ssg-detect",
		dependsOn: ["i18n:plugin", "i18n:plugin:route-locale-detect"],
		enforce: "post",
		setup(_nuxt) {}
	})
];
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-loading-indicator.js
var NuxtLoadingIndicator = defineComponent({
	name: "NuxtLoadingIndicator",
	props: {
		throttle: {
			type: Number,
			default: 200
		},
		duration: {
			type: Number,
			default: 2e3
		},
		hideDelay: {
			type: Number,
			default: 500
		},
		resetDelay: {
			type: Number,
			default: 400
		},
		height: {
			type: Number,
			default: 3
		},
		color: {
			type: [String, Boolean],
			default: "repeating-linear-gradient(to right,#00dc82 0%,#34cdfe 50%,#0047e1 100%)"
		},
		errorColor: {
			type: String,
			default: "repeating-linear-gradient(to right,#f87171 0%,#ef4444 100%)"
		},
		estimatedProgress: {
			type: Function,
			required: false
		}
	},
	setup(props, { slots, expose }) {
		const { progress, isLoading, error, start, finish, clear } = useLoadingIndicator({
			duration: props.duration,
			throttle: props.throttle,
			hideDelay: props.hideDelay,
			resetDelay: props.resetDelay,
			estimatedProgress: props.estimatedProgress
		});
		expose({
			progress,
			isLoading,
			error,
			start,
			finish,
			clear
		});
		return () => h("div", {
			class: "nuxt-loading-indicator",
			style: {
				position: "fixed",
				top: 0,
				right: 0,
				left: 0,
				pointerEvents: "none",
				width: "auto",
				height: `${props.height}px`,
				opacity: isLoading.value ? 1 : 0,
				background: error.value ? props.errorColor : props.color || void 0,
				backgroundSize: `${progress.value > 0 ? 100 / progress.value * 100 : 0}% auto`,
				transform: `scaleX(${progress.value}%)`,
				transformOrigin: "left",
				transition: "transform 0.1s, height 0.4s, opacity 0.4s",
				zIndex: 999999
			}
		}, slots);
	}
});
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Flayouts.mjs
var virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default = { default: defineAsyncComponent(() => import('../build/default-QCYbKBR_.mjs').then((m) => m.default || m)) };
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-layout.js
var LayoutLoader = defineComponent({
	name: "LayoutLoader",
	inheritAttrs: false,
	props: {
		name: String,
		layoutProps: Object
	},
	setup(props, context) {
		return () => h(virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default[props.name], props.layoutProps, context.slots);
	}
});
var nuxt_layout_default = defineComponent({
	name: "NuxtLayout",
	inheritAttrs: false,
	props: {
		name: {
			type: [
				String,
				Boolean,
				Object
			],
			default: null
		},
		fallback: {
			type: [String, Object],
			default: null
		}
	},
	setup(props, context) {
		const nuxtApp = useNuxtApp();
		const injectedRoute = inject(PageRouteSymbol);
		const route = !injectedRoute || injectedRoute === useRoute$1() ? useRoute() : injectedRoute;
		const layout = computed(() => {
			let layout = resolveLayoutName(route, props.name);
			if (layout && !(layout in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default)) {
				if (props.fallback) layout = unref(props.fallback);
			}
			return layout;
		});
		provide(LayoutSymbol, layout);
		const resolveRouteLayout = (routeToCheck) => resolveLayoutName(routeToCheck, props.name);
		const layoutRef = shallowRef();
		context.expose({ layoutRef });
		const done = nuxtApp.deferHydration();
		let lastLayout;
		return () => {
			const hasTransition = !!layout.value && layout.value in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default && !!(route?.meta.layoutTransition ?? false);
			const transitionProps = hasTransition && _mergeTransitionProps([
				route?.meta.layoutTransition,
				false,
				{
					onBeforeLeave() {
						_startTransition(nuxtApp);
					},
					onAfterLeave() {
						_finishTransition(nuxtApp);
					}
				}
			]);
			const previouslyRenderedLayout = lastLayout;
			lastLayout = layout.value;
			return _wrapInTransition(transitionProps, { default: () => h(Suspense, {
				suspensible: true,
				onResolve: async () => {
					await nextTick(done);
				}
			}, { default: () => h(LayoutProvider, {
				layoutProps: mergeProps(context.attrs, route.meta.layoutProps ?? {}, { ref: layoutRef }),
				key: layout.value || void 0,
				name: layout.value,
				shouldProvide: !props.name,
				resolveRouteLayout,
				isRenderingNewLayout: (name) => {
					return name !== previouslyRenderedLayout && name === layout.value;
				},
				hasTransition
			}, context.slots) }) }).default();
		};
	}
});
var LayoutProvider = defineComponent({
	name: "NuxtLayoutProvider",
	inheritAttrs: false,
	props: {
		name: { type: [String, Boolean] },
		layoutProps: { type: Object },
		hasTransition: { type: Boolean },
		shouldProvide: { type: Boolean },
		isRenderingNewLayout: {
			type: Function,
			required: true
		},
		resolveRouteLayout: {
			type: Function,
			required: true
		}
	},
	setup(props, context) {
		const name = props.name;
		if (props.shouldProvide) provide(LayoutMetaSymbol, { isCurrent: (route) => name === false || name === props.resolveRouteLayout(route) });
		const injectedRoute = inject(PageRouteSymbol);
		const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute$1();
		const enclosingLayout = inject(LayoutMetaSymbol, null);
		if (isNotWithinNuxtPage) {
			const vueRouterRoute = useRoute();
			const reactiveChildRoute = {};
			for (const _key in vueRouterRoute) {
				const key = _key;
				Object.defineProperty(reactiveChildRoute, key, {
					enumerable: true,
					get: () => {
						return props.isRenderingNewLayout(props.name) && (!enclosingLayout || enclosingLayout.isCurrent(vueRouterRoute)) ? vueRouterRoute[key] : injectedRoute[key];
					}
				});
			}
			provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
		}
		return () => {
			if (!name || typeof name === "string" && !(name in virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Flayouts_default)) return context.slots.default?.();
			return h(LayoutLoader, {
				key: name,
				layoutProps: props.layoutProps,
				name
			}, context.slots);
		};
	}
});
//#endregion
//#region node_modules/nuxt/dist/app/components/route-provider.js
var defineRouteProvider = (name = "RouteProvider") => defineComponent({
	name,
	props: {
		route: {
			type: Object,
			required: true
		},
		vnode: Object,
		vnodeRef: Object,
		renderKey: String,
		trackRootNodes: Boolean,
		routeRecord: Object
	},
	setup(props) {
		const previousKey = props.renderKey;
		const previousRoute = props.route;
		const route = {};
		for (const key in props.route) Object.defineProperty(route, key, {
			get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
			enumerable: true
		});
		provide(PageRouteSymbol, shallowReactive(route));
		return () => {
			if (!props.vnode) return props.vnode;
			return h(props.vnode, { ref: props.vnodeRef });
		};
	}
});
var RouteProvider = defineRouteProvider();
//#endregion
//#region node_modules/nuxt/dist/pages/runtime/page.js
var page_default = defineComponent({
	name: "NuxtPage",
	inheritAttrs: false,
	props: {
		name: { type: String },
		transition: {
			type: [Boolean, Object],
			default: void 0
		},
		keepalive: {
			type: [Boolean, Object],
			default: void 0
		},
		route: { type: Object },
		pageKey: {
			type: [Function, String],
			default: null
		}
	},
	setup(props, { attrs, slots, expose }) {
		const nuxtApp = useNuxtApp();
		const pageRef = ref();
		inject(PageRouteSymbol, null);
		expose({ pageRef });
		inject(LayoutMetaSymbol, null);
		nuxtApp.deferHydration();
		return () => {
			return h(RouterView, {
				name: props.name,
				route: props.route,
				...attrs
			}, { default: markStableSlot((routeProps) => {
				return h(Suspense, { suspensible: true }, { default() {
					return h(RouteProvider, {
						vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
						route: routeProps.route,
						vnodeRef: pageRef
					});
				} });
			}) });
		};
	}
});
function markStableSlot(fn) {
	const wrapped = ((routeProps) => {
		const result = fn(routeProps);
		if (Array.isArray(result)) return result;
		if (result == null || !isVNode(result)) return [createCommentVNode()];
		return [result];
	});
	wrapped._n = true;
	return wrapped;
}
function normalizeSlot(slot, data) {
	const slotContent = slot(data);
	return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
//#endregion
//#region \0plugin-vue:export-helper
var _plugin_vue_export_helper_default = (sfc, props) => {
	const target = sfc.__vccOpts || sfc;
	for (const [key, val] of props) target[key] = val;
	return target;
};
//#endregion
//#region app.vue
var _sfc_main$3 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	const _component_NuxtLoadingIndicator = NuxtLoadingIndicator;
	const _component_NuxtLayout = nuxt_layout_default;
	const _component_NuxtPage = page_default;
	_push(`<!--[-->`);
	_push(ssrRenderComponent(_component_NuxtLoadingIndicator, { color: "#bb9842" }, null, _parent));
	_push(ssrRenderComponent(_component_NuxtLayout, null, {
		default: withCtx((_, _push, _parent, _scopeId) => {
			if (_push) _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent, _scopeId));
			else return [createVNode(_component_NuxtPage)];
		}),
		_: 1
	}, _parent));
	_push(`<!--]-->`);
}
var _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var app_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main$3, [["ssrRender", _sfc_ssrRender$1]]);
//#endregion
//#region components/Media.vue
var _sfc_main$2 = {
	props: {
		altProp: {
			type: String,
			required: false
		},
		ariaHidden: {
			type: Boolean,
			required: false,
			default: false
		},
		image: {
			type: Object,
			required: true,
			default: () => ({})
		},
		classes: {
			type: String,
			required: false
		},
		lazy: {
			type: Boolean,
			required: false,
			default: true
		},
		placeholder: {
			type: String,
			required: false,
			default: "vertical"
		}
	},
	computed: {
		alt() {
			if (this.image.alt) return this.image.alt;
			else if (this.altProp) return this.altProp;
			else return "labete";
		},
		src() {
			if (this.image.url) return this.image.url;
		},
		returnClasses() {
			return this.classes;
		}
	},
	components: { VLazyImage }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
	const _component_v_lazy_image = resolveComponent("v-lazy-image");
	if ($props.lazy && $props.image?.url) _push(ssrRenderComponent(_component_v_lazy_image, mergeProps({
		src: $props.image.url,
		"src-placeholder": $props.placeholder === "horizontal" ? "/product_placeholder_horizontal.jpg" : "/product_placeholder.jpg",
		alt: $options.alt,
		title: $options.alt,
		class: $options.returnClasses,
		"aria-hidden": $props.ariaHidden
	}, _attrs), null, _parent));
	else if (!$props.lazy && $props.image?.url) _push(`<img${ssrRenderAttrs(mergeProps({
		src: $options.src,
		alt: $options.alt,
		title: $options.alt,
		class: $options.returnClasses,
		"aria-hidden": $props.ariaHidden
	}, _attrs))}>`);
	else _push(`<!---->`);
}
var _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Media.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Media_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]), { __name: "Media" });
//#endregion
//#region error.vue
var _sfc_main$1 = {
	__name: "error",
	__ssrInlineRender: true,
	props: ["error"],
	setup(__props) {
		const mainStore = useMainStore();
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Media = Media_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "container error" }, _attrs))}><div class="row"><div class="col-md-12 text-center"><h1>${ssrInterpolate(_ctx.$t("error.title"))}</h1>`);
			if (__props.error.statusCode === 404) _push(`<p>${ssrInterpolate(_ctx.$t("error.notFound.text"))}</p>`);
			else _push(`<!---->`);
			_push(`<button class="button-simple">${ssrInterpolate(_ctx.$t("error.home"))}</button>`);
			_push(ssrRenderComponent(_component_Media, {
				classes: "error-img",
				image: unref(mainStore).settings?.error_image
			}, null, _parent));
			_push(`</div></div></div>`);
		};
	}
};
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
//#endregion
//#region virtual:nuxt:node_modules%2F.cache%2Fnuxt%2F.nuxt%2Fisland-renderer.mjs
var IslandRenderer = () => null;
//#endregion
//#region node_modules/nuxt/dist/app/components/nuxt-root.vue
var _sfc_main = {
	__name: "nuxt-root",
	__ssrInlineRender: true,
	setup(__props) {
		const nuxtApp = useNuxtApp();
		nuxtApp.deferHydration();
		nuxtApp.ssrContext.url;
		const SingleRenderer = false;
		provide(PageRouteSymbol, useRoute$1());
		nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup", []);
		const error = /* @__PURE__ */ useError();
		const abortRender = error.value && !nuxtApp.ssrContext.error;
		function invokeAppErrorHandler(err, target, info) {
			const errorHandler = nuxtApp.vueApp.config.errorHandler;
			if (errorHandler && !errorHandler.__nuxt_default) try {
				errorHandler(err, target, info);
			} catch (handlerError) {
				console.error("[nuxt] Error in `app.config.errorHandler`", handlerError);
			}
		}
		onErrorCaptured((err, target, info) => {
			nuxtApp.hooks.callHook("vue:error", err, target, info)?.catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
			{
				const p = nuxtApp.runWithContext(() => showError(err));
				onServerPrefetch(() => p);
				invokeAppErrorHandler(err, target, info);
				return false;
			}
		});
		const islandContext = nuxtApp.ssrContext.islandContext;
		return (_ctx, _push, _parent, _attrs) => {
			ssrRenderSuspense(_push, {
				default: () => {
					if (unref(abortRender)) _push(`<div></div>`);
					else if (unref(error)) _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
					else if (unref(islandContext)) _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
					else if (unref(SingleRenderer)) ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
					else _push(ssrRenderComponent(unref(app_default), null, null, _parent));
				},
				_: 1
			});
		};
	}
};
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
//#endregion
//#region node_modules/nuxt/dist/app/entry.js
var entry$1 = async function createNuxtAppServer(ssrContext) {
	const vueApp = createApp(_sfc_main);
	const nuxt = createNuxtApp({
		vueApp,
		ssrContext
	});
	try {
		await applyPlugins(nuxt, virtual_nuxt_node_modules_2F_cache_2Fnuxt_2F_nuxt_2Fplugins_server_default);
		await nuxt.hooks.callHook("app:created", vueApp);
	} catch (error) {
		await nuxt.hooks.callHook("app:error", error);
		nuxt.payload.error ||= createError$1(error);
	}
	if (ssrContext && (ssrContext["~renderResponse"] || ssrContext._renderResponse)) throw new Error("skipping render");
	return vueApp;
};
var entry_default = ((ssrContext) => entry$1(ssrContext));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: entry_default
}, Symbol.toStringTag, { value: 'Module' }));

export { ClientOnly as C, Media_default as M, NuxtLink as N, _plugin_vue_export_helper_default as _, useNuxtApp as a, useAsyncData as b, useHead as c, useI18n as d, useMainStore as e, useRouter as f, useSeoMeta as g, useLocalePath as h, useSwitchLocalePath as i, useCookie as j, entry as k, useRoute$1 as u };
//# sourceMappingURL=entry.mjs.map
