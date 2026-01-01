<!-- HEADER BANNER -->
<p align="center">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=400&size=20&duration=5000&pause=1000&color=36BCF7FF&background=00000000&center=false&vCenter=false&lines=%F0%9F%92%8A+Welcome+to+BillBiopsy!;Your+AI-Powered+Patient+Advocate" alt="Welcome animation for BillBiopsy: Your AI-Powered Patient Advocate" />
</p>


<p align="center">
  <a href="https://example-demo-url.com" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-00C853?style=for-the-badge&logo=google-chrome&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Powered%20by-Google%20Gemini-6772E5?style=for-the-badge&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/File%20Upload-Multer-008CDD?style=for-the-badge&logo=upload&logoColor=white" />
  <img src="https://img.shields.io/badge/PDF%20Gen-pdf--lib-FFCA28?style=for-the-badge&logo=adobe&logoColor=black" />
</p>

---

<p align="center" style="font-size:1.2em">
  <strong>🩺 BillBiopsy — Analyze hospital bills, detect overcharges, and generate complaint letters instantly.</strong><br>
  <em>An AI-powered medical bill analyzer focused on the Indian healthcare market.</em>
</p>

---

<div align="center">
  <img src="https://via.placeholder.com/600x320?text=BillBiopsy+-+Dashboard+Preview" width="45%" alt="Dashboard Preview"/>
  &nbsp;
  <img src="https://via.placeholder.com/600x320?text=Analysis+Report+Preview" width="45%" alt="Analysis Report Preview"/>
</div>

---

## 🚀 Why BillBiopsy?

- 🕒 Save time: Get a line-by-line analysis of your hospital bill in seconds.
- 💸 Save money: Detect overcharges and see potential refunds or savings.
- 📝 Take action: Auto-generate a formal complaint/appeal PDF you can send to the hospital or insurer.
- 🇮🇳 India-focused: Pricing comparisons and market references optimized for the Indian market.

---

## Features

- 📄 Upload medical bills (JPG, PNG, PDF)
- 🤖 AI-powered OCR & semantic analysis using Google Gemini (Vision)
- 💰 Automatic overpricing detection against standard market rates
- 📊 Detailed item-by-item breakdown and summary savings
- 📝 Auto-generated complaint PDF with customizable fields
- 🔒 No sign-in required — processing happens in-memory

---

## 🛠️ Tech Stack

| Frontend              | Backend                | AI / Integrations      |
|:---------------------:|:---------------------:|:---------------------:|
| ⚛️ React (Vite)       | 🖥️ Node.js + Express  | 🤖 Google Gemini Vision |
| 🎨 CSS (or Tailwind)  | 📁 Multer (file uploads)| 🧾 pdf-lib (PDF generation) |

---

## Quickstart

1. Clone the repo

```bash
git clone https://github.com/Gagan021-5/BillBiopsy.git
cd BillBiopsy
```

2. Install dependencies (root script provided)

```bash
npm run install-all
```

3. Configure environment variables (create `server/.env`)

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

4. Run in development (runs both client & server)

```bash
npm run dev
```

Or run separately:

Terminal 1 (server):
```bash
npm run server
```

Terminal 2 (client):
```bash
npm run client
```

5. Open the app:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

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

---

## API Endpoints

### POST `/api/analyze`
Upload and analyze a medical bill.

- Request: multipart/form-data with `bill` file
- Response: JSON analysis with items, pricing, flagged overcharges and summary

### POST `/api/generate-pdf`
Generate complaint PDF from analysis.

- Request: JSON with analysis data and optional contact fields
- Response: PDF file download

### GET `/api/health`
Health check endpoint.

---

## Usage

1. Upload a hospital bill (JPG, PNG, or PDF)
2. Click "Analyze Bill" to start OCR + AI processing
3. Review the itemized analysis (overpriced items highlighted)
4. Edit contact fields if needed and click "Generate Complaint PDF"

---

## Notes & Limits

- No database or user authentication required by default
- All processing happens in-memory (suitable for demo / small scale)
- Supports bills up to 10MB by default (adjustable in server config)
- Accuracy depends on image quality and bill format; manual verification recommended

---

## Architecture

```mermaid
graph TD
  U[👩‍⚕️ User] -->|Upload Bill| A[⚛️ Client (React)]
  A -->|POST /api/analyze| B[🖥️ Server (Express)]
  B -->|OCR + Vision| C[🤖 Google Gemini Vision]
  B -->|Compare Rates| D[📊 Market Rate DB (static / heuristics)]
  B -->|Generate PDF| E[🧾 pdf-lib]

  classDef frontend fill:#61dafb,stroke:#222,stroke-width:2px;
  classDef backend fill:#2ecc40,stroke:#222,stroke-width:2px;
  classDef ai fill:#6772e5,stroke:#222,stroke-width:2px;

  class A frontend
  class B backend
  class C ai
```

---

## Contributing

Contributions welcome — open an issue or submit a PR with improvements, bug fixes, or model prompts that improve accuracy.

---

## License

MIT
