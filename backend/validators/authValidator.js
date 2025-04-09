module.exports = ({ logger, joi }) => {
  let authValidator = {};

  authValidator.signup = (postData) => {
    logger.info("authValidator/signup : START");
    // joi Validation Schema for Post
    const authValidatorSchema = joi.object({
      username: joi
        .string()
        .trim()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
          "string.email": "Username must be a valid email address.",
          "string.empty": "Username (email) is required.",
        }),
      password: joi.string().trim().required().min(8).messages({
        "string.empty": "Password is required.",
        "string.min": "Password must be at least 8 characters long.",
      }),
    });

    logger.info("authValidator/signup: END");
    return authValidatorSchema.validate(postData);
  };

  authValidator.login = (postData) => {
    logger.info("authValidator/login : START");
    // joi Validation Schema for Post
    const authValidatorSchema = joi.object({
      username: joi
        .string()
        .trim()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
          "string.email": "Username must be a valid email address.",
          "string.empty": "Username (email) is required.",
        }),
      password: joi.string().trim().required().messages({
        "string.empty": "Password is required.",
      }),
    });

    logger.info("authValidator/login: END");
    return authValidatorSchema.validate(postData);
  };

  return authValidator;
};
