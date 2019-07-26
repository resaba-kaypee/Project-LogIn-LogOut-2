const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');


// User model
const Users = require("../models/users.model");

// log in page
router.get("/login", (req, res) => {
  res.render("login");
});

// register
router.get("/register", (req, res) => {
  res.render("register");
});

// handle registration
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }

  //check password match
  if (password !== password2) {
    errors.push({ msg: "Password do not match" });
  }

  //check pass length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // validate passed
    Users.findOne({ email: email }).then(user => {
      if (user) {
        //user exist
        errors.push({ msg: "Email already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new Users({
          name,
          email,
          password
        });

        //hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'You are now registered')
                res.redirect("/users/login")
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});

// handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// handle logout
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login')
});

module.exports = router;