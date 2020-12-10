const { body } = require("express-validator");
const db = require("../models/index");

module.exports = [
  body("name")
    .not()
    .isEmpty()
    .withMessage("user name is REQUIRED")
    .not()
    .isInt()
    .withMessage("user name must not be ONLY NUMBERS")
    .custom(async (userName) => {
      let result = false;
      if (userName !== undefined && isNaN(userName)) {
        const userData = await db.user.findAndCountAll({
          where: { name: userName },
        });
        if (userData.count >= 1) {
          throw new Error("this user name is already used");
        }
        result = true;
      }
      return result;
    }),
  body("token").not().isEmpty().withMessage("user token is REQUIRED"),
];
