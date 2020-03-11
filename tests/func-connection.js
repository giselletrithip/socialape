var assert = require('assert');
var expect = require("chai").expect;

const url = "https://asia-northeast1-evelyn-todo.cloudfunctions.net/helloWorld";

describe('Cloud functions', () => {

  describe("HTTPS callack by using node's https module", () => {
    it('should return "Hello World!"', (done) => {
      const https = require("https");
      let data = "";
      https.get(url, (res) => {

        expect(res.statusCode).to.equal(200);
        expect(res.headers.server).to.equal('Google Frontend'); //console.log('headers:', res.headers);
        expect(res.headers['x-powered-by']).to.equal('Express');

        res.on('data', (d) => {
          data += d; // process.stdout.write(d);
        });

        res.on('end', () => {
          expect(data).to.equal("Hello World!");
          done();
        });

      }).on('error', (e) => {
        expect(e).to.exist.and.be.instanceof(Error); //.and.have.property('message', 'user exists');
        done(e);
      });
    });
  });

  describe("AXIOS Promise", () => {
    it('should return "Hello World!"', () => {
      const axios = require("axios");
      return axios.get(url)
        .then(function (response) {
          // console.log(response.data);
          // console.log(response.status);
          // console.log(response.statusText);
          // console.log(response.headers);
          // console.log(response.config);
          expect(response.data).to.equal("Hello World!");
        });
    });
  });

  describe("AXIOS async/await", () => {
    it('should return "Hello World!"', async () => {
      const axios = require("axios");
      const res = await axios.get(url);
      expect(res.data).to.equal("Hello World!");
    });
  });



});
