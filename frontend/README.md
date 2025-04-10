# Implementing JWT Authentication in Frontend: Access Token, Refresh Token, and Form Handling with React Hook Form and Zod

This project demonstrates how to implement JWT authentication in a frontend application, including handling access and refresh tokens, managing authentication state with context, and integrating form validation using React Hook Form and Zod. The design and UI components are bootstrapped using ShadCN to ensure a responsive and modern interface. The setup covers routing, token management, form handling, and making API calls with Axios to ensure a smooth and cohesive user experience.

## Table of Contents

1. [Frontend Project Structure](#frontend-project-structure)

   - [Folder Structure](#folder-structure)

2. [Setup Instructions](#setup-instructions)

   - [Frontend Setup (React + Vite)](#frontend-setup-react--vite)

3. [Authentication Mechanisms](#authentication-mechanisms)

   - [Access Token](#access-token)
   - [Refresh Token](#refresh-token)
   - [Authentication Context](#authentication-context)
   - [Key Methods](#key-methods)

4. [Routes in Frontend (React Router)](#routes-in-frontend-react-router)

   - [Public Routes](#public-routes)
   - [Protected Routes](#protected-routes)

5. [Form Management with React Hook Form and Zod Integration](#form-management-with-react-hook-form-and-zod-integration)

   - [React Hook Form](#react-hook-form)
   - [Zod for Validation](#zod-for-validation)
   - [Example Code: Login and Profile Forms](#example-code-login-and-profile-forms)

6. [Axios for API Calls](#axios-for-api-calls)
   - [Sample Axios Configuration](#sample-axios-configuration)
   - [Token Refresh Example](#token-refresh-example)
   - [Profile Edit Example](#profile-edit-example)

## 1. Frontend Project Structure

This React project follows a modular folder structure designed for scalability and maintainability. Below is an overview of the folder structure and its purpose.

**Folder Structure**:

```bash
├── components/             # Reusable UI components (Shadcn components, form components)
├── context/                # Auth provider and context for managing access tokens and user authentication
├── lib/                    # Reusable helper functions (API with Axios, try-catch wrapper, tailwind merge)
├── node_modules/           # Project dependencies
├── public/                 # Public assets (e.g., SVG files, images)
├── routes/                 # Route wrappers (protecting routes, redirecting users)
├── src/                    # Main pages and app-level components
```

## 2. Setup Instructions

### Frontend Setup(React + Vite)

1. **Clone the repository:**
   First, clone the repository and navigate into your project directory:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   cd frontend
   ```

2. **Install Frontend Dependencies:**
   Run the following command to install the required frontend dependencies:

   ```bash
   pnpm install
   ```

3. **Run the Frontend:**
   After the installation, run the following command to start the frontend application:
   ```bash
   pnpm run dev
   ```

## 3. Authentication Mechanisms

In this React application, authentication is handled using context, which provides a central place for managing the user's authentication status and access tokens across the application. Below is an overview of the authentication mechanisms implemented:

### Access Token

The `accessToken` is stored in the application state and is used to authenticate requests to the backend API. The token is included in the `Authorization` header of outgoing requests, ensuring that the user is authenticated for each API call.

- **Fetching the Token**: The `AuthProvider` component is responsible for managing the user's authentication state. It includes a `fetchMe` function that checks for an existing valid token by making a `POST` request to the `/api/auth/refresh` endpoint, which either returns a new token or clears the user's session if the token is invalid.

- **Setting the Token**: Once the token is retrieved, it is saved in the component state (`token`) and made available through the `AuthContext`. This token is included in the `Authorization` header of all API requests using an Axios interceptor.

### Refresh Token

A refresh mechanism is built into the application to ensure that users stay authenticated even after their access token expires. When an API request returns an "Unauthorized" error (status code `1`), the application automatically attempts to refresh the token by making a request to the `/api/auth/refresh` endpoint.

- **Token Refresh Logic**: If the refresh request is successful, the new token is stored, and the original request is retried with the new token attached to its headers. If the refresh request fails, the user is logged out and the session is cleared.

- **Axios Interceptors**: The application uses Axios interceptors to automatically attach the token to each request and handle token refreshing when necessary.

### Authentication Context

The authentication state (token, userId, and loading status) is shared globally through the `AuthContext`. The `useAuth` hook allows components to access authentication data, such as the `token` and `userId`, as well as functions to handle login, logout, and signup actions.

### Key Methods

- **login**: This function sends a `POST` request to the `/api/auth/login` endpoint with the provided credentials, stores the access token upon success, and updates the authentication state.
- **logout**: This function clears the access token and logs the user out.
- **signup**: This function sends a `POST` request to the `/api/auth/signup` endpoint with user data, stores the access token upon success, and updates the authentication state.

## 4. Routes in Frontend (React Router)

React Router is used to handle routing in the frontend of this application. It allows for the creation of different routes, both public and protected, and enables dynamic route handling, which ensures a smooth navigation experience.

### Public Routes

Public routes are accessible to all users, regardless of whether they are authenticated. These routes allow users to view pages like the login and signup pages without requiring any authentication.

- **Example Routes**:
  - `/login`: Route to the Login page.
  - `/signup`: Route to the Signup page.

### Protected Routes

Protected routes require users to be authenticated before accessing them. These routes are wrapped in a `ProtectedLayout` component, which ensures that only authenticated users can access certain parts of the application.

- **Example Routes**:
  - `/home`: Route to the Home page.
  - `/profile/edit`: Route to the Edit Profile page.

The `ProtectedLayout` component acts as a wrapper for these routes. It checks if the user is authenticated before allowing access to the child routes. If the user is not authenticated, they are redirected to the login page.

## 5. Form Management with React Hook Form and Zod Integration

In the project, I utilized **React Hook Form** in combination with **Zod** for handling form validation and managing form state. This approach not only simplifies form management but also ensures better performance and scalability. Here’s a breakdown of how I integrated these libraries:

#### 1. **React Hook Form**:

React Hook Form provides a simple and efficient way to manage forms in React applications. It minimizes re-renders and enhances performance, especially with complex forms or large datasets.

- **`useForm` hook**: This is the core hook from React Hook Form, which handles form state, validation, and submission.
- **Form Field Handling**: With `FormField`, `FormControl`, `FormItem`, and `FormLabel`, form fields are integrated into the form, and validation messages are rendered dynamically.
- **Event Handling**: The form submission is managed via `form.handleSubmit(handleSubmit)` where `handleSubmit` manages the form validation and invokes the `handleSubmit` function once the form is valid.

#### 2. **Zod for Validation**:

Zod is a TypeScript-first schema declaration and validation library that I used to define the structure and validation rules for the form data.

- **Form Schema Definition**: I created a schema using Zod for validating the form inputs. For example, in the `LoginForm`, the schema validates the `username` to ensure it’s a valid email and not empty, while `password` is checked to ensure it’s at least 2 characters long and not empty.
- **Resolver**: The `zodResolver` from the `@hookform/resolvers/zod` package is used to integrate Zod validation with React Hook Form. This allows for seamless integration where the form only submits when all fields conform to the defined validation rules.

#### 3. **Example Code: Login and Profile Forms**:

- **Login Form**:
  The login form uses `useForm` from React Hook Form, combined with a Zod schema for validation, to handle the user’s login credentials (username and password). Upon submission, the form invokes an authentication method and navigates based on the result.

```javascript
const formSchema = z.object({
  username: z
    .string()
    .email()
    .min(2, { message: "Username must be at least 2 characters." }),
  password: z
    .string()
    .min(2, { message: "Password must be at least 2 characters." }),
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: { username: "", password: "" },
});

const handleSubmit = async (value) => {
  // Authentication logic
};
```

- **Profile Edit Form**:
  Similarly, the profile edit form also integrates React Hook Form with Zod. The form updates user profile information such as username, name, and bio, with validation ensuring that the fields meet the necessary requirements.

```javascript
const formSchema = z.object({
  username: z.string().email().min(2, { message: "Username is required." }),
  name: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters." }),
  bio: z
    .string()
    .max(500)
    .regex(/^[\w\s.,!?'"()-]*$/, {
      message: "Bio must not contain HTML tags.",
    }),
});

const form = useForm({
  resolver: zodResolver(formSchema),
  defaultValues: {
    username: userInfo?.username,
    name: userInfo?.name,
    bio: userInfo?.bio,
  },
});

const handleSubmit = async (value) => {
  // Profile update logic
};
```

This combination of React Hook Form and Zod greatly simplifies form handling, enhances validation with minimal boilerplate code, and ensures a more performant, scalable solution. The integration with Zod guarantees that data meets the specified requirements before being processed, reducing the likelihood of errors or invalid inputs.

## 6. **Axios for API Calls**:

Axios is used for making API calls to the backend. I created an Axios instance to manage requests and ensure that cookies (for session management) are included when needed, such as with refresh tokens.

**Sample Axios Configuration**:

```javascript
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5002", // or your API base
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // include cookies if needed (especially for refresh tokens)
});

export default api;
```

**Token Refresh Example:**:

```javascript
const [response, error] = await tc(() => api.get("/api/auth/refresh"));
```

**Profile Edit Example:**:

```javascript
const [response, error] = await tc(() =>
  api.post("/api/user/profile/edit", { userId, ...value })
);
```
