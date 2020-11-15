const { check } = require("express-validator");

module.exports = [
  check("name").not().isInt().withMessage("user name must not be ONLY NUMBERS"),
];
