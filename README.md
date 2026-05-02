# 🩸 BloodReach

### **Real-time emergency blood coordination, built for precision when every second counts.**

BloodReach is a high-trust, minimalist platform designed to bridge the gap between medical emergencies and life-saving donors. Built with a focus on reducing cognitive load and prioritizing action over engagement, it transforms the chaotic search for blood into a structured, immediate coordination system.

---

## 🏛️ Design Philosophy

In an emergency, users are often under extreme stress and unable to think clearly. BloodReach adheres to a strict **Minimalist Healthcare Design System**:

- **Reduced Cognitive Load**: No "startup flashy" visuals, loud gradients, or complex dashboard clutter.
- **Calm, Neutral Palette**: A professional environment using deep reds for critical actions and neutral tones for structure.
- **Editorial Clarity**: High-contrast typography (Geist/Inter) and generous whitespace to ensure information is scannable in seconds.
- **Trust-First Architecture**: Built to feel like a stable healthcare utility, not a social media tool.

---

## 🧠 The AI Engine

One of the platform's core breakthroughs is the **Natural Language Emergency Parser**. Powered by **Llama-3 (Groq)**, it allows users to bypass tedious forms during a crisis.

Family members can simply describe the situation in plain text:
> *"Help! Need 2 units of O-negative at Apollo Hospital Jubilee Hills for a surgery scheduled in 1 hour."*

The AI instantly extracts:
- **Blood Group**: `O-`
- **Urgency**: `IMMEDIATE`
- **Location**: `Apollo Hospital, Jubilee Hills`
- **Units**: `2`

This turns raw panic into actionable, structured data in under 200ms.

---

## ⚡ Core Features

- **AI-Powered Rapid Entry**: Natural language processing to eliminate form friction.
- **Precision Geo-Alerting**: Donors are only notified if they match the blood type and are within the immediate 20km radius.
- **Live Activity Feed**: A real-time timeline of requests and responses to maintain network momentum.
- **Donor Integrity Control**: A "One-Click" availability toggle and a medical-grade recovery cooldown system.
- **Privacy-First Connection**: Direct coordination without intermediaries, ensuring speed and data sovereignty.

---

## 🛠️ The Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS.
- **Styling**: Custom Variable-based Design System (Minimalist Healthcare).
- **AI**: Groq SDK + Llama-3-70b.
- **Data & Realtime**: Supabase (PostgreSQL + Realtime Hooks).
- **Auth**: Clerk (Secure Identity Management).

---

## 🚀 Development Setup

### 1. Frontend Setup
```bash
cd frontend
npm install
# Configure your .env.local with Clerk, Supabase, and Groq keys
npm run dev
```

### 2. Backend (Optional/Legacy)
The platform is currently migrating to a Next.js Serverless architecture, but the legacy Django service can be run via:
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

---

## ⚖️ Medical Disclaimer
**BloodReach is a coordination platform and does not provide medical services.** 
The platform is intended to connect donors and seekers; all medical procedures, blood testing, and transfusions must be performed by certified medical professionals in clinical settings.

---

## License
MIT. Built with heart and intentionality for the global health community. 🩸
