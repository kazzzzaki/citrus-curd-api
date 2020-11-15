const { setupExpressServer } = require("../src/server");
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
          userCount.count.should.equal(1);

          //TEARDOWN
        });
        it("should return error when user name is number", async () => {
          //SETUP
          const newUserData = {
            name: "123",
            token: "newUserToken",
          };
          const error = {
            errors: [
              {
                value: "123",
                msg: "user name must not be ONLY NUMBERS",
                param: "name",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.post("/api/user").send(newUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          const userCount = await db.user.findAndCountAll({
            where: { name: "123" },
          });
          userCount.count.should.equal(0);

          //TEARDOWN
        });
        it("should return error when user name not set", async () => {
          //SETUP
          const newUserData = {
            token: "newUserToken",
          };
          const error = {
            errors: [
              {
                msg: "user name is required",
                param: "name",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.post("/api/user").send(newUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);

          //TEARDOWN
        });
        it("should return error when user token is not set", async () => {
          //SETUP
          const newUserData = {
            name: "newUser",
          };
          const error = {
            errors: [
              {
                msg: "user token is REQUIRED",
                param: "token",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.post("/api/user").send(newUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);

          //TEARDOWN
        });
      });
      describe("PATCH /api/user - get users data", () => {
        it("should patch users with id 2", async () => {
          //SETUP
          const patchUserData = {
            name: "patchUser",
            token: "patchUserToken",
          };

          //EXCERCISE
          const res = await request.patch("/api/user/2").send(patchUserData);

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).name.should.equal(patchUserData.name);
          JSON.parse(res.text).token.should.equal(patchUserData.token);
          //TEARDOWN
          const tearDownUserData = {
            name: "John",
            token: "testtoken",
          };
          await db.user.update(tearDownUserData, {
            where: { id: 2 },
          });
        });
        it("should return error with name", async () => {
          //SETUP
          const patchUserData = {
            name: "patchUser2",
            token: "patchUserToken2",
          };

          //EXCERCISE
          const res = await request.patch("/api/user/mike").send(patchUserData);

          //ASSERT
          res.should.have.status(400);
          res.text.should.equal("patch needs id as number");
          //TEARDOWN
        });
        it("should return error when user name is number", async () => {
          //SETUP
          const newUserData = {
            name: "123",
            token: "newUserToken",
          };
          const error = {
            errors: [
              {
                value: "123",
                msg: "user name must not be ONLY NUMBERS",
                param: "name",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.patch("/api/user/2").send(newUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          const userCount = await db.user.findAndCountAll({
            where: { name: "123" },
          });
          userCount.count.should.equal(0);

          //TEARDOWN
        });
      });
      describe("PUT /api/user - get users data", () => {
        it("should put users with id 4", async () => {
          //SETUP
          const putUserData = {
            name: "putUser",
            token: "putUserToken",
          };

          //EXCERCISE
          const res = await request.put("/api/user/4").send(putUserData);

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).name.should.equal(putUserData.name);
          JSON.parse(res.text).token.should.equal(putUserData.token);
          //TEARDOWN
          const tearDownUserData = {
            name: "Chris",
            token: "testtoken",
          };
          await db.user.update(tearDownUserData, {
            where: { id: 4 },
          });
        });
        it("should return error with name", async () => {
          //SETUP
          const putUserData = {
            name: "putUser",
            token: "putUserToken",
          };

          //EXCERCISE
          const res = await request.put("/api/user/Chris").send(putUserData);

          //ASSERT
          res.should.have.status(400);
          res.text.should.equal("put needs id as number");
          //TEARDOWN
        });
      });
      describe("DELETE /api/user - get users data", () => {
        //TODO:
        it("should delete users with id", async () => {
          //SETUP
          const deleteUserData = {
            name: "DeleteUser",
            token: "deletetesttoken",
          };
          await db.user.create(deleteUserData);
          const userData = await db.user.findOne({
            raw: true,
            where: { name: deleteUserData.name },
          });

          //EXCERCISE
          const res = await request.delete(`/api/user/${userData.id}`);

          //ASSERT
          res.should.have.status(200);
          const userCount = await db.user.findAndCountAll({
            where: { name: "DeleteUser" },
          });
          userCount.count.should.equal(0);

          //TEARDOWN
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
