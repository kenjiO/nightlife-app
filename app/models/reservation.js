'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Reservation = new Schema({
	'bar': {'type': String, 'required': true},
	'Date': {'type': Date, 'default': Date.now},
	'username': {'type': String, 'required': true}

});

module.exports = mongoose.model('Reservation', Reservation);
