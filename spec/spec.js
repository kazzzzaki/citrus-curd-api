const { setupExpressServer } = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("../models/index");
chai.use(chaiHttp);
chai.should();

// Another reason we separated creating our server from starting it
const app = setupExpressServer();
let request;
describe("tasklist API server", () => {
  beforeEach(() => {
    request = chai.request(app);
  });

  describe("hello world test", () => {
    describe("GET /hello - hello world", () => {
      it("should return all users", async () => {
        //SETUP

        //EXCERCISE
        const res = await request.get("/api/hello");

        //ASSERT
        res.should.have.status(200);

        //TEARDOWN
      });
    });
  });

  describe("tasklist API test", () => {
    describe("/api/user test", () => {
      describe("GET /api/user - get users data", () => {
        //TODO:データまで確認する方法が見つかったら、修正した
        it("should return all users", async () => {
          //SETUP
          const userData = await db.user.findAll({ raw: true });
          const expect = userData.map((user) => {
            user.createdAt = user.createdAt.toJSON();
            user.updatedAt = user.updatedAt.toJSON();
            return user;
          });

          //EXCERCISE
          const res = await request.get("/api/user");

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).should.deep.equal(expect);

          //TEARDOWN
        });

        it("should return users limit 3", async () => {
          //SETUP
          const userData = await db.user.findAll({ raw: true, limit: 3 });
          const expect = userData.map((user) => {
            user.createdAt = user.createdAt.toJSON();
            user.updatedAt = user.updatedAt.toJSON();
            return user;
          });
          //EXCERCISE
          const res = await request.get("/api/user?limit=3");

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).should.deep.equal(expect);

          //TEARDOWN
        });

        it("should return users limit 2 offset 2", async () => {
          //SETUP
          const userData = await db.user.findAll({
            raw: true,
            limit: 2,
            offset: 2,
          });
          const expect = userData.map((user) => {
            user.createdAt = user.createdAt.toJSON();
            user.updatedAt = user.updatedAt.toJSON();
            return user;
          });
          //EXCERCISE
          const res = await request.get("/api/user?limit=2&offset=2");

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).should.deep.equal(expect);

          //TEARDOWN
        });
        it("should return users by id", async () => {
          //SETUP
          const userData = await db.user.findAll({
            raw: true,
            where: { id: 1 },
          });
          const expect = userData.map((user) => {
            user.createdAt = user.createdAt.toJSON();
            user.updatedAt = user.updatedAt.toJSON();
            return user;
          });
          //EXCERCISE
          const res = await request.get("/api/user/1");

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).should.deep.equal(expect);

          //TEARDOWN
        });
        it("should return users by name", async () => {
          //SETUP
          const userData = await db.user.findAll({
            raw: true,
            where: { name: "kazuaki" },
          });
          const expect = userData.map((user) => {
            user.createdAt = user.createdAt.toJSON();
            user.updatedAt = user.updatedAt.toJSON();
            return user;
          });
          //EXCERCISE
          const res = await request.get("/api/user/kazuaki");

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).should.deep.equal(expect);

          //TEARDOWN
        });

        describe("POST /api/user - create users data", () => {
          it("should create users", async () => {
            //SETUP
            const newUserData = {
              name: "newUser",
              token: "newUserToken",
            };

            //EXCERCISE
            const res = await request.post("/api/user").send(newUserData);

            //ASSERT
            res.should.have.status(201);
            const userData = await db.user.findAll({
              raw: true,
              where: { name: "newUser" },
            });
            const expect = userData.map((user) => {
              user.createdAt = user.createdAt.toJSON();
              user.updatedAt = user.updatedAt.toJSON();
              return user;
            });
            JSON.parse(res.text).should.deep.equal(expect);

            //TEARDOWN
            await db.user.destroy({
              where: { name: "newUser" },
            });
          });
          it("should return error when user name already exists", async () => {
            //SETUP
            const newUserData = {
              name: "kazuaki",
              token: "newUserToken",
            };

            //EXCERCISE
            const res = await request.post("/api/user").send(newUserData);

            //ASSERT
            res.should.have.status(400);
            res.text.should.equal("this user name is already used");
            const userCount = await db.user.findAndCountAll({
              where: { name: "kazuaki" },
            });
            userCount.should.equal(1);

            //TEARDOWN
          });
        });
        describe("PATCH /api/user - get users data", () => {
          //TODO:
        });
        describe("PUT /api/user - get users data", () => {
          //TODO:
        });
        describe("DELETE /api/user - get users data", () => {
          //TODO:
        });
      });
    });
    describe("/api/task test", () => {
      describe("GET /api/task - get task data", () => {
        //TODO: task
      });
      describe("POST /api/task - get task data", () => {
        //TODO: task
      });
      describe("PATCH /api/task - get task data", () => {
        //TODO: task
      });
      describe("PUT /api/task - get task data", () => {
        //TODO: task
      });
      describe("DELETE /api/task - get task data", () => {
        //TODO: task
      });
    });
  });
});
