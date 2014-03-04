var DB = require('../lib/database').DB
var sponsorships = DB.collection('sponsorships')
var debug = require('debug')('sponsorships')
var _ = require('underscore');

sponsorships.ensureIndex({sponsor: 1, sponsored: 1}, {unique: true}, function (err) { });

function verify_sponsorship (sponsorship, callback) {
    var verification = {};
    if (!sponsorship.sponsor)
        verification.reason = 'Please specify a sponsor.';
    if (!sponsorship.sponsored)
        verification.reason = 'Please specify a member to sponsor.';

    if (verification.reason)
        verification.invalid = true;
    return callback(null, verification);
}

sponsorships.findById = function (id, callback) {
    debug('findById:', id)    
};

sponsorships.findBySponsor = function (employee, callback) {
    sponsorships.find({sponsor: employee.email}).toArray(function (err, sponsorships) {
        if (err)
            return callback(err);
        else
            return callback(null, sponsorships);
    });
};

sponsorships.create = function (sponsorship, callback) {

    sponsorship = _.defaults(sponsorship, {

    });

    console.log(sponsorship);

    verify_sponsorship(sponsorship, function (err, verification) {
        console.log('verifying');
        if (verification.invalid)
            return callback(new Error(verification.reason));
        sponsorships.insert(sponsorship, {safe:true}, function (err, sponsorship) {
            return callback(err, sponsorship && sponsorship[0]);
        });
    });

};

module.exports = sponsorships;
