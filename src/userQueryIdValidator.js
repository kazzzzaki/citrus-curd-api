const { param } = require("express-validator");

module.exports = [
  param("reqId")
    .not()
    .isEmpty()
    .isInt()
    .withMessage("id in the url param must be a number"),
];
