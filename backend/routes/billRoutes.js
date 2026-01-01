import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { analyzeBill, generatePdf, healthCheck } from '../controllers/billController.js';

const router = express.Router();

// Analyze bill endpoint
router.post('/analyze', upload.single('bill'), analyzeBill);

// Generate PDF endpoint
router.post('/generate-pdf', generatePdf);

// Health check endpoint
router.get('/health', healthCheck);

export default router;

