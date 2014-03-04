var DB = require('../lib/database').DB
var employees = DB.collection('employees')
var debug = require('debug')('employees')
var _        = require('underscore');
    _.str    = require('underscore.string');
var createPassword = require('password-generator');
var bcrypt = require('bcrypt');

employees.ensureIndex({email: 1}, {unique: true, dropDups: true}, function () { });

function verify_employee (employee, callback) {
    var verification = {};
    if (!employee.name)
        verification.reason = 'Please specify a name.';
    else if (!employee.airline)
        verification.reason = 'Please specify an airline.';
    else if (!employee.email)
        verification.reason = 'Please provide an email address';

    if (verification.reason)
        verification.invalid = true;
    return callback(null, verification);
}

employees.findById = function (id, callback) {
    debug('findById:', id)    
}

function generate_password (callback) {

    var pw = createPassword();
    bcrypt.genSalt(function (err, salt) {
        if (err)
            return callback(err);
        bcrypt.hash(pw, function (err, hash) {
            if (err)
                return callback(err);
            return callback(null, {password: pw, hash: hash});
        });
    });
}

employees.create = function (employee, callback) {

    console.log(typeof employee, employee);

    // var password = password_generator.password();
    // console.log(password);

    employee = _.defaults(employee, {
        fullName: null,
        shortBio: null,
        fullBio: null,
        picture: null,
        links: [],
        website: null,
        projects: [], // array of project document _ids
        airline: null,
    });

    console.log(typeof employee, employee);

    verify_employee(employee, function (err, verification) {
        console.log('verified');
        if (verification.invalid)
            return callback(new Error(verification.reason));
        generate_password(function (err, password_info) {
            if (err)
                return callback(err);

            employee.password = password_info.hash;
            employees.insert(employee, {safe: true}, function (err, employee) {
                if (err)
                    console.log(err.message, err.stack);
                if (err && err.code == 11000)
                    err = new Error('That email address has already registered');
                if (err)
                    return callback(err);
                console.log(employee);
                employee = employee[0];
                employee.password = password_info.pw;
                callback(err, employee);
            });

        });
    });

}

module.exports = employees;
