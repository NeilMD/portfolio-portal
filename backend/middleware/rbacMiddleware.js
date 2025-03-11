const jwt = require("jsonwebtoken");

module.exports = ({ roles, logger, process, utils }) => {
  return async (req, res, next) => {
    logger.info("rbacMiddleware: START");
    let objResult = utils.responseUtil();

    const authHeader = req.headers["authorization"];
    let token = "";
    req.user = Object.create({});
    req.user.role = "guest";
    let isAllowed = false;
    let decoded = "";
    if (authHeader) {
      token = authHeader && authHeader.split(" ")[1];
      logger.info(`token: ${token}`);
      decoded = await utils.tc(() => {
        return jwt.verify(
          token,
          process.env.SECRET_ACCESS_TOKEN,
          (err, decoded) => {
            logger.info("Invalid JWT Token");
            return decoded;
          }
        );
      });

      if (decoded.numCode == 0) {
        req.user = Object.create({});
        req.user.userId = decoded?.objResult?.userId;
        req.user.role = decoded?.objResult?.role;
      }
    }
    logger.info(`User Role: ${req.user.role}`);
    if (decoded.numCode == 0 || req.user.role) {
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
            allowedRolesForMethod?.includes(req.user.role)
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
