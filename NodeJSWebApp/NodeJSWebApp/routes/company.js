var ObjectID = require('mongodb').ObjectID;
var nconf = require('nconf');
var db

module.exports.SetDB = function(database) {
    db = database;
}

module.exports.findCompanyInfo = function (req, res){
    var companyName = loadCompanyName();
    db.collection('Companies').findOne({ 'companyname' : companyName }, function (err, result) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        res.send(result);
    })
}

module.exports.updateCompanyInfo = function (req, res){
    var id = req.body._id;

    db.collection('Companies').update(
        { '_id' : new ObjectID(id) },
        {
            $set : {
                companyIntro : req.body.companyIntro,
                background : req.body.background ,
                skillsets : req.body.skillsets
            }
        },
        function (err, item){
            if (err) {
                res.send(err);
            } else {
                res.send(item);
            }
        } 
    );
}

var loadCompanyName = function (){
    nconf.file({ file : './config/config.json' });
    console.log(nconf.get('company:companyName'));
    return nconf.get('company:companyName');
}

