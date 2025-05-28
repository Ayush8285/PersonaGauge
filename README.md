# 🎯 PersonaGauge

**PersonaGauge** is an AI-powered web application designed to analyze resumes (CVs) and quiz responses to determine personality traits and predict the most suitable job roles. The platform empowers users to understand their strengths through intelligent career guidance and visual analytics.

---

## 📌 What We Do

**PersonaGauge** leverages Machine Learning (SVM) and Natural Language Processing (NLP) to:

- 🔍 Analyze uploaded CVs and extract key skills and patterns.
- 🧠 Evaluate quiz responses to determine personality types (e.g., Big Five traits).
- 🧑‍💻 Predict the best-fit job roles based on combined CV and quiz data.
- 📊 Visualize results through interactive graphs and insightful explanations.

---

## 🛠️ Tech Stack

### 🧩 Frontend

- **React** with **Vite** for fast development and performance
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Recharts / Chart.js** for data visualization

### 🧠 Backend

- **Python** with **Django** for REST API
- **pymongo** for MongoDB integration
- **SVM Model** trained on synthetic CV and quiz dataset
- **NLTK** for NLP
- **JWT** for secure authentication

### 🗃️ Database

- **MongoDB** for storing user profiles, CV uploads, quiz results, and predictions

---

## ✅ Features Established

- 🔐 JWT-based Authentication (Login/Signup)
- 📄 CV Upload & NLP skill extraction
- 📝 Quiz-based Personality Analysis
- 🤖 AI-based Prediction (SVM model)
- 📊 Visual Charts for Personality & Role Results
- 📂 User Dashboard with submission history
- 🔧 Modular Components & Redux State Management

---

## 🧰 Frontend Setup (React + Vite)

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Steps

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# env
Create a .env file in the frontend  root by same as env.sample

# 3. Start the development server
npm run dev


🧠 Backend Setup (Python + Django)
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the environment
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# env
Create a .env file in the backend root by same as env.sample


# Run Django Server

# 5. Apply migrations
python manage.py migrate

# 6. Start the development server
python manage.py runserver

