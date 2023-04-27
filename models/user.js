const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Role = require('../models/role');

const user = new Schema({
   
    first_name: { type: String },
    last_name: { type: String },
    email: { type: String },
    password: { type: String },
    country: { type: String },
    address: { type: String },
    city: { type: String },
    zip_code: { type: String },
    number: { type: String },

     role: {
         type: Role.schema
         
        },
   
        status: { type: String, enum: ['Pending', 'Active'], default: 'Pending' },
        confirmCode: { type: String},
        phoneCode: { type: String,required: false },
        tokenTemp: { type: String,required: false },
      }, { timestamps: true });

module.exports = mongoose.model('users', user)
