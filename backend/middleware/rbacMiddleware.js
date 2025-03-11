const jwt = require("jsonwebtoken");

module.exports = ({ roles, logger, utils, jwt }) => {
  return async (req, res, next) => {
    logger.info("rbacMiddleware: START");
    let objResult = utils.responseUtil();

    const authHeader = req.headers["authorization"];
    let token = "";
    let isAllowed = false;
    let decoded = "";

    // Initialize user as guest by default
    res.locals.user = res.locals.user || { role: "guest" };

    // if token Exist
    if (authHeader) {
      token = authHeader && authHeader.split(" ")[1];
      logger.info(`token: ${token}`);
      decoded = await jwt.verifyToken(token);
      // if decoded is properly set, all values will be defined.
      if (decoded) {
        res.locals.user.userId = decoded?.userId;
        res.locals.user.role = decoded?.role;
      }
    }
    logger.info(`User Role: ${res.locals.user.role}`);

    if (decoded || res.locals.user.role) {
      const requestPath = req.path; // Requested path
      const requestMethod = req.method; // HTTP method (GET, POST, etc.)

      // Check if the route and method are allowed
      isAllowed = roles.some((route) => {
        // Create a regex for the route path
        const routeRegex = new RegExp(
          "^" + route.path.replace(/\*/g, "[^/]+") + "$"
        );

        // Check if the path matches the current requestPath
        if (routeRegex.test(requestPath)) {
          // Check if the method is in the allowed methods for this route
          const allowedRolesForMethod = route.methods[requestMethod];

          // Check if the current user role is in the allowed roles for this method
          if (
            allowedRolesForMethod &&
            allowedRolesForMethod?.includes(res.locals.user.role)
          ) {
            return true; // User is allowed
          }
        }
        return false; // User is not allowed
      });
    }

    logger.info("rbacMiddleware: END");

    if (isAllowed) {
      next(); // Allowed access, proceed
    } else {
      objResult.numCode = 1;
      objResult.objError =
        "Access Denied: You do not have permission to access this route or method.";

      return res.status(201).json(objResult);
    }
  };
};
