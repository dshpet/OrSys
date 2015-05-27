'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DataReceiverSchema = new Schema({
  googleId: String,
  pressureBackbone: [Schema.Types.Mixed],
  pressureSeat: [Schema.Types.Mixed],
  pressureLeftArmrest:[Schema.Types.Mixed],
  pressureRightArmrest:[Schema.Types.Mixed],
  time: { type : Date, default: Date.now },
  correct: Boolean
});

module.exports = mongoose.model('DataReceiver', DataReceiverSchema);