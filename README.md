# Task Management Application - TaskNest

A full-stack task management application with features like user authentication, real-time updates, and data visualization. This application is built using **Node.js** for the backend, **React** with **Vite** for the frontend, and **MongoDB** as the database. The application is developed using TypeScript for both the frontend and backend, enhancing type safety and code reliability.

## Features
1. **Task Management**: Create, view, edit, and delete tasks.
2. **User Authentication**: Secure login and registration with JWT-based authentication.
3. **Real-Time Updates**: Real-time task updates using **Socket.io**.
4. **Data Visualization**: Visual representation of task statistics using charts and graphs.
5. **Responsive Design**: Works seamlessly on various devices and screen sizes.

## Technologies Used
- **Frontend**: React, Vite, CSS/Bootstrap for styling.
- **Backend**: Node.js, Express.js, Socket.io.
- **Database**: MongoDB (Atlas or local instance).
- **Deployment**: Vercel for frontend, Render for backend.

## Getting Started

### Prerequisites
- Node.js installed (v14+)
- MongoDB instance (local or cloud-based like MongoDB Atlas)
- Git for cloning the repository

### Installation Steps

#### Clone the Repository
```bash
frontend:-git clone https://github.com/fasinafarook/TaskNest-frontend.git
cd frontend

backend:-https://github.com/fasinafarook/TaskNest-backend
cd backend
```

#### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```

   #### backend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

### Accessing the Application
- **Frontend**: [https://task-nest-nine.vercel.app/](https://task-nest-nine.vercel.app/)
- **Backend**: Deployed on Render

## Deployment
- **Frontend**: Deployed on **Vercel**. To deploy, run:
  ```bash
  vercel --prod
  ```
- **Backend**: Deployed on **Render**. Follow Render deployment documentation to host your Node.js backend.

## Usage
1. **User Registration**: Sign up for an account.
2. **Login**: Log in to access the task dashboard.
3. **Task Management**: Add, edit, or delete tasks.
4. **Real-Time Updates**: See task changes in real-time.
5. **Data Visualization**: View task statistics through charts.

## Screenshots
(Add screenshots or GIFs showcasing different parts of your app, e.g., task dashboard, data visualization)

## Contributing
Contributions are welcome! Please fork this repository and submit pull requests for any enhancements.

## License
This project is licensed under the MIT License.

---
