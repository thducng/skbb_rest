const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({ 
    id: {
        type: String,
        required: true,
        unique: true,
    }, 
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: Number,
    exp: Number
}, { timestamps: true });

const Model = mongoose.model('Profile', schema);
module.exports = Model;