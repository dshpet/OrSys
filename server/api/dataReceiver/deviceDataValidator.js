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
module.exports = {
    almostEqual: function(value1, value2){
      return Math.abs(value1 - value2) <= 8;
    },
    noPressure: function (value){
      return value >= 0 && value < 10;
    },
    lightPressure: function (value){
      return value >= 10 && value < 30;
    },
    aboveLightPressure: function (value){
      return value >= 30 && value < 50; 
    },
    middlePressure: function (value){
      return value >= 50 && value < 70;
    },
    strongPressure: function (value){
      return value >= 70 && value <= 100;
    },
    validateBackbonePressure: function (backbonePressureArray){
      return (lightPressure(backbonePressureArray[0].value) || noPressure(backbonePressureArray[0].value)) && 
      (middlePressure(backbonePressureArray[1].value)) && 
      (middlePressure(backbonePressureArray[2].value) || aboveLightPressure(backbonePressureArray[2].value)) && 
      (lightPressure(backbonePressureArray[3].value)) && 
      (aboveLightPressure(backbonePressureArray[4].value));
    },
    noBackbonePressure: function (backbonePressureArray){
      return 
        almostEqual(backbonePressureArray[0].value, 0) &&
        almostEqual(backbonePressureArray[1].value, 0) &&
        almostEqual(backbonePressureArray[2].value, 0) &&
        almostEqual(backbonePressureArray[3].value, 0) &&
        almostEqual(backbonePressureArray[4].value, 0);
    },
    validateSeatPressure: function (seatPressureArray){
      return 
        (almostEqual(seatPressureArray[0].value, seatPressureArray[1].value) && 
         strongPressure(seatPressureArray[0].value, seatPressureArray[1].value)) &&
        (almostEqual(seatPressureArray[2].value, seatPressureArray[3].value) &&
          middlePressure(seatPressureArray[2].value, seatPressureArray[3].value));
    },
    validateArmrestPressure: function (leftArmrestArray, rightArmrestArray){
      return (almostEqual(leftArmrestArray[0].value, rightArmrestArray[0].value));
    },
    validateData: function (receivedDataObject){
      //objects are needed for correct sync
      var correctBackbonePos = validateBackbonePressure(dataReceiver.pressureBackbone);
      var correctSeatPos = validateSeatPressure(dataReceiver.pressureSeat);
      var correctArmrestPos = validateArmrestPressure(dataReceiver.pressureLeftArmrest, dataReceiver.pressureRightArmrest);

      return correctBackbonePos && correctSeatPos && correctArmrestPos;
    }
};