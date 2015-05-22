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
  //console.log(req.body);
  DataReceiver.create(req.body, function(err, dataReceiver) {
    if(err) { return handleError(res, err); }

    //processing correct axis
    //in case of closures
    var backbone = dataReceiver.pressureBackbone;
    var seat = dataReceiver.pressureSeat;
    var leftArmrest = dataReceiver.pressureLeftArmrest;
    var rightArmrest = dataReceiver.pressureRightArmrest;
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

    function almostEqual(value1, value2){
      return Math.abs(value1 - value2) <= 8;
    }
    function noPressure(value){
      return value >= 0 && value < 10;
    }
    function lightPressure(value){
      return value >= 10 && value < 30;
    }
    function aboveLightPressure(value){
      return value >= 30 && value < 50; 
    }
    function middlePressure(value){
      return value >= 50 && value < 70;
    }
    function strongPressure(value){
      return value >= 70 && value <= 100;
    }
    function validateBackbonePressure(backbonePressureArray){
      return (lightPressure(backbonePressureArray[0].value) || noPressure(backbonePressureArray[0].value)) && 
      (middlePressure(backbonePressureArray[1].value)) && 
      (middlePressure(backbonePressureArray[2].value) || aboveLightPressure(backbonePressureArray[2].value)) && 
      (lightPressure(backbonePressureArray[3].value)) && (aboveLightPressure(backbonePressureArray[4].value));
        /*(lightPressure(backbonePressureArray[0].value) || noPressure(backbonePressureArray[0].value)) &&
        (middlePressure(backbonePressureArray[1].value)) &&
        (middlePressure(backbonePressureArray[2].value) || aboveLightPressure(backbonePressureArray[2].value)) &&
        (lightPressure(backbonePressureArray[3].value)) &&
        (aboveLightPressure(backbonePressureArray[4].value))
        ;*/
    }
    function noBackbonePressure(backbonePressureArray){
      return 
        almostEqual(backbonePressureArray[0].value, 0) &&
        almostEqual(backbonePressureArray[1].value, 0) &&
        almostEqual(backbonePressureArray[2].value, 0) &&
        almostEqual(backbonePressureArray[3].value, 0) &&
        almostEqual(backbonePressureArray[4].value, 0);
    }
    function validateSeatPressure(seatPressureArray){
      console.log("seatPressureArray: " + seatPressureArray);
      return 
        (almostEqual(seatPressureArray[0].value, seatPressureArray[1].value) && 
         strongPressure(seatPressureArray[0].value, seatPressureArray[1].value)) &&
        (almostEqual(seatPressureArray[2].value, seatPressureArray[3].value) &&
          middlePressure(seatPressureArray[2].value, seatPressureArray[3].value));
    }
    function validateArmrestPressure(leftArmrestArray, rightArmrestArray){
      console.log("leftArmrestArray: " + leftArmrestArray);
      console.log("rightArmrestArray: " + rightArmrestArray);
      return 
        (almostEqual(leftArmrestArray[0].value, rightArmrestArray[0].value));
    }
    function validateData(receivedDataObject){
      //console.log("Data from validateData: " + receivedDataObject);
      //console.log("One of the objects: " + receivedDataObject.pressureBackbone[0]);
      //console.log("One of the values: " + receivedDataObject.pressureBackbone[0].value);
      return 
        validateBackbonePressure(receivedDataObject.pressureBackbone) &&
        validateSeatPressure(receivedDataObject.pressureSeat) &&
        validateArmrestPressure(receivedDataObject.pressureLeftArmrest, receivedDataObject.pressureRightArmrest);
    }

    //var correct = validateData(dataReceiver);
    //var correctBackbonePos = 
    /*var backbonePressureArray = dataReceiver.pressureBackbone;
    console.log("here!!!!!");
    console.log("Correct position checker: " + (lightPressure(backbonePressureArray[0].value) || noPressure(backbonePressureArray[0].value)) &&
        (middlePressure(backbonePressureArray[1].value)) &&
        (middlePressure(backbonePressureArray[2].value) || aboveLightPressure(backbonePressureArray[2].value)) &&
        (lightPressure(backbonePressureArray[3].value)) &&
        (aboveLightPressure(backbonePressureArray[4].value)));
    var statement = (lightPressure(backbonePressureArray[0].value) || noPressure(backbonePressureArray[0].value)) && (middlePressure(backbonePressureArray[1].value)) && (middlePressure(backbonePressureArray[2].value) || aboveLightPressure(backbonePressureArray[2].value)) && (lightPressure(backbonePressureArray[3].value)) && (aboveLightPressure(backbonePressureArray[4].value));
    console.log("Position checker one string: ");
    console.log(statement);
    console.log("IT WAS STATEMENT");
    var statementFromFunction = validateBackbonePressure(dataReceiver.pressureBackbone);
    console.log(statementFromFunction);
    console.log("IT WAS STATEMENT FROM FUNCTION");*/

    var correctBackbonePos = validateBackbonePressure(dataReceiver.pressureBackbone);
    var correctSeatPos = validateSeatPressure(dataReceiver.pressureSeat);
    var correctArmrestPos = validateArmrestPressure(dataReceiver.pressureLeftArmrest, dataReceiver.pressureRightArmrest);

    var correctPosition = correctBackbonePos && correctSeatPos && correctArmrestPos;

    console.log("Correct position : ");
    console.log(correctPosition);
    

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