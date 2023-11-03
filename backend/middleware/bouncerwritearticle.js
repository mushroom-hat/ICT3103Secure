const { check, validationResult } = require('express-validator');

console.log("it came to validate");

// Title Validation
const validateTitle = () => {
    return check('title', 'Invalid title')
      .isLength({ min: 2 })
      .withMessage('Title cannot be empty.')
      .escape();
  };

// Content Validation
const validateContent = () => {
    return check('content', 'Invalid content')
      .isLength({ min: 2 })
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

  // Title validation
  const TitleReq = {...req};
  await new Promise((resolve) => {
    console.log("It checked if title got issue");
    TitleValidation(TitleReq, res, () => {
      TitleErrors = validationResult(TitleReq);
      console.log(TitleErrors);
      if (!TitleErrors.isEmpty()) {
        console.log("Title validation errors:", TitleErrors.array());
      } else {
        TitleValid = true;
      }
      resolve(); // Resolve the promise
    });
  });
  // Content validation
  const ContentReq = {...req};
  ContentValidation(ContentReq, res, () => {
    console.log("It checked if content got issue");
    const ContentErrors = validationResult(ContentReq);
    if (!ContentErrors.isEmpty()) {
      console.log("Content validation errors:", ContentErrors.array());
    } else {
      ContentValid = true;
    }
    console.log("runn ah u kns")
    if (!TitleValid && !ContentValid) {
        // Handle the case where both validations fail
        console.log("both also got issue");
        return res.status(422).json({
        errors: [...TitleErrors.array(), ...ContentErrors.array()],
        });
    } else if (!TitleValid) {
        // Handle the case where only password validation fails
        return res.status(422).json({
        errors: TitleErrors.array(),
        });
    } else if (!ContentValid) {
        // Handle the case where only username validation fails
        return res.status(422).json({
        errors: ContentErrors.array(),
        });
    }
    next();
});

}

module.exports = bouncerwritearticle;