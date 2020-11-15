const express = require("express");
const db = require("../models/index");
const userRegistValidator = require("./userRegistValidator");
const userUpdateValidator = require("./userUpdateValidator");
const userQueryIdValidator = require("./userQueryIdValidator");
const { validationResult } = require("express-validator");
const cors = require("cors");
const taskQueryValidator = require("./taskQueryValidator");
const taskRegistValidator = require("./taskRegistValidator");
const taskUpdateValidator = require("./taskUpdateValidator");

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
  app.use(
    "/api/task/:reqUserId",
    taskQueryValidator,
    async (req, res, next) => {
      const { reqUserId } = req.params;
      const userToken = req.query.token;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const userData = await db.user.findAndCountAll({
        where: { id: reqUserId, token: userToken },
      });
      if (userData.count === 1) {
        next();
      } else {
        res.status(400).send({
          errors: [
            {
              value: userToken,
              msg: "the token sent was incorrect",
              param: "token",
              location: "query",
            },
          ],
        });
      }
    }
  );

  ////GET
  app.get("/api/task/:reqUserId", taskQueryValidator, async function (
    req,
    res
  ) {
    const { reqUserId } = req.params;
    const taskData = await db.task.findAll({ where: { userid: reqUserId } });
    res.send(taskData);
  });

  ////POST METHOD
  app.post("/api/task/:reqUserId", taskRegistValidator, async function (
    req,
    res
  ) {
    const { reqUserId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const newTask = req.body;
    newTask.userid = reqUserId;
    newTask.completed = false;
    const taskData = await db.task.findAll({
      where: { task: newTask.task },
    });
    res.status(201).send(taskData);
  });

  ////PATCH METHOD
  app.patch("/api/task/:reqUserId", taskUpdateValidator, async function (
    req,
    res
  ) {
    const { reqUserId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const patchTask = req.body;
    patchTask.userid = reqUserId;
    const taskId = patchTask.id;
    const taskData = await db.task.update(patchTask, {
      where: { id: taskId },
    });
    if (taskData) {
      const userData = await db.task.findOne({
        where: { id: taskId },
      });
      res.send(userData);
    } else {
      res.status(400).end();
    }
  });

  return app;
};

module.exports = { setupExpressServer };
