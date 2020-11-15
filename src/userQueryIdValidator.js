const { param } = require("express-validator");
const db = require("../models/index");

module.exports = [
  param("reqId")
    .not()
    .isEmpty()
    .isInt()
    .withMessage("id in the url param must be a number")
    .custom(async (reqId) => {
      let result = false;
      if (!isNaN(reqId)) {
        const userData = await db.user.findAndCountAll({
          where: { id: reqId },
        });
        if (userData.count === 0) {
          throw new Error("there were no user with the requested id");
        }
        result = true;
      }
      return result;
    }),
];
