# Banking Chatbot 🤖

An AI-powered banking chatbot built using Python, Flask, and Google Gemini. It provides conversational responses to banking-related queries through a clean, responsive, and user-friendly web interface.

## ✨ Features

- 💬 Interactive chatbot for banking-related questions
- 🤖 AI-generated responses using Google Gemini
- 🌐 Web interface built with HTML, CSS, and JavaScript
- 📱 Responsive design for different screen sizes
- 📝 Readable responses with headings, lists, and formatted text
- 🔐 Environment-variable-based API key configuration
- ⚡ Flask backend for handling chat requests

## 🛠️ Technologies Used

- **Programming Language:** Python
- **Backend:** Flask
- **AI Model:** Google Gemini
- **Frontend:** HTML, CSS, JavaScript
- **API Integration:** Google Generative AI SDK

## 📁 Project Structure

```text
kvb-banking-chatbot/
├── app.py
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
├── requirements.txt
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/kvb-banking-chatbot.git
cd kvb-banking-chatbot
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Create a virtual environment

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure the Gemini API key

Generate an API key through [Google AI Studio](https://aistudio.google.com/).

Set the key in PowerShell:

```powershell
$env:GOOGLE_API_KEY = "YOUR_API_KEY"
```

Replace `YOUR_API_KEY` with your own key. Never commit API keys to GitHub.

### 5. Run the application

```bash
python app.py
```

Open your browser and visit:

http://127.0.0.1:5000

## 🔒 Security

- Store API keys in environment variables.
- Never upload API keys, `.env` files, credentials, or private information.
- Add sensitive files and virtual environments to `.gitignore`.
- Do not enter confidential banking or personal information into the chatbot.

## ⚠️ Disclaimer

This project is an educational AI chatbot prototype. Responses are AI-generated and may be inaccurate. It is not an official KVB banking service and should not be used for actual financial transactions or decisions. Verify banking information through official bank channels.

## 👩‍💻 Author

**Hamshini Priya S**

AI & Data Science Student

---

⭐ If you find this project interesting, consider giving the repository a star!
