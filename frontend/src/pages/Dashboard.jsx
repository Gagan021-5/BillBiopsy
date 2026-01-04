import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import FileUpload from '../components/upload/FileUpload';
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
      const currentLang = getLanguageByCode(i18n.language) || getLanguageByCode('en') || { englishName: 'English' };
      formData.append('language', currentLang.englishName || 'English');

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
    if (!analysis) {
      setError('No analysis data available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Ensure analysis has required structure
      const auditResult = {
        ...analysis,
        line_items: analysis.line_items || [],
        hospital_name: analysis.hospital_name || '',
        city: analysis.city || '',
        bill_date: analysis.bill_date || '',
        total_amount: analysis.total_amount || 0,
        potential_savings: analysis.potential_savings || 0,
        patient_name: analysis.patient_name || '',
      };

      const complaintResponse = await fetch('/api/generate-complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: '',
          auditResult: auditResult,
        }),
      });

      if (!complaintResponse.ok) {
        let errorMessage = 'Failed to generate complaint';
        try {
          const errorData = await complaintResponse.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${complaintResponse.status}`;
        }
        throw new Error(errorMessage);
      }

      let complaintData;
      try {
        complaintData = await complaintResponse.json();
      } catch (e) {
        throw new Error('Invalid response from server');
      }
      
      const complaintText = complaintData?.complaintText;

      if (!complaintText) {
        throw new Error('No complaint text generated');
      }

      const patientName = (analysis.patient_name && typeof analysis.patient_name === 'string' && analysis.patient_name.trim())
        ? analysis.patient_name.trim()
        : 'Patient Name Not Available';

      const pdfResponse = await fetch('/api/generate-complaint-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          complaintText,
          patient_name: patientName,
        }),
      });

      if (!pdfResponse.ok) {
        let errorMessage = 'Failed to generate PDF';
        try {
          const errorText = await pdfResponse.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.details || errorMessage;
          }
        } catch (e) {
          errorMessage = `Server error: ${pdfResponse.status}`;
        }
        throw new Error(errorMessage);
      }

      const blob = await pdfResponse.blob();

      if (!blob || blob.size === 0) {
        throw new Error('Empty PDF received');
      }

      if (blob.type && blob.type !== 'application/pdf') {
        throw new Error('Invalid PDF received');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'medical_complaint.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message || 'Failed to download PDF');
      console.error('PDF generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 sm:mb-4 tracking-tight px-2">
            {t('dashboard.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto px-2">
            {t('dashboard.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {/* Upload Section */}
          <FileUpload
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
            file={file}
            loading={loading}
            error={error}
          />

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
              <ComplaintGenerator auditResult={analysis} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

