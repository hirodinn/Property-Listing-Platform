# 🏠 Property Listing Platform

A premium, multi-tenant property listing application built with the **MERN** stack (MongoDB, Express, React, Node.js). This platform provides a robust ecosystem for property owners to list their properties and for users to browse and book tours.

---

## 🔗 Live Demos

- **Backend (Render)**: [API Base URL](https://property-listing-platform-hamc.onrender.com/)
- **Frontend (Vercel)**: [Live Frontend](https://property-listing-platform-eta.vercel.app/)
- **API Documentation**: [Live Swagger UI](https://property-listing-platform-hamc.onrender.com/api-docs)

---

## 🚀 Features

### 👤 User Roles

- **Admin**: Complete oversight of the platform. Manage users, approve/reject property listings, and monitor all platform activities.
- **Property Owner**: Dedicated dashboard to list new properties, upload images, and manage existing listings.
- **General User**: Browse properties with advanced filtering, view detailed property information, and book tours.

### 🛠 Core Functionalities

- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control.
- **Property Management**: Comprehensive CRUD operations for properties.
- **Image Uploads**: Integrated with **Cloudinary** for high-performance image hosting and optimization.
- **Dynamic Dashboard**: Tailored experiences for Admins, Owners, and Users.
- **Interactive Tours**: Users can book tours for specific properties.
- **API Documentation**: Fully documented REST API using **Swagger**.

---

## 💻 Tech Stack

### Frontend

- **Core**: React 19 (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4.0
- **Routing**: React Router 7
- **Notifications**: React Toastify

### Backend

- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Validation**: Joi
- **Security**: Helmet, BcryptJS, JWT
- **Documentation**: Swagger (swagger-jsdoc & swagger-ui-express)

---

## 🏗 Project Structure

```text
.
├── backend/            # Express server, MongoDB models, and API routes
├── frontend/           # React application built with Vite
├── package.json        # Root package file for workspace management
└── README.md           # You are here!
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account for image hosting

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/hirodinn/Property-Listing-Platform
    cd property-listing-platform
    ```

2.  **Install dependencies for all projects**:

    ```bash
    npm run install-all
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the `backend/` directory and add the following:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development

    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    FRONTEND_URL=https://property-listing-platform-eta.vercel.app
    ```

### Running the Application

- **Development mode** (Backend & Frontend concurrently):
  ```bash
  npm run dev
  ```
- **API Documentation**:
  Once the server is running, visit `http://localhost:5000/api-docs` to view the Swagger UI locally.

---

## 🚀 Deployment

### Render (Backend Only)

The backend is deployed as a standalone web service on **Render**.

- **Build Command**: `cd backend && npm install`
- **Start Command**: `npm run start`
- **Environment Variables**: Ensure `NODE_ENV=production` and all other required variables are set.

### Vercel (Frontend Only)

The frontend is independently deployed on **Vercel**. Highlight the `frontend` folder as the root during setup.

- **Frontend URL**: [https://property-listing-platform-eta.vercel.app](https://property-listing-platform-eta.vercel.app)
