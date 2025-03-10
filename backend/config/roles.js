module.exports = {
  user: [
    // Auth
    { path: "/api/auth/logout", methods: ["POST"] }, // User can log out

    // Blog
    { path: "/api/blog/user/*", methods: ["GET"] }, // Retrieves all blog posts by a specific user
    { path: "/api/blog/add", methods: ["POST"] }, // Creates a new blog post (title, content, tags)

    // Contact
    { path: "/api/contact/messages", methods: ["GET", "POST"] }, // Retrieves contact messages

    // Project
    { path: "/api/project/media", methods: ["POST"] }, // Adds media (images/videos) to a specific project.
    { path: "/api/project/add", methods: ["POST"] }, // Adds a new project (project description, tech stack, demo links, GitHub repository).
    { path: "/api/project/user/*", methods: ["GET"] }, // GET Fetches all projects of a specific user.
    { path: "/api/project/user/*", methods: ["GET"] }, // GET Fetches all projects of a specific user.

    //User
    { path: "/api/user/profile/*", methods: ["GET"] }, // Retrieve specific user profile info
    { path: "/api/user/profile/edit", methods: ["POST"] }, // POST Updates the user’s profile information (bio, skills, technologies, etc.).
  ],

  guest: [
    // Auth
    { path: "/api/auth/login", methods: ["POST"] }, // Guest login
    { path: "/api/auth/signup", methods: ["POST"] }, // Guest sign-up
    { path: "/api/auth/login/google", methods: ["GET"] }, // Google login URL
    { path: "/api/auth/login/google/callback", methods: ["GET"] }, // Google login callback

    // User
    { path: "/api/user", methods: ["GET"] }, // Retrieve general user profile info
    { path: "/api/user/profile/*", methods: ["GET"] }, // Retrieve specific user profile info
    { path: "/api/user/profile/add", methods: ["POST"] }, // POST Creates the user’s profile information (bio, skills, technologies, etc.).

    // Project
    { path: "/api/project", methods: ["GET"] }, // Retrieve all projects
    { path: "/api/project/*/*", methods: ["GET"] }, // Retrieve detailed information about a specific project
    { path: "/media/*/*/*", methods: ["GET"] }, // GET Retrieves media (images/videos) to a specific project.

    // Blog
    { path: "/api/blog", methods: ["GET"] }, // Retrieve all blog posts
    { path: "/api/blog/*/*", methods: ["GET"] }, // Retrieve detailed information about a specific blog post

    // Contact
    { path: "/api/contact/messages", methods: ["POST"] }, // Submits a new contact message or inquiry (name, email, message)
  ],
};
