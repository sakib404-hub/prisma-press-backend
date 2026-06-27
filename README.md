<div align="center">

# 🚀 User Management API

### 🔐 A Modern REST API for User & Profile Management

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

A scalable backend application built with **Express.js**, **TypeScript**, **Prisma ORM**, and **PostgreSQL** for managing users and their profiles through RESTful APIs.

</div>

---

## ✨ Features

✅ User Registration

✅ User Profile Creation

✅ Get All Users

✅ Get Single User

✅ Update User Information

✅ User & Profile Relationship Management

✅ Prisma ORM Integration

✅ PostgreSQL Database Support

✅ TypeScript Support

✅ Environment Variable Configuration

✅ Modular Project Architecture

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| ⚡ Node.js | Runtime Environment |
| 🚂 Express.js | Backend Framework |
| 🔷 TypeScript | Type Safety |
| 🔺 Prisma ORM | Database ORM |
| 🐘 PostgreSQL | Database |
| 🌱 Dotenv | Environment Variables |

---

## 📂 Project Structure

```bash
src/
├── app/
│   ├── modules/
│   │   ├── user/
│   │   └── profile/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── errors/
│
├── config/
├── lib/
├── app.ts
└── server.ts

prisma/
├── schema.prisma
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/your-repository-name.git

cd your-repository-name
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

---

## 🗄️ Database Setup

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Migration

```bash
npx prisma migrate dev
```

### Open Prisma Studio

```bash
npx prisma studio
```

---

## ▶️ Running the Project

### Development Mode

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## 📌 API Endpoints

### User Routes

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/users/create-user` | Create User & Profile |
| GET | `/api/v1/users` | Get All Users |
| GET | `/api/v1/users/:id` | Get Single User |
| PATCH | `/api/v1/users/:id` | Update User Information |

---

## 🏗️ Database Relationships

```text
User
 │
 └─── One-to-One
          │
          ▼
       Profile
```

Each user can have a single profile associated with them, managed through Prisma relations.

---

## 📜 Available Scripts

```bash
npm run dev       # Start Development Server
npm run build     # Build TypeScript Project
npm start         # Start Production Server
```

---

## 🎯 Future Improvements

- 🔐 JWT Authentication
- 👮 Role-Based Authorization
- 🔎 Search & Filtering
- 📄 Pagination Support
- 📚 Swagger Documentation
- 🧪 Unit & Integration Testing
- 🚦 Rate Limiting

---

<div align="center">

### ⭐ If you like this project, give it a star!

Made with ❤️ using Express, TypeScript, Prisma & PostgreSQL

</div>
