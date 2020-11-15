const { body } = require("express-validator");

module.exports = [
  body("task").not().isEmpty().withMessage("task is REQUIRED"),
  body("project").not().isEmpty().withMessage("project is REQUIRED"),
  body("priority").not().isEmpty().withMessage("priority is REQUIRED"),
  body("due").not().isEmpty().withMessage("due is REQUIRED"),
  body("comment").not().isEmpty().withMessage("comment is REQUIRED"),
];
