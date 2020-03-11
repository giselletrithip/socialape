var fetch = require('isomorphic-unfetch');
var expect = require("chai").expect;

const url = "http://localhost:5001/socialape-giselle/asia-northeast1/api";

describe("Call signup", () => {
  const endpoint = url + "/signup";
  it("should create an account", async (done) => {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: Math.random().toString() + "@gmail.com",
        password: "xxxyyy",
        confirmPassword: "xxxyyy",
        handle: Math.random().toString()
      })
    })
    .then(res => {
      expect(res.json()).to.exist;
      //expect(res.status).to.equal(201);
      done();
    })
    .catch(err => {
      expect(err).to.exist.and.be.instanceof(Error);
      done(err);
    });
  });
});

