'use strict';

var _ = require('lodash');
var DataReceiver = require('./dataReceiver.model');

// Get list of dataReceivers
exports.index = function(req, res) {
  console.log("Index GET dataReceiver");
  DataReceiver.find(function (err, dataReceivers) {
    if(err) { return handleError(res, err); }
    return res.json(200, dataReceivers);
  });
};

// Get a single dataReceiver
exports.show = function(req, res) {
  DataReceiver.findById(req.params.id, function (err, dataReceiver) {
    if(err) { return handleError(res, err); }
    if(!dataReceiver) { return res.send(404); }
    return res.json(dataReceiver);
  });
};

// Creates a new dataReceiver in the DB.
exports.create = function(req, res) {
  console.log(req.body);
  DataReceiver.create(req.body, function(err, dataReceiver) {
    if(err) { return handleError(res, err); }

    //processing correct axis
    //in case of closures
    var backbone = dataReceiver.pressureBackbone;
    var seat = dataReceiver.pressureSeat;
    var leftArmrest = dataReceiver.pressureLeftArmrest;
    var rightArmrest = dataReceiver.pressureRightArmrest;

    var neckInRightPosition = true;
    var backboneInRightPosition = true;
    var leftArmrestInRightPosition = true;
    var rightArmrestInRightPosition = true;

    /*
    CORRECT BACKBONE POSITION IS CONSIDERED LIKE THIS
    from neck to bottom pressure points
    0 -> light pressure (20, 40) / no pressure (0)
    1 -> middle pressure (40, 75)
    2 -> middle pressure (40, 60) / below middle pressure (30, 50)
    3 -> light pressure (20, 40)
    4 -> above light pressure (30, 50)

    CORRECT SEAT POSITION IS CONSIDERED LIKE THIS
    0, 1 - back part; left, right
    2, 3 - right part; left, right
    
    0 = 1 -> strong pressure (above 60)
    2 = 3 -> middle pressure (40, 75)

    CORRECT ARMREST POSITIONS ARE CONSIDERED LIKE THIS
    leftArmrest = rightArmrest
    --------------
    IF BACKBONE OVERALL PRESSURE = 0
    CORRECT SEAT POSITION IS CONSIDERED LIKE THIS
    0, 1 - back part; left, right
    2, 3 - right part; left, right
    
    0 = 1 -> strong pressure (above 60)
    2 = 3 -> strong pressure (40, 75)

    OTHERWISE PERSON IS SITTING WRONGLY
    */

    _.forEach(backbone, function(val, key){
      //considering values from neck to bottom


    });

    return res.json(201, dataReceiver);
  });
};

// Updates an existing dataReceiver in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DataReceiver.findById(req.params.id, function (err, dataReceiver) {
    if (err) { return handleError(res, err); }
    if(!dataReceiver) { return res.send(404); }
    var updated = _.merge(dataReceiver, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, dataReceiver);
    });
  });
};

// Deletes a dataReceiver from the DB.
exports.destroy = function(req, res) {
  DataReceiver.findById(req.params.id, function (err, dataReceiver) {
    if(err) { return handleError(res, err); }
    if(!dataReceiver) { return res.send(404); }
    dataReceiver.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(res.body);
  console.log(err);
  return res.send(500, err);
}