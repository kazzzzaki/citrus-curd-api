const { body } = require("express-validator");

module.exports = [
  body("priority").isInt().withMessage("priority must be from 1-5"),
];
