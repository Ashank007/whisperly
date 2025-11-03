# 🕶️ Whisperly — Anonymous Confession App

Whisperly lets you share secrets, react to confessions, and reply — all **100% anonymous**.  
Built for fun, interaction, and keeping it low-key.

## ⚡ Features

- Share confessions anonymously  
- React to confessions with ❤️ 😂 😭  
- Reply to confessions without revealing identity  
- OTP email verification (check spam folder!)  
- Admin dashboard for moderation  
- Fully responsive, sleek UI  

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 + TypeScript + TailwindCSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT + Email OTP verification  

## 🚀 Getting Started

1. **Clone the repo**  
```bash
git clone https://github.com/Ashank007/whisperly
cd whisperly
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Setup environment variables**
- Create .env file in backend as needed:
```bash
# Frontend example
NEXT_PUBLIC_API_URL=
# Backend example
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```
4. **Run the app**
```bash
# Backend
npm run dev
# Frontend
npm run dev
```

## 📌 Usage

- Use personal emails for OTP (college emails can be tracked lol 💀)

- Post as many confessions as you like

- React and reply to confessions while staying anonymous


## 💡 Notes

- Designed to be fun, safe, and anonymous

- Reactions store counts only — no user info exposed publicly

## 📄 License

This project is licensed under MIT License.