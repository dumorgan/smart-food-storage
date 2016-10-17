var express = require('express');
var Scale = require('./../models/scale')
const path = require('path');

const bodyParser = require('body-parser')

var mcuRouter = express.Router();

mcuRouter.post('/scales/add-measure', function(req, res, next) {
  var mac = req.body.mac;
  var amount = req.body.amount;
  var timestamp = req.body.timestamp;

  console.log("Adding measure to scale " + mac + " on " + timestamp)

  var scale = new Scale(mac);
  scale.addMeasure(amount, timestamp, function(success,idMeasure) {
    res.json({"success":success,"idMeasure":idMeasure});
  });
});

module.exports = mcuRouter;
