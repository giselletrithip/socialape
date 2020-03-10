const functions = require("firebase-functions");
const funcs = functions.region("asia-northeast1").https;
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

const app = require('express')();

const cors = require("cors")({
  origin: function(origin, callback) {
    //const whitelist = ['http://localhost:3000', 'http://localhost:5000'];
    const whitelist = ["http://localhost"];
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
});

//app.use(cors);

app.get('/screams', (req, res) => {
  db.collection("screams")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push(doc.data());
      });
      cors(req, res, () => {
        res.status(200).json(screams);
      });
    })
    .catch(err => {
      console.error(err);
    });
});

// exports.helloWorld = funcs.onRequest((request, response) => {
//   cors(request, response, () => {
//     response.send("Hello from Firebase!");
//   });
// });

app.post('/scream', (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      res.status(200).json({
        message: `document ${doc.id} created successfully`
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went wrong" });
    });
});

exports.api = funcs.onRequest(app);
