// Globals


_ = require('underscore');

require('longjohn');


process.on('uncaughtException', function (err) {
    console.log('uncaught:' + err);
    console.log(err.stack);
});

// Module Deps

var debug = require('debug')('app')
var express = require('express')
var flash = require('connect-flash')

var stylus = require('stylus')
var sass = require('node-sass');
// var bootstrap_sass = require('bootstrap-sass');


var bootstrap = require('bootstrap-stylus')
var config = require('./config')
var auth = require('./lib/auth')
var users = require('./models/users')

var async = require('async');

var models = require('./models');

// Configuration

var app = express()
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('people are awesome'));
    app.use(express.session({ secret: 'people are awesome' }));
    app.use(auth.passport.initialize())
    app.use(auth.passport.session())
    app.use(flash())
    app.use(app.router);

    app.use('/public/css', stylus.middleware({
        src: __dirname + '/public/css',
        compile: function (str, path) {
          return stylus(str)
                  .set('filename', path)
                  .use(bootstrap())
        }
    }));

    // app.use('/assets/stylesheets', sass.middleware({
    //     src:  __dirname + '/assets/sass',
    //     debug: true,
    //     compile: function (str, path) {
    //         return sass(str)
    //             .set('filename', path)
    //             .use(bootstrap_sass());
    //     }
    // }));
    app.use('/assets', express.static(__dirname + '/assets'));

    app.use('/public', express.static(__dirname + '/public'));
})

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })) 
});

app.configure('production', function(){
    app.use(express.errorHandler()) 
});

// if not authorized, send to /

// if authorized, redirect to appropriate dashboard

//-----------------------------------------------------------------------------
// Notifications
//-----------------------------------------------------------------------------

app.on('sponsorship created', function (sponsor, member) {
    console.log('sponsor', sponsor, 'member', member);
    models.members.findById(member, function (err, member) {
        if (err)
            return console.log('err:' + err);
        if (!member)
            return console.log('there is no member');
        if (member)
            return console.log('there is a member');
    });
});

app.on('sponsorship removed', function (sponsor, member) {

});

app.on('book request', function () { 

});

app.on('employee signup', function (employee) {

    var payload = {
        from: 'noreply@rollout.com',
        to: employee.email, // 'seye.ojumu@gmail.com',
        subject: 'Hello',
        text: [
        'Hi ' + employee.name + ',',
        '',
        'Welcome to Roll.',
        '',
        'Your password is: ' + employee.password, 
        '',
        'Sign in at http://localhost:3000/employee/login',
        ''].join('\n')
    };

    require('./lib/mail').send(payload, function (err) {
        if (err)
            return debug('err:' + err);
        debug('sent!');
    });
});

app.on('buddy signup', function () {

});

app.on('forgot password', function () {

});

// Setup Routes

var models = require('./models');



//-----------------------------------------------------------------------------
// Employee: 
//-----------------------------------------------------------------------------

// create employee
app.post('/employee', function (req, res) {
    console.log(typeof req.body, req.body);
    models.employees.create(req.body, function (err, created) {
        if (err)
            res.send(err.message);
        else
            res.send('created!');
    });

});

// update an employee
app.put('/employee', function (req, res) {
    // 
});

// get an employee
app.get('/employee', function (req, res) {
    // 
});

//-----------------------------------------------------------------------------
// Sponsorships
//-----------------------------------------------------------------------------

app.post('/sponsorships', function (req, res) {

    console.log(req.body);
    var sponsor = req.body.sponsor, name = req.body.name, email = req.body.email, priority = req.body.priority, relation = req.body.relation;

    async.parallel([
        function (callback) {
            models.members.create({name: name, email: email, priority: 0}, function (err, member) {
                console.log('created:member', member);
                callback(err);
            });
        },
        function (callback) {
            models.sponsorships.create({sponsor: sponsor, sponsored: email, relation: relation}, function (err) {
                console.log('created:sponsor', sponsor, 'member', email);
                callback(err);
            });
        }],
        function (err) {
            if (err)
                res.send(400, 'err:'+err);
            else {
                res.redirect("/buddies");
                // res.send('created sponsorship');
            }
        });

        // },
        // function (err) {
        //     if (err)
        //         res.send(''+err);
        //     else
        //         res.send('created sponsorship');
        // });

});

//-----------------------------------------------------------------------------
// Airport autocomplete
//-----------------------------------------------------------------------------

app.get('/foo', function (req, res) {
    res.send(['SFO', 'PIT', 'JFK', 'NYC', 'IAD', 'SJC']);
});

//-----------------------------------------------------------------------------
// Flights: Search
//-----------------------------------------------------------------------------

app.get('/flights/:from-:to/:date.json', function (req, res) {

    // from
    // to
    // yyyy-mm-dd

    var date_parts = date.split('-').map(function (x) { return parseInt(x, 10); });
    var months = ['Jan', 'Feb', 'Mar', 'Apr'];

    models.trip.fake({source: req.params.from, destination: req.params.to, depart: {
        month: months[date_parts[1]],
        day: day_parts[2]
    }}, function (err, trips) {
        if (err)
            res.send(''+err);
        else
            res.send(trips);
    });

});


app.get('/flights/:from-:to/:date', function (req, res) {

    var date_parts = req.params.date.split('-').map(function (x) { return parseInt(x, 10); });
    var months = [null, 'Jan', 'Feb', 'Mar', 'Apr'];

    var depart = months[date_parts[1]] + ' ' + date_parts[2];

    models.trip.fake({source: req.params.from, destination: req.params.to}, function (err, trips) {

        res.render('flights', {
            itinerary: {from: req.params.from, to: req.params.to, depart: depart},
            trips: trips.map(function (t) {
                // console.log(t.available, t.listed.length);
                // console.lgo(t.available < t)
                if (parseInt(t.available) < t.listed.length)
                    t.score = 0;
                if (parseInt(t.available) == t.listed.length)
                    t.score = 0.5;
                if (parseInt(t.available) > t.listed.length)
                    t.score = 1;
                // t.score = 0.5;
                return t;

            })
        });
    });

});

app.get('/flight/:id', function (req, res) {

    models.trip.findById(req.params.id, function (err, trip) {
        if (err)
            res.send(err);
        else 
            console.log(trip);

        // var t = trip;
        if (parseInt(trip.available) < trip.listed.length)
            trip.score = 0;
        if (parseInt(trip.available) == trip.listed.length)
            trip.score = 0.5;
        if (parseInt(trip.available) > trip.listed.length)
            trip.score = 1;
        trip.ahead = trip.listed.filter(function (x) { return x == 'family'; }).length;
        trip.equ = trip.listed.filter(function (x) { return x == 'friend'; }).length;

        res.render('single', {
            trip: trip
        });
    });

});

app.post('/listings', function (req, res) {

    console.log(req.body);
    console.log(req.session);

    req.session.listing = req.body.id;

    models.listing.create(
        {flight_id: req.body.id, user_id: req.session.id, user_type: req.session.type},
        function (err) {
            res.redirect('/listings');
        });

});

app.get('/listings', function (req, res) {

    // console.log(models.listing.last);

    // var listing = models.listing.last;
    // listing.from = listing.segments[0].from;
    // listing.to = listing.segments.slice(-1)[0].to;

// console.log(models.listing.last);
//     res.render('listed', {
//         listings: [models.listing.last] // [{available:3,capacity:100,listed:[null],id:12}, {available:3,capacity:100,listed:[null],id:12}]
//     });

    if (req.session.listing) {
        models.trip.findById(req.session.listing, function (err, listings) {
            if (parseInt(listings.available) < listings.listed.length)
                listings.klass = 'success';
            if (parseInt(listings.available) == listings.listed.length)
                listings.klass = 'warning';
            if (parseInt(listings.available) > listings.listed.length)
                listings.klass = 'danger';    
            // if (listings.)       
            console.log(err, listings);
            res.render('listed', {
                listings: [listings] // [{available:3,capacity:100,listed:[null],id:12}, {available:3,capacity:100,listed:[null],id:12}]
            });
        });
    }
    else {
        res.render('listed', {
            listings: [] // [{available:3,capacity:100,listed:[null],id:12}, {available:3,capacity:100,listed:[null],id:12}]
        });
    }

});

// // create a listing
// app.post('/flight/:id/list', function (req, res) {

//     console.log(req.body);
//     res.redirect('/blahblahblah');

// });

// the listed flights page
app.get('/blahblahblah', function (req, res) {
});

app.get(
    '/employee/dashboard', 
    function (req, res) {
        console.log('current id:' + req.session.current_id);
        console.log(req.session.user);
        res.render('employee_dashboard', {
            listings: [], // [{available:3,capacity:100,listed:[null],id:12}],
            user: req.session.user
        });
    });

app.get('/search',  function (req, res) {

    res.render('search', {
        user: req.user
    });

});

app.post('/search', function (req, res) {

    console.log(req.body);
    res.redirect('/flights/' + req.body.from + '-' + req.body.to + '/' + req.body.depart);
    // res.send('foo');

});

// family signup

// create member
app.post('/member', function (req, res) {
    // 
    console.log(typeof req.body, req.body);
    models.members.create(req.body, function (err, created) {
        if (err)
            res.send(err.message);
        else
            res.send('created!');
    });


});

// get an user
app.get('/member/:id', function (req, res) {
    models.members.findById(req.params.id, function (err, member) {
        if (err)
            res.send(''+err);
        else
            res.send(member);
    });
});




app.get('/', function(req, res) {
    res.render('index', {
        user: req.user,
        flash: req.flash()
    })
});

app.get('/signup', function (req, res) {
    res.render('signup', {
        user: req.user,
        flash: req.flash()
    });
});

app.post('/signup.:ext?', function (req, res) {

    try { 
        console.log('ext:' + req.params.ext);
    }
    catch (err) {
        res.send(''+err);
    }

    function success (user) {

        app.emit('employee signup', user);
        req.flash('success', "Thanks for signing up! We're sending you an email.");
        res.redirect('/employee/dashboard');
        
    }

    function failure (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }

    models.employees.create(req.body, function (err, created) {
        if (err)
            failure(err);
        else
            success(created);
    });

    // var error = false
    
    // if (!req.body.email) {
    //     req.flash('error', 'Email address is required.')
    //     error = true
    // }
    // if (!req.body.password) {
    //     req.flash('error', 'Password is required.')
    //     error = true
    // }

    // if (error) {
    //     res.redirect('/signup')
    //     return
    // }

    // var loginUser = function (err, user) {
    //     if (err) {
    //         if (err.code == 11000) 
    //             req.flash('error', 'A user with that email already exists.')
    //         else 
    //             req.flash('error', 'Something went wrong. Please try again later.')
    //         res.redirect('/signup')
    //         return
    //     }

    //     debug('Account created. Login... ', user)
    //     req.login(user, redirectUser)
    // }

    // var redirectUser = function (err) {
    //     if (err) {
    //         debug('Login failed!')
    //         req.flash('error', 'Account created. Please login.')
    //         res.redirect('/login')
    //         return
    //     }
    //     debug('Welcome!')
    //     req.flash('success', 'Welcome to Sideproject!')
    //     res.redirect('/')
    // }

    // users.create({
    //     email: email,
    //     password: password
    // }, loginUser)
})

// 

app.get('/employee/login', function (req, res) {
    res.render('employee_login', {
        user: req.user,
        flash: req.flash()
    });
});

app.post('/employee/login', function (req, res) {
    console.log(req.body);
    auth.employee({email: req.body.e, password: req.body.p}, function (err, employee) {
        console.log('auth.employee:complete');
        if (err) {
            req.flash('error', err.message);
            res.redirect('/employee/login');
        }
        else {
            req.session.current_id = employee.email;
            req.session.user = employee;
            res.redirect('/employee/dashboard');
        }

    });

}); 

app.get('/buddy', function (req, res) {

    res.render('buddy', {
        user: req.session.user
    });
});

app.get('/buddy/dashboard', function (req, res) {

    res.render('buddy_dashboard', {

        listings: [{available:3,capacity:100,listed:[null],id:12}]
       

        // when you add a buddy -> create a sponsorship

    });
});


app.get('/buddy/login', function (req, res) {

    res.render('buddy_login', {

    });

});

app.post('/buddy/login', function (req, res) {

    console.log(req.body);
    auth.buddy({email: req.body.e, password: req.body.p}, function (err, buddy) {
        console.log('auth.buddy:complete');
        if (err) {
            req.flash('error', err.message);
            res.redirect('/buddy/login');
        }
        else {
            req.session.current_id = buddy.email;
            req.session.user = buddy;
            res.redirect('/buddy/dashboard');
        }

    });

}); 

app.get('/success', function (req, res) {

    res.send('SUCCESS');

});



app.get('/calendar', function (req, res) {

    res.render('calendar', {

    });

});

app.get('/buddies', function (req, res) {

    models.sponsorships.findBySponsor(req.session.user, function (err, sponsorships) {
        if (err)
            return res.send('err:'+err);

        // console.log('sponsorships:' + sponsorships);
        async.map(
            sponsorships, 
            function (sponsorship, callback) {
                models.members.findByEmail(sponsorship.sponsored, function (err, m) {
                    if (m)
                        m.relation = sponsorship.relation;
                    console.log(m);
                    return callback(err, m);
                });
            },
            function (err, sponsored) {
                return res.render('buddies', {
                    sponsorships: sponsored
                });
            });

    });

    // // get the current user
    // var e = models.employees.findByEmail('seye.ojumu@gmail.com', function (err, employee) {
    //     if (err)
    //         return res.send('err:' + err);

    //     models.sponsorships.findBySponsor(employee, function (err, sponsorships) {
    //         if (err)
    //             return res.send('err:'+err);
    //         else
    //             return res.render('buddies', {
    //                 sponsorships: sponsorships
    //             });
    //     });

    // });

});

// app.post('/buddy/login', auth.authenticate({successFlash: 'Login successful!'}), function (req, res) {
//     res.redirect('/')
// });

app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/');
});





var PORT = process.env.PORT || 3000
app.listen(PORT)
console.log("Express server listening on port %d in %s mode", PORT, app.get('env'))


module.exports = app