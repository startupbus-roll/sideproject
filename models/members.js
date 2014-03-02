var DB = require('../lib/database').DB
var members = DB.collection('members')
var debug = require('debug')('members');
var uuid = require('uuid').v4;

function verify_member (member, callback) {
    var verification = {};
    if (!member.name)
        verification.reason = 'Please specify a name.';
    if (!member.email)
        verification.reason = 'Please provide an email address';

    if (verification.reason)
        verification.invalid = true;
    return callback(null, verification);
}

members.findById = function (id, callback) {
    debug('findById:', id);
    members.findOne({id: id}, function (err, member) {
        // console.log('member:' + JSON.stringify(member));
        // delete member._id;
        if (member && member._id)
            delete member._id;
        callback(err, member);
    });
}

members.findByEmail = function (email, callback) {
    members.findOne({email: email}, function (err, member) {
        console.log('member:' + JSON.stringify(member));
    });
};

members.create = function (member, callback) {

    console.log(typeof member, member);

    member = _.defaults(
        {id: uuid()},
        member, 
        {
        fullName: null,
        shortBio: null,
        fullBio: null,
        picture: null,
        links: [],
        website: null,
        projects: [], // array of project document _ids
        airline: null // verify airline
    });

    console.log(typeof member, member);

    verify_member(member, function (err, verification) {
        console.log('verified');
        if (verification.invalid)
            return callback(new Error(verification.reason));
        members.insert(member, {safe: true}, function (err, member) {
            console.log(member);
            callback(err, member[0])
        });
    });

}

module.exports = members;
