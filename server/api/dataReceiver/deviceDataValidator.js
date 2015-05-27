'use strict';
var Q = require('q'); //for async calls

var almostEqual = function(value1, value2){
	return Math.abs(value1 - value2) <= 8;
};
var noPressure = function (value){
	return value >= 0 && value < 10;
};
var lightPressure = function (value){
	return value >= 10 && value < 30;
};
var aboveLightPressure = function (value){
	return value >= 30 && value < 50; 
};
var middlePressure = function (value){
	return value >= 50 && value < 70;
};
var strongPressure = function (value){
	return value >= 70 && value <= 100;
};
var validateBackbonePressure = function (backbonePressureArray){
	return (lightPressure(backbonePressureArray[0].value) || noPressure(backbonePressureArray[0].value)) && 
	(middlePressure(backbonePressureArray[1].value)) && 
	(middlePressure(backbonePressureArray[2].value) || aboveLightPressure(backbonePressureArray[2].value)) && 
	(lightPressure(backbonePressureArray[3].value)) && 
	(aboveLightPressure(backbonePressureArray[4].value));
};
var noBackbonePressure = function (backbonePressureArray){
    var almostEqual0 = almostEqual(backbonePressureArray[0].value, 0);
    var almostEqual1 = almostEqual(backbonePressureArray[1].value, 0);
    var almostEqual2 = almostEqual(backbonePressureArray[2].value, 0);
    var almostEqual3 = almostEqual(backbonePressureArray[3].value, 0);
    var almostEqual4 = almostEqual(backbonePressureArray[4].value, 0);
	return almostEqual0 && almostEqual1 && almostEqual2 && almostEqual3 && almostEqual4;
	
};
var validateSeatPressure = function (seatPressureArray){
    var almostEqual0and1 = almostEqual(seatPressureArray[0].value, seatPressureArray[1].value);
    var almostEqual2and3 = almostEqual(seatPressureArray[2].value, seatPressureArray[3].value);

    var firstCondition = almostEqual0and1 && strongPressure(seatPressureArray[0].value) && strongPressure(seatPressureArray[1].value);
    var secondCondition = almostEqual2and3 && middlePressure(seatPressureArray[2].value) && middlePressure(seatPressureArray[3].value);

    var result = firstCondition && secondCondition;
    console.log("Seat full bool: " +  result);

	return result;
};
var validateArmrestPressure = function (leftArmrestArray, rightArmrestArray){
	return (almostEqual(leftArmrestArray[0].value, rightArmrestArray[0].value));
};
var validateData = function (receivedDataObject){
      //objects are needed for correct sync
      var correctBackbonePos = validateBackbonePressure(receivedDataObject.pressureBackbone);
      var correctSeatPos = validateSeatPressure(receivedDataObject.pressureSeat);
      var correctArmrestPos = validateArmrestPressure(receivedDataObject.pressureLeftArmrest, receivedDataObject.pressureRightArmrest);

      return correctBackbonePos && correctSeatPos && correctArmrestPos;
 };

  module.exports = {
	//processing correct axis

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

    almostEqual: almostEqual,
    noPressure: noPressure,
    lightPressure: lightPressure,
    aboveLightPressure: aboveLightPressure,
    middlePressure: middlePressure,
    strongPressure: strongPressure,
    validateBackbonePressure: validateBackbonePressure,
    noBackbonePressure: noBackbonePressure,
    validateSeatPressure: validateSeatPressure,
    validateArmrestPressure: validateArmrestPressure,
    validateData: validateData,
    getModule: function (req, res) {
    	return res.json(module.exports);
    }
};