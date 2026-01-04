import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Download,
  FileText,
} from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

export default function ComplaintGenerator({ auditResult }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [complaintText, setComplaintText] = useState(null);
  const [error, setError] = useState(null);

  const generateComplaint = async () => {
    if (!auditResult) {
      setError("Please analyze a bill first.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setComplaintText(null);

    try {
      const response = await fetch("/api/generate-complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: "",
          auditResult: auditResult,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate complaint");
      }

      const data = await response.json();
      setComplaintText(data.complaintText || "");
    } catch (err) {
      console.error("Complaint generation error:", err);
      setError(err.message || "Failed to generate complaint.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!complaintText) {
      setError("No complaint text available.");
      return;
    }

    setIsDownloading(true);
    setError(null);

    try {
      const patientName = (auditResult?.patient_name && typeof auditResult.patient_name === 'string' && auditResult.patient_name.trim())
        ? auditResult.patient_name.trim()
        : 'Patient Name Not Available';

      const response = await fetch("/api/generate-complaint-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          complaintText,
          patient_name: patientName
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to generate PDF";
        try {
          const errorText = await response.text();
          if (errorText) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error || errorData.details || errorMessage;
          }
        } catch (e) {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      if (!blob || blob.size === 0) {
        throw new Error("Empty PDF received");
      }

      if (blob.type && blob.type !== "application/pdf") {
        throw new Error("Invalid PDF received");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "medical_complaint.pdf";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      setError(err.message || "Failed to download PDF.");
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <Card>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
        📝 Generate Complaint
      </h2>
      <p className="text-slate-600 mb-4 sm:mb-6 text-xs sm:text-sm px-2">
        Generate formal complaint from audit results
      </p>

      {!auditResult && (
        <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-xs sm:text-sm mb-4">
          Please analyze a bill first to generate a complaint.
        </div>
      )}

      <div className="space-y-3 sm:space-y-4">
        {auditResult && (
          <Button
            onClick={generateComplaint}
            disabled={isGenerating}
            variant="primary"
            className="w-full"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Complaint...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" />
                Generate Formal Complaint
              </span>
            )}
          </Button>
        )}

        <AnimatePresence mode="wait">
          {complaintText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <h3 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">
                Formal Complaint:
              </h3>
              <div className="text-slate-800 whitespace-pre-wrap text-xs sm:text-sm mb-3 sm:mb-4 max-h-60 overflow-y-auto break-words">
                {complaintText}
              </div>
              <Button
                onClick={downloadPDF}
                disabled={isDownloading || !complaintText || complaintText.trim().length === 0}
                variant="primary"
                className="w-full"
              >
                {isDownloading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating PDF...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Complaint PDF
                  </span>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm break-words"
          >
            {error}
          </motion.div>
        )}
      </div>
    </Card>
  );
}

