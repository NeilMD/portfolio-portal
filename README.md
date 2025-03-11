## Project Overview
 
This project leverages `Express.js` for the backend and React for the frontend, implementing a clear separation of concerns through the **Model-View-Controller (MVC) pattern**. The frontend (`React`) acts as the view, while external routes handle incoming requests, passing them to controllers, which in turn interact with the models for database operations.
 
## Project Architecture & Key Considerations
 
For this project, we envisioned a modular architecture with a clear separation of concerns, ensuring maintainability and scalability. We adhered to a set of coding standards to promote consistency and readability. Key considerations include:
* **Logging**: Implemented structured logging for easier debugging and monitoring.
* **Response Consistency**: In controllers, all responses are returned at the bottom to improve readability and ensure logical flow.
* **Role-Based Configuration**: Role-based access is defined in a configuration file, keeping role management centralized and flexible.
* **Dynamic File Loading**: We dynamically load certain files from folders to improve extensibility and maintain clean code organization.
 
 
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
* **Access Token Generation**: Upon successful login, an access token (JWT) is generated. The access token contains information such as the user’s ID, role, and expiration time. It has a short expiration time (15 minutes) to minimize the impact of token theft.
* **Access Token Storage**: For security reasons, the access token is not stored in local storage or session storage to avoid vulnerabilities such as Cross-Site Scripting (XSS). Instead, it is stored in memory and passed in the Authorization header with each HTTP request (Authorization: Bearer <access_token>). This ensures that even if an attacker exploits XSS vulnerabilities, the access token remains safe, as it is not persistently stored in the browser.
* **Token Expiration and Renewal**: Due to the short lifespan of access tokens, users are required to periodically refresh them using a refresh token, allowing the system to maintain security without requiring frequent logins.
 
 
### **Refresh Token**
* **Refresh Token Generation**: Along with the access token, a refresh token is generated at login. The refresh token has a longer expiration time (7 days) and is used solely to request a new access token when the old one expires.
* **Refresh Token Storage**: Unlike the access token, the refresh token is stored in an HttpOnly cookie. This type of cookie is not accessible via JavaScript, which provides protection against XSS attacks. Storing the refresh token in a secure, HttpOnly cookie also prevents attackers from easily accessing it through client-side scripts.
* **Token Refresh Process**: When the access token expires, the client automatically sends a request to the server using the refresh token (via an API call) to obtain a new access token. This ensures that the user remains authenticated without having to log in again, and the access token can continue to be sent in headers for secure communication.
 
	
Storing the access token in memory and the refresh token in an HttpOnly cookie provides strong protection against security threats. This approach mitigates the risk of XSS attacks, as an attacker cannot steal the refresh token through client-side scripts.
 
Additionally, CSRF protection is not needed when using Bearer tokens because the browser doesn’t automatically send authentication credentials with requests. Since JWTs are manually included in the Authorization header, CSRF attacks aren’t possible.
 
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
    ]
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