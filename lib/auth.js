var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var debug = require('debug')('auth')
var bcrypt = require("bcrypt");

var ObjectID = require('./database').Types.ObjectID
var users = require('../models/users')
var models = require('../models');

// Local Auth Strategy
// -- try and find user in users collection MongoDB

var strategyOptions = {
    usernameField: 'email',
    passwordField: 'password'
}

var strategyCallback = function (username, password, done) {

    debug('Looking for %s in DB.users...', username)
    
    users.findOne({ email: username }, function(err, user) {
        if (err) {
            debug.error(err)
            return done(err) 
        }
        if (!user) {
            debug('%s not found!', username)
            return done(null, false, { message: 'Incorrect username.' })
        }
        debug('Found:', user)        
        if (user.password !== password) {
            debug('Password %s invalid!', password)
            return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
    })

};

function employee_callback (email, password, done) {

    models.employees.findByEmail(email, function (err, employee) {

        if (err) {
            debug('err:'+err);
            return done(err);
        }

        if (!employee) {
            debug('user not found');
            return done(null, false, {message: 'Bad Username'});
        }

        // GIANT FUCKING BACK DOOR INTO THE SYSTEM BECAUSE LARA CANT REMEMBER HER PASSWD
        if (email == 'laras126@gmail.com' && password == 'stupid') {
            delete employee.password;
            return done(null, employee);
        }

        console.log('about to compare');
        bcrypt.compare(password, employee.password, function (err, match) {

            console.log('err:'+err);
            console.log('m:'+match);

            if (!match) {
                debug('compare:'+match);
                return done(null, false, {message: 'bad password'});
            }

            debug('compare:'+match);
            delete employee.password;
            return  done(null, employee);

        });

    });
}
function buddy_callback (email, password, done) {
    models.members.findByEmail(email, function (err, member) {

        console.log(err, member);

        if (err) {
            debug('err:'+err);
            return done(err);
        }

        if (!member) {
            debug('user not found');
            return done(null, false, {message: 'Bad Username'});
        }

        // GIANT FUCKING BACK DOOR INTO THE SYSTEM BECAUSE LARA CANT REMEMBER HER PASSWD
        if (email == 'rachel@gatorsdontbark.com' && password == 'stupid') {
            delete member.password;
            return done(null, member);
        }

        console.log('about to compare');
        bcrypt.compare(password, member.password, function (err, match) {

            console.log('err:'+err);
            console.log('m:'+match);

            if (!match) {
                debug('compare:'+match);
                return done(null, false, {message: 'bad password'});
            }

            debug('compare:'+match);
            delete member.password;
            return  done(null, member);

        });

    });
}

// Tell passport to use our auth strategy
var buddy_strategy = new LocalStrategy(strategyOptions, strategyCallback)
var employee_strategy = new LocalStrategy(strategyOptions, employee_callback)
passport.use(employee_strategy);

passport.serializeUser(function(user, done) {
    debug('serializeUser: ', user)
    done(null, user._id)
})

passport.deserializeUser(function(id, done) {
    debug('deserializeUser: ', id)
    users.findOne({ _id: ObjectID(id) }, function (err, user) {
        debug('found: ', user)
        done(err, user)
    })
})



function authenticate (options) {
    debug('authenticate', options);
    options = options || {}
    _.defaults(options, { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
    if (options.type == 'employee')
        passport.use(employee_strategy);
    if (options.type == 'buddy')
        passport.use(buddy_strategy);
    return passport.authenticate('local', options)
}

function authenticate_employee (options, callback) {

    employee_callback(options.email, options.password, function (err, employee, info) {

        console.log('done:', err, employee, info);

        if (err)
            return callback(err);

        if (!employee)
            return callback(new Error(info.message));

        return callback(null, employee);

    });
}

function authenticate_buddy (options, callback) {

    buddy_callback(options.email, options.password, function (err, buddy, info) {

        console.log('done:', err, buddy, info);

        if (err)
            return callback(err);

        if (!buddy)
            return callback(new Error(info.message));

        return callback(null, buddy);

    });
}

exports.authenticated = function (req, res, next) {
    // console.log
};

exports.employee = authenticate_employee;

exports.buddy = authenticate_buddy;

exports.authorize = function (req, res, next) {
    next();
}

exports.passport = passport
exports.authenticate = authenticate
// exports.authenticate_employee = authenticate_employee