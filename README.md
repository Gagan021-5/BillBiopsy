# BillBiopsy - Patient Advocate

An AI-powered medical bill analyzer for Indian patients. Upload your hospital bill and get instant analysis against standard market rates, with automatic complaint letter generation.

## Features

- 📄 Upload medical bills (JPG, PNG, PDF)
- 🤖 AI-powered analysis using Google Gemini Vision
- 💰 Automatic overpricing detection
- 📊 Detailed item-by-item breakdown
- 📝 Auto-generated complaint PDF
- 🎨 Clean, modern UI

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Google Gemini 1.5 Flash (Vision)
- **File Handling:** Multer
- **PDF Generation:** pdf-lib

## Setup Instructions

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

**Get your Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste it into the `.env` file

### 3. Run the Application

**Development mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 (Server):
```bash
npm run server
```

Terminal 2 (Client):
```bash
npm run client
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
billbiopsy/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Styles
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # Main server file
│   ├── .env.example       # Environment template
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## API Endpoints

### POST `/api/analyze`
Upload and analyze a medical bill.

**Request:** Multipart form data with `bill` file
**Response:** JSON analysis with items, pricing, and savings

### POST `/api/generate-pdf`
Generate complaint PDF from analysis.

**Request:** JSON with analysis data
**Response:** PDF file download

### GET `/api/health`
Health check endpoint.

## Usage

1. Upload a medical bill (JPG, PNG, or PDF)
2. Click "Analyze Bill" to process
3. Review the analysis table (overpriced items highlighted in red)
4. Download the auto-generated complaint PDF

## Notes

- No database or authentication required
- All processing happens in-memory
- Supports bills up to 10MB
- Optimized for Indian healthcare market rates

## License

MIT

