const { check } = require("express-validator");

module.exports = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("必須項目です。")
    .not()
    .isInt()
    .withMessage("user name must not be ONLY NUMBERS"),
];
