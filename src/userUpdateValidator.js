const { body } = require("express-validator");

module.exports = [
  body("name").not().isInt().withMessage("user name must not be ONLY NUMBERS"),
];
