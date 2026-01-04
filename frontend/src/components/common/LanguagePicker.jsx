import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown } from 'lucide-react';
import { getLanguagesByRegion, getLanguageByCode, RTL_LANGUAGES } from '../../constants/languages';

export default function LanguagePicker({ onLanguageChange }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('i18nextLng');
    if (!storedLang || !getLanguageByCode(storedLang)) {
      if (i18n.language !== 'en') {
        i18n.changeLanguage('en');
        localStorage.setItem('i18nextLng', 'en');
      }
    } else if (i18n.language !== storedLang && getLanguageByCode(storedLang)) {
      i18n.changeLanguage(storedLang);
    }
  }, []);

  const currentLang = getLanguageByCode(i18n.language) || getLanguageByCode('en') || { name: 'English', dir: 'ltr' };
  const languagesByRegion = getLanguagesByRegion() || {};

  const handleLanguageChange = (langCode) => {
    const lang = getLanguageByCode(langCode) || { dir: 'ltr' };
    i18n.changeLanguage(langCode);
    try {
      localStorage.setItem('i18nextLng', langCode);
    } catch (e) {
      console.warn('localStorage write failed:', e);
    }
    setIsOpen(false);
    
    if (onLanguageChange) {
      onLanguageChange();
    }

    document.documentElement.dir = lang.dir;
    document.documentElement.lang = langCode;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/70 backdrop-blur-md border border-white/20 hover:bg-white/90 transition-all"
      >
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLang?.name || 'Language'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 sm:w-80 max-h-96 overflow-y-auto bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 z-50"
            >
              <div className="p-4">
                {Object.entries(languagesByRegion).map(([region, langs]) => (
                  <div key={region} className="mb-4 last:mb-0">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                      {region}
                    </h3>
                    <div className="space-y-1">
                      {langs?.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                            i18n.language === lang.code
                              ? 'bg-[#2563EB] text-white'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{lang?.name || 'Unknown'}</div>
                              <div
                                className={`text-xs ${
                                  i18n.language === lang.code ? 'text-white/80' : 'text-slate-500'
                                }`}
                              >
                                {lang?.englishName || ''}
                              </div>
                            </div>
                            {RTL_LANGUAGES.includes(lang?.code) && (
                              <span className="text-xs px-2 py-0.5 bg-slate-200 rounded text-slate-600">
                                RTL
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
