import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Stethoscope, Menu, X } from 'lucide-react';
import LanguagePicker from './LanguagePicker';

export default function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Stethoscope className="w-6 h-6 sm:w-8 sm:h-8 text-[#2563EB]" />
            </motion.div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#1e40af] bg-clip-text text-transparent tracking-tight">
              {t('title')}
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-4">
            <LanguagePicker />
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1e40af] text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {t('navbar.analyze_now')}
              </motion.button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 py-4 space-y-4"
            >
              <div className="flex flex-col gap-4">
                <LanguagePicker onLanguageChange={() => setIsMobileMenuOpen(false)} />
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1e40af] text-white rounded-lg font-semibold shadow-lg transition-all duration-200"
                  >
                    {t('navbar.analyze_now')}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

