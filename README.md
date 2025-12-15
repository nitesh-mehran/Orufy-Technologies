# Full Stack Product Management Application

This is a full stack web application built using **React (Vite)** for the frontend and  
**Node.js + Express.js + MongoDB** for the backend.

---

## Tech Stack

Frontend:
- React.js (Vite)
- React Router
- Tailwind CSS
- React Icons

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Nodemailer
- Multer

---

## Project Structure

fullstack-project/
|
├── client
├── server
├── .gitignore
├── README.md

---

## Environment Variables

Create a `.env` file inside the `server` folder.

Path:
server/.env

Example:
# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/productr

# Server
PORT=5000

# EMAIL SETTINGS (Gmail)
FROM_EMAIL=nadiamehran2003@gmail.com
EMAIL_PASS=anapiwmgcgksvwnq  

# JWT
JWT_SECRET=supersecretjwtkey12345

 # How to Run the Project
Run Backend (Server)

cd server
npm install
npm run dev

Run Frontend (Client)
Open a new terminal and run:

cd client
npm install
npm run dev


