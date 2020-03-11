const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();
const app = require("express")();

// const config = JSON.parse(process.env.FIREBASE_CONFIG);
//console.log(functions.config());

const firebaseConfig = {
  apiKey: "AIzaSyCiG7aEuGcvD0EGDTuB2bV2Q5Ouny6gbbk",
  authDomain: "socialape-giselle.firebaseapp.com",
  databaseURL: "https://socialape-giselle.firebaseio.com",
  projectId: "socialape-giselle",
  storageBucket: "socialape-giselle.appspot.com",
  messagingSenderId: "1069557420737",
  appId: "1:1069557420737:web:2b28bcd727c71869aa3a40",
  measurementId: "G-C2J9TKNF8M"
};
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

// const cors = require('cors')({
//   origin: function(origin, callback) {
//     const whitelist = ['http://localhost:3000', 'http://localhost:5000', 'https://giselletrithip.github.io', 'https://giselle-trithip.web.app']
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// });

const isEmpty = str => {
  return str.trim() ? false : true;
};
const isEmail = str => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return str.match(emailRegEx) ? true : false;
};

const cors = require("cors")({
  origin: true
});
app.use(cors);
app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().useHandle,
          createdAt: doc.data().createdAt
        });
      });
      cors(req, res, () => {
        res.status(200).json(screams);
      });
    })
    .catch(err => {
      console.error(err);
    });
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
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

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  console.log(newUser);

  let errors = {};

  if (isEmpty(newUser.email)) errors.email = "Must not be empty";
  else if (!isEmail(newUser.email)) errors.email = "Must be a valid email address";

  if (isEmpty(newUser.password)) errors.password = "Must not be empty";
  if (newUser.password !== newUser.confirmPassword) errors.confirmPassword = "passwords must match";
  if (isEmpty(newUser.handle)) errors.handle = "Must not be empty";

  if (Object.keys(errors).length > 0) res.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code == "auth/email-already-in-use") {
        return res.status(400).json({ handle: "email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

app.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }
  let errors = {}
  if (isEmpty(user.email)) errors.email = "Must not be empty";
  else if (!isEmail(user.email)) errors.email = "Must be a valid email address";

  if (isEmpty(user.password)) errors.password = "Must not be empty";
  if (Object.keys(errors).length > 0) res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then(data => {
    return data.user.getIdToken();
  })
  .then(token => {
    return res.json({ token })
  })
  .catch(err => {
    console.error(err);
    if (err.code === "auth/wrong-password") {
      return res.status(403).json({ general: "Wrong credentials, please try again" })
    } else {
      return res.status(500).json({ error: err.code });
    }
  })
});

exports.api = functions.region("asia-northeast1").https.onRequest(app);
