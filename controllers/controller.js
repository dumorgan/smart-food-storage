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

  console.log(req.body);

  var user = new User(email,password);
  user.save(function(success,idUser) {
    res.json({"success":success,"idUser":idUser});
  });
});

/*************************************************************************
                      SCALE RELATED ROUTES
*************************************************************************/
router.post('/scales/add-new', function(req, res, next) {

    var idUser = req.body.idUser;
    var mac = req.body.mac;

    console.log("Adding scale to user " + idUser + " with MAC " + mac);

    var scale = new Scale(mac);
    scale.createNew(idUser,function(success,idScale) {
      res.json({"sucess":success,"idScale":idScale});
    });
});

/*************************************************************************
                      PRODUCT RELATED ROUTES
*************************************************************************/
router.post('/products/add-new', function(req, res, next) {
  var name = req.body.name;
  var idUser = req.body.idUser;

  console.log("Adding product " + " to user " + idUser)
  console.log(req.body);

  var product = new Product(name);
  product.save(idUser, function(success) {
    res.json({"success": success});
  })
})

module.exports = router
