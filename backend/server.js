// IMPORT MODULES
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const fs = require("fs");
const http = require("http");
const https = require("https");
const hsts = require("hsts");
const path = require("path");
const helmet = require("helmet");
const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());

const modules = Object.create({});
modules.logger = logger;
modules.router = router;

// IMPORT ROUTES
modules.route.userRoutes = require("./routes/user")(modules.logger);
modules.route.authRoutes = require("./routes/authentication")(modules.logger);
modules.route.blogRoutes = require("./routes/blog")(modules.logger);
modules.route.contactRoutes = require("./routes/contact")(modules.logger);
modules.route.projectRoutes = require("./routes/project")(modules.logger);
modules.route.errorRoute = require("./routes/errorHandler")(modules.logger);

// IMPORT MIDDLEWARE
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config();
// connect to DB
connectDB(modules.logger);
const app = express();
app.use(express.json());

// Use Helmet for security headers
// Default headers set by Helmet:
// 1. X-Content-Type-Options (nosniff) - Prevents browsers from MIME-sniffing the content.
// 2. X-Frame-Options (sameorigin) - Prevents clickjacking by allowing frames only from the same origin.
// 3. X-DNS-Prefetch-Control - Controls browser DNS prefetching. Default is 'off'.
// 4. Strict-Transport-Security (HSTS) - Enforces HTTPS connections to the server.
// 5. X-Permitted-Cross-Domain-Policies - Controls Adobe Flash/Acrobat content.
// 6. Referrer-Policy (no-referrer) - Controls the information sent in the `Referer` header.
// 7. Expect-CT - Enforces Certificate Transparency.
// 8. X-XSS-Protection - Enables browser's built-in XSS filtering for older browsers.
app.use(helmet());
// Custom headers
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.referrerPolicy({ policy: "no-referrer-when-downgrade" }));

logger.info("Routes Definition");
//ROUTES
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/project", projectRoutes);

// Serve static files (images, CSS, JS) with caching
app.use(
  express.static(path.join(__dirname, "build"), {
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

app.use(errorRoute);

// Port configuration
const { PORT_HTTP = 5000, PORT_HTTPS = 5001 } = process.env;

// SSL certificate options
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "ssl", "private-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "ssl", "certificate.pem")),
};

// Apply HSTS middleware to the HTTPS server
const hstsOptions = {
  maxAge: 31536000, // 1 year in seconds
  includeSubDomains: true, // Apply HSTS to all subdomains
  preload: true, // Include this site in the HSTS preload list
};

// Create HTTP server
http.createServer(app).listen(PORT_HTTP, () => {
  logger.info(`HTTP Server running on port ${PORT_HTTP}`);
});

// Create HTTPS server with HSTS middleware
https
  .createServer(sslOptions, (req, res) => {
    hsts(hstsOptions)(req, res, () => app(req, res));
  })
  .listen(PORT_HTTPS, () => {
    logger.info(`HTTPS Server running on port ${PORT_HTTPS}`);
  });
