import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: 'llama-3.1-8b-instant',
  temperature: 0, // 🔒 
});

const complaintTemplate = `You are a legal medical complaint writer for Indian patients.

TASK:
- Generate a FORMAL LEGAL MEDICAL COMPLAINT in plain text ONLY. No markdown, no emojis, no JSON, no code blocks.

CONDITIONS:
1. If ALL billed items are correctly priced (no overpriced items), respond with exactly:
   "All charges are verified. No complaint is necessary."
2. If ANY item is overpriced or flagged, generate a complaint.

PATIENT VOICE INPUT (optional):
{spoken_text}

AUDIT RESULTS:
Hospital: {hospital_name}
City: {city}
Bill Date: {bill_date}
Total Amount: ₹{total_amount}
Potential Savings: ₹{total_savings}

Overpriced Items:
{overpriced_items}

REQUIREMENTS IF COMPLAINT IS NEEDED:
- Use a polite but firm legal tone.
- Address: Hospital Administration / District Consumer Forum.
- Start with formal salutation.
- Mention OVERCHARGING explicitly.
- Include PATIENT GRIEVANCE.
- Request REFUND / INVESTIGATION.
- List specific overpriced items.
- Include PATIENT VOICE input if provided.
- End with formal closing.

OUTPUT RULE:
- Only plain text.
- If no complaint is needed, return only:
  "All charges are verified. No complaint is necessary."`;

const prompt = PromptTemplate.fromTemplate(complaintTemplate);
const complaintChain = RunnableSequence.from([prompt, model]);

export async function generateComplaintWithLangChain(
  hospital_name,
  city,
  bill_date,
  total_amount,
  total_savings,
  overpriced_items,
  spoken_text = ''
) {
  try {
    const overpricedItemsText = overpriced_items.length > 0
      ? overpriced_items.map(item => `- ${item.service}: Charged ₹${item.price}, Fair Price ₹${item.standard_price || Math.round(item.price * 0.7)}`).join('\n')
      : 'No overpriced items found. All charges are correctly priced.';

    const result = await complaintChain.invoke({
      hospital_name: hospital_name || 'Not specified',
      city: city || 'Not specified',
      bill_date: bill_date || 'Not specified',
      total_amount: total_amount || 0,
      total_savings: total_savings || 0,
      overpriced_items: overpricedItemsText,
      spoken_text: spoken_text || 'No voice input provided',
    });

    return result?.content?.trim() || result?.text?.trim() || '';
  } catch (error) {
    console.error('LangChain complaint generation error:', error);
    throw new Error('Failed to generate complaint with LangChain');
  }
}
