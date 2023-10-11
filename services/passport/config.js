const localStrategy = require("passport-local").Strategy;
const User = require("../../models/user.model");
const bcrypt = require("bcrypt");

module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne( {username: username }, (err, user) => {
        if (err) throw err;
        if (!user) return done(null, false);
        // Could use user.comparePassword instead
        bcrypt.compare(password, user.password, (err, result) => {
          if(result === true) {
            return done(null, user);
          } else return done(null, false);
        });
      });
    })
  )

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  })

  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      cb(err, { user })
    });
  })
}