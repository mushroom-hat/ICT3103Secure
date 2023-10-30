const { check, validationResult } = require('express-validator');


// Password validation
const validatePassword = () => {
  return check('pwd', 'Password must be at least 7 characters long').isLength({ min: 7 })
    .custom((value) => {
      const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/;
      if (re.test(value)) {
        return true; // Password matches the pattern
      } else {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.');
      }
    });
};

const bouncer = (req, res, next) => {
  console.log("the validation begins");
  const validationRule = validatePassword();
  validationRule(req, res, () => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const extractedErrors = errors.array().map((err) => ({ [err.param]: err.msg }));
      return res.status(422).json({
        errors: extractedErrors,
      });
    }
    next();
  });
};

module.exports = bouncer;
