
"use strict";

const connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
const pg = require('pg');

var Product = function(name) {
  this.name = name;
}

  //save a new product in the db
Product.prototype.save = function(idUser, callback) {
  var name = this.name;

  console.log("Adding new product " + name + " to user " + idUser);

  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      done();
      console.log(err);
      return res.status(500).json({sucess: false, data: err});
    }
    var query = "INSERT INTO \"Products\" (name,\"idUser\") VALUES ($1,$2)";
    client.query(query,[name,idUser], function(err, result) {
      if (err) {
        callback(false)
      }
      else {
        done();
        callback(true)
      }
    });
  });
}
 /*
  getProduct(name,idUser) {

    console.log("Retrieving product " + name + " from user " + idUser);

    pg.connect(connectionString, function(err, client done) {
      if (err) {
        done();
        console.log(err);
        return res.status(500).json({sucess:false}, data: err);
      }

      var query = "SELECT * FROM Products WHERE name=$1 AND idUser=$2";
      client.query(query,[this.name,this.idUser], function(err, result) {
        if (err) {
          return res.json({sucess:false});
        }
        done();
        return res.json({sucess:true});
      });
    });
  }
}
*/

module.exports = Product;
