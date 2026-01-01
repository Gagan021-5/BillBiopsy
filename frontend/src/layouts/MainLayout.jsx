import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { getLanguageByCode, RTL_LANGUAGES } from '../constants/languages';

export default function MainLayout() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Safe fallback: default to English if i18n.language is not found
    const currentLang = getLanguageByCode(i18n.language) || { dir: 'ltr' };

    // Update document direction and language safely
    document.documentElement.dir = currentLang.dir || 'ltr';
    document.documentElement.lang = i18n.language || 'en';
  }, [i18n.language]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
