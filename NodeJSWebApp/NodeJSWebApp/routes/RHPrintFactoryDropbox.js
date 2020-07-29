var Dropbox = require('dropbox');

module.exports.dropboxAuthenticate = function () {
    var client = new Dropbox.Client({
        //key: 'my01ijch2wttvec'
        token: 'GHHRDhoNyLAAAAAAAAAAgcvLLpXBvzvIZlqqY9mgTFbGJvbIIvBeKA85YUBp4iEJ'
    });

    client.authenticate({ interactive : false } ,function (err, client) {
        if (err) {
            console.log(err);
        }
    });

    return client;
};

module.exports.uploadImage = function (dropboxClient, fileImageBuffer, filePath, callback){
    if (dropboxClient.isAuthenticated) {
        dropboxClient.writeFile(filePath, fileImageBuffer, function (err, stat) {
            if (err) {
                console.log(err);
            } else {
                dropboxClient.makeUrl(filePath, { downloadHack : true } , function (err, link) {
                    var longlink = link.url.split('/s');
                    var shortlink = longlink[1].split('?')[0];
                    callback(shortlink);
                });
            }
        });
    }
  
}

module.exports.removeImage = function (dropboxClient, filePath){
    if (dropboxClient.isAuthenticated) {
        dropboxClient.remove(filePath, function (err, stat) {
            if (err) {
                console.log(err);
            }
        });
    }
}