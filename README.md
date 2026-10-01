🔧 devMeet — Backend

The backend API for **devMeet**, a Tinder-style social networking platform for developers.

It provides authentication, developer profiles, connection requests, real-time chat, premium membership, and other REST APIs used by the devMeet frontend.

🔗 Live Demo: [devmeetup.me](https://devmeetup.me)
💻 Frontend Repo: [yashmankar1/devMeet-web](https://github.com/yashmankar1/devMeet-web)

---

✨ Features

* 🔐 JWT authentication with HTTP-only cookies
* 👤 User registration, login, profile management, and authentication
* 🧑‍💻 Developer feed and profile APIs
* 🤝 Connection request management
* 💬 Real-time messaging with Socket.io
* 💳 Razorpay premium membership integration
* 🛡️ Authentication and authorization for protected routes
* 🗄️ MongoDB database with Mongoose
* 🌐 RESTful API architecture
* ⚡ Production deployment with environment-based configuration

---

🛠️ Tech Stack

* Node.js — JavaScript runtime
* Express.js — Backend framework
* MongoDB — Database
* Mongoose — ODM
* JWT — Authentication
* HTTP-only Cookies — Secure session/token storage
* Socket.io — Real-time communication
* Razorpay — Payment integration
* Render — Backend deployment

---

🔐 Authentication

The application uses JWT-based authentication with HTTP-only cookie*.

Authentication flow:

```text
User Login
    ↓
Express API
    ↓
Validate Credentials
    ↓
Generate JWT
    ↓
Set HTTP-only Cookie
    ↓
Protected API Requests
    ↓
Verify JWT
    ↓
Allow / Reject Request
```

Protected routes verify the authenticated user before allowing access to private resources.

---

💬 Real-Time Chat

Socket.io is used for real-time one-to-one communication.

The backend manages socket connections and enables connected users to send and receive messages without repeatedly polling the server.

---

💳 Razorpay Integration

Premium membership uses Razorpay for payments.

The backend:

1. Creates the payment order.
2. Sends the order details to the frontend.
3. Receives the payment response.
4. Verifies the payment on the server.
5. Updates the user's premium membership status.

Payment verification is handled server-side rather than trusting the client.

---

🗄️ Database

The application uses MongoDB with Mongoose.

The backend manages data such as:

* Users
* Connection requests
* Connections
* Premium membership
* Chat-related data

Mongoose schemas and models are used to structure and interact with the database.

---

🚀 Run Locally

 Prerequisites

* Node.js 20+
* MongoDB / MongoDB Atlas
* Razorpay account for payment functionality

 Clone the repository

```bash
git clone https://github.com/yashmankar1/devMeet.git
cd devMeet
```

 Install dependencies

```bash
npm install
```

 Environment Variables

Create a `.env` file:

```env
PORT=7777
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Use the exact variable names required by your backend code.

Never commit `.env` files or expose secrets in your repository.

 Start the server

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:7777
```

---

🌐 Deployment

The backend is deployed on Render and uses:

* MongoDB Atlas for database hosting
* Environment variables for production secrets
* CORS configuration for frontend communication
* HTTP-only cookies for authentication
* Socket.io for real-time communication

---

📚 What I Learned

* Building REST APIs with Node.js and Express
* Designing MongoDB schemas with Mongoose
* Implementing JWT authentication
* Working with HTTP-only cookies
* Authentication and authorization middleware
* Building real-time applications with Socket.io
* Integrating and securely verifying Razorpay payments
* Handling CORS and cross-origin cookies
* Managing production environment variables
* Deploying a Node.js backend to Render

---

👨‍💻 Author

**Yash Mankar**

[GitHub](https://github.com/yashmankar1)

> Backend inspired by Akshay Saini's DevTinder project and extended with custom implementation, authentication improvements, real-time chat, Razorpay payments, and production deployment.
