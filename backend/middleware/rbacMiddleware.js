const jwt = require("jsonwebtoken");

module.exports = ({ roles, logger, process, utils }) => {
  return (req, res, next) => {
    logger.info("rbacMiddleware: START");
    let objResult = utils.responseUtil();

    const authHeader = req.headers["authorization"];
    let token = "";
    let userRole = "guest";
    let isAllowed = false;
    if (authHeader) {
      token = authHeader && authHeader.split(" ")[1];
      logger.warn(`token: ${token}`);
      const decoded = utils.tc(async () => {
        await jwt.verify(
          token,
          process.env.SECRET_ACCESS_TOKEN,
          (err, decoded) => {
            return false;
          }
        );
      });

      if (decoded) {
        req.user = Object.create({});
        req.user.userId = decoded.userId;
        req.user.role = decoded.role;
      }
    }
    if (objResult.numCode == 0) {
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
            allowedRolesForMethod.includes(userRole)
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
