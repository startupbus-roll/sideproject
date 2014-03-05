
var DB = require('../lib/database').DB
var flights = DB.collection('flights')

var debug = require('debug')('flights');
var uuid = require('uuid').v4;

flights.findById = function (id, callback) {
    debug('findById:', id);
    members.findOne({id: id}, function (err, member) {
        if (member && member._id)
            delete member._id;
        callback(err, member);
    });
};

flights.create = function (flight, callback) {

	

};

flights.trip = {

	id: '3c11ebf2-9376-4f7f-9aa0-1b62f0c71ba8',

	airline: 'AA',

	from: 'DFW',
	to: 'LGA',

	segments: [
		{

			depart: '2014-03-05T18:06',
			arrive: '2014-03-05T20:00',

			from: 'DFW',
			to: 'LGA',

			flight_number: '123'

		}
	],

	capacity:  160,
	available:  20,

	listed: []

};

function book (flight) {
	// go look up the flight & update the booked
	// sort the list
}

function list (flight, employee) {

}

function list (flight, member) {

}

function routes () {
	// 
	return {
		AA: {
			DFW: ['LGA']
		}
	};
}

module.exports = flights;
