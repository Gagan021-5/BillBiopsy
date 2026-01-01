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
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-8 shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
      
      <div className="relative z-10 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold opacity-90">{t('analysis.savings_title')}</h3>
          <TrendingDown className="w-6 h-6" />
        </div>
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-baseline space-x-2 mb-6"
        >
          <IndianRupee className="w-8 h-8" />
          <span className="text-5xl font-bold">
            {savings.toFixed(2)}
          </span>
        </motion.div>

        <div className="flex items-center justify-between text-emerald-50">
          <div>
            <p className="text-sm opacity-80">{t('analysis.total_amount')}</p>
            <p className="text-lg font-semibold">INR {totalAmount.toFixed(2)}</p>
          </div>
          {savings > 0 && (
            <div className="text-right">
              <p className="text-sm opacity-80">{t('analysis.savings_percentage')}</p>
              <p className="text-lg font-semibold">
                {((savings / totalAmount) * 100).toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

