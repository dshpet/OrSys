/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DataReceiver = require('./dataReceiver.model');

exports.register = function(socket) {
  DataReceiver.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DataReceiver.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('dataReceiver:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('dataReceiver:remove', doc);
}