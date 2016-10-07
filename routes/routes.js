const express = require('express');
const pg = require('pg');
const path = require('path');
const connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
const bodyParser = require('body-parser')
const router = express.Router();


//creates a user
router.post('/signup', function(req, res, next) {
  const results = [];

  //Grab data from http request
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body);
})

router.post('/login', function(req, res, next) {

  const email = req.body.email;
  const triedPassword = req.body.password;

  console.log(req.body);
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({sucess: false, data:err});
    }
    client.query("SELECT password,\"idUser\" FROM \"Users\" WHERE email=$1",[email], function(err, result) {
      if (err) {
        done();
        console.log(err);
      }
      done();
      if (triedPassword == result.rows[0].password) {
        return res.json({'success':true,'idUser':result.rows[0].idUser});
      }
      else {
        return res.json({'success':false});
      }
    });
  });
});

router.post('/products/add-new', function(req, res, next) {
  const name = req.body.name;
  const idUser = req.body.idUser;

  controller.addProduct(req.body.name,req.body.idUser);

});

module.exports = router;
