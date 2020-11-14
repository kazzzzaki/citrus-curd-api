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

  //GET METHOD
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
    await db.user.create(req.body);
    res.send(req.body);
  });

  //PATCH METHOD
  app.patch("/api/user/:id", async function (req, res) {
    //TODO find by id and name
    const userData = await db.user.update(req.body, {
      where: { id: req.params.id },
    });
    if (userData) {
      const userData = await db.user.findOne({ where: { id: req.params.id } });
      res.send(userData);
    } else {
      res.status(400).end();
    }
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
