# 🚀 Full-Stack Portfolio Management System (Java + React)

A **complete full-stack portfolio application** built using **Java, Spring Boot, and React**. The project includes a **separate backend and frontend**, a secure **Admin Panel**, and full **CRUD management** for **Projects, Certificates, and Skills**. Designed with **clean architecture, scalability, and performance** in mind.

🔗 **Live Demo**: [saifmalik.me](https://saifmalik.me)

---

## 📚 Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Tech Stack](#tech-stack)
* [Backend (Spring Boot)](#backend-spring-boot)
* [Frontend (React)](#frontend-react)
* [Authentication & Security](#authentication--security)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [License](#license)

---

## ✨ Features

### 🌐 Public Portfolio

* View **Projects**, **Certificates**, and **Skills**
* Clean and professional UI
* Fully **responsive & mobile-friendly**

### 🛠️ Admin Panel

* Secure **Admin-only dashboard**
* Admin can **Create, Update, Delete, and Manage**:

  * Projects
  * Certificates
  * Skills
* Protected routes (Admin access only)

### ⚡ Performance & Scalability

* Optimized REST APIs
* Clean and maintainable codebase
* Scalable architecture for future features

---

## 🗂️ Project Structure

```
portfolio-project/
│
├── backend/        # Spring Boot Application
│   ├── src/main/java
│   │   ├── controller
│   │   ├── service
│   │   ├── repository
│   │   ├── security
│   │   └── model
│   └── src/main/resources
│
├── frontend/       # React Application
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── hooks
│   │   └── routes
│   └── public
│
└── README.md
```

---

## 🛠️ Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT Authentication
* RESTful APIs

### Frontend

* React
* TypeScript / JavaScript
* Tailwind CSS / ShadCN UI
* React Router
* React Query

### Tools & Database

* SQL Database (MySQL / PostgreSQL)
* Git & GitHub
* REST API Integration

---

## ⚙️ Backend (Spring Boot)

* Built using **Spring Boot** with layered architecture
* **Controller – Service – Repository** pattern
* **JWT-based Authentication & Role-based Authorization**
* Secure admin-only APIs
* Centralized exception handling
* Optimized database queries using JPA

---

## 🎨 Frontend (React)

* Component-based architecture
* Secure JWT token handling
* Admin dashboard with protected routes
* Smooth UI interactions
* Fully responsive design (mobile, tablet, desktop)

---

## 🔐 Authentication & Security

* JWT-based login & authorization
* Role-based access control (ADMIN / USER)
* Secure API endpoints
* Protected frontend routes

---

## ⚙️ Installation

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📝 License

This project is licensed under the MIT License.

---

**Made with ❤️ by Saif**
