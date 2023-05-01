const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./user');
const Category = require('./category');
const Source = require('./source');
const Tags = require('./tags');


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
    },
    tags: {
        type: Tags.schema,
        required: false
    },
    imagen:{type: String}

   

});

module.exports = mongoose.model('news', news)