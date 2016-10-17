var express = require('express');
var User = require('./../models/user')
var Product = require('./../models/product')
var Scale = require('./../models/scale')
const path = require('path');

const bodyParser = require('body-parser')

var router = express.Router();


/*************************************************************************
                      USER RELATED ROUTES
*************************************************************************/
//creates a user
router.post('/signup', function(req, res, next) {
  const results = [];

  //Grab data from http request
  const email = req.body.email;
  const password = req.body.password;

  var user = new User(email,password);
  user.save(function(success,idUser,token_val) {
    if (success) {
      res.json({"success":success,"idUser":idUser,"authToken":token_val});
    }
    else {
      res.json({"success":success})
    }
  });
});

//logs into the Server
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  var user = new User(email,password);
  user.login(function(success,idUser,authToken) {
    if (success) {
      res.json({"success":success,"idUser":idUser,"authToken":authToken})
    }
    else {
      res.json({"success":false,"idUser":null,"authToken":null})
    }
  });
});

/*************************************************************************
                      SCALE RELATED ROUTES
*************************************************************************/
router.post('/scales/add-new', function(req, res, next) {

  var idUser = req.body.idUser;
  var mac = req.body.mac;
  var authToken = req.body.authToken;

  var user = new User(idUser);

  user.authenticate(authToken, function(successfulAuth) {
    if (successfulAuth) {
      console.log("Adding scale to user " + idUser + " with MAC " + mac);

      var scale = new Scale(mac);
      scale.createNew(idUser,function(success,idScale) {
        res.json({"sucess":true,"idScale":idScale});
      });
    }
    else {
      res.json({"success":true,"idScale":null})
    }
  });
});


/*************************************************************************
                      PRODUCT RELATED ROUTES
*************************************************************************/
router.post('/products/add-new', function(req, res, next) {
  var name = req.body.name;
  var idUser = req.body.idUser;
  var authToken = req.body.authToken;

  var user = new User(idUser);

  user.authenticate(authToken, function(successfulAuth) {
    if (successfulAuth) {
      console.log("Adding product " + " to user " + idUser)
      var product = new Product(name);
      product.save(idUser, function(success) {
        res.json({"success": success});
      })
    }
    else {
      res.json({"success":false,"authentication":"failed"})
    }
  });

})

router.post('products/bind-to-scale', function (req, res, next) {

});

module.exports = router
