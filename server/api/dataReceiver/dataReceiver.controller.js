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
  DataReceiver.create(req.body, function(err, dataReceiver) {
    if(err) { return handleError(res, err); }

    var deviceDataValidator = require('./deviceDataValidator.js');   

    var correctBackbonePos = deviceDataValidator.validateBackbonePressure(dataReceiver.pressureBackbone);
    var correctSeatPos = deviceDataValidator.validateSeatPressure(dataReceiver.pressureSeat);
    var correctArmrestPos = deviceDataValidator.validateArmrestPressure(dataReceiver.pressureLeftArmrest, dataReceiver.pressureRightArmrest);
    var correctPosition = deviceDataValidator.validateData(dataReceiver);

    console.log("Correct position : ");
    console.log(correctPosition);

    console.log("Other correct positions: " + correctBackbonePos + correctSeatPos + correctArmrestPos);

    function notifyUser(user){
      //todo send notification to user;
    }
    if (!correctPosition) {
      notifyUser();
    }
    

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