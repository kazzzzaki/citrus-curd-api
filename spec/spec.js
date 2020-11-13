const { setupExpressServer } = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
chai.should();

// Another reason we separated creating our server from starting it
const app = setupExpressServer();
let request;
describe("test server", () => {
  beforeEach(() => {
    request = chai.request(app);
  });

  describe("test get", () => {
    describe("GET /api/user - get all users", () => {
      it("should return all users", async () => {
        //SETUP

        //EXCERCISE
        const res = await request.get("/api/user");

        //ASSERT
        res.should.have.status(200);

        //TEARDOWN
      });
    });
  });
});
