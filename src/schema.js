var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var UserServiceSchema2 = new mongoose.Schema({
     email: {
          type: String,
          unique: true,
     },
     following: {type: [String], default: []},
     followers: {type: [String], default: []},

});

UserServiceSchema2.plugin(uniqueValidator, {message: 'is already in use.'});

mongoose.model('UserService', UserServiceSchema2);
