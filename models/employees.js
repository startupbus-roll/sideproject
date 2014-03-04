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

employees.findByEmail = function (email, callback) {
    employees.findOne({email: email}, function (err, employee) {
        if (err)
            return callback(err);
        else
            return callback(null, employee);
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

employees.create = function (employee, callback) {


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


    verify_employee(employee, function (err, verification) {
        if (verification.invalid)
            return callback(new Error(verification.reason));
        generate_password(function (err, password_info) {
            if (err)
                return callback(err);

            employee.password = password_info.hash;
            employees.insert(employee, {safe: true}, function (err, employee) {
                // if (err)
                //     console.log(err.message, err.stack);
                if (err && err.code == 11000)
                    err = new Error('That email address has already registered');
                if (err)
                    return callback(err);
                employee = employee[0];
                employee.password = password_info.password;
                // console.log(employee);
                callback(err, employee);
            });

        });
    });

}

module.exports = employees;
