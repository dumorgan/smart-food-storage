const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

require('./../routes/database.js')
require('./../models/user.js')

module.exports = function(passport) {

  passport.serializeUser(function (user, done) {
      console.log('the user got serizalized');
      done(null, user.id);

  });

  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
      console.log(id, ' is starting to be deserialized with passport.js');
      User.findById(id, function (err, user) {
          done(err, user);
      });
  });

  // LOCAL SIGNUP

  passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
      console.log('local signup is starting');

      process.nextTick(function (callback) {
        User.findOne(email, function(err, isNotAvailable, user) {
          if (err) {
            return done(err);
          }
          if (isNotAvailable == true) {
            return done(null, false)
          } else {
            console.log('new local user');
            User.save(req, function(userData) {
              return done(null, userData)
            });
          }
        });
      });
    }
  ));
}
