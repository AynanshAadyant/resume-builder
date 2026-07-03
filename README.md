# Resume Builder Backend API

This document provides documentation for the Resume Builder Backend API endpoints. 
All endpoints (except auth routes) expect requests to be authenticated via cookies/tokens if the route is protected (`isAuthenticated` middleware).

## API Endpoints

### 1. Authentication API (`/api/auth`)
Handles user authentication, registration, login, and logout.

- **`POST /api/auth/register`**
  Registers a new user.

- **`POST /api/auth/login`**
  Authenticates a user and sets a session/cookie.

- **`GET /api/auth/current`**
  *(Protected)* Returns the currently authenticated user's details.

- **`POST /api/auth/logout`**
  *(Protected)* Logs out the currently authenticated user by invalidating the session/cookie.

### 2. Profile API (`/api/profile`)
Handles operations related to the user's master profile data.

- **`POST /api/profile/create`**
  *(Protected)* Creates a new profile for the authenticated user.

- **`GET /api/profile/get`**
  *(Protected)* Retrieves the authenticated user's profile.

- **`GET /api/profile/getAll`**
  Retrieves all user profiles (often used for administrative or internal purposes).

- **`PUT /api/profile/update`**
  *(Protected)* Updates the authenticated user's profile data.

- **`DELETE /api/profile/delete`**
  *(Protected)* Deletes the authenticated user's profile.

### 3. Job Description API (`/api/jd`)
Handles operations related to Job Descriptions (JDs) for resume tailoring.

- **`POST /api/jd/`**
  *(Protected)* Stores a new job description.

- **`GET /api/jd/:id`**
  *(Protected)* Retrieves a specific job description by its ID.

- **`DELETE /api/jd/:id`**
  *(Protected)* Deletes a specific job description by its ID.

- **`POST /api/jd/parse/:id`**
  *(Protected)* Parses or analyzes the specific job description to extract keywords and requirements.

### 4. Resume API (`/api/resume`) 
*(Note: Please ensure `resumeRoutes` is imported and used in the main application file)*
Handles the generation, retrieval, and management of user resumes.

- **`POST /api/resume/create`**
  *(Protected)* Creates a new resume for the authenticated user using job description and user profile data.

- **`POST /api/resume/create/prompt`**
  *(Protected)* Creates a new resume for the authenticated user using prompt provided and user profile data.

- **`GET /api/resume/:id`**
  *(Protected)* Retrieves a specific resume by its ID.

- **`GET /api/resume/all`**
  *(Protected)* Retrieves all resumes created by the authenticated user.

---

## TODO Scope

The following features and improvements are planned for upcoming releases:

- [ ] **Resume Logging / Application Tracking**: Add logging to resumes to allow users to track a job application with the exact resume used.
- [ ] **Resume Editing**: Allow users to edit generated resumes before finalizing or downloading them.
- [ ] **Resume PDF Export**: Enable downloading resumes directly as PDF documents from the backend or frontend integrations.
- [ ] **Resume Duplication**: Allow users to duplicate an existing resume as a starting point for another job application.
- [ ] **Resume Deletion**: Provide an endpoint to delete a specific resume that is no longer needed.
- [ ] **Analytics**: Add basic analytics to show how closely a tailored resume matches a given Job Description.
