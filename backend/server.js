// IMPORT MODULES
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

// IMPORT ROUTES
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/authentication");
const blogRoutes = require("./routes/blog");
const contactRoutes = require("./routes/contact");
const projectRoutes = require("./routes/project");

// IMPORT MIDDLEWARE
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();
// TODO
// connectDB();
const app = express();
app.use(express.json());

//ROUTES
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/project", projectRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Serve static files (images, CSS, JS) with caching
app.use(
  express.static(path.join(__dirname, "..", "frontend"), {
    //TODO change the path for an actual entry point of frontend
    setHeaders: (res, path) => {
      if (path.endsWith(".js") || path.endsWith(".css")) {
        res.set("Cache-Control", "public, max-age=31536000, immutable"); // Cache for 1 year
      }
      if (path.endsWith(".html")) {
        res.set("Cache-Control", "no-cache, no-store, must-revalidate"); // Always fetch HTML files to ensure the latest version
      }
    },
  })
);

const PORT_HTTP = process.env.PORT_HTTP || 5000;
const PORT_HTTPS = process.env.PORT_HTTPS || 5001;

http.createServer(app).listen(PORT_HTTP, () => {
  console.log(`Server running on port ${PORT_HTTP}`);
});

// Create HTTPS server with SSL certificate
const options = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private-key.pem")), // Path to your private key
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")), // Path to your certificate
};

// Create HTTPS server
https.createServer(options, (req, res) => {
  // Apply HSTS middleware
  hsts(hstsOptions)(req, res, () => {
    app(req, res);
  });
});

app.listen(PORT_HTTPS, () => {
  console.log(`Server running on port ${PORT_HTTPS}`);
});
