const { expect } = require("chai");
const supertest = require("supertest");
const { app, server } = require("../cors_proxy");

describe("CORS Proxy Tests", function () {
  after(() => {
    server.close();
  });

  it("should proxy GET request successfully", function (done) {
    const targetUrl = "http://example.org";
    supertest(app)
      .get("/proxy?url=" + targetUrl)
      .end(function (_err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("should proxy POST request successfully", function (done) {
    const targetUrl = "http://example.org";
    supertest(app)
      .post("/proxy?url=" + targetUrl)
      .send("value")
      .end(function (_err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("should set the appropriate CORS headers", function (done) {
    const targetUrl = "http://example.org";
    supertest(app)
      .get("/proxy?url=" + targetUrl)
      .expect("Access-Control-Allow-Origin", "*")
      .expect("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
      .expect(
        "Access-Control-Allow-Headers",
        "Authorization, Origin, X-Requested-With, Content-Type, Accept"
      )
      .end(function (_err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("should proxy GET request when http:// is missing", function (done) {
    const targetUrl = "example.org";
    supertest(app)
      .get("/proxy?url=" + targetUrl)
      .end(function (_err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
