## Project Overview

This project leverages `Express.js` for the backend and React for the frontend, implementing a clear separation of concerns through the **Model-View-Controller (MVC) pattern**. The frontend (`React`) acts as the view, while external routes handle incoming requests, passing them to controllers, which in turn interact with the models for database operations.

## Project Architecture & Project Standard

For this project, we envisioned a modular architecture with a clear separation of concerns, ensuring maintainability and scalability. We adhered to a set of coding standards to promote consistency and readability. Key considerations include:

### **Logging**:

Implemented structured logging for easier debugging and monitoring.

**Log Flow**:

1. **Request Information**: Logs the API request URL and method (e.g., POST, /api/auth/login).
2. **Middleware Execution**: Tracks middleware execution (e.g., `rbacMiddleware`, `rateLimiterMiddleware`) with `START` and `END` timestamps.
3. **Controller Execution**: Logs the start and end of controller actions (e.g., `AuthController/login`), showing request handling time.

Sample log:

```bash
[18:41:12.009] INFO (57426): REQUEST URL: /api/auth/login
[18:41:12.009] INFO (57426): REQUEST METHOD: POST
[18:41:12.009] INFO (57426): rbacMiddleware: START
[18:41:12.009] INFO (57426): rbacMiddleware: END
[18:41:12.010] INFO (57426): rateLimiterMiddleware: START
[18:41:12.010] INFO (57426): rateLimiterMiddleware: END
[18:41:12.010] INFO (57426): AuthController/login: START
[18:41:12.101] INFO (57426): AuthController/login: END
```

### **Response Consistency**:

In controllers, all responses are returned at the bottom to improve readability and ensure logical flow. Additionally, we created a utility function to standardize response formatting across the application.

**responseUtil.js**:

```javascript
module.exports = (
  numCode = 0, // success code: 0 for success, 1 for failure
  objData = "", // data being pulled or returned
  objError = "", // error message when an error occurs
  objSuccess = "" // success message when API call is successful
) => {
  return {
    numCode,
    objData,
    objError,
    objSuccess,
  };
};
```

**sample response**:

```javascript
{
  "numCode": 0,
  "objData": "<access token>",
  "objError": "",
  "objSuccess": "User Login successfully!"
}
```

### **Role-Based Configuration**:

Role-based access is defined in a centralized configuration file, allowing flexible and manageable role assignments. The configuration file specifies paths and methods associated with specific roles, granting access control based on the role of the user.

**roles.js**:

```javascript
module.exports = [
  {
    path: "/api/project/user/*",
    methods: {
      GET: ["user"], // Only 'user' can GET their own projects
    },
  },
  {
    path: "/api/project",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET all projects
    },
  },
];
```

In this configuration:

- The **path** specifies the API endpoint.( \* represent a urlParams such :id, :projectId)
- The **methods** object defines which roles have access to each HTTP method (e.g., GET, POST).
- In this example:
  - Only the **user** role can `GET` their own projects.
  - Both **user** and **guest** roles can `GET` all projects.

This centralized configuration simplifies managing role-based access, ensuring that permissions are easily adjustable and scalable across the application.

### **Error Handling**:

To improve the readability and maintainability of the code, we abstracted the `try-catch` logic in the controllers by using the `AsyncHandler` package, along with creating our own try-catch wrapper.

Here’s sample usage of our try-catch wrapper:

**tc.js**:

```javascript
let result = await util.tc(() => {
  return newUser.save();
});
```

### **Dynamic File Loading**:

We dynamically load certain files from folders to improve extensibility and maintain clean code organization.

**Folder Structure**:

```bash
├── build/                  # Build output directory(For React projects that are built)
├── config/                 # Configuration files (e.g., database, environment)
├── controllers/            # Controller logic for handling requests
├── data/                   # Dummy Data(Depracated)
├── middleware/             # Middleware functions
├── models/                 # Database models
├── node_modules/           # Project dependencies
├── public/                 # Public assets (e.g., images, frontend files)
├── routes/                 # Application routes
├── ssl/                    # SSL certificate and private key
├── utils/                  # Utility functions
├── validators/             # Validation logic for data inputs
├── db.js                   # Database connection file
├── package.json            # Project manifest (dependencies, scripts, etc.)
├── pnpm-lock.yaml          # Lockfile for exact dependency versions
└── server.js               # Entry point for starting the server

```

**Sample loading and Initialization of Files**:

```bash
[19:14:57.504] INFO (62738): MongoDB Connect: Start
[19:14:57.518] INFO (62738): ===========================
[19:14:57.518] INFO (62738): ===========================
[19:14:57.518] INFO (62738): =====FILE LOADING BEGIN====
[19:14:57.520] INFO (62738): =====Load Config=====
[19:14:57.520] INFO (62738): Config File: config
[19:14:57.520] INFO (62738): Config File: roles
[19:14:57.521] INFO (62738): =====Load Dummy Data=====
[19:14:57.521] INFO (62738): Dummy Data File: blogs
[19:14:57.522] INFO (62738): Dummy Data File: projects
[19:14:57.522] INFO (62738): Dummy Data File: users
[19:14:57.525] INFO (62738): =====Load Middleware=====
[19:14:57.525] INFO (62738): Middleware File: cacheMiddleware
[19:14:57.525] INFO (62738): Middleware File: errorMiddleware
[19:14:57.525] INFO (62738): Middleware File: rateLimitMiddleware
[19:14:57.525] INFO (62738): Middleware File: rbacMiddleware
[19:14:57.525] INFO (62738): Middleware File: urlLogging
[19:14:57.550] INFO (62738): =====Load Utils =====
[19:14:57.550] INFO (62738): Util File: headerAuth
[19:14:57.550] INFO (62738): Util File: jwt
[19:14:57.550] INFO (62738): Util File: responseUtil
[19:14:57.550] INFO (62738): Util File: tc
[19:14:57.550] INFO (62738): =====Load Model=====
[19:14:57.550] INFO (62738): Model File: User
[19:14:57.558] INFO (62738): =====Load Controller=====
[19:14:57.558] INFO (62738): Controller File: AuthController
[19:14:57.558] INFO (62738): Controller File: UserController
[19:14:57.560] INFO (62738): =====Load Routes=====
[19:14:57.560] INFO (62738): Route File: authentication
[19:14:57.561] INFO (62738): Route File: blog
[19:14:57.561] INFO (62738): Route File: contact
[19:14:57.561] INFO (62738): Route File: project
[19:14:57.561] INFO (62738): Route File: user
[19:14:57.561] INFO (62738): =====FILE LOADING DONE=====
[19:14:57.562] INFO (62738): ===========================
[19:14:57.562] INFO (62738): ===========================
[19:14:57.562] INFO (62738): App Init
[19:14:57.562] INFO (62738): Header Security Init
[19:14:57.563] INFO (62738): Google Auth Init
[19:14:57.563] INFO (62738): URL Logging Init
[19:14:57.563] INFO (62738): RBAC Authentication Init
[19:14:57.563] INFO (62738): Routes Init
[19:14:57.584] INFO (62738): HTTP Server running on port 5002
[19:14:57.584] INFO (62738): HTTPS Server running on port 5001
[19:14:57.593] INFO (62738): MongoDB Connected: localhost
[19:14:57.593] INFO (62738): MongoDB Connect: END
```

## Setup Instructions

1. **Clone the repository:**
   ```
    git clone <repository-url>
    cd <repository-directory>
   ```
2. **Install dependencies:**
   Ensure you have Node.js installed. Then, run the following command to install required dependencies:
   ```
    pnpm install
   ```
3. **Create .env File:**
   Make sure to set up your environment variables in a **.env file** in the root directory of your project. Example:
   ```
    MONGO_URI=mongodb://localhost:27017/userAuth
    PORT_HTTP=5002
    PORT_HTTPS=5001
    GOOGLE_CLIENT_ID=<insert your google client id>
    GOOGLE_CLIENT_SECRET=<insert your google client secret>
    SECRET_ACCESS_TOKEN=<generate secret token for signing access token>
    SECRET_REFRESH_TOKEN=<generate secret token for signing refresh token>
   ```
4. **Configure Database Connection:**
   Update the connectDB method in _config/db.js_ (currently commented out). This will establish the connection to your database. You can also add your db credentials in the **.env file**.
   ```
    MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/mernbackend?retryWrites=true&w=majority
    MONGO_URI=mongodb://localhost:27017/
   ```
5. **SSL Configuration:**
   Make sure you have an ssl folder at the root level, containing your SSL certificates:
   - certificate.pem
   - private-key.pem
6. **Run the Server:**
   Once everything is set up, run the following command to start the server in development mode: - certificate.pem
   ```
    pnpm run dev
   ```

## Authentication Mechanisms

We implemented JWT-based authentication using access and refresh tokens to ensure robust security.

### **Access Token**

- **Access Token Generation**: Upon successful login, an access token (JWT) is generated. The access token contains information such as the user’s ID, role, and expiration time. It has a short expiration time (15 minutes) to minimize the impact of token theft.
- **Access Token Storage**: For security reasons, the access token is not stored in local storage or session storage to avoid vulnerabilities such as Cross-Site Scripting (XSS). Instead, it is stored in memory and passed in the Authorization header with each HTTP request (Authorization: Bearer <access_token>). This ensures that even if an attacker exploits XSS vulnerabilities, the access token remains safe, as it is not persistently stored in the browser.
- **Token Expiration and Renewal**: Due to the short lifespan of access tokens, users are required to periodically refresh them using a refresh token, allowing the system to maintain security without requiring frequent logins.

### **Refresh Token**

- **Refresh Token Generation**: Along with the access token, a refresh token is generated at login. The refresh token has a longer expiration time (7 days) and is used solely to request a new access token when the old one expires.
- **Refresh Token Storage**: Unlike the access token, the refresh token is stored in an HttpOnly cookie. This type of cookie is not accessible via JavaScript, which provides protection against XSS attacks. Storing the refresh token in a secure, HttpOnly cookie also prevents attackers from easily accessing it through client-side scripts.
- **Token Refresh Process**: When the access token expires, the client automatically sends a request to the server using the refresh token (via an API call) to obtain a new access token. This ensures that the user remains authenticated without having to log in again, and the access token can continue to be sent in headers for secure communication.

Storing the access token in memory and the refresh token in an HttpOnly cookie provides strong protection against security threats. This approach mitigates the risk of XSS attacks, as an attacker cannot steal the refresh token through client-side scripts.

Additionally, CSRF protection is not needed when using Bearer tokens because the browser doesn’t automatically send authentication credentials with requests. Since JWTs are manually included in the Authorization header, CSRF attacks aren’t possible.

## Authentication Mechanisms (Google OAuth)

We use **Google OAuth 2.0** for secure login via Google accounts, integrated with **Passport.js**.

### Google OAuth Flow

1. **Login**: Users start the Google login process by visiting the `/api/auth/login/google` endpoint, which redirects to Google’s OAuth consent screen.
2. **Callback**: After user authorization, Google redirects to `/api/auth/login/google/callback`. **Passport.js** handles the response, verifying the user and extracting profile info (Google ID, name).

### Passport.js Google OAuth Configuration

- **Client ID & Secret**: Obtained from Google Cloud Console and stored in environment variables.
- **Callback URL**: Matches the URL set in Google Cloud Console.
- **Scopes**: We only request profile information (`scope: ["profile"]`).

Example configuration:

```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/login/google/callback",
      scope: ["profile"],
      state: false,
    },
    modules.controller.AuthController.googleMain
  )
);
```

### JWT Integration with Google OAuth

- After Google authentication, a **JWT token** is generated for session management. The token is passed in the `Authorization` header (`Bearer <access_token>`) for subsequent API requests.

### Security Considerations

- **Stateless Sessions**: No server-side sessions are used (`session: false`). Access is controlled via JWT tokens.
- **Minimal Permissions**: We only request basic profile information from Google.

## Role-Based Access Control (RBAC)

In our application, we implemented a **Role-Based Access Control (RBAC)** system to manage access and ensure that only authorized users can perform certain actions. We defined two primary roles:

### 1. Guest

- **Access**: Can view public sections of the portfolio, such as project showcases and blog posts.
- **Restrictions**: Cannot access any content management or account-related features.

### 2. User

- **Access**: Can create, manage, and edit blog posts and portfolio items.
- **Permissions**: Can access protected routes such as `/api/user/profile/edit`, `/api/auth/refresh`, and other administrative features.

User's role is encoded within their **JWT** (JSON Web Token), and role-based permissions are enforced using middleware. This middleware validates whether a user has the necessary role to access specific routes. By using route-level protection, we ensure that only authorized users can access restricted areas and perform certain actions.

The following configuration defines the access control for different routes based on user roles:

```javascript
module.exports = [
  // Authentication routes
  {
    path: "/api/auth/logout",
    methods: { POST: ["user"] }, // Only 'user' can POST to this route
  },
  {
    path: "/api/auth/login",
    methods: { POST: ["user", "guest"] }, // Both 'user' and 'guest' can POST to this route
  },
  {
    path: "/api/auth/refresh",
    methods: { POST: ["user"] }, // Only 'user' can refresh access token
  },
];
```

This configuration ensures that each route is protected based on the user’s role. By using middleware and JWT encoding, we enforce access control throughout the application, blocking unauthorized users from performing actions they aren’t allowed to.

## Lessons Learned

Throughout this project, we encountered several challenges, particularly in balancing security and usability. Below are some of the key lessons learned:

### 1. Balancing Security with User Experience

One challenge was deciding where to store tokens to maximize security without frustrating the user. We opted for storing **JWT tokens** in the Authorization header and **refresh tokens** in **HttpOnly cookies**, providing secure storage while maintaining smooth session continuity for users. Handling token expiry required careful consideration to avoid excessive logouts while minimizing the risk of token misuse.

### 2. Granularity of Access Control

Another challenge was determining the right level of granularity for role-based access. Since the application has relatively simple functionality, we opted for **route-level protection**. This simplified implementation, but we acknowledged the trade-off of not having more granular control over specific actions (e.g., read, write, delete) within a route. For now, this structure meets the project’s needs, but future iterations might require more detailed access control mechanisms.

### 3. CSRF and XSS Protection

Implementing secure token management to prevent **CSRF** and **XSS** attacks was critical. Storing refresh tokens in **HttpOnly cookies** provided additional security but added complexity to the token refresh process. We had to ensure that the token refresh process was smooth and seamless for the user to avoid session interruptions.

Ultimately, these challenges led us to make design choices that emphasized security while maintaining a positive user experience. In future projects, we may consider more granular role-based permissions and explore further enhancements to session management.
