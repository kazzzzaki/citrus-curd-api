const express = require("express");
const db = require("../models/index");
const userRegistValidator = require("./userRegistValidator");
const userUpdateValidator = require("./userUpdateValidator");
const userQueryIdValidator = require("./userQueryIdValidator");
const { validationResult } = require("express-validator");
const cors = require("cors");

const setupExpressServer = () => {
  /* return configured express app */
  const app = express();

  app.use(express.json());

  // CORSを許可する
  app.use(cors());

  //GET Hello
  app.get("/api/hello", function (req, res) {
    res.send("Hello World!");
  });

  ////GET METHOD
  //api/userのパターン
  app.get("/api/user", async function (req, res) {
    let userData;
    if (req.query.limit) {
      if (req.query.offset) {
        userData = await db.user.findAll({
          limit: req.query.limit,
          offset: req.query.offset,
        });
      } else {
        userData = await db.user.findAll({ limit: req.query.limit });
      }
    } else {
      userData = await db.user.findAll();
    }
    res.send(userData);
  });

  //api/user/paramsのパターン
  app.get("/api/user/:idOrName", async function (req, res) {
    const { idOrName } = req.params;
    let userData;
    if (isNaN(idOrName)) {
      //数値型以外の場合はnameで検索する
      userData = await db.user.findAll({
        where: { name: idOrName },
      });
    } else {
      //数値型の場合はwhereで検索する
      userData = await db.user.findAll({ where: { id: idOrName } });
    }
    res.send(userData);
  });

  ////POST METHOD
  app.post("/api/user", userRegistValidator, async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await db.user.create(req.body);
    const userData = await db.user.findAll({
      where: { name: req.body.name },
    });
    res.status(201).send(userData);
  });

  ////PATCH METHOD
  app.patch(
    "/api/user/:reqId",
    userUpdateValidator,
    userQueryIdValidator,
    async function (req, res) {
      const { reqId } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "please request either user name or user token",
              location: "body",
            },
          ],
        });
      }
      const userData = await db.user.update(req.body, {
        where: { id: reqId },
      });
      if (userData) {
        const userData = await db.user.findOne({
          where: { id: reqId },
        });
        res.send(userData);
      } else {
        res.status(400).end();
      }
    }
  );

  ////PUT METHOD
  app.put(
    "/api/user/:reqId",
    userRegistValidator,
    userQueryIdValidator,
    async function (req, res) {
      const { reqId } = req.params;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userData = await db.user.update(req.body, {
        where: { id: reqId },
      });
      if (userData) {
        const userData = await db.user.findOne({
          where: { id: reqId },
        });
        res.send(userData);
      } else {
        res.status(400).end();
      }
    }
  );

  //DELETE METHOD
  app.delete("/api/user/:reqId", userQueryIdValidator, async function (
    req,
    res
  ) {
    const { reqId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userData = await db.user.destroy({ where: { id: reqId } });
    if (userData) {
      res.status(200).end();
    } else {
      res.status(400).end();
    }
  });

  //////
  //////api/task/paramsのパターン
  //////
  ////GET
  app.get("/api/task/:reqUserId", async function (req, res) {
    const { reqUserId } = req.params;
    const taskData = await db.task.findAll({ where: { userid: reqUserId } });
    res.send(taskData);
  });

  return app;
};

module.exports = { setupExpressServer };
