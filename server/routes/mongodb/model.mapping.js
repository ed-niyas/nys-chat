var Users = require('../../models/users.model');
// get future models here

var ModelMapping = {

    Mapping: function (model) {
        switch(model.toLowerCase()){

            case 'users': return Users;
            // add cases for future models here

            default: return null;
        }
    }
}

module.exports = ModelMapping;