var localStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var ObjectID = require('mongodb').ObjectID;
var db;

module.exports.setDB = function(database) {
    db = database;
}

module.exports.initPassport = function (passport) {

    passport.serializeUser(function (user, done) {
        console.log('Serializing user:');
        console.log(user);
        done(null, user._id);
    });
    
    passport.deserializeUser(function (id, done) {
        console.log('Deserializing user id:');
        console.log(id);
        db.collection('Users').findOne({ '_id' : new ObjectID(id) }, function (err, user) { 
            console.log(user);
            done(err, user);
        });
    });

    login(passport);
}

module.exports.isAuthenticated = function (req, res, next){
    var test = req.isAuthenticated();
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

module.exports.isUserLogin = function (req, res){
    if (req.isAuthenticated()) {
        res.send({ user: req.user });
    } else {
        res.rend({ user: null });
    }
}

module.exports.CheckUserPassword = function (req, res){
    var id = req.body._id;
    var username = req.body.username;
    var password = req.body.password;


}

module.exports.UpdateUserPassword = function (req, res){
    var id = req.body._id;
    var userName = req.body.username;
    var oldPassword = req.body.oldPassword;
    var newPassword = req.body.newPassword;
    var confirmNewPassword = req.body.confirmNewPassword;
    var hashPassword = bCrypt.hashSync(newPassword, bCrypt.genSaltSync(10), null);
    
    findUser(id, function (err, user) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (isValidPassword(user, oldPassword) && newPassword === confirmNewPassword) {
                db.collection('Users').update(
                    {
                        '_id' : new ObjectID(id)
                    }, 
                    {
                        $set : { password : hashPassword }
                    }, function (err, result) {
                        if (err) {
                            console.log('Save New Password Error ' + err);
                        } else {
                            console.log('Save Successfully new password');
                        }
                    });

  
            }
        }
    });

    res.send(req.body);
}

var login = function (passport){
    passport.use('login', new localStrategy({
        passReqToCallback : true
    }, function (req, username, password, done) {
        db.collection('Users').findOne({ 'username' : username }, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                console.log('User not found wiht username');
                return done(null, false);
            }

            if (!isValidPassword(user, password)) {
                console.log('Invalid passworld');
                return done(null, false); // redirect back to login page
            }

            //return user from done method which will be treated like success
            return done(null, user);
        });

    }));
}

var isValidPassword = function (user, password){
    return bCrypt.compareSync(password, user.password);
}

var findUser = function (id, done){
    db.collection('Users').findOne({ '_id' : new ObjectID(id) }, function (err, user) {
        console.log(user);
        done(err, user);
    });
}