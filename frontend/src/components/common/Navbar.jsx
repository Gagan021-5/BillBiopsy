import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Stethoscope } from 'lucide-react';
import LanguagePicker from './LanguagePicker';

export default function Navbar() {
  const { t } = useTranslation();

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
              <Stethoscope className="w-8 h-8 text-[#2563EB]" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#2563EB] to-[#1e40af] bg-clip-text text-transparent tracking-tight">
              {t('title')}
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </motion.nav>
  );
}

