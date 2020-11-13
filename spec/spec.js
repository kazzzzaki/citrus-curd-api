const { setupExpressServer } = require("../src/server");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

// Another reason we separated creating our server from starting it
const app = setupExpressServer();

describe("test server", () => {
  beforeEach(() => {
    request = chai.request(app);
  });

  describe("test get", () => {
    describe("GET /api/user - get all users", () => {
      it("should return all usres", async () => {
        const res = await request.get("/api/user");
        res.should.have.status(200);
      });
    });
  });
});
