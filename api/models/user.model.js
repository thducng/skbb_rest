const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: String, 
    lastname: String,
    profiles: [String], 
    active: Boolean, 
    status: String,
    terms: Date
}, { timestamps: true });

const Model = mongoose.model('User', schema);
module.exports = Model;