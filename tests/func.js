var assert = require('assert');
var expect = require("chai").expect;

const url = "https://asia-northeast1-evelyn-todo.cloudfunctions.net/";

describe('Auth functions', () => {

  describe("Create an account", () => {
    let endpoint = url + "signUp";
    it("should create an account", async () => {
      const axios = require("axios");
      const data = {
        email: Math.random().toString() + "@gmail.com",
        password: "xxxyyy"
      };
      const res = await axios.post(endpoint, data);
      expect(res).to.exist.and.have.property('status', 201);
    });
  });

});

describe('Todos functions', () => {

  describe("Create todo", () => {
    let endpoint = url + "createTodo";
    it("should create a todo", async () => {
      const axios = require("axios");
      const data = {
        content: "Create a todo by test script"
      };
      const res = await axios.post(endpoint, data);
      expect(res).to.exist.and.have.property('status', 200);
    });
  });

  describe("Get todos list", () => {
    let endpoint = url + "getTodos";
    it("should get todos list", async () => {
      const axios = require("axios");
      const res = await axios.get(endpoint);
      expect(res).to.exist;
      expect(res.data.length).to.be.gt(0);
    });
  });

});
