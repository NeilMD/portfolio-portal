module.exports = [
  {
    path: "/api/auth/logout",
    methods: {
      POST: ["user"], // Only 'user' can POST to this route
    },
  },
  {
    path: "/api/auth/login",
    methods: {
      POST: ["user", "guest"], // Both 'user' and 'guest' can POST to this route
    },
  },
  {
    path: "/api/auth/refresh",
    methods: {
      POST: ["user", "guest"], // Only "user" can refresh access token
    },
  },
  {
    path: "/api/auth/signup",
    methods: {
      POST: ["user", "guest"], // Both 'user' and 'guest' can POST to this route
    },
  },
  {
    path: "/api/auth/login/google",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET this route
    },
  },
  {
    path: "/api/auth/login/google/callback",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET this route
    },
  },

  // Blog routes
  {
    path: "/api/blog/user/*",
    methods: {
      GET: ["user"], // Only 'user' can GET blog user routes
    },
  },
  {
    path: "/api/blog/add",
    methods: {
      POST: ["user"], // Only 'user' can POST new blog posts
    },
  },
  {
    path: "/api/blog",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET all blog posts
    },
  },
  {
    path: "/api/blog/*/*",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET specific blog post details
    },
  },

  // Contact routes
  {
    path: "/api/contact/messages",
    methods: {
      GET: ["user"], // Only 'user' can GET contact messages
      POST: ["user", "guest"], // Both 'user' and 'guest' can POST messages
    },
  },

  // Project routes
  {
    path: "/api/project/media",
    methods: {
      POST: ["user"], // Only 'user' can POST to project media
    },
  },
  {
    path: "/api/project/add",
    methods: {
      POST: ["user"], // Only 'user' can POST to add new project
    },
  },
  {
    path: "/api/project/edit",
    methods: {
      POST: ["user"], // Only 'user' can POST to edit project
    },
  },
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
  {
    path: "/api/project/*/*",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET specific project details
    },
  },
  {
    path: "/api/project/media/*/*/*",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET media files
    },
  },

  // User routes
  {
    path: "/api/user",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET user info
    },
  },
  {
    path: "/api/user/profile/get",
    methods: {
      POST: ["user"], // Both 'user' and 'guest' can GET specific user profiles
    },
  },
  {
    path: "/api/user/profile/*",
    methods: {
      GET: ["user", "guest"], // Both 'user' and 'guest' can GET specific user profiles
    },
  },
  {
    path: "/api/user/profile/add",
    methods: {
      POST: ["user"], // Only 'user' can POST to create a new user profile
    },
  },
  {
    path: "/api/user/profile/edit",
    methods: {
      POST: ["user"], // Only 'user' can POST to edit their profile
    },
  },
];
