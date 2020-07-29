var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var mongoDB = require('./routes/mongoDB.js');

var printFactoryRoutes = require('./routes/print'); 
var users = require('./routes/users');
var companies = require('./routes/company');
var contact = require('./routes/contact');
var uiexpress = require('uinexpress').__express;

var app = express();

// view engine setup
app.engine('html', uiexpress);
app.set('views' , path.join(__dirname,'public/html'))
app.set('view engine', 'html');
app.locals.layout = false;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public')));

var server_port;
var server_ip_address;
var connection_string;
var database_name = 'printfacotry'
app.set('port', process.env.PORT || 3000);
if (app.get("env") === "development") {
    console.log('Developmnet env set');
    server_port = process.env.PORT || 3000;
    connection_string = "mongodb://localhost:27017/PrintFactoryDB"; 
} else {
    server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
    server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
    connection_string = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://admin:<password>@127.2.223.2:27017';
    connection_string = connection_string + database_name;
}

//estalbish database connection
mongoDB.connectDB(connection_string, function (err , database) {
    if (err) {
        console.log('mongoDB can not connect to database')
    } else {
        printFactoryRoutes.setDB(database);
        users.setDB(database);
        companies.SetDB(database);
    }
});

//Configuring Passport
app.use(expressSession({secret: 'mySecretKey', resave : true ,saveUninitialized : true }));
app.use(passport.initialize());
app.use(passport.session());

///Initialize passport
users.initPassport(passport);

//service end point 
app.post('/Login', function (req, res, next) {
    passport.authenticate('login', function (err, user) {
        if (err) {
            return res.status(500).send({error: 'error'}); //res.redirect('/Login');
        }
        if (!user) {
            return res.send({user:null})//res.redirect('/Login');
        }
        req.logIn(user, function (err) {
            if (err) { return res.redirect('/Login') }
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
            });
            res.send({ user:user });
        });
    })(req, res, next);
});

app.get('/Logout', function (req, res) {
    req.logOut();
    res.send(req.body);
});

//route 
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/PrintFactory/Company', companies.findCompanyInfo);
app.put('/PrintFactory/Company/:id', users.isAuthenticated, companies.updateCompanyInfo);
app.get('/CheckUserLogin' , users.isUserLogin);
app.put('/UpdateUserPassword', users.UpdateUserPassword);
app.get('/PrintFactory', printFactoryRoutes.findAll);
app.get('/PrintFactory/Product/:id', printFactoryRoutes.findByID);
app.post('/PrintFactory/SearchProduct', printFactoryRoutes.findBySearchQuery);
app.post('/PrintFactory/Price/Products', printFactoryRoutes.findByPrice);
app.put('/PrintFactory/Product/:id', users.isAuthenticated, printFactoryRoutes.updatePrint);
app.post('/PrintFactory/SendEmail', contact.sendEmail);
app.post('/PrintFactory/Product', users.isAuthenticated ,printFactoryRoutes.addPrint);
app.post('/PrintFactory/Product/Update', users.isAuthenticated, printFactoryRoutes.updatePrintImage);
app.delete('/PrintFactory/product/:id', users.isAuthenticated, printFactoryRoutes.deletePrint);
app.delete('/PrintFactory/Product/:id/Image', users.isAuthenticated , printFactoryRoutes.deletePrintImage);
app.get('/PrintFactory/random/image', printFactoryRoutes.findRandImage);


// catch 404 and forward to error handler
app.use(function (req, res, next) {g
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

if (app.get('env') === 'development') {
    var server = app.listen(app.get('port') , '10.40.29.246' , function () {
        console.log('Express server listening on server port ' + app.get('port'));
    });
} else { 
    var server = app.listen(server_port , server_ip_address, function () {
        console.log('Express server listening on server '+ server_ip_address+ 'port ' + server_port);
    });
}


module.exports = app;
