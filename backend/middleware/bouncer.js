const { check, validationResult } = require('express-validator');

// Paswword validation
const validatePassword = () => {
  return check('pwd', 'Password must be at least 7 characters long').isLength({ min: 7 });
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().map((err) => ({ [err.param]: err.msg }));
  return res.status(422).json({
    errors: extractedErrors,
  });
};

const bouncer = (req, res, next) => {
  console.log("the validation begins");
  const validationRule = validatePassword();
  validationRule(req, res, () => {
    validate(req, res, next); // Execute the validation function
  });
};

module.exports = bouncer;
