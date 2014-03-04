
//
// var segment = {};
// var leg = {};

// // {
// // 	cost: {},
// // 	source: null,
// // 	destination: null,
// // 	depart: null
// // };

var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var uuid = require('uuid').v4;

function random_code () {
	var code = '';
	for (var i = 0; i < 3; i++)
		code += alphabet[Math.floor(Math.random() * alphabet.length)];
	return code;
}

function random_int (max) { 
	return Math.floor(Math.random() * max);
}

function random_list (max) {
	var t = random_int(max);
	var p = [];
	for (var i = 0; i < t; i++)
		p.push(null);
	return p;
}

exports.fake = function (options, callback) {
	options.num |= 4;
	var trips = [], segments, soure, dest, depart;
	for (var i = 0; i < options.num; i++) {
		segments = [], k = random_int(2) + 1;
		for (j = 0; j < k; j++) {
			segments.push({
				source: random_code(),
				destination: random_code()
			});
		}
		trips.push({id: uuid(), available: random_int(15), listed: random_list(10), capacity: random_int(100)+60, segments: segments});
	}
	console.log(JSON.stringify(trips));
	return callback(null, trips);
};