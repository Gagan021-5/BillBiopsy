import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { TrendingDown, IndianRupee } from 'lucide-react';

export default function SavingsCard({ analysis }) {
  const { t } = useTranslation();
  const savings = analysis?.potential_savings || 0;
  const totalAmount = analysis?.total_amount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-4 sm:p-6 md:p-8 shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/10 rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32" />
      <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-white/10 rounded-full -ml-12 sm:-ml-18 md:-ml-24 -mb-12 sm:-mb-18 md:-mb-24" />
      
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold opacity-90">{t('analysis.savings_title')}</h3>
          <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-baseline space-x-2 mb-4 sm:mb-6"
        >
          <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold">
            {savings.toFixed(2)}
          </span>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-emerald-50 gap-3 sm:gap-0">
          <div>
            <p className="text-xs sm:text-sm opacity-80">{t('analysis.total_amount')}</p>
            <p className="text-base sm:text-lg font-semibold">INR {totalAmount.toFixed(2)}</p>
          </div>
          {savings > 0 && (
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm opacity-80">{t('analysis.savings_percentage')}</p>
              <p className="text-base sm:text-lg font-semibold">
                {((savings / totalAmount) * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

