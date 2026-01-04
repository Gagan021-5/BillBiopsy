import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import Card from '../common/Card';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.3
    }
  }
};

export default function ResultsTable({ analysis, onDownloadPDF }) {
  const { t } = useTranslation();
  const lineItems = analysis?.line_items || [];
  const flaggedItems = lineItems.filter(item => item.flagged);

  return (
    <div className="space-y-6">
      {/* Bill Information */}
      {(analysis?.hospital_name || analysis?.patient_name || analysis?.bill_date) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4 tracking-tight">
              {t('analysis.bill_info')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {analysis.hospital_name && (
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 mb-1">{t('analysis.hospital')}</p>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base break-words">{analysis.hospital_name}</p>
                </div>
              )}
              {analysis.patient_name && (
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 mb-1">{t('analysis.patient')}</p>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base break-words">{analysis.patient_name}</p>
                </div>
              )}
              {analysis.bill_date && (
                <div>
                  <p className="text-xs sm:text-sm text-slate-500 mb-1">{t('analysis.date')}</p>
                  <p className="font-semibold text-slate-900 text-sm sm:text-base break-words">{analysis.bill_date}</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {t('analysis.items_title')}
            </h3>
            {flaggedItems.length > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-semibold">
                {flaggedItems.length} {t('analysis.flagged_count')}
              </span>
            )}
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
            <motion.table
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full min-w-[600px]"
            >
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-xs sm:text-sm">{t('analysis.service')}</th>
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-xs sm:text-sm">{t('analysis.quantity')}</th>
                  <th className="text-right py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-xs sm:text-sm">{t('analysis.price')}</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 font-semibold text-slate-700 text-xs sm:text-sm">{t('analysis.status')}</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.length > 0 ? (
                  lineItems.map((item, index) => (
                    <motion.tr
                      key={index}
                      variants={rowVariants}
                      className={`
                        border-b border-slate-100 transition-colors
                        ${item.flagged 
                          ? 'bg-red-50/50 hover:bg-red-50' 
                          : 'hover:bg-slate-50'
                        }
                      `}
                    >
                      <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-slate-900 text-xs sm:text-sm break-words">
                        {item.service || '-'}
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-slate-600 text-xs sm:text-sm">
                        {item.quantity || 1}
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-right font-semibold text-slate-900 text-xs sm:text-sm">
                        INR {(item.price || 0).toFixed(2)}
                      </td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                        {item.flagged ? (
                          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-semibold">
                            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {t('analysis.flagged')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold">
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            {t('analysis.ok')}
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 sm:py-12 text-center text-slate-500 text-sm sm:text-base">
                      {t('analysis.no_items')}
                    </td>
                  </tr>
                )}
              </tbody>
            </motion.table>
          </div>
        </Card>
      </motion.div>

      {/* Download PDF Button */}
      {analysis?.potential_savings > 0 && analysis?.line_items?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={onDownloadPDF}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 inline-flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {t('analysis.download_complaint')}
          </button>
        </motion.div>
      )}
    </div>
  );
}

