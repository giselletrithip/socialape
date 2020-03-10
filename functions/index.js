const functions = require('firebase-functions');
const funcs = functions.region("asia-northeast1").https;

exports.helloWorld = funcs.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
