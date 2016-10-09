var express = require('express');
var User = require('./../models/user')
const path = require('path');

const bodyParser = require('body-parser')

var router = express.Router();

//creates a user
router.post('/signup', function(req, res, next) {
  const results = [];

  //Grab data from http request
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body);

  var user = new User(email,password);
  var sucess = user.save();
  return res.json({'sucess': sucess.toString()});
})

module.exports = router
