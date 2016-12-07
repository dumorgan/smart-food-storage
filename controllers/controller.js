var express = require('express');
var User = require('./../models/user');
var Product = require('./../models/product');
var Scale = require('./../models/scale');
var Shipment = require('./../models/shipment');
var path = require('path');

var bodyParser = require('body-parser');

var router = express.Router();

router.get('/',function(req, res, next) {
  res.render('./../index.html')
})

/*************************************************************************
                      USER RELATED ROUTES
*************************************************************************/
//creates a user
/**
params: email, password
returns: success, idUser, authToken
*/
router.post('/signup', function(req, res, next) {
  const results = [];

  //Grab data from http request
  const email = req.body.email;
  const password = req.body.password;

  console.log(email,password)

  var user = new User(email,password);
  user.save(function(success,idUser,token_val) {
    if (success) {
      console.log("New user " + idUser + " just signed up!");
      res.json({"success":success,"idUser":idUser,"authToken":token_val});
    }
    else {
      res.json({"success":success})
    }
  });
});

//logs into the Server
/**
params: email, password
returns: success, idUser, authToken
*/
router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;

  console.log(email,password);

  var user = new User(email,password);
  user.login(function(success,idUser,authToken) {
    console.log("asdada")
    if (success) {
      console.log("User " + idUser + " logged in");
      res.json({"success":success,"idUser":idUser,"authToken":authToken})
    }
    else {
      console.log("Some user failed to login");
      res.json({"success":false,"idUser":null,"authToken":null})
    }
  });
});

router.post('/users/products/get-amount', function(req, res, next) {
  var idUser = req.body.idUser;
  var authToken = req.body.authToken;

  console.log("Getting available products from user " + idUser);
  var user = new User(idUser);
  var product = new Product();

  user.authenticate(authToken, function(successfulAuth) {
    if (successfulAuth) {
      user.getProducts(function(err, result) {
        if (err) {
          console.log(err);
          res.json({error:err});
        }
        else {
          res.json(result);
        }
      });
    }
    else {
      res.json({"success": false, "error": "failed auth"});
    }
  });
})

/*************************************************************************
                      SCALE RELATED ROUTES
*************************************************************************/
/**
params: idUser, authToken, mac
returns: success, idScale
*/
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
      res.json({"success":false})
    }
  });
});

//This route is for getting all scales from a given user
/**
params: idUser, authToken, mac
returns: scales (array with mac and idScale)
*/
router.post('/scales/get', function(req, res, next) {

  var idUser = req.body.idUser;
  var authToken = req.body.authToken;
  var user = new User(idUser);

  user.authenticate(authToken, function (successfulAuth) {
    if (successfulAuth) {
      console.log("Getting scales from user " + idUser);
      var scale = new Scale();

      scale.getByUser(idUser, function(scales) {
        if (scales.length > 0) {
          res.json(scales);
        }
        else {
          res.json({"scales":null})
        }
      });
    }
    else {
      res.json({"success":false});
    }
  });
});


/*************************************************************************
                      PRODUCT RELATED ROUTES
*************************************************************************/
/**
params: idUser, authToken, name (name of the products)
returns: success
*/
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
        console.log("Just added a new product to user " + idUser);
        res.json({"success":true});
      })
    }
    else {
      res.json({"success":false,"authentication":"failed"})
    }
  });
});


/**
params: idUser
authToken
productName (name of the product)
name - name of the shipment (can be different than that of the product)
expirationDate - string in the format yy-mm-dd hh:mm:ss
totalPurchased
idScale

returns: success, idShipment
*/
router.post('/products/add-shipment', function(req, res, next) {

  var name = req.body.name;
  var productName = req.body.productName;
  var idUser = req.body.idUser;
  var authToken = req.body.authToken;
  var expirationDate = req.body.expirationDate;
  var totalPurchased = req.body.totalPurchased;
  var mac = req.body.mac;

  console.log(req.body);

  console.log("Adding shipment to user :" + idUser + " product: " + productName);

  var shipment = new Shipment(name,expirationDate);
  var user = new User(idUser);

  user.authenticate(authToken, function(successfulAuth) {
    if (successfulAuth) {
      shipment.save(mac,name,productName,idUser,function(success,idShipment) {
        if (success) {
          console.log("Aqui")
          res.json({"success":true,"idShipment":idShipment});
        }
        else {
          console.log("Nao la")
          res.json({"success":false,"idShipment":idShipment});
        }
      });
    }
    else {
      console.log("Erro auth");
      res.json({"success":false,"authentication":"failed"})
    }
  });
});


/*************************************************************************
                      SHIPMENT RELATED ROUTES
*************************************************************************/


router.post('products/bind-to-scale', function (req, res, next) {

});

module.exports = router
