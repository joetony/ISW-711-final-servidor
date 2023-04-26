const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/user');
const Category = require('../models/category');


const source = new Schema({
    url: { type: String },
    name: { type: String },
    category: { 
        type: Category.schema,
        require: false
    },
    user: {
      type: User.schema,
       required: false
}

});

module.exports = mongoose.model('sources', source)