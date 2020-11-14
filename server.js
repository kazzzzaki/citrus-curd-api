const express = require("express");
const db = require("./models/index");

const setupExpressServer = () => {
  /* return configured express app */
  const app = express();
  app.use(express.json());

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

  //POST METHOD
  app.post("/api/user", async function (req, res) {
    if (isNaN(req.body.name)) {
      const userCount = await db.user.findAndCountAll({
        where: { name: req.body.name },
      });
      if (userCount.count === 0) {
        await db.user.create(req.body);
        const userData = await db.user.findAll({
          where: { name: req.body.name },
        });
        res.status(201).send(userData);
      } else {
        res.status(400).send("this user name is already used");
      }
    } else {
      res.status(400).send("user name must not be ONLY NUMBERS");
    }
  });

  //PATCH METHOD
  app.patch("/api/user/:reqId", async function (req, res) {
    const { reqId } = req.params;
    let userData;
    if (isNaN(reqId)) {
      //TODO:数値型以外の場合は現状エラー。今後実装する方法について検討する。
      // const userData = await db.user.update(req.body, {
      //   where: { name: reqId },
      // });
      // if (userData) {
      //   const userData = await db.user.findOne({
      //     where: { name: reqId },
      //   });
      //   res.send(userData);
      // } else {
      res.status(400).send("patch needs id as number");
      // }
    } else {
      //数値型の場合はwhereで検索する
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
    res.send(userData);
  });

  //DELETE METHOD
  app.delete("/api/user/:id", async function (req, res) {
    const userData = await db.user.destroy({ where: { id: req.params.id } });
    if (userData) {
      res.status(200).end();
    } else {
      res.status(400).end();
    }
  });

  return app;
};

module.exports = { setupExpressServer };
