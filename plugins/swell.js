import swell from 'swell-js';

export default async (context, inject) => {
  const locale = context.app.i18n.locale;
  const storeId = context.$config.swellStoreId;
  const publicKey = context.$config.swellPublicKey;

  if (!storeId || !publicKey) {
    throw new Error('[swell module]: Both store ID and public API key must be provided');
  }

  const initSwell = async (newLocale) => {
    const clientOptions = {
      locale: `${newLocale}-CA`
    };

    await swell.init(storeId, publicKey, clientOptions);
    await swell.settings.load();

      context.$swell = swell;
      inject('swell', swell);
  };

  // Initial setup
  await initSwell(locale);

  context.app.i18n.onLanguageSwitched = async (oldLocale, newLocale) => {
    await initSwell(newLocale);
  };
};