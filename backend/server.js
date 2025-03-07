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
const GoogleStrategy = require("passport-google-oauth20");

// Module Init
const modules = Object.create({});
modules.logger = logger;
modules.express_router = router;
modules.mongoose = mongoose;
modules.process = process;
modules.asyncHandler = asyncHandler;
modules.passport = passport;
modules.config = require("./config");

// DB Conenct
require("./config/db")(modules.logger, modules.mongoose, modules.process);

logger.info("===========================");
logger.info("===========================");
logger.info("=====FILE LOADING BEGIN====");
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
  logger.info(`Dummy Middleware File: ${file}`);
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
    config: modules.config,
    model: modules.model,
    logger: modules.logger,
    util: modules.util,
    process: modules.process,
    asyncHandler: modules.asyncHandler,
    passport: modules.passport,
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
    cacheMiddleware: modules.middleware.cacheMiddleware,
    controller: modules.controller,
    router: modules.express_router,
    passport: modules.passport,
    authMiddleware: modules.middleware.authMiddleware({
      logger: modules.logger,
      utils: modules.util,
      process: modules.process,
    }),
  });
}

logger.info("=====FILE LOADING DONE=====");
logger.info("===========================");
logger.info("===========================");

logger.info("App Init");
const app = express();
app.use(express.json());

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
    async (accessToken, refreshToken, profile, done) => {
      logger.info("GOOGLE ASYNC START");
      let resultUser = "",
        existingUser = "";
      let User = modules.model.User;
      // Try to find the user in database
      existingUser = await modules.util.tc(
        async () =>
          await User.findOne({
            googleId: profile.id,
          })
      );

      // If user doesn't exist, create a new one
      if (existingUser.objResult === 0) {
        const newUser = new User({
          googleId: profile?.id,
          name: profile?.displayName,
          email: profile?.emails?.value,
        });
        const tempUser = await newUser.save();
        resultUser = {
          userId: tempUser._id,
          googleId: tempUser.googleId,
          name: profile.displayName,
        };
      } else {
        resultUser = {
          userId: existingUser.objResult._id,
          googleId: existingUser.objResult.googleId,
          name: profile.displayName,
        };
      }
      logger.info("GOOGLE ASYNC END");
      return done(null, resultUser);
    }
  )
);

logger.info("Routes Init");
//ROUTES
app.use("/api/user", modules.route.user);
app.use("/api/auth/", modules.route.authentication);
app.use("/api/blog", modules.route.blog);
app.use("/api/contact", modules.route.contact);
app.use("/api/project", modules.route.project);

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
