# 🚀 AI-Powered CSV Importer

> **Upload any CSV → Let AI understand the data → Get CRM-ready leads in seconds.**

An AI-powered full-stack application that intelligently converts **any CSV format** into a standardized CRM schema using **Google Gemini AI**.

Unlike traditional CSV importers that require manual column mapping, this application automatically recognizes different column names, understands their meaning using AI, and extracts structured CRM records with minimal user effort.

---

## 🌟 Features

- 🤖 AI-powered intelligent field mapping
- 📂 Supports any CSV structure and layout
- 📋 Interactive CSV preview before import
- ⚡ Batch processing for better performance
- 📈 Real-time processing progress
- 🎯 Automatic CRM field extraction
- 📱 Fully responsive modern interface
- 🌙 Dark mode support
- 🔄 Retry mechanism for failed AI requests
- 🛡️ Robust validation and error handling
- 🚀 Production-ready architecture
- 📊 Import summary with skipped and successful records

---

## 🛠️ Tech Stack

### 🎨 Frontend

- ⚛️ Next.js 14 (App Router)
- 📘 TypeScript
- 🎨 Tailwind CSS
- 📄 Papa Parse
- 📁 React Dropzone
- 🎯 Lucide React

### ⚙️ Backend

- 🟢 Node.js
- 🚂 Express.js
- 📘 TypeScript
- 📤 Multer
- 🤖 Google Gemini API
- ✅ Zod Validation

---

## 📦 Installation

### 📋 Prerequisites

Before running the project, ensure you have:

- 🟢 Node.js v18 or above
- 📦 npm or Yarn
- 🔑 OpenRouter API Key

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/ai-csv-importer.git
cd ai-csv-importer
```

### 2️⃣ Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the **backend** directory.

```env
PORT=5001

OPENROUTER_API_KEY=your_openrouter_api_key

BATCH_SIZE=5
```

Create a `.env.local` file inside the **frontend** directory.

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## ▶️ Run the Project

### Start Backend

```bash
cd backend
npm run dev
```

### Start Frontend

```bash
cd frontend
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
ai-csv-importer
│
├── frontend
│   ├── app
│   ├── components
│   ├── hooks
│   ├── lib
│   └── types
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── middleware
│   ├── utils
│   ├── ai
│   └── types
│
└── README.md
```

---

## 🤖 AI Workflow

```text
📂 Upload CSV
      │
      ▼
📋 Preview CSV
      │
      ▼
✅ Confirm Import
      │
      ▼
⚙️ Backend Parses CSV
      │
      ▼
🤖 Google Gemini AI
      │
      ▼
🧠 Intelligent Field Mapping
      │
      ▼
📊 CRM JSON Records
      │
      ▼
📈 Display Import Summary
```

---

## 🎯 Supported CRM Fields

- 📅 Created At
- 👤 Name
- 📧 Email
- 📱 Mobile Number
- 🌍 Country Code
- 🏢 Company
- 🏙️ City
- 📍 State
- 🌎 Country
- 👨‍💼 Lead Owner
- 🎯 CRM Status
- 📝 CRM Notes
- 📊 Data Source
- 🏠 Possession Time
- 📄 Description

---

## 📈 Performance Highlights

- ⚡ Batch AI processing
- 🚀 Fast CSV parsing
- 🧠 Intelligent semantic column detection
- 📦 Handles large CSV files efficiently
- 🔄 Automatic retry on AI failures
- 🛡️ Strong input validation

---

## 🎯 Future Improvements

- 📜 Import history
- 👥 User authentication
- ☁️ Cloud storage support
- 🗄️ Database integration
- 📊 Analytics dashboard
- 🔔 Email notifications
- 🌐 Multi-language support

---

## 👨‍💻 Author

**Anshuman Tiwari**

- 💼 LinkedIn: *(Add your LinkedIn URL)*
- 🐙 GitHub: *(Add your GitHub URL)*

---

## 📄 License

This project was developed as part of the **GrowEasy Software Developer Assignment**.

Feel free to fork, explore, and improve the project.