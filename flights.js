
//

var routes = exports.routes = {

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

}

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
