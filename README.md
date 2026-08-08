# CampusSync ERP

CampusSync is a React + Vite frontend with an Express and MongoDB backend.

## Run locally

1. Create `server/.env` from `server/.env.example` and set a strong `JWT_SECRET`. Set `MONGODB_URI` to a running MongoDB database.
2. Start the backend: `cd server` then `npm.cmd start`.
3. In another terminal, start the frontend from the project root: `npm.cmd run dev`.
4. Open the displayed Vite URL, register an institution, and save the generated institution code. Use that code, email, and password to sign in.

The Student Management page is available at `/admin/students` after admin login and supports live create, read, update, and delete operations. The existing Courses dashboard also reads live course records from the backend.

## API

- `POST /api/auth/register` creates an institution administrator and returns its institution code.
- `POST /api/auth/login` returns a JWT for an institution code, email, and password.
- `GET /api/health` checks the backend health.
- `GET|POST /api/students` and `GET|PUT|DELETE /api/students/:id` manage student records. Write operations require an admin JWT.
- `GET|POST /api/courses` and `GET|PUT|DELETE /api/courses/:id` manage course records. Write operations require an admin JWT.
- `POST /api/enrollments`, `GET /api/enrollments/student/:studentId`, and `GET /api/enrollments/course/:courseId` support course enrolment.
- `GET /api/attendance/sessions`, `POST /api/attendance/session`, `POST /api/attendance/mark`, plus course and student reports support attendance tracking.
