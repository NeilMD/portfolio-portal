# Table of Contents

1. [Project Overview](#project-overview)
2. [Backend Setup and Architecture](#backend-setup-and-architecture)
3. [Frontend Setup and Components](#frontend-setup-and-components)
4. [Project Execution and Development Process](#project-execution-and-development-process)
5. [Security and Validation Overview](#security-and-validation-overview)
   - [Input Validation Techniques](#input-validation-techniques)
     - [Frontend Validation (Zod)](#frontend-validation-zod)
     - [Backend Validation (Joi)](#backend-validation-joi)
   - [Output Encoding Methods](#output-encoding-methods)
   - [Encryption Techniques Used](#encryption-techniques-used)
   - [Third-party Libraries Dependency Management](#third-party-libraries-dependency-management)
6. [Lessons Learned](#lessons-learned)
   - [Challenges Faced](#challenges-faced)
   - [Resolution](#resolution)

---

## 1. Project Overview

This project leverages **Express.js** for the backend and **React** for the frontend, implementing a clear separation of concerns through the **Model-View-Controller (MVC) pattern**. The frontend (`React`) serves as the view, while external routes handle incoming requests, passing them to controllers, which then interact with models for database operations.

The project is structured in two main parts:

1. **Backend**: Focused on implementing JWT authentication, Google OAuth using Auth0, and managing user roles and access.
2. **Frontend**: Designed with **React** and optimized using **ShadCN** components, implementing JWT authentication, form handling, and token management.

### **Phase 3 Enhancements**

For **Phase 3**, we focused on optimizing the frontend to create a more efficient and visually appealing user experience. **ShadCN Components** were utilized to bootstrap the creation of pages and forms. These pre-built, customizable components expedited the development process, enabling rapid implementation of responsive, consistent, and user-friendly interfaces.

### **Key Features**

- **JWT Authentication** (Access & Refresh Tokens) for secure user access
- **Plain JWT Authorization** on the frontend (Google OAuth has not yet been integrated)
- Robust form management with **React Hook Form** and **Zod** for validation
- Optimized UI components powered by **ShadCN**
- Efficient token handling, including refresh and context management

---

## 2. Backend Setup and Architecture

For the backend, we implemented **JWT authentication** using both **access tokens** and **refresh tokens**, along with **Google OAuth integration** through **Auth0**. The backend follows a modular architecture, which includes robust logging, role-based access control, and error handling.

For detailed information about the backend setup, architecture, and authentication mechanisms, please refer to the [**Backend README**](./backend/README.md).

---

## 3. Frontend Setup and Components

On the frontend, we implemented **JWT authentication** with **React** and **Vite**, focusing on user authentication, token management, and form handling. We utilized **React Hook Form** for managing forms and **Zod** for form validation. Additionally, we incorporated **ShadCN** for streamlined UI development and responsiveness. **Google OAuth integration** has not yet been implemented in the frontend, and the current authentication mechanism relies solely on **JWT authorization**.

For detailed instructions on frontend setup, token management, form handling, and component integration, please refer to the [**Frontend README**](./frontend/README.md).

---

## 4. Project Execution and Development Process

The development of this project involved:

- **Backend**: Set up **JWT authentication** with secure token management (access and refresh), integrated **Google OAuth via Auth0**, and ensured a modular, maintainable backend structure.
- **Frontend**: Focused on creating a responsive user interface using **ShadCN**, managing authentication via **React Context**, handling forms with **React Hook Form and Zod**, and ensuring smooth interactions with the backend using **Axios** for API calls. **Google OAuth** has not been integrated into the frontend, and the authentication is currently handled through **JWT authorization**.

- **Optimization and UI**: The UI was designed with usability in mind, using ShadCN components to ensure fast development and an aesthetically pleasing interface.

---

## 5. Security and Validation Overview

In this section, we will explain the key security mechanisms implemented in this project, focusing on input validation techniques, output encoding methods, encryption techniques used, third-party libraries dependency management, and the lessons we learned during this phase.

### Input Validation Techniques

We implemented input validation at both the **frontend** and **backend** levels to ensure data integrity and security.

#### Frontend Validation (Zod)

On the frontend, we used **Zod**, a TypeScript-first schema validation library, to validate user inputs. Zod allows us to define clear, robust validation rules for form fields, which ensures that we prevent invalid data from reaching the backend. Below is an example of how we validate form data on the frontend using Zod:

```javascript
const formSchema = z.object({
  username: z
    .string()
    .email()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .nonempty({
      message: "Username is required.",
    }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50, { message: "Name must be at most 50 characters." })
    .regex(/^[A-Za-z\s]+$/, {
      message: "Name must contain only letters and spaces.",
    })
    .nonempty({ message: "Name is required." }),
  bio: z
    .string()
    .max(500, { message: "Bio must be 500 characters or less." })
    .regex(/^[\w\s.,!?'"()-]*$/, {
      message: "Bio must not contain HTML tags or special characters.",
    })
    .nonempty({ message: "Bio is required." }),
});
```

#### Backend Validation (Joi)

On the backend, we used Joi for input validation. Joi allows us to define schemas that are flexible, expressive, and capable of handling more complex validations, including pattern matching and string length restrictions. Below is an example of how we validate the profile data on the backend:

```javascript
profileValidator.edit = (postData) => {
  logger.info("profileValidator/edit : START");
  const profileValidatorSchema = joi.object({
    userId: joi
      .string()
      .required()
      .trim()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Invalid ObjectId format for userId.",
        "string.empty": "userId is required.",
      }),
    username: joi
      .string()
      .required()
      .email({ tlds: { allow: false } })
      .messages({
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
      }),
    name: joi.string().required().trim().min(3).max(50).messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 2 characters long.",
      "string.max": "Name cannot be longer than 100 characters.",
    }),
    bio: joi
      .string()
      .max(500)
      .pattern(/^[^<>]*$/) // No HTML tags like <script> or <b>
      .pattern(/^[a-zA-Z0-9\s.,!?'"()-]*$/) // Allow basic punctuation
      .messages({
        "string.max": "Bio must be at most 500 characters.",
        "string.pattern.base":
          "Bio must not contain HTML tags or special characters.",
      }),
  });
};
```

### Output Encoding Methods

Although the main focus is on input validation, it’s crucial to properly encode output data to avoid security risks like Cross-Site Scripting (XSS). In this project, React automatically handles the sanitization of dynamic data when rendering to the frontend, ensuring that any potentially malicious content is neutralized. This built-in sanitization effectively prevents XSS attacks, making it impossible for harmful scripts to execute in the browser.

Additionally, since we do not accept any data that contains HTML or use dangerouslySetInnerHTML, we did not see the need for an external library to further sanitize the data. React’s native handling is sufficient to ensure security in this case

### Encryption Techniques Used

We used JWT (JSON Web Tokens) for secure token-based authentication. These tokens are encrypted with a secret key, ensuring that sensitive data (such as user credentials) is securely transmitted between the frontend and backend. The JWT tokens are also signed to verify their authenticity and integrity.

### Third-party Libraries Dependency Management

We utilize a variety of third-party libraries for key functionalities, including Zod for frontend validation, Joi for backend validation, Axios for API calls, and React Hook Form for form management. All dependencies are managed using npm and are listed in the `package.json` files for both frontend and backend projects.

These libraries help streamline development, improve maintainability, and reduce the need to reinvent the wheel for common functionalities.

---

## 6. Lessons Learned

### Challenges Faced

1. **Managing JWT Token in React**: One of the most challenging parts was managing the JWT token in React, especially when implementing it inside the context and providing it to all the child components. Ensuring that the token was available throughout the app while maintaining security and reactivity was tricky. We used React's context API to manage the authentication state and pass the token to the children, but ensuring proper token refreshing and synchronization across the application required careful planning and implementation.

2. **CI/CD YAML Configuration Issues**: We struggled to test the CI/CD pipeline, which added significant time to the debugging process. After multiple failed attempts, we realized that the YAML configuration file we were running wasn't the updated one. The issue was that re-running the failed jobs didn’t apply the changes made to the YAML file. This meant we needed to trigger a completely new run for the new YAML configuration to take effect. Once we identified this, we were able to correct the configuration and successfully run the pipeline.

3. **Validation Mismatches**: Ensuring consistency between frontend and backend validation was another challenge. To resolve this, we synchronized validation rules between both layers, using Zod on the frontend and Joi on the backend.

4. **Asynchronous Operations**: Integrating asynchronous API calls with proper error handling and token management was initially tricky. This was resolved by carefully handling errors with proper user feedback and ensuring that authentication states were properly maintained.

### Resolution

By focusing on clear and consistent validation and error handling mechanisms on both frontend and backend, we were able to address these challenges efficiently. Collaboration between frontend and backend also ensured that we maintained a seamless user experience and robust security measures. The CI/CD issue was resolved by triggering new pipeline runs and ensuring the updated YAML file was used, preventing further confusion.
