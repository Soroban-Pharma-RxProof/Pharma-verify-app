import { describe, it, expect } from 'vitest';
import { translations, SupportedLocale, TranslationDictionary } from '../src/i18n/translations';

describe('i18n Multilingual Dictionary Tests', () => {
  const supportedLocales: SupportedLocale[] = ['en', 'fr', 'ha', 'yo', 'sw'];

  it('contains all 5 supported locales', () => {
    supportedLocales.forEach((locale) => {
      expect(translations[locale]).toBeDefined();
    });
  });

  it('ensures every locale has identical required translation keys without missing entries', () => {
    const enKeys = Object.keys(translations.en) as (keyof TranslationDictionary)[];
    expect(enKeys.length).toBeGreaterThanOrEqual(30);

    supportedLocales.forEach((locale) => {
      const localeDict = translations[locale];
      enKeys.forEach((key) => {
        expect(localeDict[key]).toBeDefined();
        expect(typeof localeDict[key]).toBe('string');
        expect(localeDict[key].trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('validates critical verification status copy across languages', () => {
    // English
    expect(translations.en.authenticTitle).toBe('Authentic Medicine');
    expect(translations.en.expiredTitle).toBe('Expired Medicine');
    expect(translations.en.recalledTitle).toBe('Recalled Medicine');
    expect(translations.en.suspiciousTitle).toContain('Suspicious');

    // French
    expect(translations.fr.authenticTitle).toBe('Médicament Authentique');
    expect(translations.fr.expiredTitle).toBe('Médicament Périmé');
    expect(translations.fr.recalledTitle).toBe('Médicament Rappelé');

    // Hausa
    expect(translations.ha.authenticTitle).toBe('Magani na Gaskiya');
    expect(translations.ha.expiredTitle).toBe('Magani Ya Lalace');
    expect(translations.ha.recalledTitle).toBe('An Janye Maganin');

    // Yoruba
    expect(translations.yo.authenticTitle).toBe('Ògùn Gidi Ni');
    expect(translations.yo.expiredTitle).toBe('Ògùn Yìí Ti Bàjẹ́');
    expect(translations.yo.recalledTitle).toBe('A Ti Fagilé Ògùn Yìí');

    // Swahili
    expect(translations.sw.authenticTitle).toBe('Dawa Halisi');
    expect(translations.sw.expiredTitle).toBe('Dawa Imeisha Muda');
    expect(translations.sw.recalledTitle).toBe('Dawa Imerudishwa Nyuma');
  });

  it('confirms blister pack and custody terminology is localized', () => {
    supportedLocales.forEach((locale) => {
      const dict = translations[locale];
      expect(dict.custodyChain).toBeDefined();
      expect(dict.blisterStripsRemaining).toBeDefined();
      expect(dict.dispenseMedicine).toBeDefined();
      expect(dict.burnSerial).toBeDefined();
    });
  });
});
