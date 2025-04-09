// IMPORT MODULES
const express = require("express");
const router = express.Router();

const dotenv = require("dotenv").config();
const fs = require("fs");
const http = require("http");
const https = require("https");
const hsts = require("hsts");
const path = require("path");
const helmet = require("helmet");
const pino = require("pino");
const pretty = require("pino-pretty");
const logger = pino(pretty());
const requireDir = require("require-dir");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const GoogleStrategy = require("passport-google-oauth20");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const joi = require("joi");
const profileMiddleware = require("./middleware/profileMiddleware");
const authValidator = require("./validators/authValidator");

// Module Init
const modules = Object.create({});
modules.logger = logger;
modules.express_router = router;
modules.mongoose = mongoose;
modules.process = process;
modules.asyncHandler = asyncHandler;
modules.passport = passport;
modules.rateLimit = rateLimit;
modules.joi = joi;

// DB Connect
require("./db")(modules.logger, modules.mongoose, modules.process);

logger.info("===========================");
logger.info("===========================");
logger.info("=====FILE LOADING BEGIN====");

// Load Config
const configFiles = requireDir("./config");
modules.config = Object.create({});
logger.info("=====Load Config=====");
for (const file in configFiles) {
  logger.info(`Config File: ${file}`);
  modules.config[file] = configFiles[file];
}

// Load Dummy Data
const dummyDataFiles = requireDir("./data");
modules.dummyData = Object.create({});
logger.info("=====Load Dummy Data=====");
for (const file in dummyDataFiles) {
  logger.info(`Dummy Data File: ${file}`);
  modules.dummyData[file] = dummyDataFiles[file];
}

// Load Middleware
const middlewareFiles = requireDir("./middleware");
modules.middleware = Object.create({});
logger.info("=====Load Middleware=====");
for (const file in middlewareFiles) {
  logger.info(`Middleware File: ${file}`);
  modules.middleware[file] = middlewareFiles[file];
}

// Load Utils
const utilFiles = requireDir("./utils");
modules.util = Object.create({});
logger.info("=====Load Utils =====");
for (const file in utilFiles) {
  logger.info(`Util File: ${file}`);
  modules.util[file] = utilFiles[file];
}

// Load Models
const modelFiles = requireDir("./models");
modules.model = Object.create({});
logger.info("=====Load Model=====");
for (const file in modelFiles) {
  logger.info(`Model File: ${file}`);
  modules.model[file] = modelFiles[file](modules.logger, modules.mongoose);
}

// Load Controller
const controllerFiles = requireDir("./controllers");
modules.controller = Object.create({});
logger.info("=====Load Controller=====");
for (const file in controllerFiles) {
  logger.info(`Controller File: ${file}`);
  modules.controller[file] = controllerFiles[file]({
    config: modules.config.config,
    model: modules.model,
    logger: modules.logger,
    util: modules.util,
    process: modules.process,
    asyncHandler: modules.asyncHandler,
    passport: modules.passport,
    jwt: modules.util.jwt({
      process: modules.process,
      logger: modules.logger,
      utils: modules.util,
      asyncHandler: modules.asyncHandler,
    }),
  });
}

// Load Validator
const validatorFiles = requireDir("./validators");
modules.validator = Object.create({});
logger.info("=====Load Validators=====");
for (const file in validatorFiles) {
  logger.info(`Validators File: ${file}`);
  modules.validator[file] = validatorFiles[file]({
    logger: modules.logger,
    joi: modules.joi,
  });
}
// Load Routes
const routeFiles = requireDir("./routes");
modules.route = Object.create({});
logger.info("=====Load Routes=====");
for (const file in routeFiles) {
  logger.info(`Route File: ${file}`);
  modules.route[file] = routeFiles[file]({
    logger: modules.logger,
    controller: modules.controller,
    router: modules.express_router,
    passport: modules.passport,
    cacheMiddleware: modules.middleware.cacheMiddleware,
    rateLimitMiddleware: modules.middleware.rateLimitMiddleware({
      rateLimit: modules.rateLimit,
      logger: modules.logger,
      utils: modules.util,
    }),
    profileMiddleware: modules.middleware.profileMiddleware({
      logger: modules.logger,
      validator: modules.validator,
    }),
    authMiddleware: modules.middleware.authMiddleware({
      logger: modules.logger,
      validator: modules.validator,
    }),
  });
}

logger.info("=====FILE LOADING DONE=====");
logger.info("===========================");
logger.info("===========================");

logger.info("App Init");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your React frontend URL
    credentials: true, // if you're using cookies or authorization headers
  })
);

logger.info("Header Security Init");
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

logger.info("Google Auth Init");
// Passport configuration for Google OAuth
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

logger.info("URL Logging Init");
app.use(
  modules.middleware.urlLogging({
    logger: modules.logger,
  })
);

logger.info("RBAC Authentication Init");
app.use(
  modules.middleware.rbacMiddleware({
    logger: modules.logger,
    roles: modules.config.roles,
    process: modules.process,
    utils: modules.util,
    jwt: modules.util.jwt({
      logger: modules.logger,
      process: modules.process,
      utils: modules.util,
      asyncHandler: modules.asyncHandler,
    }),
  })
);

logger.info("Routes Init");
//ROUTES
app.use("/api/user", modules.route.user);
app.use("/api/auth", modules.route.authentication);
app.use("/api/blog", modules.route.blog);
app.use("/api/contact", modules.route.contact);
app.use("/api/project", modules.route.project);

// Serve static files (images, CSS, JS) with caching
app.use(
  // Build is the folder where the build files of the frontend(React), will be placed.
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
app.use(modules.middleware.errorMiddleware({ logger: modules.logger }));

// Port configuration
const { PORT_HTTP = 5002, PORT_HTTPS = 5001 } = process.env;

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
