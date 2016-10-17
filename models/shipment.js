"use strict";

const connectionString = "postgres://postgres:7921@localhost:5432/pi_db";
const pg = require('pg');

var Product = require('./product');

var Shipment = class Shipment {

  constructor(name,expirationDate) {
    this.name = name;
    this.expirationDate = expirationDate;
  }

  save(idScale,productName,idUser,callback) {
    var Product = new Product(productName);

    Product.getId(idUser, function(idProduct) {

      pg.connect(connectionString, function(err, client, done) {
        if (err) {
          callback(err);
        }
        var expirationDate = this.expirationDate;
        var name = this.name;
        var sqlQuery = "INSERT INTO \"Shipments\" (\"expirationDate\",\"idScale\",\"idProduct\",\"idUser\",name) VALUES ($1,$2,$3,$4,$5) RETURNING \"idShipment\""
        client.query(sqlQuery,[expirationDate,idScale,idProduct,idUser,name],function(err, result) {
          if (err) {
            callback(err);
          }
          callback(true,result.rows[0].idShipment);
        });
      });
    });
  }
}

module.exports = Shipment;
