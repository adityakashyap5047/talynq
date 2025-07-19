# 🚀 Talynq

**Talynq** is a modern job creation and talent discovery platform that connects skilled individuals with the right opportunities — faster, smarter, and easier.

---

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, OAuth (Google/GitHub optional)
- **Email & Notifications**: Nodemailer / Resend API
- **Hosting**: Vercel (Frontend), Render / Railway (Backend)

---

## 📦 Features

- 👤 User authentication & role management (Job Seeker / Recruiter)
- 📄 Create & manage job listings
- 📝 Apply to jobs with resumes and cover letters
- 🔍 Smart search & filters
- 💬 Messaging system between recruiters & applicants
- 📊 Admin dashboard for analytics and management
- 📱 Fully responsive and mobile-friendly UI

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/talynq.git
cd talynq
```

### 2. Install dependencies

```bash
# For both frontend and backend
npm install
```

### 3. Set up environment variables

Create `.env` file in the `server/` and `client/` directories.

**Example for `server/.env`**

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.yourprovider.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
```

### 4. Start development servers

```bash
# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev
```

---

## 💡 Future Enhancements

- AI-based job recommendations
- Resume parsing & scoring
- Video interviews & scheduling
- Push notifications
- Mobile app (React Native)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT

---

## ✨ Author

**Aditya Kumar**  
[LinkedIn](https://linkedin.com/in/your-profile) • [Portfolio](https://your-portfolio.com)

