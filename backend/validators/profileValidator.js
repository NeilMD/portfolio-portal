module.exports = ({ logger, joi }) => {
  let profileValidator = {};

  profileValidator.get = (postData) => {
    logger.info("profileValidator/get : START");
    // joi Validation Schema for Post
    const profileValidatorSchema = joi.object({
      userId: joi
        .string()
        .required()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.pattern.base": "Invalid ObjectId format for userId.",
          "string.empty": "userId is required.",
        }),
    });

    logger.info("profileValidator/get: END");
    return profileValidatorSchema.validate(postData);
  };

  profileValidator.edit = (postData) => {
    logger.info("profileValidator/edit : START");
    // joi Validation Schema for Post
    const profileValidatorSchema = joi.object({
      userId: joi
        .string()
        .required()
        .trim()
        .regex(/^[0-9a-fA-F]{24}$/)
        .messages({
          "string.pattern.base": "Invalid ObjectId format for userId.",
          "string.empty": "userId is required.",
        }),
      username: joi
        .string()
        .required()
        .email({ tlds: { allow: false } })
        .messages({
          "string.email": "Email must be a valid email address.",
          "string.empty": "Email is required.",
        }),
      name: joi.string().required().trim().min(3).max(50).messages({
        "string.empty": "Name is required.",
        "string.min": "Name must be at least 2 characters long.",
        "string.max": "Name cannot be longer than 100 characters.",
      }),

      bio: joi
        .string()
        .max(500)
        .pattern(/^[^<>]*$/) // No HTML tags like <script> or <b>
        .pattern(/^[a-zA-Z0-9\s.,!?'"()-]*$/) // Allow basic punctuation
        .messages({
          "string.max": "Bio must be at most 500 characters.",
          "string.pattern.base":
            "Bio must not contain HTML tags or special characters.",
        }),
    });

    logger.info("profileValidator/edit: END");
    return profileValidatorSchema.validate(postData);
  };

  return profileValidator;
};
