var fs = require('fs');
var path = require('path');
var dropbox = require('./RHPrintFactoryDropbox.js');
var ObjectID = require('mongodb').ObjectID;
var db

exports.setDB = function(database){
    db = database; 
}

//expose function
exports.findAll = function (req, res) {
    db.collection('Products', function (err, collection) {
        if (err) {
            console.log("The 'PrintFactoryDB' does not exist,Createing it with sample data...");
        } else { 
            collection.find().toArray(function (err, items) {
                res.send(items);
            });
        }
    });
};

exports.findByID = function (req, res) {
    var id = req.params.id;
    console.log('Retriving PrintFactoryProducts' + id);
    db.collection('Products').findOne({ '_id': new ObjectID(id) }, function (err, item) {
        res.send(item);
    });
};

exports.findBySearchQuery = function (req, res){
    var searchQuery = req.body.searchquery;
    console.log('Retriving PrintFactory Products by its query ' + searchQuery);
    db.collection('Products').find({ product_name : { $regex : searchQuery , $options : 'm' } }).toArray(function (err, items) {
        if (err) {
            console.log(err);
            res.send(null);
        } else {
            if (!items || items.length == 0) {
                
                db.collection('Products').find({ product_description : { $regex: searchQuery , $options : 'm' } }).toArray(function (err, itemss) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(itemss);
                    }
                });

            } else {
                res.send(items);
            }
        }
    });
}

exports.findByPrice = function (req, res){
    var minPrice = parseInt(req.body.minPrice), maxPrice = parseInt(req.body.maxPrice);

    if (minPrice < maxPrice) {
        db.collection('Products').find({ product_price : { $gt: minPrice , $lt : maxPrice } }).toArray(function (err, items) {
            if (err) {
                console.log(err);
                res.send(null);
            } else {
                res.send(items);
            }
        });
    } else {
        db.collection('Products').find({ product_price : { $gt: maxPrice } }).toArray(function (err, items) {
            if (err) {
                console.log(err);
                res.send(null);
            } else {
                res.send(items);
            }
        });
    }

}

exports.addPrint = function (req, res) {
    var fstream;
    var picture_names = [];
    var print;

    var file_number = 0, finished = false;
    var dropboxClient = dropbox.dropboxAuthenticate();
    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val; 
    });
    req.busboy.on('file', function (fieldname, file, filename) {
        var chunks = [];

        ++file_number;

        
        //write file into dropbox driver        
        file.on('data', function (chunk) {
            chunks.push(chunk);
        });
        
        file.on('end', function () {
            var filePath = '/PrintFactory/' + filename;
            var imageData = Buffer.concat(chunks);
            dropbox.uploadImage(dropboxClient, imageData, filePath, function (url) {
                picture_names.push(url);

                if (picture_names.length === file_number) {
                    var name = req.body.ProductName;
                    var price = req.body.ProductPrice;
                    var desc = req.body.ProductDesc;
                    print = {
                        product_name : name,
                        product_description : desc,
                        product_picture: picture_names,
                        product_price: price
                    }
                    
                    db.collection('Products').insert(print, { w: 1 }, function (err, result) {
                        if (err) {
                            console.log('Error: Add new print failed');
                        } else {
                            console.log('Success save into db');
                        }
                    });
                    
                    res.redirect('/')
                }
            });

        });

        //picture_names.push(filename);
        //fstream = fs.createWriteStream('./public/images/' + filename);
        //fstream = fs.createWriteStream(filename);
        //file.pipe(fstream);
        //fstream.on('finish', function () {
        //    if (--file_number === 0 && finished) {
        //        var name = req.body.ProductName;
        //        var price = req.body.ProductPrice;
        //        var desc = req.body.ProductDesc;
        //        print = {
        //            product_name : name,
        //            product_description : desc,
        //            product_picture: picture_names,
        //            product_price: price
        //        }
                
        //        //db.collection('Products').insert(print, { w: 1 }, function (err, result) {
        //        //    if (err) {
        //        //        console.log('Error: Add new print failed');
        //        //    } else {
        //        //        console.log('Success save into db');
        //        //    }
        //        //});

        //        res.redirect('/')
        //    }
        //});
    });
    
    req.busboy.on('finish', function () {
        finished = true;
    });
    
    req.pipe(req.busboy);

 


};

exports.updatePrintImage = function (req, res) {
    var fstream;
    var picture_names = [];
    var print;
    var file_number = 0, finished = false;
    var dropboxClient = dropbox.dropboxAuthenticate();
    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val;
    });
    req.busboy.on('file', function (fieldname, file, filename) {
        //picture_names.push(filename);
        var chunks = [];
        ++file_number;
        //write file into dropbox driver        
        file.on('data', function (chunk) {
            chunks.push(chunk);
        });
        
        file.on('end', function () {
            var filePath = '/PrintFactory/' + filename;
            var imageData = Buffer.concat(chunks);
            dropbox.uploadImage(dropboxClient, imageData, filePath, function (url) {
                picture_names.push(url);
                
                if (picture_names.length === file_number) {
                    var id = req.body.ProductID;
                    
                    db.collection('Products').update(
                        { _id: new ObjectID(id) } ,
                        { $addToSet : { product_picture : { $each : picture_names } } } ,
                        function (err, result){
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                     
                    res.redirect('/')
                }
            });

        });

    });
    
    req.busboy.on('finish', function () {
        finished = true;
    });
    
    req.pipe(req.busboy);

};

exports.updatePrint = function (req, res){

    var id = req.body._id
    var name = req.body.product_name;
    var price = req.body.product_price;
    var desc = req.body.product_description;
    print = {
        product_name : name,
        product_description : desc,
        product_price: price
    }
                
    db.collection('Products', function (err, collection) {
        collection.update(
            {
                '_id': new ObjectID(id)
            }, 
            {
                $set : print
            }, 
            {
                upsert: false
            }, 
            function (err, result) 
            {
                if (err) {
                    console.log('Error updating printfactorydb: ' + err);
                } else {
                    console.log('' + result + ' document(s) updated');
                }
            }
        );
    });
    
    res.send(req.body);
}

exports.deletePrint = function (req, res) {
    var id = req.params.id;
    console.log('Deleting print: ' + id);
    var dropboxClient = dropbox.dropboxAuthenticate();
    db.collection('Products', function (err, collection) {
        collection.findOne({ '_id': new ObjectID(id) }, { product_picture : 1 }, function (err, item) {
            if (err) {
                console.log('find one product id ' + id + 'error');
                res.send({ 'error': 'An Delete image from remote dropbox error has occurred - ' + err });
            } else {
                item.product_picture.forEach(function (image_names) { 
                    var filePath = '/PrintFactory/' + image_names.split('/')[2];
                    dropbox.removeImage(dropboxClient, filePath);
                });

            }
        });
        collection.remove({ '_id': new ObjectID(id) }, { justOne: true , w:1 }, function (err, result) {
            if (err) {
                res.send({ 'error': 'An Delete error has occurred - ' + err });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });

};

exports.deletePrintImage = function (req, res) {
    var id = req.body.id;
    var imageNames = req.body.image;
    var dropboxClient = dropbox.dropboxAuthenticate();
    imageNames.forEach(function (element) {
        var dropboxImageName = element.split('/')[2];
        dropbox.removeImage(dropboxClient, '/PrintFactory/' + dropboxImageName);
    })
    
    db.collection('Products', function (err, collection) {
        collection.update(
            { '_id': new ObjectID(id) }, 
                        {
                $pull : {
                    'product_picture' : {$in : imageNames }
                }
            }, 
            {
                multi : true
            } , 
            function (err, result) {
                if (err) {
                    console.log('Error updating printfactorydb: ' + err);
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(req.body);
                }
            });
    });
    
};


exports.findRandImage = function (req, res){
    console.log('find all image name in db, and return a random image name');
    var random_product_index = 0;

    db.collection('Products').find().toArray(function (err, items) {
        db.collection('Products').count({}, function (err, numOfProducts) {
            if (err) {
                console.log('error can not find products');
            } else {
                var product_size = numOfProducts;
                random_product_index = Math.round(Math.random() * product_size);
                res.send(items[random_product_index]);
            }
        });
    });

 
}



