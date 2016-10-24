
"use strict";

var connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
var pg = require('pg');

var Product = class Product {

  constructor(name) {
    this.name = name;
  }

save(idUser, callback) {
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

  getId(idUser,callback) {
    var name = this.name;

    pg.connect(connectionString, function(err, client, done) {
      if (err) {
        done();
        console.log(err);
        callback(err);
      }
      client.query("SELECT \"idProduct\" FROM \"Products\" WHERE name=$1 AND \"idUser\"=$2",[name,idUser], function(err, result) {
        if (err) {
          console.log(err);
          callback(err);
        }
        done();
        callback(result.rows[0].idProduct);
      });
    });
  }
}

module.exports = Product;
