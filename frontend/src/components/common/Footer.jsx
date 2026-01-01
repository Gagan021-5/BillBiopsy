import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-900 text-white py-8 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="flex items-center justify-center gap-2 text-slate-300">
          {t('footer.text')}
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
        </p>
      </div>
    </motion.footer>
  );
}

