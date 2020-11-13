const { setupExpressServer } = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const db = require("../models/index");
chai.use(chaiHttp);
chai.should();

// Another reason we separated creating our server from starting it
const app = setupExpressServer();
let request;
describe("test server", () => {
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
    describe("GET /api/user - get users data", () => {
      //TODO:データまで確認する方法が見つかったら、修正した
      it("should return all users", async () => {
        //SETUP
        const userData = await db.user.findAll();

        //EXCERCISE
        const res = await request.get("/api/user");

        //ASSERT
        res.should.have.status(200);
        JSON.parse(res.text).length.should.equal(userData.length);

        //TEARDOWN
      });

      it("should return users limit 3", async () => {
        //SETUP
        const userData = await db.user.findAll({ limit: 3 });

        //EXCERCISE
        const res = await request.get("/api/user?limit=3");

        //ASSERT
        res.should.have.status(200);
        JSON.parse(res.text).length.should.equal(userData.length);

        //TEARDOWN
      });
    });
  });
});
