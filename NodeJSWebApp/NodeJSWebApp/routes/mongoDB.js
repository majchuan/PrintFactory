var bCrypt = require('bcrypt-nodejs');
var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

var db = null;
var mongoclient = mongo.MongoClient;

//Initalize connection to MongoDB
module.exports.connectDB = function (url, callback){

    mongoclient.connect(url, function (err, database) {
        if (err) throw err;
        db = database;
        
        db.listCollections({ name : 'Products' }).next(function (err, colinfo) {
            if (err) {
                console.log('The PrintFactoryDB does not connect correctly, try agian later');
            } else {
                if (!colinfo) {
                    console.log('Initial PrintFactoryDB/Products');
                    populateDB();
                }
            }
        });
        
        db.listCollections({ name : 'Users' }).next(function (err, colinfo) {
            if (!colinfo) {
                console.log('inital Users document here');
                populateUser();
            }
        });
        
        db.listCollections({ name : 'Companies' }).next(function (err, colinfo) {
            if (!colinfo) {
                console.log('inital Company document here');
                populateCompanyInfo();
            }
        });

        console.log("Connected to 'PrintFactoryDB' database");

        callback(null,database);
    });

}

module.exports.getDB = function (){
    return db;
}

module.exports.closeDB = function (callback){
    if (!db) {
        db.close(function (err, result) {
            db = null;
            callback(err);
        });
    }
}

// Populate database with sample data
var populateDB = function () {
    var PrintFactory = [
        {
            product_name : 'h&m',
            product_description : 'the brand is built in sweden, and now in Canada',
            product_picture: ['j5d2grnyozi5x67/_DSC3200.JPG', 'ku495eea1tlaa0c/_DSC3202.JPG', '5ywnd9elc1cthzg/_DSC3203.JPG' , '0yvz86pk6kp6n4w/_DSC3205.JPG'] ,
            product_price: 125
        },
        {
            product_name : 'prada',
            product_description : 'the brand is built in italy, and now in canana, very expensive',
            product_picture: ['1imejjfzulpqdn0/_DSC3269.JPG', '012b41fukrnnpai/_DSC3273.JPG', 'ycky7vn0xkclwvf/_DSC3274.JPG' , 'f91a08n3lghbrf6/_DSC3276.JPG'],
            product_price: 225
        },
        {
            product_name : 'gucci',
            product_description : 'the brand is built in francs, and now produce in canada',
            product_picture: ['bfsi79bexvrfkt1/_DSC3318.JPG', '50sx718v3ue4h1h/_DSC3320.JPG', 'esqvdt3aevvcmiq/_DSC3328.JPG?' , '85n0f70uaozkow7/_DSC3330.JPG'],
            product_price: 5000
        },
        {
            product_name : 'hermes',
            product_description : 'the most expensive brand',
            product_picture: ['u1ec3540am02zmu/_DSC3331.JPG', 'ek19go4gbxcaz8d/_DSC3333.JPG', 'um2ipmkux39e3st/_DSC3335.JPG' , 'rcrzj3qeyz1vvfb/_DSC3337.JPG'],
            product_price: 250000
        },
        {
            product_name : 'guess',
            product_description : 'the guess guess',
            product_picture: ['hu8bxzcscokvxw7/_DSC3342.JPG', 'dpuy1m1txhwxr0e/_DSC3343.JPG', 'u76d4mk99eso83i/_DSC3347.JPG' , '9tvmiwo4uy39qls/_DSC3354.JPG'],
            product_price: 250
        },
        {
            product_name : 'gap',
            product_description : 'american gap',
            product_picture: ['2srup9edjgbr8xc/_DSC3362.JPG', 'yhytp7erw1xk9wv/_DSC3363.JPG', 'h596d18g9mgsqn4/_DSC3364.JPG' , 'tlrmbp98hd9hg8a/_DSC3365.JPG'],
            product_price: 52
        },
        {
            product_name : 'navyblue',
            product_description : 'come from china',
            product_picture: ['pzoxssdy44kj8jg/_DSC3366.JPG', 'zjzhapa54rlc838/_DSC3377.JPG?', 'yeq3alih9d1tm5c/_DSC3379.JPG' , 'mbl2iyl5kxlai6t/_DSC3387.JPG'],
            product_price: 258
        },
    ];
    
    db.collection('Products').insert(PrintFactory, { w: 1 } , function (err, result) {
        console.log('Insert result' + result);
       
    });

};

var populateUser = function () {
    var admin = {
        username : 'admin',
        password : CreateHash('12342')
    }
    
    db.collection('Users').insert(admin, { w: 1 }, function (err, result) {
        console.log('Insert admin user' + result);
    });
}

var CreateHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var populateCompanyInfo = function (){
    var companyInfo = {
        companyname : 'RHPrintFactory',
        companyIntro : "Ourprinting department offers a large array of apparel brands and styles and screen printing materials,so that you obtain the finished product that fits your purpose and style.We are not only offering screen printing.but also embroidery, Vinyl heat transfer, digital heat transfer, Direct - to - Garment printing, banner, sticker, window decal and vehicle warps.All works are done IN HOUSE, ensuring quality control and quick turnaround. With the recently new ownershipand improved management, we could now offering same great quality products,better customer service and much faster turn - around.We look forward to having opportunity to work with you." ,
        background : "Rugged Country (B & H Canvas) is a locally-owned company located in Birch Hills, Saskatchewan. We had been servicing Birch Hill, Prince Albert and North Saskatchewan area since 1990. Rugged Country manufactured custom business executive bags, cash bags for bank, Hockey bags, team/player garments bags, Gun/bow cases, hunting belts and custom fitted boat covers.",
        skillsets: "Screen Printing ,Embroidery ,Direct-To-Garment Printing,Heat Transfer,Digital Heat Transfer,Traophy Name Tags,Window Decals/Sticker/Vehicle wraps,Banner/Sign"
    }

    db.collection('Companies').insert(companyInfo, { w : 1 } , function (err, result) {
        console.log('Insert compaies info' + result);
    });
}

