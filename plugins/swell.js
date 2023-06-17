import swell from 'swell-js';

export default async (context, inject) => {
  const locale = context.app.i18n.locale;
  const storeId = process.env.SWELL_STORE_ID;
  const publicKey = process.env.SWELL_PUBLIC_KEY;

  // Bail if options aren't provided
  if (!storeId) {
    throw new Error('[swell module]: a store ID must be provided');
  }
  if (!publicKey) {
    throw new Error('[swell module]: a public API key must be provided');
  }
  // Set up swell-js client
  swell.init(storeId, publicKey, { locale: `${locale}-CA` });

  await swell.settings.load();

  // Set currency and locale after loading settings
  // Settings are necessary for correct execution of currency.set
  // swell.currency.set(currency);
  // swell.currency.locale = locale;

  // swell.locale.set(locale);

  // Inject client into nuxt context as $swell
  context.$swell = swell;
  inject('swell', swell);

  // context.store.commit('setState', { key: 'currency', value: currency });
  // context.store.commit('setState', { key: 'locale', value: locale });
};
