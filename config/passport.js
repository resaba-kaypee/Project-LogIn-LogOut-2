const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load user model
const Users = require('../models/users.model');

module.exports = function(passport){
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // match user email
      Users.findOne({email : email})
        .then(user => {
          if(user == null) {
            return done(null, false, { message: 'That email is not yet registered'});
          }

          //match user password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if(isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {message: 'Password Incorrect'});
            }
          }) 
        })
        .catch(err => console.log(err));
    })
  )
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
