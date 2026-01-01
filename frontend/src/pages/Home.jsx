import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Upload, Shield, TrendingDown, FileText } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Upload,
      titleKey: 'feature_upload.title',
      descriptionKey: 'feature_upload.description'
    },
    {
      icon: Shield,
      titleKey: 'feature_ai.title',
      descriptionKey: 'feature_ai.description'
    },
    {
      icon: TrendingDown,
      titleKey: 'feature_savings.title',
      descriptionKey: 'feature_savings.description'
    },
    {
      icon: FileText,
      titleKey: 'feature_complaint.title',
      descriptionKey: 'feature_complaint.description'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/10 via-transparent to-emerald-500/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-[#2563EB] via-[#1e40af] to-emerald-600 bg-clip-text text-transparent tracking-tight">
              {t('home.hero_title')}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('home.hero_subtitle')}
            </p>
            <Link to="/dashboard">
              <Button variant="primary" className="text-lg px-8 py-4">
                {t('home.get_started')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              {t('home.how_it_works')}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('home.how_it_works_subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#2563EB] to-[#1e40af] flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {t(`home.${feature.titleKey}`)}
                  </h3>
                  <p className="text-slate-600">
                    {t(`home.${feature.descriptionKey}`)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

