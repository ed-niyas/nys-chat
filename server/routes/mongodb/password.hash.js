const crypto = require('crypto');

var hashpwd= function(pwd){
    var hash = crypto.createHash('sha256');
    hash.update(pwd);
    return hash.digest('hex');
}

module.exports = hashpwd;