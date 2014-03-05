var DB = require('../lib/database').DB
var listings = DB.collection('listings')
var debug = require('debug')('listings')
var _        = require('underscore');
    _.str    = require('underscore.string');
var xPassword = require('password-generator');
var bcrypt = require('bcrypt');

listings.ensureIndex({email: 1}, {unique: true, dropDups: true}, function () { });

exports.last = null;

function verify_listing (listing, callback) {
    var verification = {};
    if (!listing.name)
        verification.reason = 'Please specify a name.';
    else if (!listing.airline)
        verification.reason = 'Please specify an airline.';
    else if (!listing.email)
        verification.reason = 'Please provide an email address';

    if (verification.reason)
        verification.invalid = true;
    return callback(null, verification);
}

listings.findById = function (id, callback) {
    debug('findById:', id)    
}

listings.findByUser = function (userid, callback) {
    listings.find({user_id: userid}).toArray(callback);
};

listings.findByEmail = function (email, callback) {
    listings.findOne({email: email}, function (err, listing) {
        if (err)
            return callback(err);
        else
            return callback(null, listing);
    });
};

function generate_password (callback) {

    var pw = createPassword();
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err);
        bcrypt.hash(pw, salt, function (err, hash) {
            if (err)
                return callback(err);
            return callback(null, {password: pw, hash: hash});
        });
    });
}

listings.create = function (listing, callback) {

    listing = listing || {};
    // callback(null, {});

    listing = _.defaults(listing, {

    });


    exports.last = listing;
    console.log('inserting:' +JSON.stringify(listing));

    listings.insert(listing, {safe: true}, function (err, listing) {
        callback(err, listing);
    });

}

module.exports = listings;
