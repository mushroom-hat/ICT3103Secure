const { check, validationResult } = require('express-validator');

// Title Validation
const validateTitle = () => {
    return check('title', 'Invalid title')
      .isLength({ min: 1 })
      .withMessage('Title cannot be empty.')
      .escape();
  };

// Content Validation
const validateContent = () => {
    return check('content', 'Invalid content')
      .isLength({ min: 1 })
      .withMessage('Content cannot be empty.')
      .escape();
  };

const bouncerwritearticle = async (req, res, next) => {
  console.log("the validation begins");

  const TitleValidation = validateTitle();
  const ContentValidation = validateContent();

  let TitleValid = false;
  let ContentValid = false;
  let TitleErrors;

  // Password validation
  const TitleReq = {...req};
  await new Promise((resolve) => {
    TitleValidation(TitleReq, res, () => {
      TitleErrors = validationResult(TitleReq);
      if (!TitleErrors.isEmpty()) {
        console.log("Title validation errors:", TitleErrors.array());
      } else {
        TitleValid = true;
      }
      resolve(); // Resolve the promise
    });
  });
  // Username validation
  const ContentReq = {...req};
  ContentValidation(ContentReq, res, () => {
    const ContentErrors = validationResult(ContentReq);
    if (!ContentErrors.isEmpty()) {
      console.log("Content validation errors:", ContentErrors.array());
    } else {
      ContentValid = true;
    }
});
  next();
}

module.exports = bouncerwritearticle;