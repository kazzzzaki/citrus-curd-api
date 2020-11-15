const { check } = require("express-validator");

module.exports = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("user name is REQUIRED")
    .not()
    .isInt()
    .withMessage("user name must not be ONLY NUMBERS"),
  check("token").not().isEmpty().withMessage("user token is REQUIRED"),
];
