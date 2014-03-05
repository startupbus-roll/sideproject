
//
// var segment = {};
// var leg = {};

// // {
// // 	cost: {},
// // 	source: null,
// // 	destination: null,
// // 	depart: null
// // };
var df = require('dateformat');
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

var data = [{"id":"dcd1309b-4c94-4f09-8f9f-2d4102fbe258","capacity":150,"available":14,"listed":["friend","family","friend","friend","friend"],"number":"1103","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T15:45:00.000Z","arrive":"2014-03-05T20:00:00.000Z","capacity":150,"stops":0}]},{"id":"375e6cbf-4fd0-4c51-a12e-0af646c718cd","capacity":150,"available":1,"listed":["family","family","friend","family","friend"],"number":"1111","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T18:10:00.000Z","arrive":"2014-03-05T22:30:00.000Z","capacity":150,"stops":0}]},{"id":"55f686d1-9fb7-4223-909c-bc98c1295781","capacity":150,"available":10,"listed":["friend","friend","friend","friend","friend"],"number":"1121","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T19:30:00.000Z","arrive":"2014-03-05T23:50:00.000Z","capacity":150,"stops":0}]},{"id":"cd7d6240-6cf1-4b2e-a044-97145fff5887","capacity":150,"available":4,"listed":["friend","family","friend","friend"],"number":"1131","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T20:15:00.000Z","arrive":"2014-03-06T00:40:00.000Z","capacity":150,"stops":0}]},{"id":"04c251d2-7af4-4166-872b-0cfb368f1fcb","capacity":150,"available":5,"listed":["family","family","friend","friend","friend"],"number":"1107","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T16:50:00.000Z","arrive":"2014-03-05T21:05:00.000Z","capacity":150,"stops":0}]},{"id":"2c85427b-33b4-48d7-95a1-0cec76adcb0d","capacity":150,"available":9,"listed":["friend","friend","friend","friend","family"],"number":"1139","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T21:10:00.000Z","arrive":"2014-03-06T01:35:00.000Z","capacity":150,"stops":0}]},{"id":"dfec2eab-ac87-425b-914c-51900d24366e","capacity":150,"available":14,"listed":["friend","friend","family","family"],"number":"1143","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T21:55:00.000Z","arrive":"2014-03-06T02:15:00.000Z","capacity":150,"stops":0}]},{"id":"e024e562-7c5b-4b1f-ba4b-c021277b6588","capacity":150,"available":6,"listed":["friend","family","friend","friend","friend","family","friend","friend","friend"],"number":"1145","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T22:45:00.000Z","arrive":"2014-03-06T03:00:00.000Z","capacity":150,"stops":0}]},{"id":"a625ead9-c358-4322-ab6d-a42ae58d03fa","capacity":150,"available":0,"listed":["friend","friend"],"number":"1151","stops":0,"segments":[{"from":"DFW","to":"LGA","depart":"2014-03-05T23:55:00.000Z","arrive":"2014-03-06T04:10:00.000Z","capacity":150,"stops":0}]}];
    // data = data.concat([{"id":"b5e7d49b-7f6b-4ca2-84c1-a0de311ad8c6","capacity":165,"available":1,"stops":0,"segments":[{"from":"DFW","to":"CLT","depart":"2014-03-05T22:55:00.000Z","arrive":"2014-03-06T02:15:00.000Z","capacity":165,"stops":0},{"from":"CLT","to":"EWR","depart":"2014-03-06T03:18:00.000Z","arrive":"2014-03-06T04:59:00.000Z","capacity":165,"stops":0}]},{"id":"6794547b-9f02-4778-b0b9-996d3ac032bd","capacity":76,"available":11,"stops":0,"segments":[{"from":"DFW","to":"ORD","depart":"2014-03-05T21:30:00.000Z","arrive":"2014-03-05T23:50:00.000Z","capacity":140,"stops":0},{"from":"ORD","to":"EWR","depart":"2014-03-06T00:35:00.000Z","arrive":"2014-03-06T03:30:00.000Z","capacity":76,"stops":0}]},{"id":"e68b2d70-89b5-4dec-9d6f-473a39a76c86","capacity":150,"available":11,"stops":0,"segments":[{"from":"DFW","to":"ORD","depart":"2014-03-05T21:30:00.000Z","arrive":"2014-03-05T23:50:00.000Z","capacity":140,"stops":0},{"from":"ORD","to":"LGA","depart":"2014-03-06T01:00:00.000Z","arrive":"2014-03-06T04:00:00.000Z","capacity":150,"stops":0}]},{"id":"0143a4aa-8adf-45f7-abd6-c5790ac0ad94","capacity":120,"available":3,"stops":0,"segments":[{"from":"DFW","to":"DCA","depart":"2014-03-05T22:00:00.000Z","arrive":"2014-03-06T01:40:00.000Z","capacity":150,"stops":0},{"from":"DCA","to":"LGA","depart":"2014-03-06T03:00:00.000Z","arrive":"2014-03-06T04:06:00.000Z","capacity":120,"stops":0}]}]);

data.forEach(function (datum) {
	datum.segments.forEach(function (segment) {
		segment.depart = new Date(segment.depart);
		segment.arrive = new Date(segment.arrive);
		segment.depart_string = df(segment.depart, 'h:MM tt');
		segment.arrive_string = df(segment.arrive, 'h:MM tt');
	});
	datum.from = datum.segments[0].from;
	datum.to = datum.segments.slice(-1)[0].to;
	datum.depart_string = datum.segments[0].depart_string;
	datum.arrive_string = datum.segments.slice(-1)[0].arrive_string;
	datum.stops = datum.segments.length - 1;
	// datum.listed = [];
	datum.day_string = df(datum.segments[0].depart, 'mmm d')
	// datum.number = 
	// console.log(datum.arrive_string);
});


exports.findById = function (id, callback) {
	for (var i = 0; i < data.length; i++) {
		if (data[i].id == id) {
			return callback(null, data[i]);
		}
	}
	return callback(new Error("no such trip"));
};

function find_trips () {

	models.flights.find({}).toArray(function (err, trips) {

		

	});

}

exports.fake = function (options, callback) {
	options.num |= 4;
	var trips = [], segments, soure, dest, depart;
	// for (var i = 0; i < options.num; i++) {
	// 	segments = [], k = random_int(2) + 1;
	// 	for (j = 0; j < k; j++) {
	// 		segments.push({
	// 			source: random_code(),
	// 			destination: random_code()
	// 		});
	// 	}
	// 	trips.push({id: uuid(), available: random_int(15), listed: random_list(10), capacity: random_int(100)+60, segments: segments});
	// }
	// console.log(JSON.stringify(data));
	return callback(null, data);
};