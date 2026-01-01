import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import billRoutes from './routes/billRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', billRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 BillBiopsy server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set GEMINI_API_KEY in .env file`);
  console.log(`🤖 Primary: Gemini 2.5 Flash | Fallback: Gemini 2.5 Flash Lite`);
  console.log(`📊 Features: Dynamic Rate Card & Self-Learning History enabled`);
});
