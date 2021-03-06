var fs = require('fs');
var models = require('../models');
var uuid = require('uuid').v4;

// console.log(uuid());

models.flights.remove({stops: 0}, function () {


var data = fs.readFileSync('flights.data', {encoding: 'utf-8'});

data = data.replace(/\*/g, '');
var lines = data.split('\n');


function random_int (max) { 
	return Math.floor(Math.random() * max);
}

function random_list(iter, num) {
	var m = random_int(num);
	var p = [];
	for (var i = 0; i < m; i++) {
		p.push(iter(i));
	}
	return p;
}

var p = [];
lines.forEach(function (line) {

	var row = line.split(' ').filter(function (x) { return x; });

	row = {
		number: row[1],
		from: row[2],
		to: row[3],
		depart: row[4],
		arrive: row[5],
		capacity: row[6]
	};

	if (row.from == 'DFW' && row.to == 'LGA')  {
		// console.log(row.depart);
		// console.log(row.depart.slice(-1));
		// console.log(row.depart.slice(-3, -1));
		// console.log(row.depart.slice(0, -3));

		var h  = parseInt(row.depart.slice(0, -3), 10);
		var m  = parseInt(row.depart.slice(-3, -1), 10);
		var ap = row.depart.slice(-1) == 'A';
		h = h + (ap ? 0 : 12);
		var depart = new Date(2014, 2, 5, h, m);

		var h  = parseInt(row.arrive.slice(0, -3), 10);
		var m  = parseInt(row.arrive.slice(-3, -1), 10);
		var ap = row.arrive.slice(-1) == 'A';
		h = h + (ap ? 0 : 12);
		var arrive = new Date(2014, 2, 5, h, m);
		// console.log(h + (ap ? 0 : 12), m, ap);

		var c = parseInt(row.capacity, 10);

		// console.log();

		p.push(
			{

				id: uuid(),

				capacity: c,

				available: random_int(15),

				listed: random_list(function () { return Math.random() < 0.6 ? 'friend' : 'family'; }, 10),

				number: row.number,

				stops: 0,

				segments: [{
					from: row.from,
					to: row.to,
					depart: depart,
					arrive: arrive,
		
					capacity: c,
		
					stops: 0
		
				}]
			});
	}

});
console.log(JSON.stringify(p));


});