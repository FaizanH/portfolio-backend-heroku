const router = require("express").Router();
const passport = require("passport");
let User = require("../models/user.model");
// const catchAsync = require("../middleware/catchAsync");
// const authentication = require("../middleware/authenticate");
// const { signup, login, protectedRoute, logout } = authController;
// const { authenticate } = authentication;

// router.post("/login", catchAsync(login));
// router.post("/signup", catchAsync(signup));
// router.post("/authenticate", authenticate, catchAsync(protectedRoute));

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) {
        res.send("No User Found to Login")
      } else {
        req.logIn(user, (err) => {
          if (err) throw err;
          res.send(user);
          // console.log(req.user + " logged in");
        });
      }
    })(req, res, next);
});

router.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const newUser = new User({
    username,
    password
  });

  User.findOne({"username": username}, function(err, user) {
    if (err) {
        throw err;
    } else if (user) {
        res.json("Username already exists");
    } else {
      newUser.save()
        .then(() => res.json("New User Created"))
        .catch(err => res.status(400).json("Error: " + err));
}
  });
});

router.get("/user", (req, res) => {
    if (req.user)
        res.json(req.user); // The req.user stores the entire user that has been authenticated inside of it.
    else
        res.send("No User Found")
});

router.post("/logout", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
  req.logout(function(err) {
    if (err) { return next(err) }
    req.session.destroy(function (err) {
      res.redirect("/");
    })
    // req.session.destroy(err => res.send("Logged Out User"));
  });
});

module.exports = router;