'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DataReceiverSchema = new Schema({
  id: String,
  pressureBackbone: [Schema.Types.Mixed],
  pressureSeat: [Schema.Types.Mixed],
  pressureLeftArmrest:[Schema.Types.Mixed],
  pressureRightArmrest:[Schema.Types.Mixed]
});

module.exports = mongoose.model('DataReceiver', DataReceiverSchema);