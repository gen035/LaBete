//#region middleware/i18n.js
function i18n_default({ isHMR, app, store, route, params, error, redirect }) {
	const defaultLocale = app.i18n.fallbackLocale;
	if (isHMR) return;
	const locale = params.lang || app.i18n;
	if (store.state.locales.indexOf(locale) === -1) return error({
		message: "This page could not be found.",
		statusCode: 404
	});
	store.commit("SET_LANG", locale);
	app.i18n.locale = store.state.locale;
	if (locale === defaultLocale && route.fullPath.indexOf("/" + defaultLocale) === 0) {
		const toReplace = "^/" + defaultLocale + (route.fullPath.indexOf("/" + defaultLocale + "/") === 0 ? "/" : "");
		const re = new RegExp(toReplace);
		return redirect(route.fullPath.replace(re, "/"));
	}
}

export { i18n_default as default };
//# sourceMappingURL=i18n-D7uOyl6u.mjs.map
