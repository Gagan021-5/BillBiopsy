import { generateComplaintWithLangChain } from '../chains/complaintChain.js';
import PDFDocument from 'pdfkit';

/**
 * Generate formal complaint TEXT
 */
export async function generateFormalComplaint(transcriptText, auditResult) {
  try {
    if (!auditResult) {
      throw new Error('auditResult missing');
    }

    const overpricedItems = (auditResult.line_items || []).filter(item => item.flagged);

    const complaintText = await generateComplaintWithLangChain(
      auditResult.hospital_name || '',
      auditResult.city || '',
      auditResult.bill_date || '',
      auditResult.total_amount || 0,
      auditResult.potential_savings || 0,
      overpricedItems,
      transcriptText || ''
    );

    return complaintText;
  } catch (error) {
    console.error('Error generating complaint:', error);
    throw new Error('Failed to generate formal complaint');
  }
}

/**
 * Generate complaint PDF (FIXED – NO CORRUPTION)
 */
export async function generateComplaintPdf(req, res) {
  try {
    const { complaintText } = req.body;

    if (!complaintText || typeof complaintText !== 'string') {
      return res.status(400).json({ error: 'Valid complaintText is required' });
    }

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    });

    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));

    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="medical_complaint.pdf"'
      );
      res.setHeader('Content-Length', pdfBuffer.length);

      res.end(pdfBuffer);
    });

    // ===== PDF CONTENT =====

    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('FORMAL MEDICAL COMPLAINT', { align: 'center' })
      .moveDown(2);

    const today = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`Date: ${today}`, { align: 'right' })
      .moveDown(2);

    doc
      .font('Helvetica')
      .fontSize(11)
      .text(complaintText, {
        align: 'left',
        lineGap: 4,
      });

    doc.end();
  } catch (error) {
    console.error('Error generating complaint PDF:', error);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate PDF',
        details: error.message,
      });
    }
  }
}
