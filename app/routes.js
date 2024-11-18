
const { ObjectId } = require('mongodb');
module.exports = function (app, passport, db) {
  // normal routes ===============================================================
  const multer = require('multer');
  const path = require('path');
  // Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Save images in public/uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

  // show the home page (will also have our login links)
  app.get("/", function (req, res) {
    res.render("index.ejs");
  });
  // HOME SECTION ===========================
  app.get("/home", isLoggedIn, function (req, res) {
    db.collection("posts")
      .find()
      .sort({ thumbUp: -1 })
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("home.ejs", {
          user: req.user, //not sure if this right, is this for passport or something else?
          posts: result,
        });
      });
  });

  // PROFILE SECTION =========================
  app.get("/profile", isLoggedIn, function (req, res) {
    db.collection("users")
      .find()
      .toArray((err, result) => {
        if (err) return console.log(err);
        res.render("profile.ejs", {
          user: req.user,
          users: result,
        });
      });
  });

  // LOGOUT ==============================
  app.get("/logout", function (req, res) {
    req.logout(() => {
      console.log("User has logged out!");
    });
    res.redirect("/");
  });

  // message board routes ===============================================================
  //saves newly posted image and caption into the posts collection on mongo, redirects back to /home.
  app.post('/posts', upload.single('image'), (req, res) => {
    const { email, caption } = req.body;
    const imagePath = `/uploads/${req.file.filename}`;
  
    db.collection('posts').insertOne(
      {
        email,
        image: imagePath,
        caption,
        thumbUp: 0,
      },
      (err, result) => {
        if (err) return console.log(err);
        console.log('Saved to database');
        res.redirect('/home');
      }
    );
  });

  

  app.put("/posts", (req, res) => {
    db.collection("posts").findOneAndUpdate(
      { _id: ObjectId(req.body.postId) },
    { $inc: { thumbUp: 1 } }, // Increment the thumbUp value
    { returnOriginal: false }, // Return the updated document
    (err, result) => {
      if (err) return res.send(err);
      res.send(result.value);
    }

    );
  });

  app.delete('/posts', (req, res) => {
    db.collection('posts').findOneAndDelete(
      { _id: ObjectId(req.body.postId) }, // Use ObjectId here
      (err, result) => {
        if (err) return res.status(500).send(err); // Return proper status code
        res.send('Entry deleted!');
      }
    );
  });


//=============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get("/login", function (req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  // process the login form
  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/login", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // SIGNUP =================================
  // show the signup form
  app.get("/signup", function (req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  // process the signup form
  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/home", // redirect to the secure profile section
      failureRedirect: "/signup", // redirect back to the signup page if there is an error
      failureFlash: true, // allow flash messages
    })
  );

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get("/unlink/local", isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      // saves new user document into the user collection in mongo
      res.redirect("/profile");
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect("/");
}
