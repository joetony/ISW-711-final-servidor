const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const role = new Schema({
    name: { type: String },
});

module.exports = mongoose.model('roles', role)
