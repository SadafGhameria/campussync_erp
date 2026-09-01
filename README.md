CampusSync ERP

CampusSync ERP is a full-stack College Management System designed to simplify academic and administrative tasks. It provides a centralized platform for managing institutions, students, courses, enrollments, and attendance.

The application is built using React + Vite for the frontend and Node.js, Express.js, and MongoDB for the backend.

✨ Features

- Institution & Admin Authentication
  
  - Institution registration
  - Admin login
  - JWT-based authentication
  - Institution-specific access

- Student Management
  
  - Create student records
  - View student records
  - Update student information
  - Delete student records
  - Live CRUD operations

- Course Management
  
  - View course records
  - Create, update, and delete courses
  - Backend-connected course data

- Course Enrollment
  
  - Enroll students in courses
  - View student-wise enrollments
  - View course-wise enrollments

- Attendance Management
  
  - Create attendance sessions
  - Mark student attendance
  - Access course and student attendance reports

Tech Stack

Frontend

- React.js
- Vite
- JavaScript
- HTML5
- CSS3

Backend

- Node.js
- Express.js
- REST API
- JWT Authentication

Database

- MongoDB

Tools

- Git
- GitHub
- npm

Run Locally

Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB
- Git

1. Clone the repository

git clone https://github.com/SadafGhameria/campussync_erp.git
cd campussync_erp

2. Configure the backend

Create "server/.env" from "server/.env.example".

Set the following environment variables:

JWT_SECRET=your_strong_secret
MONGODB_URI=your_mongodb_connection_string

Make sure MongoDB is running and the connection string is valid.

3. Start the backend

Open a terminal and run:

cd server
npm.cmd start

4. Start the frontend

Open another terminal from the project root:

npm.cmd run dev

Open the Vite URL displayed in the terminal.

5. Create an account

1. Register an institution.
2. Save the generated institution code.
3. Sign in using the institution code, email, and password.
4. Access the admin dashboard.

🔗 API

Authentication

POST /api/auth/register
POST /api/auth/login

Health Check

GET /api/health

Students

GET    /api/students
POST   /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id

Write operations require an admin JWT.

Courses

GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PUT    /api/courses/:id
DELETE /api/courses/:id

Write operations require an admin JWT.

Enrollments

POST /api/enrollments
GET  /api/enrollments/student/:studentId
GET  /api/enrollments/course/:courseId

Attendance

GET  /api/attendance/sessions
POST /api/attendance/session
POST /api/attendance/mark

Course and student attendance reports are also supported.

📍 Student Management

After logging in as an administrator, the Student Management page is available at:

/admin/students

It supports live Create, Read, Update, and Delete (CRUD) operations through the backend.

The Courses dashboard also retrieves live course records from the backend.

🔒 Security

- JWT-based authentication is used for protected admin operations.
- Database credentials and JWT secrets are stored using environment variables.
- ".env" files should not be committed to the repository.

🎯 Project Objective

CampusSync ERP was developed to provide a centralized system for managing common college operations and to reduce the need for manual record management.

The project demonstrates practical experience with:

- Full-stack web development
- React frontend development
- RESTful API development
- MongoDB database integration
- JWT authentication
- CRUD operations
- Frontend-backend integration

🔮 Future Enhancements

- Faculty management
- Student and faculty portals
- Timetable management
- Examination and result management
- Fee management
- Role-based access control
- Dashboard analytics
- Notifications

👩‍💻 Author

Sadaf Ghameria

GitHub:
https://github.com/SadafGhameria/campussync_erp

---

⭐ If you find this project useful, consider giving it a star!
