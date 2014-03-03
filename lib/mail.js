

var nodemailer = require('nodemailer'),
	error = require('debug')('mail.error'),
	debug = require('debug')('mail');
	// config = require('./config');

var _transport;
function email () {

	this.__defineGetter__('transport', function () {
		if (!_transport)
			_transport = nodemailer.createTransport("SendGrid", {
				auth: {
					user: 'justrollout',
					pass: 'Just roll out 2014'
				}
			});
		return _transport;
	});

}

email.prototype = {

	send: function (options, callback) {

		var message = {
			subject: options.subject || 'DEBUG SUBJECT',
			text: options.text || 'DEBUG TEXT',
			from: options.from || config.mail.from,
			to: options.to || config.mail.to
		};
		console.log('sending:' + JSON.stringify(message));

		this.transport.sendMail(message, function (err) {
		    if (err){
		       	error('Error occured');
		        error(error.message);
		    }
		    else
			    debug('Message sent successfully!');
			callback(err);
		});

	}

};

var instance = new email();

module.exports = instance; //new email();

if (require.main == module) {
// {"subject":"FOO","text":"alert:BAR","from":"Monitoring Service <sojumu@yahoo-inc.com>","to":"DEBUG TO <sojumu@yahoo-inc.com>"}
	process.on('uncaughtException', function (err) {
	    console.log('uncaught:' + err);
	    console.log(err.stack);
	});

	require('async').each(
		require('../config').settings.emails,
		function (mail, callback) {
			instance.send({
				from: 'noreply@rollout.com',
				to: mail,
				subject: 'Hello',
				text: 'World' 
			},
			function (err) {
				if (err)
					return callback(err);
				debug('sent!');
				callback();
			});
		},
		function (err) {
			process.nextTick(process.exit);
		});
}


