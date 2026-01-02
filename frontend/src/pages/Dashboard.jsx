import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import FileUpload from '../components/upload/FileUpload';
import VoiceRecorder from '../components/voice/VoiceRecorder';
import ComplaintGenerator from '../components/complaint/ComplaintGenerator';
import SavingsCard from '../components/analysis/SavingsCard';
import ResultsTable from '../components/analysis/ResultsTable';
import { getLanguageByCode } from '../constants/languages';

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile, errorMessage = null) => {
    setFile(selectedFile);
    setError(errorMessage);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError(t('upload.error_no_file'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('bill', file);
      
      // Send language name to backend
      const currentLang = getLanguageByCode(i18n.language);
      formData.append('language', currentLang.englishName);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze bill');
      }

      const data = await response.json();
      // Handle new format: { audit, complaintText } or legacy format
      if (data.audit) {
        setAnalysis({ ...data.audit, complaintText: data.complaintText });
      } else {
        setAnalysis(data);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the bill');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!analysis) return;

    try {
      // Transform new structure to old structure for PDF generation compatibility
      const pdfData = {
        complaint_text: `This complaint is regarding the medical bill from ${analysis.hospital_name || 'the hospital'} dated ${analysis.bill_date || 'the bill date'}. After analysis, we have identified ${analysis.line_items?.filter(item => item.flagged).length || 0} potentially overpriced items totaling INR ${(analysis.potential_savings || 0).toFixed(2)} in potential savings. We request a review and rectification of these charges.`,
        items: (analysis.line_items || []).map(item => ({
          name: item.service,
          charged_price: item.price,
          standard_price: item.flagged ? item.price * 0.7 : item.price, // Estimate
          is_overpriced: item.flagged,
          savings: item.flagged ? item.price * 0.3 : 0
        })),
        total_charged: analysis.total_amount || 0,
        total_savings: analysis.potential_savings || 0,
        currency: 'INR'
      };

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'complaint-letter.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || 'Failed to download PDF');
      console.error('PDF generation error:', err);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* Upload Section */}
          <FileUpload
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            file={file}
            loading={loading}
            error={error}
          />

          {/* Voice-to-Text Section */}
          <VoiceRecorder />

          {/* Results Section */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <SavingsCard analysis={analysis} />
              <ResultsTable analysis={analysis} onDownloadPDF={handleDownloadPDF} />
              {analysis.complaintText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <h3 className="font-semibold text-green-900 mb-2">Generated Complaint:</h3>
                  <div className="text-slate-800 whitespace-pre-wrap text-sm mb-4 max-h-60 overflow-y-auto">
                    {analysis.complaintText}
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/generate-complaint-pdf', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ complaintText: analysis.complaintText }),
                        });
                        if (!response.ok) throw new Error('Failed to generate PDF');
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'complaint.pdf';
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (err) {
                        setError(err.message || 'Failed to download PDF');
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Complaint PDF
                  </button>
                </motion.div>
              )}
              <ComplaintGenerator auditResult={analysis} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

