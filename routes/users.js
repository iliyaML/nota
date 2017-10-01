const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// load user model
require('../models/User');
const User = mongoose.model('users');

// user login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// login form process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// user regester route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// register form process
router.post('/register', (req, res) => {
  let errors = [];

  if(req.body.password != req.body.password2){
    errors.push({ text: 'Passwords do not match' });
  }

  if(req.body.password.length < 4){
    errores.push({ text: 'Passwords must be at least 4 characters' });
  }

  if(errors. length > 0){
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    // check if user email exists in db
    User.findOne({ email: req.body.email })
    .then(user => {
      if(user){
        req.flash('errorMsg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        };

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if(err){
              throw err;
            }
            newUser.password = hash;
            new User(newUser)
            .save()
            .then(user => {
              req.flash('successMsg', 'You are registered and can log in');
              res.redirect('/users/login');
            })
            .catch(err => console.log(err));
          });
        });
      }
    });

  }
});

module.exports = router;
