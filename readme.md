# 📝 Notes Taking App  

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)  
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript)  
![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)  
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)  
![Express](https://img.shields.io/badge/Framework-Express-black?logo=express)  
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)  
![JWT](https://img.shields.io/badge/Auth-JWT-yellowgreen?logo=jsonwebtokens)  
![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-orange?logo=gmail)  
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render)  

A **secure and responsive note-taking application** with OTP-based authentication and JWT-protected APIs.  
Users can sign up and log in with email + OTP, manage personal notes, and enjoy a smooth UI across devices.  
Deployed fully on the cloud with a working demo link.  

---

## ✨ Features  

### 🔐 Authentication  
- Sign up with **Email + OTP flow**.  
- Log in with **Email + OTP**. Option to stay logged in.  
- JWT-based authorization for secure API access.  

### 📨 OTP Verification  
- OTP sent via email (using **Nodemailer + Gmail SMTP**).  
- **OTP expiry**: expires automatically after 5 minutes.  

### 🗒️ Notes Management  
- Create, view, edit, and delete personal notes.  
- Notes stored securely in MongoDB.  

### 🎨 Responsive Design  
- Matches provided UI design.  
- Fully mobile-friendly.  

### ☁️ Deployment  
- **Frontend** and **Backend** deployed on Render.  
- **Database** hosted on MongoDB Atlas.  

---

## 🔧 Extra Features  
1. **OTP Expiry** → OTPs expire after **5 minutes**, enhancing security.  
2. **Expiry Timer** → Users see OTP expiry countdown for clarity.  
3. **Edit & Update Notes** → Users can not only create and delete, but also **edit/update notes**.  

---

## 🛠️ Tech Stack  

### Frontend  
- React + TypeScript  
- TailwindCSS  
- Axios (API requests)  
- React Router DOM  

### Backend  
- Node.js + Express (TypeScript)  
- JWT for authentication  
- Nodemailer (OTP emails)  

### Database  
- MongoDB (via Mongoose)  

### Other  
- Git & GitHub for version control  
- Render (for deployment)  

---

## 📂 Project Structure  

```bash
root
 ┣ client/          # React frontend
 ┃ ┣ src/
 ┃ ┃ ┣ components/  # Reusable UI
 ┃ ┃ ┣ pages/       # Login, Signup, Dashboard
 ┃ ┃ ┣ store/       # Zustand or Redux store
 ┃ ┃ ┗ App.tsx
 ┣ server/          # Node backend
 ┃ ┣ src/
 ┃ ┃ ┣ routes/      # Auth & Notes APIs
 ┃ ┃ ┣ middleware/  # JWT verification, OTP utils
 ┃ ┃ ┣ models/      # User, Note models
 ┃ ┃ ┣ controllers/ # Auth & Notes logic
 ┃ ┃ ┗ index.ts
 ┣ .env.example     # Example environment variables
 ┣ README.md
 ┗ package.json