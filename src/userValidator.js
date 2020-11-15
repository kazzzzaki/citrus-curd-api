const { check } = require("express-validator");

module.exports = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("user name is required")
    .not()
    .isInt()
    .withMessage("user name must not be ONLY NUMBERS"),
];
