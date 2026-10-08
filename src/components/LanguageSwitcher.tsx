'use client';

import React from 'react';
import { Globe } from 'lucide-react';
import { SupportedLocale } from '../i18n/translations';
import { useLanguage } from '../i18n/LanguageContext';

const LOCALE_LABELS: Record<SupportedLocale, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
  ha: { label: 'Hausa', flag: '🇳🇬' },
  yo: { label: 'Yorùbá', flag: '🇳🇬' },
  sw: { label: 'Kiswahili', flag: '🇰🇪' },
};

export const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-4 h-4 text-emerald-400 mr-1.5 pointer-events-none" />
      <select
        aria-label="Language selector"
        value={locale}
        onChange={(e) => setLocale(e.target.value as SupportedLocale)}
        className="bg-slate-900/80 border border-slate-700/60 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer hover:border-slate-600 transition-colors"
      >
        {Object.entries(LOCALE_LABELS).map(([code, item]) => (
          <option key={code} value={code} className="bg-slate-900 text-slate-100">
            {item.flag} {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};
