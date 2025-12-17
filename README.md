# 📍 Heat Map Based Store Placement Analysis

## Overview
This project is a **data-driven decision support system** designed to identify **optimal store locations** using **heat map analysis**.  
It visualises customer density, demand intensity, and geographic patterns to support **strategic retail placement decisions**.

The application is built as a **full-stack data application**, combining backend analytics with interactive map-based visualisation.

---

## 🚀 Key Features
- 📊 Heat map visualisation of customer/activity density  
- 🗺️ Geographic mapping for city and store-level analysis  
- 📈 Data-driven store placement insights  
- ⚡ Interactive and high-performance web interface  
- 🔧 Modular, scalable architecture  

---

## 🛠️ Tech Stack

### Backend
- Python 3.10+
- FastAPI / Streamlit
- Pandas, NumPy
- Scikit-learn (if ML used)
- PostgreSQL / CSV-based data

### Frontend
- React (Vite)
- JavaScript, HTML, CSS
- Leaflet / Mapbox for map visualisation

---

## 📂 Project Structure

```text
HEATMAP/
│
├── backend/                # Backend source code
│   ├── app.py / main.py
│   ├── requirements.txt
│   └── utils/
│
├── frontend/               # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── data/                   # Dataset files (CSV)
│
├── .gitignore
├── README.md
└── requirements.txt
▶️ How to Run This Project (Step by Step)

These steps work on Windows, macOS, and Linux.

1️⃣ Prerequisites

Install the following:

Python 3.10+
https://www.python.org/downloads/

Node.js (LTS)
https://nodejs.org/

Git
https://git-scm.com/

Verify installation:

python --version
node --version
git --version

2️⃣ Clone the Repository
git clone https://github.com/Utkarshkhandka/heatmap-store-placement-analysis.git
cd heatmap-store-placement-analysis

3️⃣ Backend Setup (Python)
Create Virtual Environment
python -m venv venv

Activate Virtual Environment

Windows

venv\Scripts\activate


macOS / Linux

source venv/bin/activate


You should see:

(venv)

Install Backend Dependencies
pip install -r requirements.txt

Run Backend

Streamlit

streamlit run app.py


FastAPI

uvicorn main:app --reload


Backend will be available at:

http://localhost:8000

4️⃣ Frontend Setup (If Present)

Open a new terminal window (keep backend running):

cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

5️⃣ Access the Application

Frontend UI → http://localhost:5173

Backend API → http://localhost:8000

Heat map visualisation loads with provided dataset

❗ Common Issues & Fixes
Module not found
pip install -r requirements.txt

npm not recognised

Install Node.js and restart terminal.

Port already in use

Stop the existing process or change the port.

⏹️ Stop the Application

Press:

CTRL + C


in the terminal.

🎯 Use Cases

Retail expansion planning

Urban analytics

Business intelligence systems

Academic and final-year projects

🔮 Future Enhancements

Real-time data ingestion

Machine learning–based location scoring

PostGIS spatial analysis

Cloud deployment (AWS / GCP)

👤 Author

Utkarsh Khandka
GitHub: https://github.com/Utkarshkhandka


---

## 📌 FINAL COMMANDS (DO THIS NOW)

After saving `README.md`, run:

```bash
git add README.md
git commit -m "Add detailed README with setup instructions"
git push