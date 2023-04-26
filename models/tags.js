const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tag = new Schema({
    name: { type: String }
});

module.exports = mongoose.model('Tag', tag);