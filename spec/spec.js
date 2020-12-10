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
          const error = {
            errors: [
              {
                value: "kazuaki",
                msg: "this user name is already used",
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
                msg: "user name is REQUIRED",
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
        it("should return error when request body is empty", async () => {
          //SETUP
          const postUserData = {};
          const error = {
            errors: [
              {
                msg: "user name is REQUIRED",
                param: "name",
                location: "body",
              },
              {
                msg: "user token is REQUIRED",
                param: "token",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.post("/api/user").send(postUserData);

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
        it("should return error when user name already exists", async () => {
          //SETUP
          const newUserData = {
            name: "kazuaki",
          };

          const error = {
            errors: [
              {
                value: "kazuaki",
                msg: "this user name is already used",
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
            where: { name: "kazuaki" },
          });
          userCount.count.should.equal(1);

          //TEARDOWN
        });
        it("should return error with name", async () => {
          //SETUP
          const patchUserData = {
            name: "patchUser2",
            token: "patchUserToken2",
          };
          const error = {
            errors: [
              {
                value: "mike",
                msg: "id in the url param must be a number",
                param: "reqId",
                location: "params",
              },
            ],
          };

          //EXCERCISE
          const res = await request.patch("/api/user/mike").send(patchUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          //TEARDOWN
        });
        it("should be able to update user name only", async () => {
          //SETUP
          const patchUserData = {
            name: "patchUser",
          };

          //EXCERCISE
          const res = await request.patch("/api/user/2").send(patchUserData);

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).name.should.equal(patchUserData.name);
          const userCount = await db.user.findAndCountAll({
            where: { name: "patchUser" },
          });
          userCount.count.should.equal(1);

          //TEARDOWN
          const tearDownUserData = {
            name: "John",
            token: "testtoken",
          };
          await db.user.update(tearDownUserData, {
            where: { id: 2 },
          });
        });
        it("should be able to update user token only", async () => {
          //SETUP
          const patchUserData = {
            token: "patchUserToken",
          };

          //EXCERCISE
          const res = await request.patch("/api/user/2").send(patchUserData);

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).token.should.equal(patchUserData.token);
          const userCount = await db.user.findAndCountAll({
            where: { token: "patchUserToken" },
          });
          userCount.count.should.equal(1);

          //TEARDOWN
          const tearDownUserData = {
            name: "John",
            token: "testtoken",
          };
          await db.user.update(tearDownUserData, {
            where: { id: 2 },
          });
        });
        it("should return error when user name is number", async () => {
          //SETUP
          const patchUserData = {
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
          const res = await request.patch("/api/user/2").send(patchUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          const userCount = await db.user.findAndCountAll({
            where: { name: "123" },
          });
          userCount.count.should.equal(0);

          //TEARDOWN
        });
        it("should return error when request body is empty", async () => {
          //SETUP
          const patchUserData = {};
          const error = {
            errors: [
              {
                msg: "please request either user name or user token",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.patch("/api/user/2").send(patchUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);

          //TEARDOWN
        });
        it("should return error if there were no user to patch", async () => {
          //SETUP
          const patchUserData = {
            name: "patchUser",
            token: "newUserToken",
          };
          const error = {
            errors: [
              {
                value: "100",
                msg: "there were no user with the requested id",
                param: "reqId",
                location: "params",
              },
            ],
          };
          //EXCERCISE
          const res = await request.patch("/api/user/100").send(patchUserData);
          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
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
        it("should return error when user name already exists", async () => {
          //SETUP
          const newUserData = {
            name: "kazuaki",
            token: "newUserToken",
          };
          const error = {
            errors: [
              {
                value: "kazuaki",
                msg: "this user name is already used",
                param: "name",
                location: "body",
              },
            ],
          };

          //EXCERCISE
          const res = await request.put("/api/user/3").send(newUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          const userCount = await db.user.findAndCountAll({
            where: { name: "kazuaki" },
          });
          userCount.count.should.equal(1);

          //TEARDOWN
        });
        it("should return error with name", async () => {
          //SETUP
          const putUserData = {
            name: "putUser",
            token: "putUserToken",
          };
          const error = {
            errors: [
              {
                value: "Chris",
                msg: "id in the url param must be a number",
                param: "reqId",
                location: "params",
              },
            ],
          };
          //EXCERCISE
          const res = await request.put("/api/user/Chris").send(putUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
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
          const res = await request.put("/api/user/3").send(newUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          const userCount = await db.user.findAndCountAll({
            where: { name: "123" },
          });
          userCount.count.should.equal(0);

          //TEARDOWN
        });
        it("should return error when user name is not set", async () => {
          //SETUP
          const newUserData = {
            token: "newUserToken",
          };
          const error = {
            errors: [
              {
                msg: "user name is REQUIRED",
                param: "name",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.put("/api/user/3").send(newUserData);

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
          const res = await request.put("/api/user/3").send(newUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);

          //TEARDOWN
        });
        it("should return error when request body is empty", async () => {
          //SETUP
          const putUserData = {};
          const error = {
            errors: [
              {
                msg: "user name is REQUIRED",
                param: "name",
                location: "body",
              },
              {
                msg: "user token is REQUIRED",
                param: "token",
                location: "body",
              },
            ],
          };
          //EXCERCISE
          const res = await request.put("/api/user/3").send(putUserData);

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);

          //TEARDOWN
        });
        it("should return error if there were no user to put", async () => {
          //SETUP
          const putUserData = {
            name: "putUser",
            token: "newUserToken",
          };
          const error = {
            errors: [
              {
                value: "100",
                msg: "there were no user with the requested id",
                param: "reqId",
                location: "params",
              },
            ],
          };
          //EXCERCISE
          const res = await request.put("/api/user/100").send(putUserData);
          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          //TEARDOWN
        });
      });
      describe("DELETE /api/user - get users data", () => {
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
        it("should return error with name", async () => {
          //SETUP
          const error = {
            errors: [
              {
                value: "mike",
                msg: "id in the url param must be a number",
                param: "reqId",
                location: "params",
              },
            ],
          };
          //EXCERCISE
          const res = await request.delete("/api/user/mike");
          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          //TEARDOWN
        });
        it("should return error if there were no user to delete", async () => {
          //SETUP
          const error = {
            errors: [
              {
                value: "100",
                msg: "there were no user with the requested id",
                param: "reqId",
                location: "params",
              },
            ],
          };
          //EXCERCISE
          const res = await request.delete("/api/user/100");
          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);
          //TEARDOWN
        });
      });
    });
    describe("/api/task test", () => {
      describe("GET /api/task - get task data", () => {
        it("should return all tasks of selected task", async () => {
          //SETUP
          const taskData = await db.task.findAll({
            raw: true,
            where: { userid: 2 },
          });
          const expect = taskData.map((task) => {
            task.due = task.due.toJSON();
            task.createdAt = task.createdAt.toJSON();
            task.updatedAt = task.updatedAt.toJSON();
            return task;
          });

          //EXCERCISE
          const res = await request.get("/api/task/2?token=testtoken");

          //ASSERT
          res.should.have.status(200);
          JSON.parse(res.text).should.deep.equal(expect);

          //TEARDOWN
        });
        it("should return 400 when token is incorrect", async () => {
          //SETUP
          const error = {
            errors: [
              {
                value: "testtoken2",
                msg: "the token sent was incorrect",
                param: "token",
                location: "query",
              },
            ],
          };

          //EXCERCISE
          const res = await request.get("/api/task/2?token=testtoken2");

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);

          //TEARDOWN
        });
        it("should return 400 when token is missing", async () => {
          //SETUP
          const error = {
            errors: [
              {
                msg: "token in the url param must not be empty",
                param: "token",
                location: "query",
              },
            ],
          };

          //EXCERCISE
          const res = await request.get("/api/task/2");

          //ASSERT
          res.should.have.status(400);
          res.body.should.deep.equal(error);

          //TEARDOWN
        });
      });
      describe("POST /api/task - get task data", () => {
        it("should create tasks", async () => {
          //SETUP
          const newUserData = {
            task: "new task",
            project: "new project",
            priority: 3,
            due: Date.parse("2020-11-20 00:00:00"),
            comment: "new task comment",
          };

          //EXCERCISE
          const res = await request
            .post("/api/task/2?token=testtoken")
            .send(newUserData);

          //ASSERT
          res.should.have.status(201);
          const taskData = await db.task.findAll({
            raw: true,
            where: { task: "new task" },
          });
          const expect = taskData.map((task) => {
            task.due = task.due.toJSON();
            task.createdAt = task.createdAt.toJSON();
            task.updatedAt = task.updatedAt.toJSON();
            return task;
          });
          console.log(res.body);
          JSON.parse(res.text).should.deep.equal(expect);

          //TEARDOWN
          await db.task.destroy({
            where: { task: "new task" },
          });
        });
      });

      describe("PATCH /api/task - get task data", () => {
        it("should patch tasks with id 1", async () => {
          //SETUP
          const patchUserData = {
            id: 1,
            task: "patch task",
            project: "patch project",
            priority: 5,
            due: Date.parse("2020-11-20 00:00:00"),
            comment: "patch task comment",
            completed: true,
          };

          //EXCERCISE
          const res = await request
            .patch("/api/task/1?token=kazuaki")
            .send(patchUserData);

          //ASSERT
          res.should.have.status(200);
          res.body.task.should.equal(patchUserData.task);
          res.body.project.should.equal(patchUserData.project);
          res.body.priority.should.equal(patchUserData.priority);
          //res.body.due.should.equal(patchUserData.due);
          res.body.comment.should.equal(patchUserData.comment);
          res.body.completed.should.equal(patchUserData.completed);
          //TEARDOWN
          const tearDownUserData = {
            id: 1,
            task: "create GET METHOD",
            project: "API solo project",
            priority: 1,
            due: Date.parse("2020-11-16 03:27:09"),
            comment: "by TDD",
            completed: true,
          };
          await db.user.update(tearDownUserData, {
            where: { id: 1 },
          });
        });
      });
      describe("PUT /api/task - get task data", () => {
        //TODO: task
      });
      describe("DELETE /api/task - get task data", () => {
        it("should delete tasks with id", async () => {
          //SETUP
          const deleteTaskData = {
            userid: 1,
            task: "delete task",
            project: "delete project",
            priority: 3,
            due: Date.parse("2020-11-20 00:00:00"),
            comment: "delete task comment",
            completed: false,
          };
          await db.task.create(deleteTaskData);
          const taskData = await db.task.findOne({
            raw: true,
            where: { task: deleteTaskData.task },
          });
          const requestObj = {};
          requestObj.id = taskData.id;

          //EXCERCISE
          const res = await request
            .delete("/api/task/1?token=kazuaki")
            .send(requestObj);

          //ASSERT
          res.should.have.status(200);
          const userCount = await db.task.findAndCountAll({
            where: { task: "delete task" },
          });
          userCount.count.should.equal(0);

          //TEARDOWN
        });
      });
    });
  });
});
