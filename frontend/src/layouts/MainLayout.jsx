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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-x-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-50/90"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl bg-blob-1"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl bg-blob-2"></div>
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-200/15 rounded-full blur-3xl bg-blob-3"></div>
        <div className="absolute top-1/3 right-0 w-80 h-80 bg-cyan-200/15 rounded-full blur-3xl bg-blob-4"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.05),transparent_50%)]"></div>
      </div>
      <Navbar />
      <main className="flex-1 w-full relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
