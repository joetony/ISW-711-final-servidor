const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const Category = require('./category');
const Source = require('./source');


const news = new Schema({
    title: { type: String },
    description: { type: String },
    permanlink: {type: String},
    date: {type: Date},
    category: { 
         type: Category.schema,
         require: false
     },
     user: {
         type: User.schema,
         required: false
     },
    source: {
        type: Source.schema,
        required: false
    }

});

module.exports = mongoose.model('news', news)