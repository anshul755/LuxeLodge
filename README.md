# 🏨 LuxeLodge


Experience LuxeLodge in action: 🔗[LuxeLodge](https://luxelodge.onrender.com/)


**LuxeLodge** is a modern, full-stack lodge management system built with Node.js, Express, and MongoDB. Designed with scalability and user experience in mind, LuxeLodge enables seamless room booking, user authentication, and media management through an elegant and intuitive interface.

---

## 🚀 Quickstart Guide

### 📁 Clone the Repository

```bash
git clone https://github.com/anshul755/LuxeLodge.git
cd LuxeLodge
```

---

### 📦 Install Dependencies

```bash
npm install
```

---

### ⚙️ Set Up Environment Variables

```bash
cp .env.example .env
```

Update the `.env` file with your MongoDB and Cloudinary credentials:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SESSION_SECRET=your_session_secret
```

---

### 🚀 Start the Application

```bash
npm start
```

The app will start on: [http://localhost:3000](http://localhost:3000)

---

## 🛠 Features

- 🔐 Secure user authentication with Passport.js  
- 🛏 Dynamic room listings with image uploads via Cloudinary  
- 📅 Booking system with admin control panel  
- 🧾 EJS templated views for a smooth, server-rendered experience  
- ⚙️ Environment-based configuration and robust error handling  

---

## 🧬 Tech Stack

- **Backend**: Node.js, Express.js  
- **Database**: MongoDB, Mongoose  
- **Templating**: EJS  
- **Cloud Services**: Cloudinary  
- **Authentication**: Passport.js  
- **Styling**: Bootstrap & Custom CSS  

---

## 📁 Project Structure

```
LuxeLodge/
│
├── controllers/       # Logic for handling routes
├── models/            # Mongoose data models
├── routes/            # Express route handlers
├── views/             # EJS templates
├── public/            # Static assets (CSS, JS, images)
├── utils/             # Utility functions
├── app.js             # Main server file
├── middleware.js      # Custom middleware
├── cloudConfig.js     # Cloudinary configuration
└── .env.example       # Example environment variables
```

---

## 🔮 Future Improvements

Planned enhancements to elevate LuxeLodge even further:

- 🔗 **OAuth Integration** – Google, GitHub, and Facebook login support  
- 🎨 **UI Improvements** – Responsive design and animated transitions (React/Vue optional frontend)  
- 🔍 **Filter-Based Search** – Sort and filter by price, location, amenities, and availability  
- 🧾 **Booking History** – Personalized user dashboard with booking records  
- 🔔 **Email Notifications** – Confirmation emails and booking reminders  
- 🛡️ **Advanced Security** – Rate limiting, XSS protection, and input sanitization  
- 🌐 **Multi-language Support** – i18n for international users  
- 📱 **PWA Support** – Installable as a Progressive Web App  

---

## 🤝 Contributors

Made with passion by:

- [Anshul Patel](https://github.com/anshul755)  
- [Jainil Patel](https://github.com/JainilPatel2502)

> Contributions are always welcome! Feel free to fork the repo and submit a PR for improvements or bug fixes.
