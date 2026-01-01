import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI with Gemini 2.5 Flash (primary) and 2.5 Flash Lite (fallback)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model25Flash = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const model25FlashLite = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

// System prompt for Gemini
export const SYSTEM_PROMPT = `You are a medical bill analysis expert. Analyze the hospital bill image/PDF and extract structured data.

CRITICAL: Output ONLY valid JSON. No markdown, no explanations, no code blocks. Start directly with { and end with }.

STEP 1: Extract basic information:
- hospital_name: Name of the hospital/clinic (string, empty if not found)
- patient_name: Patient name if visible (string, empty if not found)
- bill_date: Date in YYYY-MM-DD format or original format from bill (string)
- city: City name if visible (string, empty if not found)

STEP 2: Extract all line items:
For each service/item on the bill, create an entry with:
- service: Exact service/item name from bill (string)
- quantity: Number of units (number, default 1 if not specified)
- price: Price per unit or total for that line (number, no currency symbols)
- flagged: true if price seems unusually high OR if duplicate service detected, else false

STEP 3: Calculate totals:
- total_amount: Sum of all line item prices (number)
- potential_savings: Estimated savings if flagged items are corrected (number, 0 if none flagged)

FLAGGING RULES:
- Flag if price is 2x or more than typical Indian market rate for that service
- Flag if same service appears multiple times with same date/time (duplicate)
- Flag if quantity seems incorrect (e.g., 10x normal usage)
- Be conservative - only flag clear overcharges

OUTPUT FORMAT (JSON only, no markdown):
{
  "hospital_name": "",
  "patient_name": "",
  "bill_date": "",
  "city": "",
  "line_items": [
    {
      "service": "",
      "quantity": 0,
      "price": 0,
      "flagged": false
    }
  ],
  "total_amount": 0,
  "potential_savings": 0
}`;

// Helper function to check if error is retryable (404, quota, model errors)
function isRetryableError(error) {
  const errorMessage = error.message?.toLowerCase() || '';
  const errorString = JSON.stringify(error).toLowerCase();
  
  return (
    errorMessage.includes('404') ||
    errorMessage.includes('429') ||
    errorMessage.includes('quota') ||
    errorMessage.includes('rate limit') ||
    errorMessage.includes('resource exhausted') ||
    errorMessage.includes('model not found') ||
    errorString.includes('404') ||
    errorString.includes('429') ||
    errorString.includes('quota') ||
    errorString.includes('rate limit') ||
    errorString.includes('resource exhausted')
  );
}

// Generate content with automatic fallback from 2.5 Flash to 2.5 Flash Lite
export async function generateContent(prompt, imagePart) {
  try {
    // Try Gemini 2.5 Flash first
    const result = await model25Flash.generateContent([prompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Check if error is retryable (404, quota, model errors)
    if (isRetryableError(error)) {
      console.log('⚠️  Gemini 2.5 Flash unavailable. Falling back to Gemini 2.5 Flash Lite...');
      
      try {
        // Fallback to Gemini 2.5 Flash Lite
        const result = await model25FlashLite.generateContent([prompt, imagePart]);
        const response = await result.response;
        console.log('✅ Successfully used Gemini 2.5 Flash Lite fallback');
        return response.text();
      } catch (fallbackError) {
        console.error('❌ Both models failed. Fallback error:', fallbackError.message);
        throw new Error(`Both Gemini models failed. Primary: ${error.message}, Fallback: ${fallbackError.message}`);
      }
    } else {
      // Non-retryable error (e.g., invalid API key, malformed request)
      throw error;
    }
  }
}

// Helper function to convert buffer to base64
export function bufferToBase64(buffer, mimeType) {
  return `data:${mimeType};base64,${buffer.toString('base64')}`;
}

