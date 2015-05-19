'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DataReceiverSchema = new Schema({
  id: String,
  pressureBackbone: [Number],
  pressureSeat: [Number],
  pressureLeftArmrest:[Number],
  pressureRightArmrest:[Number]
});

module.exports = mongoose.model('DataReceiver', DataReceiverSchema);