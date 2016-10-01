const express = require('express');
const pg = require('pg');
const path = require('path');
const connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
const bodyParser = require('body-parser')
const router = express.Router();


//creates a user
router.post('/users/create', function(req, res, next) {
  const results = [];

  //Grab data from http request
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  console.log(req.body);
  console.log(username);
  pg.connect(connectionString, function(err, client, done) {
    //Handle connection errors
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({sucess:false, data:err});
    }
    //SQL Query -> Insert user
    client.query("INSERT INTO \"Users\"(username,email,password) VALUES ($1,$2,$3)",[username,email,password]);
    //Select data
    const query = client.query("SELECT * FROM \"Users\" ORDER BY \"idUser\"");
    query.on('row', function(row) {
      results.push(row);
    });
    //After all data is returned close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
})

module.exports = router;
