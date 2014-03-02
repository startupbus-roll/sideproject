
// for the various types of airlines
var util = require('util');
var dateformat = require('dateformat');

var Source = function (name) {

};

Source.prototype = {

	search: function () {
		throw 'unimplemented';
	}

};

var Delta = function () { };
util.inherits(Source, Delta);

Delta.search = function (source, dest, depart) {

	

};

exports.delta = new Delta();
exports.aa    = new AA();
