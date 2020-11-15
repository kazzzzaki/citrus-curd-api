const { body } = require("express-validator");

module.exports = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("user name is REQUIRED")
    .not()
    .isInt()
    .withMessage("user name must not be ONLY NUMBERS"),
  body("token").not().isEmpty().withMessage("user token is REQUIRED"),
];
