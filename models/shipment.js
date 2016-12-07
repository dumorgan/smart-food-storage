"use strict";

var connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
var pg = require('pg');

var Product = require('./product');

var Shipment = class Shipment {

  constructor(name,expirationDate) {
    this.name = name;
    this.expirationDate = expirationDate;
  }

  save(mac,name,productName,idUser,callback) {
    var product = new Product(productName);
    var expirationDate = this.expirationDate;
    var name = this.name;

    product.getId(idUser, function(idProduct) {

      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          console.log(err);
          callback(err);
        }
        else {
          client.query('SELECT "idScale" FROM "Scales" WHERE mac=$1',[mac],function (err, result) {
            if (err) {
              console.log(err);
              callback(err);
            }
            else {
              var idScale = result.rows[0].idScale;
              console.log(idScale);
              var sqlQuery = "INSERT INTO \"Shipments\" (\"expirationDate\",\"idScale\",\"idProduct\",name) VALUES ($1,$2,$3,$4) RETURNING \"idShipment\""
              client.query(sqlQuery,[expirationDate,idScale,idProduct,name],function(err, result) {
                if (err) {
                  console.log(err);
                  callback(err);
                }
                else {
                  callback(true,result.rows[0].idShipment);
                }
              });
            }
          });
        }
      });
    });
  }
}

module.exports = Shipment;
