import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Upload,
  Loader2,
  X,
  Check,
  Download,
  FileText,
} from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";

export default function ComplaintGenerator({ auditResult }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [complaintText, setComplaintText] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Microphone access denied. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioBlob(file);
      setError(null);
      setTranscript(null);
      setComplaintText(null);
    }
  };

  const transcribeVoice = async () => {
    if (!audioBlob) {
      setError("No audio file available.");
      return;
    }

    setIsTranscribing(true);
    setError(null);
    setTranscript(null);
    setComplaintText(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "complaint.webm");

      const response = await fetch("/api/voice-complaint", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to transcribe audio");
      }

      const data = await response.json();
      setTranscript(data.transcript || "");
    } catch (err) {
      console.error("Transcription error:", err);
      setError(err.message || "Failed to transcribe audio.");
    } finally {
      setIsTranscribing(false);
    }
  };

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
          transcript: transcript || "",
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
      const response = await fetch("/api/generate-complaint-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaintText }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();

      if (blob.type !== "application/pdf") {
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

  const reset = () => {
    setAudioBlob(null);
    setTranscript(null);
    setComplaintText(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        📝 Generate Complaint
      </h2>
      <p className="text-slate-600 mb-6 text-sm">
        Record your complaint or generate from audit results
      </p>

      {!auditResult && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm mb-4">
          Please analyze a bill first to generate a complaint.
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              disabled={!auditResult}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mic className="w-4 h-4" />
              Record
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors animate-pulse"
            >
              <MicOff className="w-4 h-4" />
              Stop
            </motion.button>
          )}

          <span className="text-slate-400">or</span>

          <motion.label
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            Upload
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={!auditResult}
            />
          </motion.label>
        </div>

        {audioBlob && !transcript && (
          <Button
            onClick={transcribeVoice}
            disabled={isTranscribing}
            variant="primary"
            className="w-full"
          >
            {isTranscribing ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Transcribing...
              </span>
            ) : (
              "Transcribe Voice"
            )}
          </Button>
        )}

        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm"
          >
            <p className="font-semibold text-blue-900 mb-1">Transcript:</p>
            <p className="text-slate-800">{transcript}</p>
          </motion.div>
        )}

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
              className="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <h3 className="font-semibold text-green-900 mb-2">
                Formal Complaint:
              </h3>
              <div className="text-slate-800 whitespace-pre-wrap text-sm mb-4 max-h-60 overflow-y-auto">
                {complaintText}
              </div>
              <Button
                onClick={downloadPDF}
                disabled={isDownloading}
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
            className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {error}
          </motion.div>
        )}
      </div>
    </Card>
  );
}
