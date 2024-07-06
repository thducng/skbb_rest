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
    terms: Date,
    type: String,

    deletedAt: Date
}, { timestamps: true });

const Model = mongoose.model('user', schema);
module.exports = Model;