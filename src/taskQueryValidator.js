const { query } = require("express-validator");
const db = require("../models/index");

module.exports = [
  query("token")
    .not()
    .isEmpty()
    .withMessage("token in the url param must not be empty"),
];
